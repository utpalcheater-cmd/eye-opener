import React from 'react';
import { Article, CategoryType } from '../types';
import { X, Plus, Sparkles, BookPlus } from 'lucide-react';

interface AddArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddArticle: (article: Article) => void;
  nextPageNumber: number;
}

export const AddArticleModal: React.FC<AddArticleModalProps> = ({
  isOpen,
  onClose,
  onAddArticle,
  nextPageNumber
}) => {
  const [title, setTitle] = React.useState('');
  const [subtitle, setSubtitle] = React.useState('');
  const [category, setCategory] = React.useState<CategoryType>('সংবিধান ও আইন');
  const [year, setYear] = React.useState<number>(2026);
  const [publishedDate, setPublishedDate] = React.useState('২৪ মার্চ, ২০২৬');
  const [newspaperIssue, setNewspaperIssue] = React.useState('বর্ষ ৩৮, সংখ্যা ৮৩');
  const [originalUrl, setOriginalUrl] = React.useState('https://www.dainikjahan.com/');
  const [leadDeck, setLeadDeck] = React.useState('');
  const [rawText, setRawText] = React.useState('');
  const [pullQuote, setPullQuote] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rawText.trim()) return;

    // Split text into paragraphs
    const paragraphs = rawText
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const newArticle: Article = {
      id: `article-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      year: Number(year),
      publishedDate: publishedDate.trim(),
      newspaperIssue: newspaperIssue.trim(),
      originalUrl: originalUrl.trim() || undefined,
      readingTimeMinutes: Math.max(3, Math.ceil(rawText.split(/\s+/).length / 150)),
      excerpt: paragraphs[0]?.slice(0, 160) + '...' || '',
      leadDeck: leadDeck.trim() || undefined,
      paragraphs,
      pullQuote: pullQuote.trim() || undefined,
      pullQuoteAttribution: '— শেখ মেহেদী হাসান নাদিম',
      bookPageNumber: nextPageNumber
    };

    onAddArticle(newArticle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF7F0] border border-[#D6CEBE] rounded-xl shadow-2xl p-6 lg:p-8 my-8 text-[#1C1917]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[#78716C] hover:text-[#1C1917] rounded-md hover:bg-neutral-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pb-3 border-b border-[#D6CEBE]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9A3412]">
            <BookPlus className="w-4 h-4" />
            <span>সংকলনে নতুন লেখা সংযোজন</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-[#1C1917] mt-1">
            দৈনিক জাহানের কলাম অন্তর্ভুক্তিকরণ
          </h3>
          <p className="text-xs font-serif text-[#78716C] mt-1">
            লেখকের নতুন কলাম পেস্ট করুন, সংকলনে স্বয়ংক্রিয়ভাবে আন্তর্জাতিক পেজ মেকআপ তৈরি হবে
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-serif">
          {/* Title */}
          <div>
            <label className="block font-semibold text-[#1C1917] mb-1">
              কলামের পূর্ণ শিরোনাম *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="যেমন: অন্তর্বর্তীকালীন সরকারের সংস্কার ও নাগরিক প্রত্যাশা"
              className="w-full px-3 py-2 bg-white border border-[#D6CEBE] rounded text-xs focus:outline-none focus:border-[#9A3412]"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block font-semibold text-[#1C1917] mb-1">
              উপ-শিরোনাম / প্রেক্ষিত
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="যেমন: সাংবিধানিক প্রতিষ্ঠানগুলোর পুনর্বিন্যাসে করণীয়"
              className="w-full px-3 py-2 bg-white border border-[#D6CEBE] rounded text-xs focus:outline-none focus:border-[#9A3412]"
            />
          </div>

          {/* Category, Year, Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#1C1917] mb-1">
                বিষয় / ক্যাটাগরি
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-2.5 py-2 bg-white border border-[#D6CEBE] rounded text-xs focus:outline-none focus:border-[#9A3412]"
              >
                <option value="সংবিধান ও আইন">সংবিধান ও আইন</option>
                <option value="রাজনীতি ও রূপান্তর">রাজনীতি ও রূপান্তর</option>
                <option value="সমাজ ও মানবাধিকার">সমাজ ও মানবাধিকার</option>
                <option value="স্থানীয় সরকার ও অর্থনীতি">স্থানীয় সরকার ও অর্থনীতি</option>
                <option value="প্রযুক্তি ও গণমাধ্যম">প্রযুক্তি ও গণমাধ্যম</option>
                <option value="নদী ও পরিবেশ">নদী ও পরিবেশ</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#1C1917] mb-1">
                প্রকাশনা বর্ষ (Year)
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#D6CEBE] rounded text-xs focus:outline-none focus:border-[#9A3412]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1C1917] mb-1">
                প্রকাশকাল ও তারিখ
              </label>
              <input
                type="text"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
                placeholder="যেমন: ১৫ মে, ২০২৬"
                className="w-full px-3 py-2 bg-white border border-[#D6CEBE] rounded text-xs focus:outline-none focus:border-[#9A3412]"
              />
            </div>
          </div>

          {/* Newspaper Issue & URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1C1917] mb-1">
                পত্রিকার সংখ্যা / ভলিউম
              </label>
              <input
                type="text"
                value={newspaperIssue}
                onChange={(e) => setNewspaperIssue(e.target.value)}
                placeholder="যেমন: বর্ষ ৩৮, সংখ্যা ১২"
                className="w-full px-3 py-2 bg-white border border-[#D6CEBE] rounded text-xs focus:outline-none focus:border-[#9A3412]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1C1917] mb-1">
                দৈনিক জাহান অনলাইন লিংক
              </label>
              <input
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://www.dainikjahan.com/opinion/..."
                className="w-full px-3 py-2 bg-white border border-[#D6CEBE] rounded text-xs focus:outline-none focus:border-[#9A3412]"
              />
            </div>
          </div>

          {/* Lead Deck */}
          <div>
            <label className="block font-semibold text-[#1C1917] mb-1">
              লিড ডেক / কলামের সারসংক্ষেপ (ইটালিক প্রিভিউ)
            </label>
            <input
              type="text"
              value={leadDeck}
              onChange={(e) => setLeadDeck(e.target.value)}
              placeholder="একটি বা দুটি বাক্যে কলামের মূল সুর..."
              className="w-full px-3 py-2 bg-white border border-[#D6CEBE] rounded text-xs focus:outline-none focus:border-[#9A3412]"
            />
          </div>

          {/* Raw Text Paragraphs */}
          <div>
            <label className="block font-semibold text-[#1C1917] mb-1">
              কলামের পূর্ণ টেক্সট (অনুচ্ছেদগুলো লাইন ব্রেক দিয়ে দিন) *
            </label>
            <textarea
              required
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="কলামের প্যারাগ্রাফগুলো এখানে পেস্ট করুন..."
              className="w-full px-3 py-2 bg-white border border-[#D6CEBE] rounded text-xs focus:outline-none focus:border-[#9A3412]"
            />
          </div>

          {/* Pull Quote */}
          <div>
            <label className="block font-semibold text-[#1C1917] mb-1">
              গুরুত্বপূর্ণ উদ্ধৃতি (Pull Quote)
            </label>
            <input
              type="text"
              value={pullQuote}
              onChange={(e) => setPullQuote(e.target.value)}
              placeholder="যেমন: গণতন্ত্রের শিকড় মাটির গভীরে না পৌঁছালে রাষ্ট্র স্বৈরাচারের দিকে ধাবিত হয়।"
              className="w-full px-3 py-2 bg-white border border-[#D6CEBE] rounded text-xs focus:outline-none focus:border-[#9A3412]"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-[#D6CEBE] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#D6CEBE] rounded text-xs font-medium text-[#57534E] hover:bg-neutral-100"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-[#9A3412] hover:bg-[#7F2B0E] text-white rounded text-xs font-bold transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>সংকলনে যুক্ত করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
