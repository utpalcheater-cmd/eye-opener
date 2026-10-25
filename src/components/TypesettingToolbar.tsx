import React from 'react';
import { PaperTone, FontFamilyChoice, Article } from '../types';
import { Columns2, Columns3, AlignLeft, Type, Eye } from 'lucide-react';

interface TypesettingToolbarProps {
  paperTone: PaperTone;
  setPaperTone: (tone: PaperTone) => void;
  fontFamily: FontFamilyChoice;
  setFontFamily: (font: FontFamilyChoice) => void;
  fontSize: number;
  setFontSize: (fn: (prev: number) => number) => void;
  columnCount: 1 | 2 | 3;
  setColumnCount: (cols: 1 | 2 | 3) => void;
  articles: Article[];
  currentArticleId: string;
  onSelectArticle: (id: string) => void;
}

export const TypesettingToolbar: React.FC<TypesettingToolbarProps> = ({
  paperTone,
  setPaperTone,
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  columnCount,
  setColumnCount,
  articles,
  currentArticleId,
  onSelectArticle
}) => {
  return (
    <div className="no-print bg-[#F7F4EE] border-b border-[#E5DFD4] px-4 lg:px-12 py-2.5 text-xs text-[#57534E]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Article Jump Picker */}
        <div className="flex items-center gap-2">
          <span className="text-[#78716C] uppercase tracking-wider text-[11px] whitespace-nowrap font-medium">
            নির্বাচিত লেখা:
          </span>
          <select
            value={currentArticleId}
            onChange={(e) => onSelectArticle(e.target.value)}
            className="bg-white border border-[#D6CEBE] text-[#1C1917] rounded px-2.5 py-1 text-xs max-w-xs md:max-w-md truncate focus:outline-none focus:border-[#9A3412]"
          >
            {articles.map((art, idx) => (
              <option key={art.id} value={art.id}>
                {String(idx + 1).padStart(2, '0')}. {art.title} ({art.year})
              </option>
            ))}
          </select>
        </div>

        {/* Right: Typesetting Controls */}
        <div className="flex items-center flex-wrap gap-4">
          {/* Column Layout */}
          <div className="flex items-center gap-1 bg-white border border-[#D6CEBE] rounded p-0.5">
            <button
              onClick={() => setColumnCount(1)}
              title="একক কলাম গ্রন্থশৈলী"
              className={`p-1 rounded transition-colors ${columnCount === 1 ? 'bg-[#1C1917] text-white' : 'text-[#78716C] hover:text-[#1C1917]'}`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setColumnCount(2)}
              title="দ্বি-কলাম জার্নাল লেআউট"
              className={`p-1 rounded transition-colors ${columnCount === 2 ? 'bg-[#1C1917] text-white' : 'text-[#78716C] hover:text-[#1C1917]'}`}
            >
              <Columns2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setColumnCount(3)}
              title="ত্রয়ী-কলাম ব্রডশিট লেআউট"
              className={`p-1 rounded transition-colors ${columnCount === 3 ? 'bg-[#1C1917] text-white' : 'text-[#78716C] hover:text-[#1C1917]'}`}
            >
              <Columns3 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Font Typeface */}
          <div className="flex items-center gap-1 bg-white border border-[#D6CEBE] rounded p-0.5">
            <button
              onClick={() => setFontFamily('serif')}
              className={`px-2 py-0.5 rounded text-[11px] font-serif transition-colors ${fontFamily === 'serif' ? 'bg-[#1C1917] text-white' : 'text-[#78716C] hover:text-[#1C1917]'}`}
            >
              সেরিফ
            </button>
            <button
              onClick={() => setFontFamily('tiro')}
              className={`px-2 py-0.5 rounded text-[11px] font-serif transition-colors ${fontFamily === 'tiro' ? 'bg-[#1C1917] text-white' : 'text-[#78716C] hover:text-[#1C1917]'}`}
            >
              তিরো
            </button>
            <button
              onClick={() => setFontFamily('sans')}
              className={`px-2 py-0.5 rounded text-[11px] font-sans transition-colors ${fontFamily === 'sans' ? 'bg-[#1C1917] text-white' : 'text-[#78716C] hover:text-[#1C1917]'}`}
            >
              স্যান্স
            </button>
          </div>

          {/* Font Size */}
          <div className="flex items-center gap-1.5 bg-white border border-[#D6CEBE] rounded px-2 py-0.5">
            <Type className="w-3 h-3 text-[#78716C]" />
            <button
              onClick={() => setFontSize(s => Math.max(14, s - 1))}
              className="text-[#78716C] hover:text-[#1C1917] font-bold px-1"
              title="হরফ ছোট করুন"
            >
              -
            </button>
            <span className="text-[11px] font-mono tabular-nums text-[#1C1917] min-w-[28px] text-center">
              {fontSize}px
            </span>
            <button
              onClick={() => setFontSize(s => Math.min(24, s + 1))}
              className="text-[#78716C] hover:text-[#1C1917] font-bold px-1"
              title="হরফ বড় করুন"
            >
              +
            </button>
          </div>

          {/* Paper Tone */}
          <div className="flex items-center gap-1.5">
            <Eye className="w-3 h-3 text-[#78716C]" />
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPaperTone('archival')}
                title="আর্কাইভাল ক্রিম কাগজ"
                className={`w-5 h-5 rounded-full border transition-all ${paperTone === 'archival' ? 'border-[#9A3412] scale-110 shadow-xs' : 'border-neutral-300'}`}
                style={{ backgroundColor: '#FBF9F5' }}
              />
              <button
                onClick={() => setPaperTone('newsprint')}
                title="সংবাদপত্র নিউজপ্রিন্ট"
                className={`w-5 h-5 rounded-full border transition-all ${paperTone === 'newsprint' ? 'border-[#9A3412] scale-110 shadow-xs' : 'border-neutral-300'}`}
                style={{ backgroundColor: '#F4F1EA' }}
              />
              <button
                onClick={() => setPaperTone('white')}
                title="ধবধবে শুভ্র প্রেস পেপার"
                className={`w-5 h-5 rounded-full border transition-all ${paperTone === 'white' ? 'border-[#9A3412] scale-110 shadow-xs' : 'border-neutral-300'}`}
                style={{ backgroundColor: '#FFFFFF' }}
              />
              <button
                onClick={() => setPaperTone('sepia')}
                title="ঐতিহাসিক বাদামি পাতা"
                className={`w-5 h-5 rounded-full border transition-all ${paperTone === 'sepia' ? 'border-[#9A3412] scale-110 shadow-xs' : 'border-neutral-300'}`}
                style={{ backgroundColor: '#F7EFE2' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
