import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';
import { 
  initializeFirestore,
  doc, 
  getDocFromServer, 
  collection, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Article } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with auto-detect long-polling to prevent WebChannel 10s timeout in sandboxed preview iframe
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  ignoreUndefinedProperties: true
}, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);

// Configure Google Auth Provider with Workspace scopes
const provider = new GoogleAuthProvider();
export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/presentations',
  'https://www.googleapis.com/auth/presentations.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/drive.metadata.readonly'
];

WORKSPACE_SCOPES.forEach(scope => provider.addScope(scope));

// In-memory token management
let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Validate Firestore connection on boot with timeout protection
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('connection timeout')), 3000)
    );
    await Promise.race([
      getDocFromServer(doc(db, 'test', 'connection')),
      timeoutPromise
    ]);
    return true;
  } catch {
    // Quietly fallback: client operates in offline mode without alarming console logs
    return false;
  }
}

// Firestore operations for Articles
export async function syncArticleToFirestore(article: Article, userId?: string) {
  try {
    const articleRef = doc(db, 'articles', article.id);
    await setDoc(articleRef, {
      ...article,
      userId: userId || auth.currentUser?.uid || 'editorial-team',
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    console.warn('Article saved locally. Firestore sync pending reconnection:', e);
  }
}

export async function loadArticlesFromFirestore(): Promise<Article[]> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('timeout')), 4000)
    );
    const q = query(collection(db, 'articles'));
    const snapshot = await Promise.race([
      getDocs(q),
      timeoutPromise
    ]);
    const loaded: Article[] = [];
    snapshot.forEach(d => {
      loaded.push(d.data() as Article);
    });
    return loaded;
  } catch {
    // If offline or timed out, application gracefully uses local articles
    return [];
  }
}

// User Bookmarks in Firestore
export async function saveUserBookmark(userId: string, articleId: string) {
  try {
    const ref = doc(db, 'users', userId, 'bookmarks', articleId);
    await setDoc(ref, {
      id: articleId,
      articleId,
      userId,
      createdAt: new Date().toISOString()
    });
  } catch (e) {
    console.error('Error saving bookmark to Firestore:', e);
  }
}

export async function removeUserBookmark(userId: string, articleId: string) {
  try {
    const ref = doc(db, 'users', userId, 'bookmarks', articleId);
    await deleteDoc(ref);
  } catch (e) {
    console.error('Error removing bookmark from Firestore:', e);
  }
}

export async function loadUserBookmarks(userId: string): Promise<string[]> {
  try {
    const snapshot = await getDocs(collection(db, 'users', userId, 'bookmarks'));
    const ids: string[] = [];
    snapshot.forEach(d => ids.push(d.id));
    return ids;
  } catch (e) {
    console.error('Error loading bookmarks from Firestore:', e);
    return [];
  }
}
