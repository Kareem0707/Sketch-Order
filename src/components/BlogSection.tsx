import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  Calendar,
  User,
  ArrowLeft,
  X,
  Share2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { BLOG_ARTICLES, type BlogArticle } from '../data/blogArticles';
import { playClick, playPaperFlip } from '../utils/soundEffects';

interface BlogSectionProps {
  onOpenOrderModal: () => void;
  onOpenStudio: () => void;
  className?: string;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  onOpenOrderModal,
  onOpenStudio,
  className = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingArticle, setReadingArticle] = useState<BlogArticle | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'الكل (6 مقالات حصرية)' },
    { id: 'ecommerce-egypt', label: '🇪🇬 التجارة الإلكترونية في مصر' },
    { id: 'payments', label: '💳 فودافون كاش وإنستاباي' },
    { id: 'growth', label: '🚀 مضاعفة المبيعات' },
    { id: 'templates', label: '🎨 قوالب وتصاميم المتاجر' },
    { id: 'shipping', label: '📦 الشحن وتقليل المرتجعات' },
  ];

  const filteredArticles = BLOG_ARTICLES.filter((article) => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.seoKeywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenArticle = (article: BlogArticle) => {
    playPaperFlip();
    setReadingArticle(article);
  };

  const handleShareArticle = (article: BlogArticle) => {
    playClick();
    const url = `${window.location.origin}/#blog-${article.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  return (
    <section id="blog-section" className={`py-14 sm:py-20 select-none ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header with SEO Anchor */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 border-[#0F0F0F] dark:border-slate-700 bg-white dark:bg-[#151D2A] text-xs font-mono font-black -rotate-1 sketch-shadow-sm">
            <BookOpen className="w-4 h-4 text-[#D9722B]" />
            <span>KNOWLEDGE HUB & SEO • مدونة التجارة الإلكترونية في مصر</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-[#0F0F0F] dark:text-white">
            مقالات وأسرار تساعدك{' '}
            <span className="text-[#D9722B] dark:text-[#E88B4D] relative inline-block">
              تتصدر مبيعات السوق
            </span>
          </h2>

          <p className="text-sm sm:text-base font-bold text-zinc-600 dark:text-zinc-300 leading-relaxed">
            دليلك العملي لإنشاء متجرك، ربط بوابات الدفع، وتقليل المرتجعات، مع نصائح مجانية يكتبها نخبة من خبراء التجارة الرقمية في مصر.
          </p>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b-2 border-[#0F0F0F]/15 dark:border-slate-700 pb-4">
          
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-heading transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#0F0F0F] text-white dark:bg-[#D9722B] dark:text-slate-950 shadow-sm -translate-y-0.5'
                    : 'bg-white dark:bg-slate-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-slate-700 hover:bg-neutral-100 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث عن موضوع أو كلمة دلالية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-3 py-2 rounded-xl border-2 border-[#0F0F0F]/20 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:border-[#D9722B]"
            />
          </div>

        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => handleOpenArticle(article)}
              className="group rounded-3xl border-3 border-[#0F0F0F] dark:border-slate-600 bg-white dark:bg-[#111827] overflow-hidden sketch-shadow hover:-translate-y-1.5 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              {/* Cover Image & Category Badge */}
              <div className="relative aspect-16/10 bg-neutral-100 dark:bg-slate-800 overflow-hidden border-b-2 border-[#0F0F0F]/20 dark:border-slate-700">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-mono font-black px-2.5 py-1 rounded-full bg-[#0F0F0F]/85 text-white dark:bg-black/85 backdrop-blur-xs border border-white/20">
                    {article.categoryLabel}
                  </span>
                </div>

                <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-[10px] font-mono font-bold text-white bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-2xs">
                  <Clock className="w-3 h-3 text-[#D9722B]" />
                  <span>{article.readTime}</span>
                </div>
              </div>

              {/* Article Summary */}
              <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                    <Calendar className="w-3 h-3" />
                    <span>{article.publishedDate}</span>
                  </div>

                  <h3 className="font-heading font-black text-base sm:text-lg text-[#0F0F0F] dark:text-white group-hover:text-[#D9722B] transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-bold line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                {/* Card Bottom Meta & Read Action */}
                <div className="pt-3 border-t border-zinc-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-bold">
                    <User className="w-3.5 h-3.5 text-[#D9722B]" />
                    <span className="truncate max-w-[120px]">{article.author}</span>
                  </div>

                  <span className="font-black text-[#D9722B] group-hover:underline flex items-center gap-1">
                    <span>قراءة المقال</span>
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state if search finds nothing */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-zinc-300 dark:border-slate-700 bg-white dark:bg-[#111827] p-8 space-y-3">
            <BookOpen className="w-10 h-10 mx-auto text-zinc-400" />
            <h4 className="font-heading font-black text-lg text-zinc-700 dark:text-zinc-200">
              لم نعثر على مقالات تطابق بحثك "{searchQuery}"
            </h4>
            <p className="text-xs text-zinc-500">
              جرب البحث بكلمات مثل "إنستاباي"، "فودافون كاش"، "شحن"، أو "ملابس".
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-[#D9722B] underline pt-1"
            >
              عرض جميع المقالات
            </button>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* FULL ARTICLE READER MODAL (SEO & Reading Experience)      */}
      {/* ======================================================== */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="relative max-w-3xl w-full bg-white dark:bg-[#0F172A] text-[#0F0F0F] dark:text-white rounded-3xl border-3 border-[#0F0F0F] dark:border-slate-600 shadow-2xl my-6 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#FAF8F5] dark:bg-[#111827] border-b-2 border-zinc-200 dark:border-slate-700 p-4 sm:p-5 flex items-center justify-between gap-4 sticky top-0 z-20">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-black px-2.5 py-0.5 rounded-full bg-[#D9722B]/20 text-[#D9722B]">
                  {readingArticle.categoryLabel}
                </span>
                <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
                  • {readingArticle.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShareArticle(readingArticle)}
                  className="p-2 rounded-xl border border-zinc-300 dark:border-slate-700 hover:bg-neutral-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="مشاركة رابط المقال"
                >
                  <Share2 className="w-4 h-4 text-[#D9722B]" />
                  <span className="hidden sm:inline">{copiedShareLink ? 'تم نسخ الرابط!' : 'مشاركة'}</span>
                </button>

                <button
                  onClick={() => setReadingArticle(null)}
                  className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-slate-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content Scroll Area */}
            <div className="p-6 sm:p-10 space-y-6 overflow-y-auto flex-1 font-body">
              
              {/* Article Title & Author */}
              <div className="space-y-3 border-b-2 border-zinc-100 dark:border-slate-800 pb-5">
                <h1 className="text-2xl sm:text-3xl font-black font-heading leading-tight text-[#0F0F0F] dark:text-white">
                  {readingArticle.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#D9722B]" />
                    <span>{readingArticle.author} ({readingArticle.authorRole})</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Calendar className="w-4 h-4" />
                    <span>{readingArticle.publishedDate}</span>
                  </div>
                </div>
              </div>

              {/* Cover Image in Article */}
              <div className="rounded-2xl overflow-hidden border-2 border-zinc-200 dark:border-slate-700 aspect-16/9 bg-neutral-100">
                <img
                  src={readingArticle.coverImage}
                  alt={readingArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Lead Paragraph */}
              <p className="text-base sm:text-lg font-bold text-zinc-800 dark:text-zinc-200 leading-relaxed bg-[#D9722B]/10 p-4 rounded-2xl border-r-4 border-[#D9722B]">
                {readingArticle.content.lead}
              </p>

              {/* Article Sections */}
              <div className="space-y-6 pt-2">
                {readingArticle.content.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-3">
                    <h2 className="text-lg sm:text-xl font-black font-heading text-[#0F0F0F] dark:text-white">
                      {sec.heading}
                    </h2>
                    
                    <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {sec.body}
                    </p>

                    {sec.quote && (
                      <blockquote className="p-4 my-3 rounded-2xl bg-neutral-100 dark:bg-slate-800/80 border-r-4 border-[#0F0F0F] dark:border-slate-500 font-bold text-sm italic text-zinc-800 dark:text-zinc-200">
                        {sec.quote}
                      </blockquote>
                    )}

                    {sec.tips && sec.tips.length > 0 && (
                      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
                        <span className="text-xs font-mono font-black text-emerald-700 dark:text-emerald-400 block">
                          نقاط عملية لتطبيقها فوراً في متجرك:
                        </span>
                        <ul className="space-y-1.5">
                          {sec.tips.map((t, tIdx) => (
                            <li key={tIdx} className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Conclusion */}
              <div className="p-5 rounded-2xl bg-[#0F0F0F] text-white dark:bg-slate-900 border-2 border-[#0F0F0F] dark:border-slate-700 space-y-2">
                <span className="text-xs font-mono font-bold text-[#D9722B]">الخلاصة والتوصية:</span>
                <p className="text-sm font-bold leading-relaxed text-zinc-200">
                  {readingArticle.content.conclusion}
                </p>
              </div>

              {/* SEO Keywords Tags Display */}
              <div className="pt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-mono font-bold text-zinc-400 ml-1">الكلمات الدلالية:</span>
                {readingArticle.seoKeywords.map((kw, kwIdx) => (
                  <span
                    key={kwIdx}
                    className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-slate-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-slate-700"
                  >
                    #{kw}
                  </span>
                ))}
              </div>

              {/* In-Article Call to Action */}
              <div className="pt-6 border-t-2 border-zinc-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-50 dark:bg-slate-800/50 p-6 rounded-2xl">
                <div>
                  <h4 className="font-heading font-black text-base text-[#0F0F0F] dark:text-white">
                    جاهز تمتلك متجرك بنفسك بدون اشتراكات شهرية؟
                  </h4>
                  <p className="text-xs font-bold text-zinc-500">
                    ابدأ تجربتك المجانية في الاستوديو أو احجز متجرك بالعقد والضمان الآن.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setReadingArticle(null);
                      onOpenStudio();
                    }}
                    className="btn-sketch text-xs py-2.5 px-4 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white"
                  >
                    <span>تجربة الاستوديو لايف</span>
                  </button>
                  <button
                    onClick={() => {
                      setReadingArticle(null);
                      onOpenOrderModal();
                    }}
                    className="btn-sketch btn-sketch-primary text-xs py-2.5 px-4"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>امتلك متجرك الآن</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
