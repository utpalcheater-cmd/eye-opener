import React from 'react';
import { Article, BookMetadata } from '../types';
import { ExternalLink, Bookmark } from 'lucide-react';

interface BroadsheetLayoutProps {
  articles: Article[];
  bookMeta: BookMetadata;
  selectedArticleId: string;
  onSelectArticle: (id: string) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

export const BroadsheetLayout: React.FC<BroadsheetLayoutProps> = ({
  articles,
  bookMeta,
  selectedArticleId,
  onSelectArticle,
  bookmarkedIds,
  onToggleBookmark
}) => {
  const currentLead = articles.find(a => a.id === selectedArticleId) || articles[0];
  const sideArticles = articles.filter(a => a.id !== currentLead.id).slice(0, 3);
  const bottomArticles = articles.filter(a => a.id !== currentLead.id && !sideArticles.includes(a)).slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 lg:px-8">
      {/* Newspaper Broadsheet Paper Sheet */}
      <div className="bg-[#FAF7F0] border-2 border-[#D6CEBE] shadow-xl p-6 lg:p-12 text-[#1C1917]">
        {/* Newspaper Top Utility Ribbon */}
        <div className="flex flex-wrap items-center justify-between text-[11px] font-serif text-[#78716C] border-b border-[#D6CEBE] pb-2 mb-3">
          <div>ময়মনসিংহ ও ঢাকা থেকে যুগপৎ প্রকাশিত ঐতিহ্যবাহী দৈনিক</div>
          <div className="font-mono tracking-wider">ONLINE ARCHIVE · DAINIKJAHAN.COM</div>
          <div>প্রতিষ্ঠাতা: মরহুম হাবিবুর রহমান শেখ · প্রকাশক: শেখ মেহেদী হাসান নাদিম</div>
        </div>

        {/* Newspaper Masthead */}
        <div className="text-center py-4 border-b-4 border-double border-[#1C1917] mb-4">
          <div className="text-xs uppercase tracking-[0.25em] text-[#9A3412] font-semibold mb-1">
            উপ-সম্পাদকীয় ও দৃষ্টিকোণ পাতা
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-editorial font-bold tracking-tight text-[#1C1917]">
            দৈনিক জাহান
          </h1>
          <div className="text-xs font-serif italic text-[#57534E] mt-1">
            মুক্তবুদ্ধি ও প্রগতিশীল সাংবাদিকতার ৪১তম বর্ষে পদার্পণ
          </div>
        </div>

        {/* Dateline & Issue Strip */}
        <div className="flex items-center justify-between text-xs font-serif border-b border-[#1C1917] py-1.5 mb-8 text-[#57534E]">
          <span>{currentLead.publishedDate}</span>
          <span className="font-semibold text-[#1C1917]">
            সম্পাদকীয় কলাম সংকলন: {bookMeta.author}
          </span>
          <span className="font-mono">{currentLead.newspaperIssue}</span>
        </div>

        {/* Broadsheet 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-[#D6CEBE]">
          {/* Main Lead Op-Ed Column (7 cols) */}
          <div className="lg:col-span-8 lg:border-r lg:border-[#D6CEBE] lg:pr-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#9A3412] mb-1">
              প্রধান উপ-সম্পাদকীয় কলাম · {currentLead.category}
            </div>

            <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#1C1917] leading-tight tracking-tight mb-3">
              {currentLead.title}
            </h2>

            {currentLead.subtitle && (
              <h3 className="text-base font-serif italic text-[#57534E] mb-4 pb-3 border-b border-[#E8E2D8]">
                {currentLead.subtitle}
              </h3>
            )}

            {/* Author Byline */}
            <div className="flex items-center justify-between py-2 border-y border-[#E8E2D8] mb-6 text-xs text-[#57534E]">
              <div>
                <span className="font-bold text-[#1C1917] text-sm">{bookMeta.author}</span>
                <span className="text-[#78716C]"> — {bookMeta.authorTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleBookmark(currentLead.id)}
                  className="flex items-center gap-1 hover:text-[#9A3412]"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(currentLead.id) ? 'fill-[#9A3412] text-[#9A3412]' : ''}`} />
                  <span>সংরক্ষণ</span>
                </button>
                {currentLead.originalUrl && (
                  <a
                    href={currentLead.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:text-[#9A3412]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>মূল লিংক</span>
                  </a>
                )}
              </div>
            </div>

            {/* Lead Deck */}
            {currentLead.leadDeck && (
              <div className="bg-[#EFE9DD] p-4 text-sm font-serif italic border-l-2 border-[#9A3412] mb-6 leading-relaxed">
                {currentLead.leadDeck}
              </div>
            )}

            {/* Article Body in 2-Column Newspaper Typeset */}
            <div className="columns-1 md:columns-2 gap-6 text-sm font-serif leading-relaxed text-justify space-y-4 text-[#292524]">
              {currentLead.paragraphs.map((p, idx) => (
                <p 
                  key={idx} 
                  className={idx === 0 ? "first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-[#9A3412]" : ""}
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Pull Quote Box */}
            {currentLead.pullQuote && (
              <div className="my-6 p-4 border-y-2 border-[#1C1917] text-center bg-white/50">
                <blockquote className="font-serif italic text-base md:text-lg text-[#1C1917]">
                  “{currentLead.pullQuote}”
                </blockquote>
                <div className="text-xs font-serif text-[#78716C] mt-1 font-semibold">
                  {currentLead.pullQuoteAttribution}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Columns (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#1C1917] border-b-2 border-[#1C1917] pb-1 mb-4 flex items-center justify-between">
                <span>একই বর্ষের অন্যান্য উপ-সম্পাদকীয়</span>
                <span className="font-mono text-[#78716C]">{currentLead.year}</span>
              </div>

              <div className="divide-y divide-[#E0D9CD] space-y-4">
                {sideArticles.map((art) => (
                  <div 
                    key={art.id}
                    onClick={() => onSelectArticle(art.id)}
                    className="pt-4 first:pt-0 cursor-pointer group"
                  >
                    <div className="text-[11px] uppercase tracking-wider text-[#9A3412] font-semibold mb-1">
                      {art.category} · {art.publishedDate}
                    </div>
                    <h4 className="font-serif font-bold text-base text-[#1C1917] group-hover:text-[#9A3412] transition-colors leading-snug">
                      {art.title}
                    </h4>
                    <p className="text-xs font-serif text-[#57534E] mt-1.5 line-clamp-3 leading-relaxed">
                      {art.excerpt}
                    </p>
                    <div className="text-[11px] text-[#78716C] font-mono mt-2">
                      পড়ুন → পৃষ্ঠা {art.bookPageNumber}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Publisher Editorial Note Box */}
            <div className="bg-[#EAE4D7] p-4 border border-[#D6CEBE]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#9A3412] mb-1">
                প্রকাশকের প্রতিধ্বনি
              </div>
              <p className="text-xs font-serif text-[#292524] leading-relaxed italic">
                “দৈনিক জাহানের প্রতিটি পাতায় আমরা সত্যকে আপসহীনভাবে তুলে ধরতে অঙ্গীকারবদ্ধ। নাগরিক সমাজের বিবেককে জাগ্রত করাই আমাদের কলমের প্রধান ব্রত।”
              </p>
              <div className="text-[11px] text-[#78716C] font-serif text-right mt-2 font-semibold">
                — শেখ মেহেদী হাসান নাদিম
              </div>
            </div>
          </div>
        </div>

        {/* Broadsheet Bottom Department / Additional Articles Ribbon */}
        <div className="mt-8 pt-6">
          <div className="text-xs font-bold uppercase tracking-widest text-[#1C1917] border-b border-[#1C1917] pb-1.5 mb-6">
            সংকলনের অন্যান্য নির্বাচিত কলাম ও অভিমতমালা
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bottomArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art.id)}
                className="cursor-pointer group p-3 bg-white/40 hover:bg-white border border-[#E0D9CD] transition-all rounded-xs"
              >
                <div className="text-[11px] text-[#9A3412] font-semibold uppercase mb-1">
                  {art.year} · {art.category}
                </div>
                <h5 className="font-serif font-bold text-sm text-[#1C1917] group-hover:text-[#9A3412] leading-snug">
                  {art.title}
                </h5>
                <p className="text-xs font-serif text-[#57534E] mt-2 line-clamp-2">
                  {art.excerpt}
                </p>
                <div className="text-[11px] font-mono text-[#78716C] mt-2">
                  পৃষ্ঠা {art.bookPageNumber} · পড়ুন
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Broadsheet Bottom Folio */}
        <div className="text-center text-xs font-serif text-[#78716C] border-t border-[#D6CEBE] mt-8 pt-4">
          দৈনিক জাহান · ময়মনসিংহ বিভাগ ও জাতীয় উপ-সম্পাদকীয় সমগ্র · গ্রন্থ স্বত্ব সংরক্ষিত
        </div>
      </div>
    </div>
  );
};
