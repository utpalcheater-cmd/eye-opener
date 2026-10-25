import React from 'react';
import { BookMetadata } from '../types';
import { BookOpen, Award, CheckCircle2, Feather, Sparkles } from 'lucide-react';

interface BookCoverViewProps {
  bookMeta: BookMetadata;
  onExploreContents: () => void;
  onOpenSpread: () => void;
}

export const BookCoverView: React.FC<BookCoverViewProps> = ({
  bookMeta,
  onExploreContents,
  onOpenSpread
}) => {
  const [activeTab, setActiveTab] = React.useState<'cover' | 'preliminary' | 'foreword' | 'jacket'>('cover');

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 lg:px-8">
      {/* Sub-navigation tabs for Publication Makeup components */}
      <div className="flex items-center justify-center gap-2 mb-8 bg-[#EFE9DD] p-1.5 rounded-lg max-w-xl mx-auto">
        <button
          onClick={() => setActiveTab('cover')}
          className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${activeTab === 'cover' ? 'bg-white text-[#1C1917] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1C1917]'}`}
        >
          হার্ডবাউন্ড প্রচ্ছদ
        </button>
        <button
          onClick={() => setActiveTab('jacket')}
          className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${activeTab === 'jacket' ? 'bg-white text-[#1C1917] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1C1917]'}`}
        >
          বুক জ্যাকেট ও ফ্ল্যাপ
        </button>
        <button
          onClick={() => setActiveTab('preliminary')}
          className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${activeTab === 'preliminary' ? 'bg-white text-[#1C1917] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1C1917]'}`}
        >
          স্বত্ব ও উৎসর্গ পাতা
        </button>
        <button
          onClick={() => setActiveTab('foreword')}
          className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${activeTab === 'foreword' ? 'bg-white text-[#1C1917] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1C1917]'}`}
        >
          লেখকের ভূমিকা
        </button>
      </div>

      {/* TAB 1: Hardcover Book Showcase */}
      {activeTab === 'cover' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: 3D Hardcover Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm rounded-r-lg shadow-2xl transition-transform duration-300 hover:scale-[1.02] border border-[#D6CEBE] bg-[#F7F3EA] overflow-hidden">
              <img
                src="/src/assets/images/book_cover_anthology_1792885349062.jpg"
                alt="আন্তর্জাতিক মানের হার্ডবাউন্ড গ্রন্থ প্রচ্ছদ"
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
              
              {/* Overlayed Bangla Book Title Typography */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between text-white pointer-events-none">
                <div className="text-center pt-4">
                  <div className="text-xs uppercase tracking-[0.3em] text-amber-200 font-semibold drop-shadow">
                    দৈনিক জাহান সংকলন গ্রন্থমালা
                  </div>
                </div>

                <div className="text-center my-auto px-2">
                  <div className="inline-block p-1 border-y border-amber-300/40 mb-3">
                    <span className="text-[11px] font-mono tracking-widest text-amber-200">
                      ২০২১ — ২০২৬
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-100 drop-shadow-md leading-tight mb-2">
                    {bookMeta.title}
                  </h2>
                  <p className="text-xs font-serif italic text-neutral-200 drop-shadow">
                    {bookMeta.subtitle}
                  </p>
                </div>

                <div className="text-center pb-4 border-t border-white/20 pt-3">
                  <div className="font-serif font-bold text-base text-amber-100">
                    {bookMeta.author}
                  </div>
                  <div className="text-[11px] text-neutral-300">
                    {bookMeta.authorTitle}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: International Publication Specs */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-[#9A3412] mb-1">
                আন্তর্জাতিক মানের প্রকাশনা কাঠামো · গ্রন্থ মেকআপ
              </div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#1C1917] leading-snug">
                {bookMeta.title}
              </h1>
              <p className="text-base font-serif text-[#57534E] mt-2">
                {bookMeta.subtitle}
              </p>
            </div>

            <div className="p-5 bg-[#F2ECE1] border border-[#D6CEBE] rounded-lg text-sm text-[#292524] space-y-3 leading-relaxed">
              <p className="font-serif">
                ময়মনসিংহের শতবর্ষের ঐতিহ্যবাহী প্রকাশনা ধারা ও ‘দৈনিক জাহান’-এর সুদীর্ঘ সাংবাদিকতার পথচলায় শেখ মেহেদী হাসান নাদিম-এর সমকালীন কলাম ও উপ-সম্পাদকীয় রচনাগুলো এক অনন্য সংযোজন। আইন, সংবিধান, স্থানীয় সরকার, গণমাধ্যমের স্বাধীনতা ও চতুর্থ শিল্পবিপ্লবের প্রভাব নিয়ে রচিত শতাধিক নিবন্ধ থেকে নির্বাচিত রচনাগুলো এই রাজকীয় খণ্ডে সন্নিবেশিত হয়েছে।
              </p>
            </div>

            {/* Publication Specifications Definition Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-serif">
              <div className="p-3 bg-white border border-[#E0D9CD] rounded">
                <span className="text-[#78716C] block uppercase text-[10px] tracking-wider">লেখক</span>
                <span className="font-bold text-[#1C1917] mt-1 block">{bookMeta.author}</span>
              </div>
              <div className="p-3 bg-white border border-[#E0D9CD] rounded">
                <span className="text-[#78716C] block uppercase text-[10px] tracking-wider">প্রকাশনী</span>
                <span className="font-bold text-[#1C1917] mt-1 block">{bookMeta.publisher}</span>
              </div>
              <div className="p-3 bg-white border border-[#E0D9CD] rounded">
                <span className="text-[#78716C] block uppercase text-[10px] tracking-wider">আইএসবিএন (ISBN)</span>
                <span className="font-mono font-semibold text-[#1C1917] mt-1 block">{bookMeta.isbn}</span>
              </div>
              <div className="p-3 bg-white border border-[#E0D9CD] rounded">
                <span className="text-[#78716C] block uppercase text-[10px] tracking-wider">সংস্করণ বর্ষ</span>
                <span className="font-bold text-[#1C1917] mt-1 block">{bookMeta.firstEditionYear}</span>
              </div>
              <div className="p-3 bg-white border border-[#E0D9CD] rounded">
                <span className="text-[#78716C] block uppercase text-[10px] tracking-wider">অঙ্গসজ্জা ও মুদ্রণ</span>
                <span className="font-bold text-[#1C1917] mt-1 block">{bookMeta.coverDesigner}</span>
              </div>
              <div className="p-3 bg-white border border-[#E0D9CD] rounded">
                <span className="text-[#78716C] block uppercase text-[10px] tracking-wider">মূল্যমান</span>
                <span className="font-bold text-[#9A3412] mt-1 block">{bookMeta.price}</span>
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenSpread}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#9A3412] hover:bg-[#7F2B0E] rounded-lg transition-colors shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span>বইয়ের পাতা খুলুন (দ্বিপত্র মেকআপ)</span>
              </button>

              <button
                onClick={onExploreContents}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-[#1C1917] bg-white border border-[#D6CEBE] hover:bg-[#F3EFE6] rounded-lg transition-colors"
              >
                <span>সম্পূর্ণ সূচিপত্র ও বছরভিত্তিক নির্ঘণ্ট</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Book Dust Jacket & Flaps */}
      {activeTab === 'jacket' && (
        <div className="bg-[#FAF7F0] border border-[#D6CEBE] p-6 lg:p-12 shadow-md">
          <div className="text-center max-w-2xl mx-auto mb-10 pb-6 border-b border-[#D6CEBE]">
            <span className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold">
              আন্তর্জাতিক পাবলিকেশন স্ট্যান্ডার্ড
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#1C1917] mt-1">
              কমপ্লিট ডাস্ট জ্যাকেট (Dust Jacket Flat Layout)
            </h3>
            <p className="text-xs font-serif text-[#57534E] mt-1">
              সম্মুখ ফ্ল্যাপ, মেরুদণ্ড (Spine), পেছনের কভার এবং ফ্ল্যাপ বায়োগ্রাফি সমন্বিত সম্পূর্ণ প্রেস আর্টওয়ার্ক
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch border-2 border-dashed border-[#C5BCAC] p-4 bg-[#F5EFE4]">
            {/* Front Flap (2 cols) */}
            <div className="md:col-span-3 bg-white p-5 border border-[#D6CEBE] flex flex-col justify-between text-xs font-serif text-[#57534E]">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#9A3412] font-semibold mb-2">
                  সম্মুখ ফ্ল্যাপ · পরিচিতি
                </div>
                <h4 className="font-bold text-sm text-[#1C1917] mb-2">{bookMeta.title}</h4>
                <p className="leading-relaxed text-justify mb-3">
                  সময়ের ঘূর্ণাবর্তে যখন মূল্যবোধ ও প্রাতিষ্ঠানিক ন্যায়বিচার প্রশ্নের সম্মুখীন, তখন একজন নির্ভীক লেখকের কলম হয়ে ওঠে সমাজের দর্পণ।
                </p>
                <p className="leading-relaxed text-justify">
                  দৈনিক জাহান-এর উপ-সম্পাদকীয় কলাম থেকে সংকলিত এই রচনায় প্রতিফলিত হয়েছে বাংলাদেশ রাষ্ট্রের পুনর্গঠনের গুরুত্বপূর্ণ অধ্যায়সমূহ।
                </p>
              </div>
              <div className="text-[11px] font-mono text-[#78716C] pt-4 border-t border-neutral-200">
                মূল্য: {bookMeta.price}
              </div>
            </div>

            {/* Back Cover (3 cols) */}
            <div className="md:col-span-3 bg-[#FAF7F0] p-5 border border-[#D6CEBE] flex flex-col justify-between text-xs font-serif">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold mb-2">
                  পেছনের কভার · পাঠ-মূল্যায়ন
                </div>
                <blockquote className="italic text-[#292524] border-l-2 border-[#9A3412] pl-3 py-1 mb-4 leading-relaxed">
                  “শেখ মেহেদী হাসান নাদিমের লেখা নিছক রাজনৈতিক আক্রমণ নয়; বরং সুনির্দিষ্ট তথ্য ও সাংবিধানিক যুক্তিভিত্তিক এক গভীর সামাজিক আলোড়ন।”
                </blockquote>
                <p className="text-[11px] text-[#57534E] leading-relaxed">
                  অন্তর্বর্তী সরকারের ১৩৩ অধ্যাদেশের আইনি ব্যবচ্ছেদ থেকে শুরু করে ব্রহ্মপুত্রের নদীভাঙন সংকট—প্রতিটি বিষয়ে লেখকের পর্যবেক্ষণ সমাজকে আলোড়িত করেছে।
                </p>
              </div>

              {/* Barcode & Publisher Seal */}
              <div className="pt-4 border-t border-[#D6CEBE] flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] text-[#78716C]">ISBN 978-984-96421-5-8</div>
                  <div className="font-mono text-xs font-bold tracking-widest text-[#1C1917]">||||||| | ||||| |||||||</div>
                </div>
                <div className="text-right text-[10px] font-serif text-[#78716C]">
                  দৈনিক জাহান পাবলিকেশন্স
                </div>
              </div>
            </div>

            {/* Spine (1 col) */}
            <div className="md:col-span-1 bg-[#292524] text-white p-3 flex flex-col items-center justify-between text-center border-x-2 border-[#1C1917]">
              <span className="text-[10px] uppercase tracking-widest text-amber-300 font-mono">
                ২০২৬
              </span>
              <div className="[writing-mode:vertical-rl] rotate-180 font-serif font-bold text-xs tracking-wider text-neutral-100 my-4">
                {bookMeta.title} · {bookMeta.author}
              </div>
              <span className="text-[9px] font-mono text-neutral-400">
                DJ-PRESS
              </span>
            </div>

            {/* Front Cover (3 cols) */}
            <div className="md:col-span-3 bg-[#1C1917] text-white p-5 flex flex-col justify-between text-center relative overflow-hidden">
              <div className="pt-2">
                <span className="text-[9px] uppercase tracking-[0.25em] text-amber-300">
                  DAINIK JAHAN SELECTED ESSAYS
                </span>
              </div>
              <div className="my-auto py-6">
                <h3 className="font-serif font-bold text-lg md:text-xl text-amber-100 leading-snug mb-2">
                  {bookMeta.title}
                </h3>
                <p className="text-[10px] font-serif italic text-neutral-300">
                  {bookMeta.subtitle}
                </p>
              </div>
              <div className="pb-2 border-t border-neutral-700 pt-3">
                <div className="font-serif font-bold text-xs text-amber-200">
                  {bookMeta.author}
                </div>
                <div className="text-[9px] text-neutral-400">
                  {bookMeta.publisher}
                </div>
              </div>
            </div>

            {/* Back Flap / Author Bio (2 cols) */}
            <div className="md:col-span-2 bg-white p-4 border border-[#D6CEBE] flex flex-col justify-between text-xs font-serif">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#9A3412] font-semibold mb-2">
                  লেখক পরিচিতি
                </div>
                {/* Author Desk Portrait */}
                <div className="mb-3 rounded overflow-hidden border border-neutral-200 shadow-xs">
                  <img
                    src="/src/assets/images/editorial_press_desk_1792885369301.jpg"
                    alt="শেখ মেহেদী হাসান নাদিম"
                    className="w-full h-24 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="font-bold text-[#1C1917] text-xs mb-1">
                  {bookMeta.author}
                </div>
                <p className="text-[11px] text-[#57534E] leading-relaxed text-justify">
                  দৈনিক জাহান পত্রিকার প্রকাশক ও বিশিষ্ট প্রাবন্ধিক। ময়মনসিংহের ঐতিহ্যবাহী রাজনৈতিক ও সাংবাদিক পরিবারে তাঁর জন্ম। সমসাময়িক রাজনীতি, আইন ও নাগরিক অধিকার নিয়ে তাঁর সুচিন্তিত কলাম পাঠকপ্রিয়।
                </p>
              </div>
              <div className="text-[10px] text-[#78716C] pt-2 border-t border-neutral-200">
                আলোকচিত্র: জাহান স্টুডিও
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Preliminary Pages (Imprint, Copyright, Dedication) */}
      {activeTab === 'preliminary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Imprint & Copyright Page */}
          <div className="bg-[#FAF7F0] p-8 border border-[#D6CEBE] shadow-xs text-xs font-serif text-[#292524] space-y-4">
            <div className="text-center pb-4 border-b border-[#D6CEBE]">
              <span className="text-[10px] uppercase tracking-widest text-[#78716C]">
                গ্রন্থ পরিচিতি ও স্বত্বাধিকার পৃষ্ঠা (CIP DATA)
              </span>
            </div>

            <div className="text-center py-4">
              <h4 className="font-serif font-bold text-base text-[#1C1917]">{bookMeta.title}</h4>
              <p className="text-[11px] italic text-[#57534E]">{bookMeta.subtitle}</p>
              <p className="font-bold text-[#1C1917] mt-2">{bookMeta.author}</p>
            </div>

            <div className="border-t border-b border-[#D6CEBE] py-4 space-y-2 text-[11px] text-[#57534E]">
              <div><strong>প্রথম প্রকাশ:</strong> {bookMeta.firstEditionYear}</div>
              <div><strong>প্রকাশক:</strong> {bookMeta.publisher}</div>
              <div><strong>প্রকাশনা কার্যালয়:</strong> {bookMeta.publisherAddress}</div>
              <div><strong>অঙ্গসজ্জা ও প্রচ্ছদ:</strong> {bookMeta.coverDesigner}</div>
              <div><strong>মুদ্রক:</strong> {bookMeta.printer}</div>
              <div><strong>আন্তর্জাতিক মান গ্রন্থ সংখ্যা (ISBN):</strong> {bookMeta.isbn}</div>
              <div><strong>মূল্য:</strong> {bookMeta.price}</div>
            </div>

            <p className="text-[10px] text-[#78716C] text-justify leading-relaxed">
              প্রকাশকের লিখিত অনুমতি ব্যতিরেকে এই গ্রন্থের কোনো অংশের অনুলিপি, পুনর্মুদ্রণ বা কোনো যান্ত্রিক বা ডিজিটাল মাধ্যমে সংরক্ষণ সম্পূর্ণরূপে নিষিদ্ধ ও আইনত দণ্ডনীয়।
            </p>
          </div>

          {/* Dedication Page */}
          <div className="bg-[#FAF7F0] p-8 border border-[#D6CEBE] shadow-xs flex flex-col justify-between">
            <div className="text-center text-[10px] uppercase tracking-widest text-[#78716C]">
              উৎসর্গ (DEDICATION)
            </div>

            <div className="my-auto py-12 text-center px-4">
              <Feather className="w-6 h-6 text-[#9A3412] mx-auto mb-4 opacity-75" />
              <p className="font-serif italic text-base lg:text-lg text-[#1C1917] leading-relaxed whitespace-pre-line">
                {bookMeta.dedicationText}
              </p>
            </div>

            <div className="text-center text-[11px] font-serif text-[#78716C]">
              — শেখ মেহেদী হাসান নাদিম
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Author's Foreword */}
      {activeTab === 'foreword' && (
        <div className="bg-[#FAF7F0] p-8 lg:p-14 border border-[#D6CEBE] shadow-sm max-w-3xl mx-auto">
          <div className="text-center mb-8 pb-4 border-b border-[#D6CEBE]">
            <span className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold">
              লেখকের প্রারম্ভিক কথন
            </span>
            <h3 className="text-3xl font-serif font-bold text-[#1C1917] mt-1">
              শব্দে সমকালের সাক্ষ্য
            </h3>
            <p className="text-xs font-serif text-[#78716C] mt-1">
              শেখ মেহেদী হাসান নাদিম · প্রকাশক ও কলাম লেখক, দৈনিক জাহান
            </p>
          </div>

          <div className="text-sm font-serif leading-relaxed text-[#292524] space-y-4 text-justify whitespace-pre-line">
            {bookMeta.forewordText}
          </div>

          <div className="mt-10 pt-6 border-t border-[#D6CEBE] flex items-center justify-between text-xs font-serif text-[#57534E]">
            <div>
              <strong>স্থান:</strong> জাহান ভবন, ময়মনসিংহ
            </div>
            <div>
              <strong>তারিখ:</strong> বসন্ত, ২০২৬
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
