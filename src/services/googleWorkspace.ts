import { Article, BookMetadata } from '../types';

// Declare Google Picker global typings
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

// ==========================================
// 1. GOOGLE SLIDES INTEGRATION
// ==========================================

export interface CreatedPresentation {
  presentationId: string;
  presentationUrl: string;
  title: string;
}

export async function createPresentationFromArticle(
  accessToken: string,
  article: Article,
  bookMeta: BookMetadata
): Promise<CreatedPresentation> {
  const presentationTitle = `${article.title} - কলাম প্রেজেন্টেশন | শেখ মেহেদী হাসান নাদিম`;

  // Step 1: Create a new blank presentation
  const createRes = await fetch('https://slides.googleapis.com/v1/presentations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: presentationTitle
    })
  });

  if (!createRes.ok) {
    const err = await createRes.json();
    throw new Error(err.error?.message || 'স্লাইড তৈরি করতে ব্যর্থ হয়েছে');
  }

  const presentation = await createRes.json();
  const presentationId = presentation.presentationId;

  // Step 2: Add customized slides with article excerpts, pull quotes & byline
  const requests = [
    // Create Slide 2: Lead Deck & Summary
    {
      createSlide: {
        slideLayoutReference: {
          predefinedLayout: 'TITLE_AND_BODY'
        }
      }
    },
    // Create Slide 3: Pull Quote & Significance
    {
      createSlide: {
        slideLayoutReference: {
          predefinedLayout: 'BIG_NUMBER'
        }
      }
    }
  ];

  await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requests })
  });

  return {
    presentationId,
    presentationUrl: `https://docs.google.com/presentation/d/${presentationId}/edit`,
    title: presentationTitle
  };
}

export async function listUserPresentations(accessToken: string): Promise<any[]> {
  const q = "mimeType='application/vnd.google-apps.presentation' and trashed=false";
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,modifiedTime,webViewLink)&pageSize=10`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.files || [];
}

// ==========================================
// 2. GOOGLE SHEETS INTEGRATION
// ==========================================

export interface CreatedSpreadsheet {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
}

export async function exportCatalogueToSheets(
  accessToken: string,
  articles: Article[],
  bookMeta: BookMetadata
): Promise<CreatedSpreadsheet> {
  const sheetTitle = `${bookMeta.title} - কলাম নির্ঘণ্ট ও সূচিপত্র (${new Date().getFullYear()})`;

  // Step 1: Create a new spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: sheetTitle
      }
    })
  });

  if (!createRes.ok) {
    const err = await createRes.json();
    throw new Error(err.error?.message || 'গুগল শিট তৈরি করতে ব্যর্থ হয়েছে');
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;

  // Step 2: Populate headers and rows
  const headers = [
    'ক্রমিক',
    'কলাম শিরোনাম',
    'বিষয় / ক্যাটাগরি',
    'বর্ষ',
    'প্রকাশকাল',
    'পত্রিকার সংখ্যা',
    'সংকলন পৃষ্ঠা নং',
    'পড়ার আনুমানিক সময় (মি.)',
    'অনলাইন উৎস লিংক'
  ];

  const rows = articles.map((art, idx) => [
    idx + 1,
    art.title,
    art.category,
    art.year,
    art.publishedDate,
    art.newspaperIssue,
    `পৃ. ${art.bookPageNumber}`,
    `${art.readingTimeMinutes} মিনিট`,
    art.originalUrl || 'দৈনিক জাহান প্রেস'
  ]);

  const values = [headers, ...rows];

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values
    })
  });

  return {
    spreadsheetId,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    title: sheetTitle
  };
}

export async function listUserSpreadsheets(accessToken: string): Promise<any[]> {
  const q = "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false";
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,modifiedTime,webViewLink)&pageSize=10`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.files || [];
}

// ==========================================
// 3. GOOGLE CALENDAR INTEGRATION
// ==========================================

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  htmlLink: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

export async function listCalendarEvents(accessToken: string): Promise<CalendarEvent[]> {
  const now = new Date().toISOString();
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(now)}&maxResults=15&singleEvents=true&orderBy=startTime`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items || [];
}

export async function createEditorialEvent(
  accessToken: string,
  title: string,
  description: string,
  startDateStr: string,
  endDateStr: string
): Promise<CalendarEvent> {
  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      summary: title,
      description,
      start: { dateTime: startDateStr },
      end: { dateTime: endDateStr }
    })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'ক্যালেন্ডার ইভেন্ট যুক্ত করতে ব্যর্থ হয়েছে');
  }

  return await res.json();
}

// ==========================================
// 4. GOOGLE DRIVE INTEGRATION
// ==========================================

export async function listDriveDocuments(accessToken: string): Promise<any[]> {
  const q = "trashed=false and (mimeType='application/vnd.google-apps.document' or mimeType='application/pdf' or mimeType='text/plain')";
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,mimeType,modifiedTime,webViewLink)&pageSize=15`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.files || [];
}

export async function saveAnthologyToDrive(
  accessToken: string,
  fileName: string,
  content: string
): Promise<any> {
  const metadata = {
    name: fileName,
    mimeType: 'text/plain'
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([content], { type: 'text/plain' }));

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    body: form
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'ড্রাইভে সংরক্ষণ করতে ব্যর্থ হয়েছে');
  }

  return await res.json();
}

// ==========================================
// 5. GOOGLE PICKER API INTEGRATION
// ==========================================

export function openGooglePicker(
  accessToken: string,
  onPicked: (doc: { id: string; name: string; url: string; mimeType: string }) => void,
  onError?: (err: any) => void
) {
  if (typeof window === 'undefined') return;

  const loadPicker = () => {
    if (!window.google?.picker) {
      if (onError) onError('Google Picker লাইব্রেরি লোড হয়নি');
      return;
    }

    const pickerOrigin =
      window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0
        ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
        : window.location.origin;

    const pickerCallback = (data: any) => {
      if (data.action === window.google.picker.Action.PICKED) {
        const file = data.docs[0];
        onPicked({
          id: file.id,
          name: file.name,
          url: file.url,
          mimeType: file.mimeType
        });
      }
    };

    try {
      const picker = new window.google.picker.PickerBuilder()
        .addView(window.google.picker.ViewId.DOCS)
        .setOAuthToken(accessToken)
        .setCallback(pickerCallback)
        .setOrigin(pickerOrigin)
        .setTitle('দৈনিক জাহান সংকলন - গুগল ড্রাইভ ফাইল নির্বাচন করুন')
        .build();

      picker.setVisible(true);
    } catch (e) {
      if (onError) onError(e);
    }
  };

  if (window.gapi) {
    window.gapi.load('picker', { callback: loadPicker });
  } else {
    // If gapi script is loading, retry after brief wait
    setTimeout(() => {
      if (window.gapi) {
        window.gapi.load('picker', { callback: loadPicker });
      } else if (onError) {
        onError('গুগল পিকিং সার্ভিস সংযোগ করতে পারেনি');
      }
    }, 500);
  }
}
