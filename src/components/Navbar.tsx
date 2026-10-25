import React from 'react';
import { ViewLayoutMode } from '../types';
import { Printer, PlusCircle, Bookmark } from 'lucide-react';

interface NavbarProps {
  currentLayout: ViewLayoutMode;
  setLayout: (mode: ViewLayoutMode) => void;
  onOpenAddModal: () => void;
  onOpenBookmarks: () => void;
  bookmarkedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLayout,
  setLayout,
  onOpenAddModal,
  onOpenBookmarks,
  bookmarkedCount
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E8E2D8] px-6 lg:px-12 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single line, no descriptor taglines) */}
        <div 
          onClick={() => setLayout('spread')}
          className="cursor-pointer group flex items-baseline gap-2.5 whitespace-nowrap shrink-0"
        >
          <span className="font-editorial text-2xl font-bold tracking-tight text-[#1C1917] group-hover:text-[#9A3412] transition-colors">
            দৈনিক জাহান
          </span>
          <span className="text-xs uppercase tracking-widest text-[#78716C] font-serif-bn">
            · শেখ মেহেদী হাসান নাদিম সংকলন
          </span>
        </div>

        {/* Zone 2: 4-5 single-line navigation links with hover states */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57534E]">
          <button
            onClick={() => setLayout('spread')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentLayout === 'spread'
                ? 'text-[#9A3412] font-semibold border-b-2 border-[#9A3412]'
                : 'hover:text-[#1C1917]'
            }`}
          >
            দ্বিপত্র বই মেকআপ
          </button>

          <button
            onClick={() => setLayout('broadsheet')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentLayout === 'broadsheet'
                ? 'text-[#9A3412] font-semibold border-b-2 border-[#9A3412]'
                : 'hover:text-[#1C1917]'
            }`}
          >
            সংবাদপত্র ব্রডশিট
          </button>

          <button
            onClick={() => setLayout('cover')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentLayout === 'cover'
                ? 'text-[#9A3412] font-semibold border-b-2 border-[#9A3412]'
                : 'hover:text-[#1C1917]'
            }`}
          >
            প্রচ্ছদ ও জ্যাকেট
          </button>

          <button
            onClick={() => setLayout('contents')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentLayout === 'contents'
                ? 'text-[#9A3412] font-semibold border-b-2 border-[#9A3412]'
                : 'hover:text-[#1C1917]'
            }`}
          >
            সূচিপত্র ও আর্কাইভ
          </button>

          <button
            onClick={() => setLayout('reader')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentLayout === 'reader'
                ? 'text-[#9A3412] font-semibold border-b-2 border-[#9A3412]'
                : 'hover:text-[#1C1917]'
            }`}
          >
            নিবিড় পাঠ
          </button>

          <button
            onClick={() => setLayout('workspace')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentLayout === 'workspace'
                ? 'text-[#9A3412] font-semibold border-b-2 border-[#9A3412]'
                : 'hover:text-[#1C1917]'
            }`}
          >
            গুগল ক্লাউড হাব
          </button>
        </nav>

        {/* Zone 3: Primary action + secondary utility */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenBookmarks}
            title="সংরক্ষিত কলাম"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#57534E] hover:text-[#1C1917] border border-[#D6CEBE] rounded-md transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#9A3412]" />
            <span className="hidden sm:inline">বুকমার্ক</span>
            {bookmarkedCount > 0 && (
              <span className="text-[11px] font-mono font-semibold text-[#9A3412]">{bookmarkedCount}</span>
            )}
          </button>

          <button
            onClick={onOpenAddModal}
            title="নতুন লেখা যুক্ত করুন"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#57534E] hover:text-[#1C1917] border border-[#D6CEBE] rounded-md transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#57534E]" />
            <span>নতুন কলাম</span>
          </button>

          <button
            onClick={() => setLayout('print')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#1C1917] hover:bg-[#9A3412] rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>প্রিন্ট ও প্রেস লেআউট</span>
          </button>
        </div>
      </div>
    </header>
  );
};
