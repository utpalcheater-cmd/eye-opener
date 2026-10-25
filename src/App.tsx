import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Article, BookMetadata, ViewLayoutMode, PaperTone, FontFamilyChoice } from './types';
import { initialArticles } from './data/articles';
import { initialBookMeta } from './data/bookMeta';
import { Navbar } from './components/Navbar';
import { TypesettingToolbar } from './components/TypesettingToolbar';
import { BookSpreadLayout } from './components/BookSpreadLayout';
import { BroadsheetLayout } from './components/BroadsheetLayout';
import { BookCoverView } from './components/BookCoverView';
import { TableOfContentsView } from './components/TableOfContentsView';
import { ReaderMode } from './components/ReaderMode';
import { PrintReadyView } from './components/PrintReadyView';
import { AddArticleModal } from './components/AddArticleModal';
import { WorkspaceHub } from './components/WorkspaceHub';
import { 
  initAuth, 
  testFirestoreConnection, 
  syncArticleToFirestore, 
  loadArticlesFromFirestore, 
  saveUserBookmark, 
  removeUserBookmark, 
  loadUserBookmarks 
} from './services/firebase';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem('dainik_jahan_anthology_articles');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return initialArticles;
  });

  const [bookMeta] = useState<BookMetadata>(initialBookMeta);
  const [currentLayout, setCurrentLayout] = useState<ViewLayoutMode>('spread');
  const [selectedArticleId, setSelectedArticleId] = useState<string>(initialArticles[0].id);

  const [paperTone, setPaperTone] = useState<PaperTone>(() => {
    return (localStorage.getItem('dainik_jahan_papertone') as PaperTone) || 'archival';
  });

  const [fontFamily, setFontFamily] = useState<FontFamilyChoice>(() => {
    return (localStorage.getItem('dainik_jahan_fontfamily') as FontFamilyChoice) || 'serif';
  });

  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem('dainik_jahan_fontsize');
    return saved ? Number(saved) : 16;
  });

  const [columnCount, setColumnCount] = useState<1 | 2 | 3>(1);

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dainik_jahan_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Initialize Firebase Auth listener and Firestore boot check
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
        // Load user bookmarks from Firestore
        loadUserBookmarks(user.uid).then(remoteBookmarks => {
          if (remoteBookmarks && remoteBookmarks.length > 0) {
            setBookmarkedIds(prev => Array.from(new Set([...prev, ...remoteBookmarks])));
          }
        });
      },
      () => {
        setCurrentUser(null);
      }
    );

    // Load any remote articles from Firestore
    loadArticlesFromFirestore().then(remoteArticles => {
      if (remoteArticles && remoteArticles.length > 0) {
        setArticles(prev => {
          const map = new Map<string, Article>();
          prev.forEach(a => map.set(a.id, a));
          remoteArticles.forEach(a => map.set(a.id, a));
          return Array.from(map.values());
        });
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('dainik_jahan_anthology_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('dainik_jahan_papertone', paperTone);
  }, [paperTone]);

  useEffect(() => {
    localStorage.setItem('dainik_jahan_fontfamily', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem('dainik_jahan_fontsize', String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('dainik_jahan_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  // Current active article
  const currentArticleIndex = articles.findIndex(a => a.id === selectedArticleId);
  const currentArticle = currentArticleIndex !== -1 ? articles[currentArticleIndex] : articles[0];

  const hasPrev = currentArticleIndex > 0;
  const hasNext = currentArticleIndex < articles.length - 1;

  const handlePrevArticle = () => {
    if (hasPrev) {
      setSelectedArticleId(articles[currentArticleIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextArticle = () => {
    if (hasNext) {
      setSelectedArticleId(articles[currentArticleIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const isAlready = prev.includes(id);
      const updated = isAlready ? prev.filter(item => item !== id) : [...prev, id];
      
      // Sync with Firestore if authenticated
      if (currentUser) {
        if (isAlready) {
          removeUserBookmark(currentUser.uid, id);
        } else {
          saveUserBookmark(currentUser.uid, id);
        }
      }
      return updated;
    });
  };

  const handleAddArticle = (newArticle: Article) => {
    setArticles(prev => [newArticle, ...prev]);
    setSelectedArticleId(newArticle.id);
    setCurrentLayout('spread');

    // Sync to Firestore
    syncArticleToFirestore(newArticle, currentUser?.uid);
  };

  const handleSelectArticleAndLayout = (id: string, layout: ViewLayoutMode = 'spread') => {
    setSelectedArticleId(id);
    setCurrentLayout(layout);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      {/* Universal 3-Zone Navbar */}
      <Navbar
        currentLayout={currentLayout}
        setLayout={setCurrentLayout}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenBookmarks={() => {
          setCurrentLayout('contents');
        }}
        bookmarkedCount={bookmarkedIds.length}
      />

      {/* Typesetting & Layout Customization Bar (visible on reader/spread/broadsheet views) */}
      {(currentLayout === 'spread' || currentLayout === 'reader') && (
        <TypesettingToolbar
          paperTone={paperTone}
          setPaperTone={setPaperTone}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          fontSize={fontSize}
          setFontSize={setFontSize}
          columnCount={columnCount}
          setColumnCount={setColumnCount}
          articles={articles}
          currentArticleId={selectedArticleId}
          onSelectArticle={(id) => handleSelectArticleAndLayout(id, currentLayout)}
        />
      )}

      {/* Main Layout Presentation */}
      <main className="flex-1">
        {currentLayout === 'spread' && (
          <BookSpreadLayout
            article={currentArticle}
            bookMeta={bookMeta}
            paperTone={paperTone}
            fontFamily={fontFamily}
            fontSize={fontSize}
            columnCount={columnCount}
            onPrevArticle={handlePrevArticle}
            onNextArticle={handleNextArticle}
            hasPrev={hasPrev}
            hasNext={hasNext}
            isBookmarked={bookmarkedIds.includes(currentArticle.id)}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentLayout === 'broadsheet' && (
          <BroadsheetLayout
            articles={articles}
            bookMeta={bookMeta}
            selectedArticleId={selectedArticleId}
            onSelectArticle={(id) => handleSelectArticleAndLayout(id, 'broadsheet')}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentLayout === 'cover' && (
          <BookCoverView
            bookMeta={bookMeta}
            onExploreContents={() => setCurrentLayout('contents')}
            onOpenSpread={() => setCurrentLayout('spread')}
          />
        )}

        {currentLayout === 'contents' && (
          <TableOfContentsView
            articles={articles}
            onSelectArticle={(id) => handleSelectArticleAndLayout(id, 'spread')}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentLayout === 'reader' && (
          <ReaderMode
            article={currentArticle}
            bookMeta={bookMeta}
            paperTone={paperTone}
            fontFamily={fontFamily}
            fontSize={fontSize}
            onPrevArticle={handlePrevArticle}
            onNextArticle={handleNextArticle}
            hasPrev={hasPrev}
            hasNext={hasNext}
            isBookmarked={bookmarkedIds.includes(currentArticle.id)}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentLayout === 'print' && (
          <PrintReadyView
            articles={articles}
            bookMeta={bookMeta}
            onExit={() => setCurrentLayout('spread')}
          />
        )}

        {currentLayout === 'workspace' && (
          <WorkspaceHub
            currentUser={currentUser}
            onUserChange={setCurrentUser}
            articles={articles}
            bookMeta={bookMeta}
            selectedArticle={currentArticle}
            onImportArticleFromDrive={(title, text) => {
              const imported: Article = {
                id: `imported-${Date.now()}`,
                title: title.replace(/\.[^/.]+$/, ""),
                subtitle: 'গুগল ড্রাইভ ও পিকার থেকে সংকলিত পাণ্ডুলিপি',
                category: 'সমাজ ও মানবাধিকার',
                year: new Date().getFullYear(),
                publishedDate: `${new Date().toLocaleDateString('bn-BD', { month: 'long', day: 'numeric', year: 'numeric' })}`,
                newspaperIssue: 'ডিজিটাল ড্রাইভ পাণ্ডুলিপি',
                readingTimeMinutes: 5,
                excerpt: text.slice(0, 160) + '...',
                paragraphs: [text, 'পাণ্ডুলিপিটি গুগল ড্রাইভ থেকে স্বয়ংক্রিয়ভাবে সংকলনে আমদানি করা হয়েছে।'],
                bookPageNumber: (articles[articles.length - 1]?.bookPageNumber || 200) + 10
              };
              handleAddArticle(imported);
            }}
          />
        )}
      </main>

      {/* Add New Article Modal */}
      <AddArticleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddArticle={handleAddArticle}
        nextPageNumber={(articles[articles.length - 1]?.bookPageNumber || 200) + 12}
      />

      {/* Universal Quiet Editorial Footer */}
      <footer className="no-print bg-[#F3EFE6] border-t border-[#E8E2D8] py-8 px-6 text-xs text-[#78716C]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-base font-bold text-[#1C1917]">
              দৈনিক জাহান
            </span>
            <span className="text-[#A8A29E]">·</span>
            <span>শেখ মেহেদী হাসান নাদিম নির্বাচিত কলাম ও প্রকাশনা সমগ্র</span>
          </div>

          <div className="text-center md:text-right font-serif">
            <div>জাহান ভবন, ময়মনসিংহ · অনলাইন আর্কাইভ: dainikjahan.com</div>
            <div className="text-[11px] text-[#A8A29E] mt-0.5">
              Google Workspace (Slides, Sheets, Calendar, Drive, Picker) & Firebase Firestore সংযুক্ত
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
