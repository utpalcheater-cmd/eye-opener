import React from 'react';
import { Article, CategoryType } from '../types';
import { Search, Calendar, FolderTree, BookOpen, Clock, Bookmark, ArrowUpRight } from 'lucide-react';

interface TableOfContentsViewProps {
  articles: Article[];
  onSelectArticle: (id: string) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

export const TableOfContentsView: React.FC<TableOfContentsViewProps> = ({
  articles,
  onSelectArticle,
  bookmarkedIds,
  onToggleBookmark
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedYear, setSelectedYear] = React.useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryType | 'all'>('all');
  const [onlyBookmarks, setOnlyBookmarks] = React.useState(false);
  const [viewGrouping, setViewGrouping] = React.useState<'by-year' | 'by-category'>('by-year');

  const years = Array.from(new Set(articles.map(a => a.year))).sort((a, b) => b - a);
  const categories: CategoryType[] = [
    'সংবিধান ও আইন',
    'রাজনীতি ও রূপান্তর',
    'সমাজ ও মানবাধিকার',
    'স্থানীয় সরকার ও অর্থনীতি',
    'প্রযুক্তি ও গণমাধ্যম',
    'নদী ও পরিবেশ'
  ];

  const filteredArticles = articles.filter(art => {
    if (onlyBookmarks && !bookmarkedIds.includes(art.id)) return false;
    if (selectedYear !== 'all' && art.year !== selectedYear) return false;
    if (selectedCategory !== 'all' && art.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = art.title.toLowerCase().includes(q);
      const matchExcerpt = art.excerpt.toLowerCase().includes(q);
      const matchCategory = art.category.toLowerCase().includes(q);
      const matchYear = String(art.year).includes(q);
      return matchTitle || matchExcerpt || matchCategory || matchYear;
    }
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 lg:px-8">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-[0.25em] text-[#9A3412] font-semibold">
          গ্রন্থের সামগ্রিক নির্ঘণ্ট ও সূচিপত্র
        </span>
        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#1C1917] mt-1">
          নির্বাচিত রচনার বছরভিত্তিক তালিকা
        </h2>
        <p className="text-sm font-serif text-[#57534E] mt-2 leading-relaxed">
          দৈনিক জাহান-এ প্রকাশিত শেখ মেহেদী হাসান নাদিম-এর সমসাময়িক কলাম, সাংবিধানিক বিশ্লেষণ ও মতামত সংকলন
        </p>

        {/* Aggregate Stats */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-[#78716C] border-y border-[#E8E2D8] py-2.5">
          <div>
            মোট সংকলিত নিবন্ধ: <span className="font-mono font-bold text-[#1C1917]">{articles.length}টি</span>
          </div>
          <span aria-hidden="true">·</span>
          <div>
            সময়কাল: <span className="font-mono font-bold text-[#1C1917]">২০২১ — ২০২৬</span>
          </div>
          <span aria-hidden="true">·</span>
          <div>
            মোট পৃষ্ঠা: <span className="font-mono font-bold text-[#1C1917]">২২০+ পৃষ্ঠা</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#FAF7F0] border border-[#D6CEBE] rounded-lg p-5 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="কলামের শিরোনাম, বিষয় বা প্রাসঙ্গিক শব্দ দিয়ে খুঁজুন..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#D6CEBE] rounded-md text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#9A3412]"
            />
          </div>

          {/* Grouping switcher */}
          <div className="flex items-center gap-1 bg-[#EAE4D7] p-1 rounded-md shrink-0">
            <button
              onClick={() => setViewGrouping('by-year')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${viewGrouping === 'by-year' ? 'bg-white text-[#1C1917] shadow-xs' : 'text-[#78716C] hover:text-[#1C1917]'}`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>বছর অনুযায়ী</span>
            </button>
            <button
              onClick={() => setViewGrouping('by-category')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${viewGrouping === 'by-category' ? 'bg-white text-[#1C1917] shadow-xs' : 'text-[#78716C] hover:text-[#1C1917]'}`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>বিষয় অনুযায়ী</span>
            </button>
          </div>

          {/* Bookmarks Toggle */}
          <button
            onClick={() => setOnlyBookmarks(!onlyBookmarks)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              onlyBookmarks
                ? 'bg-[#9A3412] text-white border-[#9A3412]'
                : 'bg-white text-[#57534E] border-[#D6CEBE] hover:text-[#1C1917]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>সংরক্ষিত ({bookmarkedIds.length})</span>
          </button>
        </div>

        {/* Year Pills Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E8E2D8]">
          <span className="text-[11px] text-[#78716C] uppercase font-semibold mr-1">
            বছর নির্বাচন:
          </span>
          <button
            onClick={() => setSelectedYear('all')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${selectedYear === 'all' ? 'bg-[#1C1917] text-white' : 'bg-white text-[#57534E] border border-[#D6CEBE] hover:bg-[#F3EFE6]'}`}
          >
            সকল বছর
          </button>
          {years.map(yr => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${selectedYear === yr ? 'bg-[#1C1917] text-white' : 'bg-white text-[#57534E] border border-[#D6CEBE] hover:bg-[#F3EFE6]'}`}
            >
              {yr} ({articles.filter(a => a.year === yr).length})
            </button>
          ))}
        </div>
      </div>

      {/* Content Listing based on grouping */}
      {viewGrouping === 'by-year' ? (
        <div className="space-y-12">
          {years
            .filter(yr => selectedYear === 'all' || selectedYear === yr)
            .map(year => {
              const yearArticles = filteredArticles.filter(a => a.year === year);
              if (yearArticles.length === 0) return null;

              return (
                <div key={year} className="bg-[#FAF7F0] border border-[#D6CEBE] rounded-lg p-6 lg:p-8">
                  <div className="flex items-center justify-between border-b-2 border-[#1C1917] pb-3 mb-6">
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-3xl font-editorial font-bold text-[#1C1917]">
                        {year}
                      </h3>
                      <span className="text-xs font-serif text-[#78716C]">
                        বর্ষীয় সংকলন · {yearArticles.length}টি নিবন্ধ
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#9A3412] font-semibold">
                      পৃষ্ঠা {yearArticles[0]?.bookPageNumber} – {yearArticles[yearArticles.length - 1]?.bookPageNumber + 10}
                    </span>
                  </div>

                  <div className="divide-y divide-[#E0D9CD]">
                    {yearArticles.map(art => (
                      <div
                        key={art.id}
                        className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-[11px] text-[#78716C] mb-1">
                            <span className="font-semibold text-[#9A3412] uppercase tracking-wide">
                              {art.category}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{art.publishedDate}</span>
                            <span aria-hidden="true">·</span>
                            <span>{art.newspaperIssue}</span>
                          </div>

                          <h4 
                            onClick={() => onSelectArticle(art.id)}
                            className="font-serif font-bold text-lg text-[#1C1917] group-hover:text-[#9A3412] transition-colors cursor-pointer leading-snug"
                          >
                            {art.title}
                          </h4>

                          {art.subtitle && (
                            <p className="text-xs font-serif italic text-[#57534E] mt-1">
                              {art.subtitle}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right text-xs font-mono text-[#78716C] hidden sm:block">
                            <div>পৃষ্ঠা {art.bookPageNumber}</div>
                            <div className="text-[10px]">{art.readingTimeMinutes} মি. পাঠ</div>
                          </div>

                          <button
                            onClick={() => onToggleBookmark(art.id)}
                            className="p-1.5 text-[#78716C] hover:text-[#9A3412] border border-[#D6CEBE] rounded bg-white hover:bg-[#F3EFE6] transition-colors"
                            title="বুকমার্ক"
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(art.id) ? 'fill-[#9A3412] text-[#9A3412]' : ''}`} />
                          </button>

                          <button
                            onClick={() => onSelectArticle(art.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1C1917] hover:bg-[#9A3412] rounded transition-colors"
                          >
                            <span>পড়ুন</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map(cat => {
            const catArticles = filteredArticles.filter(a => a.category === cat);
            if (catArticles.length === 0) return null;

            return (
              <div key={cat} className="bg-[#FAF7F0] border border-[#D6CEBE] rounded-lg p-6 lg:p-8">
                <div className="flex items-center justify-between border-b-2 border-[#1C1917] pb-3 mb-6">
                  <h3 className="text-2xl font-serif font-bold text-[#1C1917]">
                    {cat}
                  </h3>
                  <span className="text-xs font-mono text-[#9A3412] font-semibold">
                    {catArticles.length}টি কলাম
                  </span>
                </div>

                <div className="divide-y divide-[#E0D9CD]">
                  {catArticles.map(art => (
                    <div
                      key={art.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-[11px] text-[#78716C] mb-1">
                          <span className="font-mono font-bold text-[#1C1917]">{art.year}</span>
                          <span aria-hidden="true">·</span>
                          <span>{art.publishedDate}</span>
                        </div>
                        <h4
                          onClick={() => onSelectArticle(art.id)}
                          className="font-serif font-bold text-lg text-[#1C1917] group-hover:text-[#9A3412] transition-colors cursor-pointer leading-snug"
                        >
                          {art.title}
                        </h4>
                        <p className="text-xs font-serif text-[#57534E] mt-1 line-clamp-2">
                          {art.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => onSelectArticle(art.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1C1917] hover:bg-[#9A3412] rounded transition-colors"
                        >
                          <span>পৃষ্ঠা {art.bookPageNumber}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredArticles.length === 0 && (
        <div className="text-center py-16 bg-[#FAF7F0] border border-[#D6CEBE] rounded-lg">
          <BookOpen className="w-10 h-10 text-[#A8A29E] mx-auto mb-3" />
          <h4 className="font-serif text-lg text-[#1C1917]">কোনো রচনা পাওয়া যায়নি</h4>
          <p className="text-xs text-[#78716C] mt-1">অনুসন্ধান শব্দ পরিবর্তন করে পুনরায় চেষ্টা করুন</p>
        </div>
      )}
    </div>
  );
};
