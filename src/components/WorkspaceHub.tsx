import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Article, BookMetadata } from '../types';
import { 
  googleSignIn, 
  logout, 
  getAccessToken 
} from '../services/firebase';
import {
  createPresentationFromArticle,
  listUserPresentations,
  exportCatalogueToSheets,
  listUserSpreadsheets,
  listCalendarEvents,
  createEditorialEvent,
  listDriveDocuments,
  saveAnthologyToDrive,
  openGooglePicker,
  CalendarEvent
} from '../services/googleWorkspace';
import { 
  Presentation, 
  FileSpreadsheet, 
  Calendar as CalendarIcon, 
  HardDrive, 
  MousePointerClick, 
  Cloud, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  RefreshCw,
  LogOut,
  UploadCloud,
  FileText
} from 'lucide-react';

interface WorkspaceHubProps {
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
  articles: Article[];
  bookMeta: BookMetadata;
  selectedArticle: Article;
  onImportArticleFromDrive?: (title: string, text: string) => void;
}

export const WorkspaceHub: React.FC<WorkspaceHubProps> = ({
  currentUser,
  onUserChange,
  articles,
  bookMeta,
  selectedArticle,
  onImportArticleFromDrive
}) => {
  const [activeTab, setActiveTab] = useState<'slides' | 'sheets' | 'calendar' | 'drive' | 'picker'>('slides');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Workspace items state
  const [presentations, setPresentations] = useState<any[]>([]);
  const [spreadsheets, setSpreadsheets] = useState<any[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);

  // Calendar event creation form
  const [eventTitle, setEventTitle] = useState('দৈনিক জাহান - পরবর্তী কলাম জমা দেওয়ার সময়সীমা');
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  const handleSignIn = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        onUserChange(result.user);
        setStatusMessage({ text: 'গুগল অ্যাকাউন্টে সফলভাবে সংযোগ স্থাপিত হয়েছে।', type: 'success' });
        loadWorkspaceData(result.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ text: 'লগইন সম্পন্ন করা যায়নি: ' + (err.message || 'অপ্রত্যাশিত ত্রুটি'), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    onUserChange(null);
    setPresentations([]);
    setSpreadsheets([]);
    setCalendarEvents([]);
    setDriveFiles([]);
    setStatusMessage({ text: 'সফলভাবে লগআউট করা হয়েছে।', type: 'info' });
  };

  const loadWorkspaceData = async (token: string) => {
    try {
      const [slides, sheets, calEvents, files] = await Promise.allSettled([
        listUserPresentations(token),
        listUserSpreadsheets(token),
        listCalendarEvents(token),
        listDriveDocuments(token)
      ]);

      if (slides.status === 'fulfilled') setPresentations(slides.value);
      if (sheets.status === 'fulfilled') setSpreadsheets(sheets.value);
      if (calEvents.status === 'fulfilled') setCalendarEvents(calEvents.value);
      if (files.status === 'fulfilled') setDriveFiles(files.value);
    } catch (e) {
      console.error('Error loading workspace data:', e);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getAccessToken().then(token => {
        if (token) loadWorkspaceData(token);
      });
    }
  }, [currentUser]);

  // Actions
  const handleExportToSlides = async () => {
    const token = await getAccessToken();
    if (!token) {
      setStatusMessage({ text: 'অনুগ্রহ করে প্রথমে গুগল সাইন ইন করুন।', type: 'info' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    try {
      const res = await createPresentationFromArticle(token, selectedArticle, bookMeta);
      setStatusMessage({ text: `স্লাইড তৈরি হয়েছে: "${selectedArticle.title}"`, type: 'success' });
      setPresentations(prev => [{ name: res.title, webViewLink: res.presentationUrl, id: res.presentationId }, ...prev]);
      window.open(res.presentationUrl, '_blank');
    } catch (err: any) {
      setStatusMessage({ text: 'স্লাইড তৈরিতে সমস্যা: ' + err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportToSheets = async () => {
    const token = await getAccessToken();
    if (!token) {
      setStatusMessage({ text: 'অনুগ্রহ করে প্রথমে গুগল সাইন ইন করুন।', type: 'info' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    try {
      const res = await exportCatalogueToSheets(token, articles, bookMeta);
      setStatusMessage({ text: 'গুগল স্প্রেডশিটে সম্পূর্ণ সূচিপত্র এক্সপোর্ট সফল হয়েছে।', type: 'success' });
      setSpreadsheets(prev => [{ name: res.title, webViewLink: res.spreadsheetUrl, id: res.spreadsheetId }, ...prev]);
      window.open(res.spreadsheetUrl, '_blank');
    } catch (err: any) {
      setStatusMessage({ text: 'শিট তৈরিতে সমস্যা: ' + err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCalendarEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await getAccessToken();
    if (!token) {
      setStatusMessage({ text: 'অনুগ্রহ করে প্রথমে গুগল সাইন ইন করুন।', type: 'info' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    try {
      const startDateTime = `${eventDate}T10:00:00+06:00`;
      const endDateTime = `${eventDate}T12:00:00+06:00`;
      const newEv = await createEditorialEvent(
        token,
        eventTitle,
        `দৈনিক জাহান উপ-সম্পাদকীয় কলাম ডেডলাইন। গ্রন্থ সংকলন রেফারেন্স: ${bookMeta.title}`,
        startDateTime,
        endDateTime
      );
      setStatusMessage({ text: 'গুগল ক্যালেন্ডারে সময়সূচি সফলভাবে যোগ হয়েছে।', type: 'success' });
      setCalendarEvents(prev => [newEv, ...prev]);
    } catch (err: any) {
      setStatusMessage({ text: 'ক্যালেন্ডার ইভেন্ট তৈরিতে সমস্যা: ' + err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackupToDrive = async () => {
    const token = await getAccessToken();
    if (!token) {
      setStatusMessage({ text: 'অনুগ্রহ করে প্রথমে গুগল সাইন ইন করুন।', type: 'info' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    try {
      const anthologyText = `গ্রন্থের নাম: ${bookMeta.title}\nলেখক: ${bookMeta.author} (${bookMeta.authorTitle})\nপ্রকাশক: ${bookMeta.publisher}\n\n` +
        articles.map((a, i) => `[${i+1}] ${a.title} (${a.year})\n${a.category} · ${a.publishedDate}\n\n${a.paragraphs.join('\n\n')}\n\n--------------------\n`).join('\n');

      const fileName = `Dainik_Jahan_Anthology_${bookMeta.author}_${new Date().toISOString().slice(0, 10)}.txt`;
      const saved = await saveAnthologyToDrive(token, fileName, anthologyText);
      setStatusMessage({ text: `গুগল ড্রাইভে সংকলন ফাইল ব্যাকআপ হয়েছে: ${fileName}`, type: 'success' });
      setDriveFiles(prev => [saved, ...prev]);
    } catch (err: any) {
      setStatusMessage({ text: 'ড্রাইভে সংরক্ষণে সমস্যা: ' + err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchPicker = async () => {
    const token = await getAccessToken();
    if (!token) {
      setStatusMessage({ text: 'অনুগ্রহ করে প্রথমে গুগল সাইন ইন করুন।', type: 'info' });
      return;
    }

    setStatusMessage({ text: 'গুগল পিকার উইন্ডো খোলা হচ্ছে...', type: 'info' });
    openGooglePicker(
      token,
      (pickedDoc) => {
        setStatusMessage({ text: `নির্বাচিত ডকুমেন্ট: "${pickedDoc.name}"`, type: 'success' });
        if (onImportArticleFromDrive) {
          onImportArticleFromDrive(pickedDoc.name, `গুগল ড্রাইভ থেকে আমদানি করা ডকুমেন্ট: ${pickedDoc.url}`);
        }
      },
      (err) => {
        setStatusMessage({ text: 'পিকার ত্রুটি: ' + String(err), type: 'error' });
      }
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 lg:px-8">
      {/* Top Banner: Author-First Workspace Integration (No API Key Hassle) */}
      <div className="bg-[#FAF7F0] border border-[#D6CEBE] rounded-xl p-6 lg:p-8 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E8E2D8]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#9A3412] font-semibold mb-1">
              <Cloud className="w-4 h-4" />
              <span>গুগল ওয়ার্কস্পেস ও ফায়ারবেস ক্লাউড স্টুডিও</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-serif font-bold text-[#1C1917]">
              লেখক ও প্রকাশকের স্বয়ংক্রিয় ক্লাউড সংযোগ
            </h2>
            <p className="text-xs font-serif text-[#57534E] mt-1 max-w-2xl leading-relaxed">
              কোনো জটিল এপিআই কি (API Key) বা টেকনিক্যাল সেটআপের ঝামেলা নেই। এক ক্লিকে গুগল সাইন ইন করেই সরাসরি গুগল স্লাইডস, শিটস, ক্যালেন্ডার, ড্রাইভ এবং গুগল পিকার ব্যবহার করুন।
            </p>
          </div>

          {/* Google Official Sign In Button or Connected Profile */}
          <div className="shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-white border border-[#D6CEBE] p-2.5 rounded-lg shadow-2xs">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Profile" className="w-9 h-9 rounded-full border border-neutral-200" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#9A3412] text-white flex items-center justify-center font-bold text-sm">
                    {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-[#1C1917] leading-tight">
                    {currentUser.displayName || 'লেখক ব্যবহারকারী'}
                  </div>
                  <div className="text-[11px] text-[#78716C] truncate max-w-[180px]">
                    {currentUser.email}
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  title="লগআউট"
                  className="p-1.5 text-[#78716C] hover:text-[#9A3412] ml-1 rounded hover:bg-neutral-100"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="gsi-material-button inline-flex items-center justify-center bg-white border border-neutral-300 rounded-md px-4 py-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <div className="w-4 h-4 mr-2.5 shrink-0">
                  <svg viewBox="0 0 48 48" className="w-full h-full">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                </div>
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Message Notification */}
        {statusMessage && (
          <div className={`mt-4 p-3 rounded-lg text-xs flex items-center gap-2 ${
            statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
            statusMessage.type === 'error' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
            'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Service Sub-navigation Tabs */}
        <div className="flex items-center flex-wrap gap-2 mt-6">
          <button
            onClick={() => setActiveTab('slides')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'slides' ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-[#57534E] border border-[#D6CEBE] hover:bg-[#F3EFE6]'
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-amber-500" />
            <span>Google Slides (স্লাইডস)</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'sheets' ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-[#57534E] border border-[#D6CEBE] hover:bg-[#F3EFE6]'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Google Sheets (স্প্রেডশিট)</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'calendar' ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-[#57534E] border border-[#D6CEBE] hover:bg-[#F3EFE6]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
            <span>Google Calendar (সময়সূচি)</span>
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'drive' ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-[#57534E] border border-[#D6CEBE] hover:bg-[#F3EFE6]'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 text-yellow-500" />
            <span>Google Drive (ড্রাইভ ফাইলস)</span>
          </button>

          <button
            onClick={() => setActiveTab('picker')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'picker' ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-[#57534E] border border-[#D6CEBE] hover:bg-[#F3EFE6]'
            }`}
          >
            <MousePointerClick className="w-3.5 h-3.5 text-purple-500" />
            <span>Google Picker (ফাইল পিকার)</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: GOOGLE SLIDES */}
      {activeTab === 'slides' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-[#D6CEBE] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
              <Presentation className="w-4 h-4" />
              <span>স্লাইড প্রেজেন্টেশন জেনারেটর</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1C1917]">
              কলাম থেকে তাৎক্ষণিক প্রেজেন্টেশন
            </h3>
            <p className="text-xs font-serif text-[#57534E] leading-relaxed">
              নির্বাচিত কলামটির শিরোনাম, মূল উপজীব্য, উদ্ধৃতি ও সিদ্ধান্তমূলক বার্তা নিয়ে গুগল স্লাইডসে একটি পূর্ণাঙ্গ প্রেজেন্টেশন তৈরি করে নিন।
            </p>

            <div className="p-3 bg-[#FAF7F0] border border-[#D6CEBE] rounded-lg text-xs space-y-1 font-serif">
              <div className="font-semibold text-[#1C1917]">নির্বাচিত কলাম:</div>
              <div className="text-[#9A3412] font-bold">{selectedArticle.title}</div>
              <div className="text-[11px] text-[#78716C]">{selectedArticle.category} · {selectedArticle.publishedDate}</div>
            </div>

            <button
              onClick={handleExportToSlides}
              disabled={isLoading || !currentUser}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <Presentation className="w-4 h-4" />
              <span>Google Slides এ প্রেজেন্টেশন তৈরি করুন</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-[#FAF7F0] border border-[#D6CEBE] rounded-xl p-6 shadow-xs">
            <h4 className="text-sm font-serif font-bold text-[#1C1917] mb-4 pb-2 border-b border-[#D6CEBE] flex items-center justify-between">
              <span>আপনার গুগল স্লাইডস প্রেজেন্টেশনসমূহ</span>
              <span className="text-xs text-[#78716C] font-mono">{presentations.length}টি ডেক</span>
            </h4>

            {presentations.length > 0 ? (
              <div className="divide-y divide-[#E0D9CD] space-y-3">
                {presentations.map((p, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <Presentation className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-serif font-medium text-[#1C1917] truncate max-w-sm">{p.name}</span>
                    </div>
                    {p.webViewLink && (
                      <a
                        href={p.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[11px] text-[#9A3412] hover:underline font-mono shrink-0"
                      >
                        <span>খুলুন</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-[#78716C] font-serif">
                কোনো প্রেজেন্টেশন পাওয়া যায়নি বা এখনও তৈরি করা হয়নি
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: GOOGLE SHEETS */}
      {activeTab === 'sheets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-[#D6CEBE] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
              <FileSpreadsheet className="w-4 h-4" />
              <span>সূচিপত্র স্প্রেডশিট এক্সপোর্ট</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1C1917]">
              পুরো সংকলনের ক্যাটালগ গুগল শিটসে
            </h3>
            <p className="text-xs font-serif text-[#57534E] leading-relaxed">
              শেখ মেহেদী হাসান নাদিম-এর সমস্ত কলাম, প্রকাশনা সাল, পত্রিকার সংখ্যা, পৃষ্ঠা নম্বর ও লিংক সহ একটি স্বয়ংসম্পূর্ণ স্প্রেডশিট তৈরি হবে।
            </p>

            <div className="p-3 bg-[#FAF7F0] border border-[#D6CEBE] rounded-lg text-xs space-y-1 font-mono">
              <div>মোট অন্তর্ভুক্ত নিবন্ধ: {articles.length}টি</div>
              <div>সময়সীমা: ২০২১ — ২০২৬</div>
              <div>হেডার ফিল্ডস: শিরোনাম, বিষয়, সাল, পৃষ্ঠা, লিংক</div>
            </div>

            <button
              onClick={handleExportToSheets}
              disabled={isLoading || !currentUser}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Google Sheets এ এক্সপোর্ট করুন</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-[#FAF7F0] border border-[#D6CEBE] rounded-xl p-6 shadow-xs">
            <h4 className="text-sm font-serif font-bold text-[#1C1917] mb-4 pb-2 border-b border-[#D6CEBE] flex items-center justify-between">
              <span>আপনার গুগল শিটস স্প্রেডশিটসমূহ</span>
              <span className="text-xs text-[#78716C] font-mono">{spreadsheets.length}টি শিট</span>
            </h4>

            {spreadsheets.length > 0 ? (
              <div className="divide-y divide-[#E0D9CD] space-y-3">
                {spreadsheets.map((s, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-serif font-medium text-[#1C1917] truncate max-w-sm">{s.name}</span>
                    </div>
                    {s.webViewLink && (
                      <a
                        href={s.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[11px] text-[#9A3412] hover:underline font-mono shrink-0"
                      >
                        <span>খুলুন</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-[#78716C] font-serif">
                কোনো স্প্রেডশিট পাওয়া যায়নি বা এখনও এক্সপোর্ট করা হয়নি
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: GOOGLE CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-[#D6CEBE] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <CalendarIcon className="w-4 h-4" />
              <span>সম্পাদকীয় ক্যালেন্ডার ও ডেডলাইন</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1C1917]">
              কলাম লেখার সময়সূচি শিডিউল
            </h3>

            <form onSubmit={handleAddCalendarEvent} className="space-y-3 text-xs font-serif">
              <div>
                <label className="block font-semibold text-[#1C1917] mb-1">ইভেন্ট বা ডেডলাইনের শিরোনাম:</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D6CEBE] rounded text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C1917] mb-1">তারিখ:</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D6CEBE] rounded text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !currentUser}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Google Calendar এ ইভেন্ট যুক্ত করুন</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-[#FAF7F0] border border-[#D6CEBE] rounded-xl p-6 shadow-xs">
            <h4 className="text-sm font-serif font-bold text-[#1C1917] mb-4 pb-2 border-b border-[#D6CEBE] flex items-center justify-between">
              <span>আসন্ন ক্যালেন্ডার ইভেন্টসমূহ</span>
              <span className="text-xs text-[#78716C] font-mono">{calendarEvents.length}টি ইভেন্ট</span>
            </h4>

            {calendarEvents.length > 0 ? (
              <div className="divide-y divide-[#E0D9CD] space-y-3">
                {calendarEvents.map((ev) => (
                  <div key={ev.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-serif font-bold text-[#1C1917]">{ev.summary}</div>
                      <div className="text-[11px] text-[#78716C]">
                        {ev.start.dateTime ? new Date(ev.start.dateTime).toLocaleDateString('bn-BD', { month: 'long', day: 'numeric', year: 'numeric' }) : ev.start.date}
                      </div>
                    </div>
                    {ev.htmlLink && (
                      <a
                        href={ev.htmlLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#9A3412] hover:underline font-mono text-[11px]"
                      >
                        ক্যালেন্ডারে দেখুন →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-[#78716C] font-serif">
                কোনো আসন্ন ইভেন্ট পাওয়া যায়নি
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: GOOGLE DRIVE */}
      {activeTab === 'drive' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-[#D6CEBE] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-yellow-600 uppercase tracking-wider">
              <HardDrive className="w-4 h-4" />
              <span>গুগল ড্রাইভ ব্যাকআপ ও ফাইলস</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1C1917]">
              ক্লাউড ব্যাকআপ সরাসরি ড্রাইভে
            </h3>
            <p className="text-xs font-serif text-[#57534E] leading-relaxed">
              শেখ মেহেদী হাসান নাদিমের সমস্ত সংকলিত কলাম একটি পূর্ণাঙ্গ আর্কাইভ ফাইল হিসেবে সরাসরি আপনার গুগল ড্রাইভে সংরক্ষণ করুন।
            </p>

            <button
              onClick={handleBackupToDrive}
              disabled={isLoading || !currentUser}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>সমগ্র সংকলন Google Drive এ সংরক্ষণ করুন</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-[#FAF7F0] border border-[#D6CEBE] rounded-xl p-6 shadow-xs">
            <h4 className="text-sm font-serif font-bold text-[#1C1917] mb-4 pb-2 border-b border-[#D6CEBE] flex items-center justify-between">
              <span>ড্রাইভ ডকুমেন্ট ও পান্ডুলিপি তালিকা</span>
              <span className="text-xs text-[#78716C] font-mono">{driveFiles.length}টি ফাইল</span>
            </h4>

            {driveFiles.length > 0 ? (
              <div className="divide-y divide-[#E0D9CD] space-y-3">
                {driveFiles.map((f, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#78716C] shrink-0" />
                      <span className="font-serif font-medium text-[#1C1917] truncate max-w-sm">{f.name}</span>
                    </div>
                    {f.webViewLink && (
                      <a
                        href={f.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#9A3412] hover:underline font-mono shrink-0"
                      >
                        ড্রাইভে দেখুন →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-[#78716C] font-serif">
                কোনো ডকুমেন্ট ফাইল পাওয়া যায়নি
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: GOOGLE PICKER */}
      {activeTab === 'picker' && (
        <div className="bg-white border border-[#D6CEBE] rounded-xl p-8 shadow-xs max-w-3xl mx-auto text-center space-y-5">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
            <MousePointerClick className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-[#1C1917]">
              Google Picker (গুগল ড্রাইভ ফাইল নির্বাচক)
            </h3>
            <p className="text-xs font-serif text-[#57534E] max-w-lg mx-auto mt-2 leading-relaxed">
              আপনার গুগল ড্রাইভের যেকোনো ফাইল বা ডকুমেন্টস থেকে সরাসরি নির্বাচন করুন। নির্বাচন করলে তার নাম ও তথ্য সংকলন ড্যাশবোর্ডে লিংক হয়ে যাবে।
            </p>
          </div>

          <div className="pt-3">
            <button
              onClick={handleLaunchPicker}
              disabled={isLoading || !currentUser}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <MousePointerClick className="w-4 h-4" />
              <span>Google Picker উইন্ডো ওপেন করুন</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
