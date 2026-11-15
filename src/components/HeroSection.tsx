import React, { useState } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Hammer,
  Grid,
  Search,
  Star,
  ArrowLeft,
  BookOpen,
  MessageSquare,
  Globe,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  User,
  Home,
  Film,
} from 'lucide-react';
import { StickmanDoodle } from './common/StickmanDoodle';
import { ComicSpeechBubble } from './common/ComicSpeechBubble';
import { HomeVideoSlot } from './HomeVideoSlot';
import { STUDIO_TEMPLATES } from './FullPageStoreStudio';
import { playPaperFlip, playPencilScratch, playClick, playCashSound } from '../utils/soundEffects';

interface HeroSectionProps {
  onOpenOrderModal: () => void;
  onExplorePlayground: () => void;
  onOpenStudio: () => void;
  onOpenTemplates: () => void;
  onOpenMerchantPortal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenOrderModal,
  onExplorePlayground: _onExplorePlayground,
  onOpenStudio,
  onOpenTemplates,
  onOpenMerchantPortal,
}) => {
  // Navigation / View Tabs inside the Wireframe
  const [activeWireframeTab, setActiveWireframeTab] = useState<'archive' | 'comparison' | 'blog' | 'forum'>('archive');
  const [viewState, setViewState] = useState<'mess' | 'solution'>('solution');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const triggerTransition = (targetState: 'mess' | 'solution') => {
    playPencilScratch();

    setTimeout(() => {
      setViewState(targetState);
      playPaperFlip();
      if (targetState === 'solution') {
        playCashSound();
      }
    }, 300);
  };

  // Filter templates for the Media Archive grid
  const filteredTemplates = STUDIO_TEMPLATES.filter((tmpl) => {
    const matchesSearch =
      searchQuery === '' ||
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.categoryBadge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Display 6 templates in the media archive grid
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredTemplates.length / itemsPerPage));
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section id="story-chaos" className="relative pt-6 sm:pt-10 pb-16 sm:pb-24 overflow-hidden paper-pattern">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8">

        {/* ======================================================== */}
        {/* 1. TOP VALUES & CORE GUARANTEES PILL                    */}
        {/* ======================================================== */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 py-2 border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-pill text-xs sm:text-sm font-black sketch-shadow-sm bg-white dark:bg-[#151D2A] text-[#0F0F0F] dark:text-slate-100 max-w-fit mx-auto -rotate-1">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#D9722B]" />
            <span>الدفع مرة واحدة فقط (بدون اشتراكات شهرية)</span>
          </span>
          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D9722B]" />
            <span>الضمان مدى الحياة لمتجرك المستقل</span>
          </span>
          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 text-[#D9722B] dark:text-[#E88B4D]">
            <Zap className="w-4 h-4" />
            <span>تسليم فوري بدومينك الخاص</span>
          </span>
        </div>

        {/* ======================================================== */}
        {/* 2. THE MASTER BROWSER WINDOW WIREFRAME FRAMEWORK        */}
        {/* Matches Image 2 (Apirak.com wireframe) + Image 1 Bento  */}
        {/* ======================================================== */}
        <div className="relative rounded-3xl md:rounded-[36px] border-3 md:border-4 border-[#0F0F0F] dark:border-slate-600 bg-white dark:bg-[#0F172A] sketch-shadow-xl overflow-hidden transition-all">
          
          {/* ------------------------------------------------------ */}
          {/* A. BROWSER CHROME TITLE & ADDRESS BAR                  */}
          {/* ------------------------------------------------------ */}
          <div className="bg-[#FAF8F5] dark:bg-[#111827] border-b-2 sm:border-b-3 border-[#0F0F0F] dark:border-slate-700 px-3 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3">
            {/* Window Controls (3 dots) */}
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-red-400 border border-[#0F0F0F]/30 dark:border-red-600 inline-block"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-[#0F0F0F]/30 dark:border-amber-600 inline-block"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 border border-[#0F0F0F]/30 dark:border-emerald-600 inline-block"></span>
              <span className="font-mono text-xs font-bold text-zinc-500 dark:text-zinc-400 mr-2 hidden sm:inline">
                Apirak / SketchOrder Browser v2.6
              </span>
            </div>

            {/* Address / URL Bar */}
            <div className="flex-1 max-w-md mx-auto hidden md:flex items-center justify-center">
              <div className="w-full bg-white dark:bg-slate-900 border-2 border-[#0F0F0F]/20 dark:border-slate-700 rounded-full px-4 py-1 text-xs font-mono text-zinc-700 dark:text-zinc-300 flex items-center justify-between shadow-2xs">
                <span className="text-emerald-500 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>https://</span>
                </span>
                <span className="font-bold text-[#0F0F0F] dark:text-white">sketchorder.store/home</span>
                <span className="text-[10px] text-zinc-400">⚡ 100% Secure</span>
              </div>
            </div>

            {/* Top Right Quick Breadcrumbs (Home | Login | Register | Contact) */}
            <div className="flex items-center gap-3 text-xs font-bold text-zinc-600 dark:text-zinc-300 font-mono">
              <a
                href="#media-archive"
                onClick={(e) => {
                  e.preventDefault();
                  playClick();
                  setActiveWireframeTab('archive');
                }}
                className="hover:text-[#D9722B] transition-colors"
              >
                المعرض
              </a>
              <span className="text-zinc-400">|</span>
              <button
                onClick={() => {
                  playClick();
                  onOpenTemplates();
                }}
                className="hover:text-[#D9722B] transition-colors"
              >
                القوالب
              </button>
              <span className="text-zinc-400">|</span>
              {onOpenMerchantPortal && (
                <button
                  onClick={() => {
                    playClick();
                    onOpenMerchantPortal();
                  }}
                  className="hover:text-[#D9722B] transition-colors"
                >
                  لوحة التاجر
                </button>
              )}
              <span className="text-zinc-400 hidden sm:inline">|</span>
              <button
                onClick={() => {
                  playClick();
                  onOpenOrderModal();
                }}
                className="text-[#D9722B] dark:text-[#E88B4D] hover:underline hidden sm:inline"
              >
                تواصل معنا
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-8 space-y-8">
            
            {/* ---------------------------------------------------- */}
            {/* B. HERO BANNER: "MY WEBSITE" / سكتش أوردر             */}
            {/* With Diagonal Striped Hatching + Comic Bubble & CTA  */}
            {/* ---------------------------------------------------- */}
            <div className="relative rounded-2xl md:rounded-3xl border-3 border-[#0F0F0F] dark:border-slate-700 bg-white dark:bg-[#111827] sketch-stripes p-5 sm:p-8 overflow-hidden sketch-shadow">
              {/* Subtle background color overlay so text remains razor sharp */}
              <div className="absolute inset-0 bg-white/85 dark:bg-[#111827]/90 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Left Mascot Silhouette Doodle */}
                <div className="hidden lg:flex flex-col items-center justify-center shrink-0">
                  <StickmanDoodle size={110} />
                  <span className="text-[10px] font-mono font-bold bg-white dark:bg-slate-900 border border-[#0F0F0F] dark:border-slate-700 px-2 py-0.5 rounded-md mt-1">
                    تميمة سكتش مان
                  </span>
                </div>

                {/* Center Speech Bubble Headline ("My Website") */}
                <div className="text-center md:text-right flex-1 space-y-3">
                  <div className="inline-block">
                    <ComicSpeechBubble className="-rotate-1" variant="normal">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#D9722B] animate-pulse"></span>
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-[#0F0F0F] dark:text-white">
                          سكتش أوردر • <span className="text-[#D9722B] dark:text-[#E88B4D]">متجرك مرسوم بقلمك</span>
                        </h1>
                      </div>
                    </ComicSpeechBubble>
                  </div>

                  <p className="text-xs sm:text-base font-bold text-zinc-700 dark:text-zinc-200 max-w-2xl leading-relaxed">
                    تقسيمة عصرية بتجمع بين روح الرسم اليدوي وفيديو تفاعلي حي. ودّع زحمة رسائل الواتس واستلم متجرك المستقل بالدومين الخاص في خلال دقائق!
                  </p>
                </div>

                {/* Right Action Button ("Buy content" / امتلك متجرك الآن) */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 items-center justify-center">
                  <button
                    onClick={() => {
                      playClick();
                      onOpenOrderModal();
                    }}
                    className="btn-sketch btn-sketch-primary text-sm sm:text-base py-3.5 px-6 -rotate-1 shadow-md hover:scale-105 transition-transform"
                  >
                    <ShoppingBag className="w-5 h-5 text-white dark:text-slate-950" />
                    <span>امتلك متجرك الآن (Buy Store)</span>
                  </button>

                  <button
                    onClick={() => {
                      playClick();
                      onOpenStudio();
                    }}
                    className="btn-sketch text-xs sm:text-sm py-2 px-4 rotate-1 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white border-2 border-[#0F0F0F] dark:border-slate-600"
                  >
                    <Hammer className="w-4 h-4 text-[#D9722B]" />
                    <span>تجربة الاستوديو لايف</span>
                  </button>
                </div>

              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* C. WIREFRAME TABS BAR (Home | Archive | Blog | Forum) */}
            {/* Matching folder tabs shown at the bottom of Image 2   */}
            {/* ---------------------------------------------------- */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#0F0F0F]/15 dark:border-slate-700 pb-2">
              
              {/* Folder Tabs Navigation */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {[
                  { id: 'archive', label: 'المعرض والفيديو الرئيسي (Media Archive)', icon: Film },
                  { id: 'comparison', label: 'المقارنة: فوضى الشات vs حل سكتش', icon: RefreshCw },
                  { id: 'blog', label: 'المدونة وقصص النجاح (Blog)', icon: BookOpen },
                  { id: 'forum', label: 'ساحة التجار والتحديثات (Forum)', icon: MessageSquare },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeWireframeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        playClick();
                        setActiveWireframeTab(tab.id as any);
                      }}
                      className={`px-3.5 py-2 rounded-t-xl font-heading text-xs sm:text-sm font-black transition-all flex items-center gap-2 border-2 border-b-0 ${
                        isActive
                          ? 'bg-[#0F0F0F] text-white dark:bg-[#D9722B] dark:text-slate-950 border-[#0F0F0F] dark:border-[#D9722B] -translate-y-1 shadow-sm'
                          : 'bg-neutral-100 dark:bg-slate-800 text-zinc-600 dark:text-zinc-300 border-transparent hover:bg-neutral-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Search Input */}
              <div className="relative min-w-[220px] max-w-xs">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="ابحث في القوالب والمعرض..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pr-9 pl-3 py-1.5 rounded-full border-2 border-[#0F0F0F]/20 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:border-[#D9722B]"
                />
              </div>

            </div>

            {/* ---------------------------------------------------- */}
            {/* D. TOP THREE-COLUMN ROW: BLOG | FORUM | ADS/GUARANTEE */}
            {/* Exact recreation of the 3 columns in Image 2         */}
            {/* ---------------------------------------------------- */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* 1. Blog Column (المدونة) */}
              <div className="md:col-span-4 rounded-2xl border-2 border-[#0F0F0F] dark:border-slate-700 bg-white dark:bg-[#111827] p-4 sketch-border-1 sketch-shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-slate-700 pb-2">
                    <span className="font-heading font-black text-sm text-[#0F0F0F] dark:text-white flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#D9722B]" />
                      <span>المدونة • Blog</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#D9722B] bg-[#D9722B]/10 px-2 py-0.5 rounded-full">
                      وثائقي جديد
                    </span>
                  </div>

                  <h3 className="text-sm font-black font-heading text-zinc-900 dark:text-zinc-100 hover:text-[#D9722B] cursor-pointer transition-colors">
                    "RDX كواليس صناعة المتاجر": إزاي براند مصري حقق 24,000 طلب تلقائي؟
                  </h3>

                  {/* 3 Preview Thumbnail Boxes (From Image 2 Wireframe) */}
                  <div className="grid grid-cols-3 gap-2 py-1">
                    <div className="aspect-square rounded-lg border border-[#0F0F0F]/20 dark:border-slate-700 bg-neutral-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center p-1 text-center">
                      <img
                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80"
                        alt="سبورتك"
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="aspect-square rounded-lg border border-[#0F0F0F]/20 dark:border-slate-700 bg-neutral-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center p-1 text-center">
                      <img
                        src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80"
                        alt="بن الصعيدي"
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="aspect-square rounded-lg border border-[#0F0F0F]/20 dark:border-slate-700 bg-neutral-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center p-1 text-center">
                      <img
                        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80"
                        alt="برجر كلوب"
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-bold">
                    لقاءات وتجارب حية مع رواد التجارة في مصر اللي غيروا طريقة استلام الأوردرات لأسلوب مريح بدون وجع دماغ.
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      playClick();
                      const el = document.getElementById('blog-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-[#D9722B] hover:underline flex items-center gap-1"
                  >
                    <span>اقرأ المقالات وقصص النجاح في المدونة</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 2. Forum Column (ساحة التجار والنقاش) */}
              <div className="md:col-span-5 rounded-2xl border-2 border-[#0F0F0F] dark:border-slate-700 bg-white dark:bg-[#111827] p-4 sketch-border-2 sketch-shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-slate-700 pb-2">
                    <span className="font-heading font-black text-sm text-[#0F0F0F] dark:text-white flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-[#D9722B]" />
                      <span>ساحة التجار • Forum & Updates</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>نشط الآن</span>
                    </span>
                  </div>

                  {/* Bulleted List (Exact match to Image 2 wireframe Forum) */}
                  <ul className="space-y-2 text-xs font-bold text-zinc-700 dark:text-zinc-200">
                    <li className="flex items-start gap-2 hover:bg-neutral-50 dark:hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors cursor-pointer">
                      <span className="text-[#D9722B] shrink-0">•</span>
                      <span><strong>إطلاق قالب نايكي (Cloud Runner 2):</strong> مخصص لصفحات الهبوط المباشرة بمعدل تحويل عالي.</span>
                    </li>
                    <li className="flex items-start gap-2 hover:bg-neutral-50 dark:hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors cursor-pointer">
                      <span className="text-[#D9722B] shrink-0">•</span>
                      <span><strong>ربط فودافون كاش وإنستاباي:</strong> رفع سكرينات التحويل وتأكيد فوري بالواتس.</span>
                    </li>
                    <li className="flex items-start gap-2 hover:bg-neutral-50 dark:hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors cursor-pointer">
                      <span className="text-[#D9722B] shrink-0">•</span>
                      <span><strong>حساب صافي الأرباح:</strong> لوحة تحكم التاجر بتعرضلك ربحك الفعلي بعد خصم تكلفة المنتج.</span>
                    </li>
                    <li className="flex items-start gap-2 hover:bg-neutral-50 dark:hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors cursor-pointer">
                      <span className="text-[#D9722B] shrink-0">•</span>
                      <span><strong>دعم الشحن لجميع المحافظات:</strong> أسعار شحن مخصصة للقاهرة وإسكندرية والصعيد تلقائياً.</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-mono text-[11px]">+140 تاجر متصل</span>
                  <button
                    onClick={() => {
                      playClick();
                      onOpenStudio();
                    }}
                    className="text-[#D9722B] hover:underline font-bold flex items-center gap-1"
                  >
                    <span>جرّب لوحة التاجر لايف</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 3. Sidebar Column: Ads by Google / Guarantee Banner */}
              <div className="md:col-span-3 space-y-3">
                {/* Main Ad Box */}
                <div className="rounded-2xl border-2 border-[#0F0F0F] dark:border-slate-700 bg-neutral-50 dark:bg-slate-900 sketch-stripes p-4 text-center sketch-shadow-sm space-y-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 pointer-events-none"></div>
                  
                  <div className="relative z-10 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 bg-white dark:bg-slate-800 border border-zinc-300 dark:border-slate-700 px-2 py-0.5 rounded-full inline-block">
                      Ads by Sketch • عرض حصري
                    </span>
                    
                    <h4 className="font-heading font-black text-base text-[#D9722B] dark:text-[#E88B4D]">
                      باقة التاجر الذهبي
                    </h4>

                    <div className="text-2xl font-black font-mono text-[#0F0F0F] dark:text-white">
                      0% عمولة
                    </div>

                    <p className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300 leading-snug">
                      متجرك بدومين خاص، دفع مرة واحدة فقط مدى الحياة بدون مصاريف سنوية مستترة!
                    </p>

                    <button
                      onClick={() => {
                        playClick();
                        onOpenOrderModal();
                      }}
                      className="w-full btn-sketch btn-sketch-primary text-xs py-2 px-3 shadow-xs"
                    >
                      <span>احجز باقتك الآن</span>
                    </button>
                  </div>
                </div>

                {/* Secondary Mini Note Widget */}
                <div className="rounded-xl border border-dashed border-[#0F0F0F]/30 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900 text-center text-xs font-bold text-zinc-600 dark:text-zinc-300">
                  ⚡ التسليم في خلال 24 ساعة فقط جاهز للبيع مباشرة
                </div>
              </div>

            </div>

            {/* ---------------------------------------------------- */}
            {/* E. CORE SECTION: MEDIA ARCHIVE & DEDICATED VIDEO     */}
            {/* The centerpiece wireframe layout from Image 2        */}
            {/* ---------------------------------------------------- */}
            <div id="media-archive" className="space-y-6 pt-4 border-t-2 border-[#0F0F0F]/15 dark:border-slate-700">
              
              {/* Media Archive Header */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#0F0F0F] text-white dark:bg-[#D9722B] dark:text-slate-950 font-heading font-black text-xs">
                      المعرض الرئيسي
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black font-heading text-[#0F0F0F] dark:text-white">
                      معرض القوالب والوسائط • Media Archive
                    </h2>
                  </div>
                  <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                    تصفح قوالب المتاجر على اليمين، وشاهد الفيديو المخصص للشاشة الرئيسية على اليسار.
                  </p>
                </div>

                {/* View Switchers */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playClick();
                      onOpenTemplates();
                    }}
                    className="btn-sketch text-xs py-1.5 px-3 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white"
                  >
                    <Grid className="w-3.5 h-3.5 text-[#D9722B]" />
                    <span>تصفح كل القوالب الـ 9</span>
                  </button>
                </div>
              </div>

              {/* DUAL CONTAINER: Left Media Grid + Right Dedicated Video Player */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT / THUMBNAILS GRID (Media Archive Grid with Star Ratings!) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3.5">
                    {paginatedTemplates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => {
                          playClick();
                          onOpenStudio();
                        }}
                        className="group relative rounded-2xl border-2 border-[#0F0F0F] dark:border-slate-700 bg-white dark:bg-[#151D2A] p-2.5 sketch-border-1 sketch-shadow-sm hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                      >
                        {/* Image Preview with Arrow Action Badge (as seen in Image 1) */}
                        <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-neutral-100 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 mb-2">
                          <img
                            src={template.previewImage}
                            alt={template.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          
                          {/* Corner Arrow Badge (like Image 1 preview badges) */}
                          <div className="absolute bottom-1.5 left-1.5 w-6 h-6 rounded-lg bg-white/90 dark:bg-slate-900/90 text-[#0F0F0F] dark:text-white flex items-center justify-center shadow-xs group-hover:bg-[#D9722B] group-hover:text-white transition-colors">
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* Template Details */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-black font-heading text-zinc-900 dark:text-white truncate">
                            {template.name}
                          </h4>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono block truncate">
                            {template.categoryBadge}
                          </span>

                          {/* 5-STAR RATING (Exact match to Image 2 wireframe stars: ⭐⭐⭐⭐⭐) */}
                          <div className="flex items-center gap-0.5 pt-0.5 text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                            <span className="text-[10px] font-mono font-bold text-zinc-400 mr-1">5.0</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Micro Hint */}
                  <div className="text-center">
                    <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                      اضغط على أي قالب لتجربته وتعديله مباشرة في الاستوديو لايف ✓
                    </span>
                  </div>
                </div>

                {/* RIGHT / DEDICATED BIG VIDEO PLAYER (المكان المخصص للفيديو الرئيسي) */}
                <div className="lg:col-span-7 space-y-2">
                  <HomeVideoSlot onOpenStudio={onOpenStudio} />
                </div>

              </div>

              {/* ---------------------------------------------------- */}
              {/* F. PAGINATION BAR: Pages 1 2 3 4 5 6 7 ... 120 121 122 */}
              {/* Exact match to pagination row at bottom of Image 2    */}
              {/* ---------------------------------------------------- */}
              <div className="pt-4 border-t-2 border-[#0F0F0F]/15 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
                  <span className="font-heading ml-1">الصفحات • Pages:</span>
                  
                  {[1, 2, 3, 4, 5, 6, 7].map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => {
                        playClick();
                        setCurrentPage(pageNum);
                      }}
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-black flex items-center justify-center border transition-all ${
                        currentPage === pageNum
                          ? 'bg-[#0F0F0F] text-white dark:bg-[#D9722B] dark:text-slate-950 border-[#0F0F0F] dark:border-[#D9722B] shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-slate-700 hover:bg-neutral-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <span className="px-1 text-zinc-400 font-bold">...</span>

                  {[120, 121, 122].map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => {
                        playClick();
                        setCurrentPage(pageNum);
                      }}
                      className={`w-8 h-7 rounded-lg text-xs font-mono font-black flex items-center justify-center border transition-all ${
                        currentPage === pageNum
                          ? 'bg-[#0F0F0F] text-white dark:bg-[#D9722B] dark:text-slate-950 border-[#0F0F0F] dark:border-[#D9722B]'
                          : 'bg-white dark:bg-slate-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-slate-700 hover:bg-neutral-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playClick();
                      setCurrentPage((prev) => Math.max(1, prev - 1));
                    }}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-zinc-300 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40"
                    title="السابق"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      playClick();
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                    }}
                    disabled={currentPage >= totalPages}
                    className="p-1.5 rounded-lg border border-zinc-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-neutral-100 dark:hover:bg-slate-800 disabled:opacity-40"
                    title="التالي"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* ---------------------------------------------------- */}
            {/* G. INTERACTIVE SCENE COMPARISON (Chaos vs Solution) */}
            {/* Embedded cleanly if user clicks Comparison tab        */}
            {/* ---------------------------------------------------- */}
            {activeWireframeTab === 'comparison' && (
              <div className="rounded-2xl border-3 border-[#0F0F0F] dark:border-slate-600 bg-neutral-50 dark:bg-slate-900 p-6 space-y-6 animate-fadeIn">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 dark:border-slate-700 pb-3">
                  <div>
                    <h3 className="text-lg font-black font-heading text-[#0F0F0F] dark:text-white">
                      مقارنة المشهد: فوضى الشات اليومية vs متجر سكتش المنظم
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      شوف الفرق الحقيقي اللي هيعيشه العميل وصاحب المتجر بنظام سكتش أوردر
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerTransition('mess')}
                      className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                        viewState === 'mess'
                          ? 'bg-red-500 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      مشهد 1: فوضى الشات
                    </button>
                    <button
                      onClick={() => triggerTransition('solution')}
                      className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                        viewState === 'solution'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      مشهد 2: حل سكتش السريع
                    </button>
                  </div>
                </div>

                {viewState === 'mess' ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center animate-fadeIn">
                    <div className="space-y-3">
                      <ComicSpeechBubble className="-rotate-2">
                        <div className="text-xs font-mono font-bold text-zinc-400">عميل مستعجل:</div>
                        <div>"يا كابتن الكوتشي دا متاح مقاس 43؟ وبكام الشحن للمهندسين؟"</div>
                      </ComicSpeechBubble>
                      <ComicSpeechBubble className="rotate-2" variant="scream">
                        <div className="text-xs font-mono font-bold text-red-500">زبونة قلقانة:</div>
                        <div>"حولت 650 فودافون كاش ومحدش رد عليا لحد دلوقتي!"</div>
                      </ComicSpeechBubble>
                    </div>

                    <div className="text-center py-4">
                      <StickmanDoodle size={130} />
                      <div className="text-xs font-bold text-red-500 mt-2">
                        صاحب المتجر غرقان في وسط الرسايل!
                      </div>
                    </div>

                    <div className="space-y-3">
                      <ComicSpeechBubble className="rotate-2">
                        <div className="text-xs font-mono font-bold text-zinc-400">مندوب الشحن:</div>
                        <div>"اللوكيشن مش واضح ورقم العميل مقفول.. هرجع الشحنة!"</div>
                      </ComicSpeechBubble>
                      <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-bold text-center">
                        النتيجة: 68% أوردرات ملغية وصداع يومي مستمر
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center animate-fadeIn">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#0F0F0F] dark:border-slate-700 space-y-2">
                      <div className="text-xs font-mono font-bold text-[#D9722B]">kicks-eg.store</div>
                      <div className="text-xs font-bold">✓ العميل اختار مقاس 43 واشترى في 15 ثانية</div>
                      <div className="text-xs font-bold text-emerald-600">✓ التحويل اتأكد باللوكيشن تلقائياً على الواتساب</div>
                    </div>

                    <div className="text-center py-4">
                      <StickmanDoodle size={130} />
                      <div className="text-xs font-bold text-emerald-600 mt-2">
                        "الزبون يطلب وأنت مرتاح وبتشرب قهوتك!"
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#0F0F0F] dark:border-slate-700 text-center space-y-2">
                      <div className="text-2xl font-black font-heading text-[#D9722B]">+320% مبيعات</div>
                      <div className="text-xs font-bold text-zinc-500">
                        زيادة في إتمام الطلبات بدون أسئلة متكررة ولا تأخير
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. SOCIAL PROOF & METRICS ROW                           */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
          <div className="p-3 sm:p-4 border-2 border-[#0F0F0F]/15 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#151D2A] sketch-shadow-sm">
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#D9722B] dark:text-[#E88B4D]">+24,500</div>
            <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">أوردر تم تنفيذه تلقائياً</div>
          </div>
          <div className="p-3 sm:p-4 border-2 border-[#0F0F0F]/15 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#151D2A] sketch-shadow-sm">
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#D9722B] dark:text-[#E88B4D]">0%</div>
            <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">عمولات على أرباح مبيعاتك</div>
          </div>
          <div className="p-3 sm:p-4 border-2 border-[#0F0F0F]/15 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#151D2A] sketch-shadow-sm">
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#D9722B] dark:text-[#E88B4D]">100%</div>
            <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">ملكية كاملة برابط ودومين خاص</div>
          </div>
          <div className="p-3 sm:p-4 border-2 border-[#0F0F0F]/15 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#151D2A] sketch-shadow-sm">
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#D9722B] dark:text-[#E88B4D]">24 ساعة</div>
            <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">تسليم المتجر وبدء البيع فوراً</div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 4. FLOATING BENTO DOCK (Matches Bottom Dock in Image 1)  */}
      {/* [🏠 الرئيسية] [⊞ القوالب] [⚙️ الاستوديو] [👤 لوحة التاجر] [🛍️ الطلب] */}
      {/* ======================================================== */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-3 py-2 rounded-2xl bg-[#0F0F0F]/90 dark:bg-[#111827]/95 backdrop-blur-md border-2 border-white/20 dark:border-slate-700 shadow-2xl flex items-center gap-1.5 sm:gap-2 text-white">
        <button
          onClick={() => {
            playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl hover:bg-white/10 flex items-center gap-1.5 text-xs font-bold transition-colors"
          title="الرئيسية"
        >
          <Home className="w-4 h-4 text-[#D9722B]" />
          <span className="hidden sm:inline">الرئيسية</span>
        </button>

        <button
          onClick={() => {
            playClick();
            onOpenTemplates();
          }}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl hover:bg-white/10 flex items-center gap-1.5 text-xs font-bold transition-colors"
          title="قوالب المتاجر"
        >
          <Grid className="w-4 h-4 text-zinc-300" />
          <span className="hidden sm:inline">القوالب</span>
        </button>

        <button
          onClick={() => {
            playClick();
            onOpenStudio();
          }}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl hover:bg-white/10 flex items-center gap-1.5 text-xs font-bold transition-colors"
          title="استوديو التخصيص لايف"
        >
          <Hammer className="w-4 h-4 text-zinc-300" />
          <span className="hidden sm:inline">الاستوديو</span>
        </button>

        {onOpenMerchantPortal && (
          <button
            onClick={() => {
              playClick();
              onOpenMerchantPortal();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl hover:bg-white/10 flex items-center gap-1.5 text-xs font-bold transition-colors"
            title="لوحة تحكم التاجر"
          >
            <User className="w-4 h-4 text-zinc-300" />
            <span className="hidden sm:inline">لوحة التاجر</span>
          </button>
        )}

        <div className="w-[1px] h-5 bg-white/20 mx-1"></div>

        <button
          onClick={() => {
            playClick();
            onOpenOrderModal();
          }}
          className="px-3.5 py-1.5 rounded-xl bg-[#D9722B] hover:bg-[#C25E1D] text-white flex items-center gap-1.5 text-xs font-black shadow-md transition-all transform hover:scale-105 active:scale-95"
          title="امتلك متجرك الآن"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>اطلب متجرك</span>
        </button>
      </div>

    </section>
  );
};
