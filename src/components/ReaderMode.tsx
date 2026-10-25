import React from 'react';
import { Article, BookMetadata, PaperTone, FontFamilyChoice } from '../types';
import { ChevronLeft, ChevronRight, Bookmark, Copy, Check, ExternalLink } from 'lucide-react';

interface ReaderModeProps {
  article: Article;
  bookMeta: BookMetadata;
  paperTone: PaperTone;
  fontFamily: FontFamilyChoice;
  fontSize: number;
  onPrevArticle: () => void;
  onNextArticle: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export const ReaderMode: React.FC<ReaderModeProps> = ({
  article,
  bookMeta,
  paperTone,
  fontFamily,
  fontSize,
  onPrevArticle,
  onNextArticle,
  hasPrev,
  hasNext,
  isBookmarked,
  onToggleBookmark
}) => {
  const [copied, setCopied] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScrollProgress((totalScroll / windowHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    const citation = `নাদিম, শেখ মেহেদী হাসান। (${article.year})। "${article.title}"। দৈনিক জাহান, ${article.publishedDate}।`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 transition-colors" style={{ backgroundColor: getBgColor() }}>
      {/* Sticky Reading Progress Bar */}
      <div 
        className="fixed top-[57px] left-0 h-1 bg-[#9A3412] z-30 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <article className="max-w-2xl mx-auto">
        {/* Article Top Kicker */}
        <div className="flex items-center justify-between text-xs text-[#78716C] mb-4 pb-3 border-b border-[#E8E2D8]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#9A3412] uppercase tracking-wider">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{article.publishedDate}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readingTimeMinutes} মিনিট পাঠ</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCitation}
              className="p-1.5 text-[#78716C] hover:text-[#1C1917] border border-[#D6CEBE] rounded hover:bg-white"
              title="সাইটেশন কপি"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => onToggleBookmark(article.id)}
              className="p-1.5 text-[#78716C] hover:text-[#9A3412] border border-[#D6CEBE] rounded hover:bg-white"
              title="বুকমার্ক"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#9A3412] text-[#9A3412]' : ''}`} />
            </button>
            {article.originalUrl && (
              <a
                href={article.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 text-[#78716C] hover:text-[#1C1917] border border-[#D6CEBE] rounded hover:bg-white"
                title="দৈনিক জাহান মূল পাতা"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#1C1917] leading-tight tracking-tight mb-4 text-balance">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="text-base md:text-lg font-serif italic text-[#57534E] mb-6 leading-relaxed">
            {article.subtitle}
          </p>
        )}

        {/* Byline */}
        <div className="flex items-center justify-between py-3 border-y border-[#E8E2D8] mb-8 text-xs text-[#57534E]">
          <div>
            <div className="font-bold text-[#1C1917] font-serif text-sm">{bookMeta.author}</div>
            <div className="text-[#78716C]">{bookMeta.authorTitle}</div>
          </div>
          <div className="text-right font-mono text-[11px] text-[#78716C]">
            <div>{article.newspaperIssue}</div>
            <div>সংকলন পৃষ্ঠা {article.bookPageNumber}</div>
          </div>
        </div>

        {/* Lead Deck */}
        {article.leadDeck && (
          <div className="p-5 mb-8 bg-black/[0.02] border-y border-[#D6CEBE] font-serif italic text-base text-[#292524] leading-relaxed">
            {article.leadDeck}
          </div>
        )}

        {/* Prose Body */}
        <div 
          className={`${getFontFamilyClass()} text-[#292524] leading-[1.8] space-y-6 text-justify`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {article.paragraphs.map((p, idx) => (
            <p 
              key={idx}
              className={idx === 0 ? "first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#9A3412]" : ""}
            >
              {p}
            </p>
          ))}
        </div>

        {/* Pull Quote */}
        {article.pullQuote && (
          <div className="my-10 py-6 border-y-2 border-[#1C1917] text-center px-6">
            <blockquote className="font-serif italic text-xl md:text-2xl text-[#1C1917] leading-relaxed">
              “{article.pullQuote}”
            </blockquote>
            {article.pullQuoteAttribution && (
              <div className="text-xs font-serif text-[#78716C] mt-2 font-medium">
                {article.pullQuoteAttribution}
              </div>
            )}
          </div>
        )}

        {/* Footnotes */}
        {article.footnotes && article.footnotes.length > 0 && (
          <div className="mt-12 pt-6 border-t border-[#E8E2D8] text-xs font-serif text-[#78716C] space-y-2">
            <div className="font-semibold text-[#57534E]">তথ্যসূত্র ও সংবিধিবদ্ধ টীকা:</div>
            {article.footnotes.map((fn, i) => (
              <div key={i}>{fn}</div>
            ))}
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-[#E8E2D8]">
          <button
            onClick={onPrevArticle}
            disabled={!hasPrev}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium border border-[#D6CEBE] rounded-lg hover:bg-white text-[#1C1917] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>পূর্ববর্তী লেখা</span>
          </button>

          <span className="text-xs text-[#78716C] font-mono">
            পৃষ্ঠা {article.bookPageNumber}
          </span>

          <button
            onClick={onNextArticle}
            disabled={!hasNext}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium border border-[#D6CEBE] rounded-lg hover:bg-white text-[#1C1917] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <span>পরবর্তী লেখা</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </article>
    </div>
  );
};
