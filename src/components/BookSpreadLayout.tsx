import React from 'react';
import { Article, BookMetadata, PaperTone, FontFamilyChoice } from '../types';
import { ChevronLeft, ChevronRight, Bookmark, Share2, Copy, Check, ExternalLink } from 'lucide-react';

interface BookSpreadLayoutProps {
  article: Article;
  bookMeta: BookMetadata;
  paperTone: PaperTone;
  fontFamily: FontFamilyChoice;
  fontSize: number;
  columnCount: 1 | 2 | 3;
  onPrevArticle: () => void;
  onNextArticle: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export const BookSpreadLayout: React.FC<BookSpreadLayoutProps> = ({
  article,
  bookMeta,
  paperTone,
  fontFamily,
  fontSize,
  columnCount,
  onPrevArticle,
  onNextArticle,
  hasPrev,
  hasNext,
  isBookmarked,
  onToggleBookmark
}) => {
  const [copied, setCopied] = React.useState(false);

  const getBgColor = () => {
    switch (paperTone) {
      case 'newsprint': return '#F4F1EA';
      case 'white': return '#FFFFFF';
      case 'sepia': return '#F7EFE2';
      case 'archival':
      default: return '#FBF9F5';
    }
  };

  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'sans': return 'font-sans-bn';
      case 'tiro': return 'font-serif-bn italic';
      case 'serif':
      default: return 'font-serif-bn';
    }
  };

  const handleCopyCitation = () => {
    const citation = `নাদিম, শেখ মেহেদী হাসান। (${article.year})। "${article.title}"। দৈনিক জাহান, ${article.newspaperIssue}, ${article.publishedDate}। সংকলিত: ${bookMeta.title}, পৃ. ${article.bookPageNumber}।`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Splitting paragraphs across the two pages of the spread:
  // Left page: lead deck, opening paragraphs
  // Right page: continuing paragraphs, pull quotes, footnotes
  const midPoint = Math.max(1, Math.ceil(article.paragraphs.length / 2));
  const leftParagraphs = article.paragraphs.slice(0, midPoint);
  const rightParagraphs = article.paragraphs.slice(midPoint);

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 lg:px-8">
      {/* Top Meta Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs text-[#78716C] border-b border-[#E8E2D8] pb-3">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#9A3412] uppercase tracking-wider">
            {article.category}
          </span>
          <span aria-hidden="true">·</span>
          <span>প্রকাশকাল: {article.publishedDate}</span>
          <span aria-hidden="true">·</span>
          <span>{article.newspaperIssue}</span>
          <span aria-hidden="true">·</span>
          <span>পড়ার সময়: {article.readingTimeMinutes} মিনিট</span>
        </div>

        <div className="flex items-center gap-2">
          {article.originalUrl && (
            <a
              href={article.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#57534E] hover:text-[#1C1917] border border-[#D6CEBE] rounded hover:bg-[#F3EFE6] transition-colors"
              title="দৈনিক জাহান অনলাইন মূল কপি দেখুন"
            >
              <ExternalLink className="w-3 h-3 text-[#78716C]" />
              <span>মূল পাতা</span>
            </a>
          )}

          <button
            onClick={handleCopyCitation}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#57534E] hover:text-[#1C1917] border border-[#D6CEBE] rounded hover:bg-[#F3EFE6] transition-colors"
            title="আন্তর্জাতিক গ্রন্থপঞ্জি উদ্ধৃতি কপি করুন"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#78716C]" />}
            <span>{copied ? 'উদ্ধৃতি কপি হয়েছে' : 'সাইটেশন'}</span>
          </button>

          <button
            onClick={() => onToggleBookmark(article.id)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs border rounded transition-colors ${
              isBookmarked 
                ? 'bg-[#9A3412] text-white border-[#9A3412]' 
                : 'text-[#57534E] hover:text-[#1C1917] border-[#D6CEBE] hover:bg-[#F3EFE6]'
            }`}
          >
            <Bookmark className="w-3 h-3" />
            <span>{isBookmarked ? 'বুকমার্কড' : 'বুকমার্ক'}</span>
          </button>
        </div>
      </div>

      {/* Book Spread Double Page Canvas */}
      <div 
        className="relative shadow-2xl rounded-sm border border-[#DED7CB] transition-colors overflow-hidden"
        style={{ backgroundColor: getBgColor() }}
      >
        {/* Visual Gutter & Spine Center Effect */}
        <div className="hidden lg:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-12 pointer-events-none z-10 bg-gradient-to-r from-black/[0.04] via-black/[0.12] to-black/[0.04] shadow-[inset_0_0_8px_rgba(0,0,0,0.06)]" />

        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[750px]">
          {/* ================= LEFT PAGE (VERSO) ================= */}
          <div className="p-8 lg:p-14 lg:pr-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E8E2D8]/70">
            {/* Running Head (Verso) */}
            <div className="flex items-center justify-between text-xs font-serif text-[#78716C] pb-6 border-b border-[#E8E2D8] mb-8">
              <span className="font-mono tabular-nums text-sm font-semibold text-[#1C1917]">
                পৃষ্ঠা {article.bookPageNumber}
              </span>
              <span className="tracking-widest uppercase text-[11px]">
                {bookMeta.title}
              </span>
            </div>

            {/* Left Content Area */}
            <div className="flex-1">
              {/* Category & Kicker */}
              <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold mb-2">
                {article.category} · উপ-সম্পাদকীয় কলাম
              </div>

              {/* Title & Deck */}
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#1C1917] leading-snug tracking-tight mb-3">
                {article.title}
              </h1>

              {article.subtitle && (
                <h2 className="text-sm font-serif italic text-[#57534E] leading-relaxed mb-6 pb-4 border-b border-[#E8E2D8]">
                  {article.subtitle}
                </h2>
              )}

              {/* Byline lockup */}
              <div className="flex items-center gap-3 mb-6 text-xs text-[#78716C]">
                <div>
                  <div className="font-semibold text-[#1C1917] font-serif text-sm">
                    {bookMeta.author}
                  </div>
                  <div>{bookMeta.authorTitle}</div>
                </div>
              </div>

              {/* Lead Deck */}
              {article.leadDeck && (
                <div className="p-4 mb-6 bg-black/[0.02] border-y border-[#D6CEBE]/80 text-[#292524] text-sm font-serif italic leading-relaxed">
                  {article.leadDeck}
                </div>
              )}

              {/* Opening Paragraphs with Drop Cap */}
              <div 
                className={`${getFontFamilyClass()} text-[#292524] leading-relaxed text-justify space-y-4`}
                style={{ fontSize: `${fontSize}px` }}
              >
                {leftParagraphs.map((para, index) => (
                  <p key={index} className={index === 0 ? "first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#9A3412]" : ""}>
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Bottom Folio Left */}
            <div className="pt-8 text-[11px] text-[#A8A29E] font-serif text-left border-t border-[#E8E2D8] mt-8">
              দৈনিক জাহান সংগ্রহশালা · সংস্করণ {bookMeta.firstEditionYear}
            </div>
          </div>

          {/* ================= RIGHT PAGE (RECTO) ================= */}
          <div className="p-8 lg:p-14 lg:pl-16 flex flex-col justify-between">
            {/* Running Head (Recto) */}
            <div className="flex items-center justify-between text-xs font-serif text-[#78716C] pb-6 border-b border-[#E8E2D8] mb-8">
              <span className="tracking-widest uppercase text-[11px] truncate max-w-[280px]">
                {article.title}
              </span>
              <span className="font-mono tabular-nums text-sm font-semibold text-[#1C1917]">
                পৃষ্ঠা {article.bookPageNumber + 1}
              </span>
            </div>

            {/* Right Content Area */}
            <div className="flex-1">
              {/* Continuing Paragraphs */}
              <div 
                className={`${getFontFamilyClass()} text-[#292524] leading-relaxed text-justify space-y-4`}
                style={{ fontSize: `${fontSize}px` }}
              >
                {rightParagraphs.map((para, index) => (
                  <p key={index}>
                    {para}
                  </p>
                ))}
              </div>

              {/* Pull Quote */}
              {article.pullQuote && (
                <div className="my-8 py-5 border-y-2 border-[#D6CEBE] text-center px-4 bg-black/[0.015]">
                  <p className="font-serif italic text-lg lg:text-xl text-[#1C1917] leading-relaxed">
                    “{article.pullQuote}”
                  </p>
                  {article.pullQuoteAttribution && (
                    <p className="text-xs font-serif text-[#78716C] mt-2 font-medium">
                      {article.pullQuoteAttribution}
                    </p>
                  )}
                </div>
              )}

              {/* Footnotes if any */}
              {article.footnotes && article.footnotes.length > 0 && (
                <div className="mt-8 pt-4 border-t border-[#E8E2D8] text-xs font-serif text-[#78716C] space-y-1">
                  <div className="font-semibold text-[#57534E] mb-1">টীকা ও তথ্যসূত্র:</div>
                  {article.footnotes.map((fn, idx) => (
                    <div key={idx}>{fn}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Folio Right */}
            <div className="pt-8 text-[11px] text-[#A8A29E] font-serif text-right border-t border-[#E8E2D8] mt-8">
              {bookMeta.publisher} · ময়মনসিংহ
            </div>
          </div>
        </div>
      </div>

      {/* Spread Navigation Bar (Bottom) */}
      <div className="no-print flex items-center justify-between mt-8 pt-4 border-t border-[#E8E2D8]">
        <button
          onClick={onPrevArticle}
          disabled={!hasPrev}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium border border-[#D6CEBE] rounded-lg hover:bg-white text-[#1C1917] disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>পূর্ববর্তী নিবন্ধ</span>
        </button>

        <div className="text-xs text-[#78716C] font-serif text-center">
          দ্বিপত্র পেজ মেকআপ: <span className="font-mono font-semibold text-[#1C1917]">{article.bookPageNumber}–{article.bookPageNumber + 1}</span>
        </div>

        <button
          onClick={onNextArticle}
          disabled={!hasNext}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium border border-[#D6CEBE] rounded-lg hover:bg-white text-[#1C1917] disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <span>পরবর্তী নিবন্ধ</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
