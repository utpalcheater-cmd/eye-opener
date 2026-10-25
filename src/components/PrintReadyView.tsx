import React from 'react';
import { Article, BookMetadata } from '../types';
import { Printer, ArrowLeft, Download } from 'lucide-react';

interface PrintReadyViewProps {
  articles: Article[];
  bookMeta: BookMetadata;
  onExit: () => void;
}

export const PrintReadyView: React.FC<PrintReadyViewProps> = ({
  articles,
  bookMeta,
  onExit
}) => {
  const [selectedYear, setSelectedYear] = React.useState<number | 'all'>('all');

  const filteredArticles = selectedYear === 'all'
    ? articles
    : articles.filter(a => a.year === selectedYear);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-screen bg-[#EDE7DB] py-8 px-4">
      {/* Floating Control Bar for Print Preparation (Hidden during print) */}
      <div className="no-print max-w-4xl mx-auto mb-8 bg-white border border-[#D6CEBE] rounded-xl shadow-lg p-4 flex flex-wrap items-center justify-between gap-4 sticky top-4 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#57534E] hover:text-[#1C1917] border border-[#D6CEBE] rounded-md transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ফিরে যান</span>
          </button>
          <div>
            <div className="font-bold text-sm text-[#1C1917]">ছাপাখানা ও প্রেস লেআউট প্রিভিউ</div>
            <div className="text-[11px] text-[#78716C]">A4 সাইজ ও দ্বিপত্র আন্তর্জাতিক পেজ মেকআপ স্ট্যান্ডার্ড</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="text-xs bg-white border border-[#D6CEBE] rounded px-2.5 py-1.5"
          >
            <option value="all">সমগ্র সংকলন (সকল বছর - {articles.length}টি কলাম)</option>
            <option value={2026}>২০২৬ সালের কলাম ({articles.filter(a => a.year === 2026).length}টি)</option>
            <option value={2025}>২০২৫ সালের কলাম ({articles.filter(a => a.year === 2025).length}টি)</option>
            <option value={2024}>২০২৪ সালের কলাম ({articles.filter(a => a.year === 2024).length}টি)</option>
            <option value={2023}>২০২৩ সালের কলাম ({articles.filter(a => a.year === 2023).length}টি)</option>
            <option value={2022}>২০২২ সালের কলাম ({articles.filter(a => a.year === 2022).length}টি)</option>
            <option value={2021}>২০২১ সালের কলাম ({articles.filter(a => a.year === 2021).length}টি)</option>
          </select>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#9A3412] hover:bg-[#7F2B0E] rounded-md transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>মুদ্রণ / PDF সংরক্ষণ (Print)</span>
          </button>
        </div>
      </div>

      {/* Complete Printable Book Document */}
      <div className="max-w-[850px] mx-auto bg-white shadow-2xl p-8 md:p-16 text-[#1C1917] font-serif print-book-spread">
        {/* ================= PAGE 1: FULL TITLE PAGE ================= */}
        <section className="min-h-[900px] flex flex-col justify-between text-center py-16 border-b-2 border-neutral-300 print-avoid-break">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[#78716C] mb-8">
              দৈনিক জাহান সাহিত্য ও সমকাল প্রকাশনা
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1C1917] leading-tight mb-4">
              {bookMeta.title}
            </h1>
            <p className="text-base font-serif italic text-[#57534E] max-w-lg mx-auto">
              {bookMeta.subtitle}
            </p>
          </div>

          <div className="my-12 py-8 border-y border-neutral-200">
            <h2 className="text-2xl font-serif font-bold text-[#1C1917]">
              {bookMeta.author}
            </h2>
            <p className="text-xs text-[#78716C] mt-1">
              {bookMeta.authorTitle}
            </p>
          </div>

          <div>
            <div className="font-bold text-sm tracking-wider uppercase text-[#1C1917]">
              {bookMeta.publisher}
            </div>
            <div className="text-xs text-[#78716C] mt-1">
              {bookMeta.publisherAddress}
            </div>
            <div className="text-xs font-mono text-[#A8A29E] mt-2">
              প্রকাশকাল: {bookMeta.firstEditionYear}
            </div>
          </div>
        </section>

        {/* ================= PAGE 2: CIP COPYRIGHT PAGE ================= */}
        <section className="min-h-[850px] flex flex-col justify-between py-12 border-b-2 border-neutral-300 print-page-break text-xs text-[#57534E]">
          <div className="text-center font-mono text-[10px] tracking-widest text-[#78716C]">
            CATALOGING-IN-PUBLICATION DATA (CIP)
          </div>

          <div className="max-w-md mx-auto p-6 border border-neutral-300 space-y-2 text-[11px]">
            <div><strong>গ্রন্থের নাম:</strong> {bookMeta.title}</div>
            <div><strong>লেখক:</strong> {bookMeta.author}</div>
            <div><strong>বিষয়:</strong> সমকালীন কলাম, আইন, রাজনীতি, সমাজ ও পরিবেশ</div>
            <div><strong>প্রকাশক:</strong> {bookMeta.publisher}</div>
            <div><strong>প্রথম প্রকাশ:</strong> {bookMeta.firstEditionYear}</div>
            <div><strong>আন্তর্জাতিক মান গ্রন্থ সংখ্যা:</strong> {bookMeta.isbn}</div>
            <div><strong>মূল্য:</strong> {bookMeta.price}</div>
          </div>

          <div className="text-center text-[10px] text-[#78716C] space-y-1">
            <p>© {bookMeta.firstEditionYear} সর্বস্বত্ব প্রকাশক ও লেখক কর্তৃক সংরক্ষিত।</p>
            <p>জাহান কমার্শিয়াল প্রেস, ময়মনসিংহ থেকে মুদ্রিত ও বাঁধাইকৃত।</p>
          </div>
        </section>

        {/* ================= PAGE 3: DEDICATION & FOREWORD ================= */}
        <section className="min-h-[850px] py-12 border-b-2 border-neutral-300 print-page-break space-y-12">
          {/* Dedication */}
          <div className="text-center py-10 border-b border-neutral-200">
            <div className="text-xs uppercase tracking-widest text-[#78716C] mb-6">
              উৎসর্গ
            </div>
            <p className="italic text-lg text-[#1C1917] max-w-lg mx-auto leading-relaxed whitespace-pre-line">
              {bookMeta.dedicationText}
            </p>
          </div>

          {/* Foreword */}
          <div>
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold">
                প্রারম্ভিক কথন
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#1C1917] mt-1">
                শব্দে সমকালের সাক্ষ্য
              </h3>
            </div>
            <div className="text-xs leading-relaxed text-[#292524] space-y-3 text-justify whitespace-pre-line">
              {bookMeta.forewordText}
            </div>
            <div className="text-right text-xs font-serif text-[#78716C] mt-6 font-semibold">
              — শেখ মেহেদী হাসান নাদিম, বসন্ত ২০২৬
            </div>
          </div>
        </section>

        {/* ================= PAGE 4: TABLE OF CONTENTS ================= */}
        <section className="min-h-[850px] py-12 border-b-2 border-neutral-300 print-page-break">
          <div className="text-center mb-8 pb-3 border-b-2 border-neutral-900">
            <h2 className="text-2xl font-serif font-bold text-[#1C1917]">
              সূচিপত্র (TABLE OF CONTENTS)
            </h2>
            <p className="text-xs text-[#78716C] mt-1">
              রচনাবলীর বছরভিত্তিক ও বিষয়ভিত্তিক নির্ঘণ্ট
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {filteredArticles.map((art, idx) => (
              <div key={art.id} className="flex items-baseline justify-between border-b border-dotted border-neutral-300 pb-1">
                <div className="flex items-baseline gap-2 max-w-[80%]">
                  <span className="font-mono text-[#78716C] font-semibold">{String(idx + 1).padStart(2, '0')}.</span>
                  <span className="font-bold text-[#1C1917]">{art.title}</span>
                  <span className="text-[10px] text-[#78716C] hidden sm:inline">({art.year} · {art.category})</span>
                </div>
                <div className="font-mono font-semibold text-[#1C1917] shrink-0">
                  পৃ. {art.bookPageNumber}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= PAGES: ALL ARTICLES ================= */}
        {filteredArticles.map((article) => (
          <article key={article.id} className="py-12 border-b-2 border-neutral-300 print-page-break space-y-6">
            {/* Running Header */}
            <div className="flex items-center justify-between text-[11px] font-serif text-[#78716C] pb-2 border-b border-neutral-300 mb-6">
              <span>{bookMeta.title}</span>
              <span className="font-mono">পৃষ্ঠা {article.bookPageNumber}</span>
            </div>

            {/* Article Head */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9A3412] mb-1">
                {article.category} · {article.publishedDate}
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#1C1917] leading-snug">
                {article.title}
              </h2>
              {article.subtitle && (
                <p className="text-xs font-serif italic text-[#57534E] mt-1">
                  {article.subtitle}
                </p>
              )}
            </div>

            {/* Author Byline */}
            <div className="py-1.5 border-y border-neutral-200 text-xs flex justify-between text-[#57534E]">
              <span>লেখক: <strong>{bookMeta.author}</strong></span>
              <span>{article.newspaperIssue}</span>
            </div>

            {/* Lead Deck */}
            {article.leadDeck && (
              <div className="bg-neutral-50 p-4 border-l-2 border-[#9A3412] text-xs font-serif italic leading-relaxed">
                {article.leadDeck}
              </div>
            )}

            {/* Article Body */}
            <div className="columns-1 md:columns-2 gap-6 text-xs font-serif leading-[1.8] text-justify space-y-3 text-[#1C1917]">
              {article.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className={pIdx === 0 ? "first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-[#9A3412]" : ""}>
                  {p}
                </p>
              ))}
            </div>

            {/* Pull Quote */}
            {article.pullQuote && (
              <div className="my-6 p-4 border-y border-neutral-400 text-center">
                <blockquote className="font-serif italic text-sm text-[#1C1917]">
                  “{article.pullQuote}”
                </blockquote>
                <div className="text-[10px] text-[#78716C] mt-1">
                  {article.pullQuoteAttribution}
                </div>
              </div>
            )}

            {/* Footnotes */}
            {article.footnotes && article.footnotes.length > 0 && (
              <div className="pt-4 border-t border-neutral-200 text-[10px] text-[#78716C] space-y-1">
                <div className="font-semibold text-neutral-800">টীকা ও তথ্যসূত্র:</div>
                {article.footnotes.map((fn, fIdx) => (
                  <div key={fIdx}>{fn}</div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};
