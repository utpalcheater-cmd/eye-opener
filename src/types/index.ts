export type CategoryType = 
  | 'সংবিধান ও আইন'
  | 'রাজনীতি ও রূপান্তর'
  | 'সমাজ ও মানবাধিকার'
  | 'স্থানীয় সরকার ও অর্থনীতি'
  | 'প্রযুক্তি ও গণমাধ্যম'
  | 'নদী ও পরিবেশ';

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: CategoryType;
  year: number;
  publishedDate: string;
  newspaperIssue: string;
  originalUrl?: string;
  readingTimeMinutes: number;
  excerpt: string;
  leadDeck?: string;
  paragraphs: string[];
  pullQuote?: string;
  pullQuoteAttribution?: string;
  footnotes?: string[];
  bookPageNumber: number;
  isLeadArticle?: boolean;
}

export interface BookMetadata {
  title: string;
  subtitle: string;
  author: string;
  authorTitle: string;
  editor: string;
  publisher: string;
  publisherAddress: string;
  firstEditionYear: string;
  isbn: string;
  price: string;
  coverDesigner: string;
  printer: string;
  dedicationText: string;
  forewordText: string;
  editorNoteText: string;
}

export type ViewLayoutMode = 
  | 'spread'        // দ্বিপত্র স্প্রেড (বইয়ের দুই পাতা)
  | 'broadsheet'    // সংবাদপত্র ব্রডশিট লেআউট
  | 'magazine'      // আধুনিক সাময়িকী ও জার্নাল
  | 'reader'        // নিবিড় পাঠ / ফোকাস রিডার
  | 'contents'      // সামগ্রিক সূচিপত্র ও বছরভিত্তিক আর্কাইভ
  | 'cover'         // গ্রন্থ প্রচ্ছদ ও জ্যাকেট ডিজাইন
  | 'print'         // প্রেস ও মুদ্রণ প্রস্তুতি ভিউ
  | 'workspace';    // গুগল ওয়ার্কস্পেস (Slides, Sheets, Calendar, Drive, Picker) ও ফায়ারবেস

export type PaperTone = 'archival' | 'newsprint' | 'white' | 'sepia' | 'dark';

export type FontFamilyChoice = 'serif' | 'sans' | 'tiro';
