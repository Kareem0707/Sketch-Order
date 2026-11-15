import React from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  Hammer,
  Grid,
  ArrowLeft,
  ShoppingBag,
  Home,
  User,
  Sparkles,
} from 'lucide-react';
import { StickmanDoodle } from './common/StickmanDoodle';
import { ComicSpeechBubble } from './common/ComicSpeechBubble';
import { HomeVideoSlot } from './HomeVideoSlot';
import { STUDIO_TEMPLATES } from './FullPageStoreStudio';
import { playClick } from '../utils/soundEffects';

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
  // Top 4 featured templates for the compact side selector
  const featuredTemplates = STUDIO_TEMPLATES.slice(0, 4);

  return (
    <section id="story-chaos" className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 overflow-hidden paper-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

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
        {/* 2. HERO BANNER: HEADLINE & ACTION BUTTONS               */}
        {/* ======================================================== */}
        <div className="relative rounded-2xl md:rounded-3xl border-3 border-[#0F0F0F] dark:border-slate-700 bg-white dark:bg-[#111827] sketch-stripes p-5 sm:p-7 overflow-hidden sketch-shadow">
          <div className="absolute inset-0 bg-white/85 dark:bg-[#111827]/90 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Mascot Silhouette Doodle */}
            <div className="hidden lg:flex flex-col items-center justify-center shrink-0">
              <StickmanDoodle size={100} />
              <span className="text-[10px] font-mono font-bold bg-white dark:bg-slate-900 border border-[#0F0F0F] dark:border-slate-700 px-2 py-0.5 rounded-md mt-1">
                سكتش مان
              </span>
            </div>

            {/* Speech Bubble Headline */}
            <div className="text-center md:text-right flex-1 space-y-2.5">
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

              <p className="text-xs sm:text-sm md:text-base font-bold text-zinc-700 dark:text-zinc-200 max-w-2xl leading-relaxed">
                تقسيمة عصرية بتجمع بين روح الرسم اليدوي وفيديو تفاعلي حي. ودّع زحمة رسائل الواتس واستلم متجرك المستقل بالدومين الخاص في خلال دقائق!
              </p>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 items-center justify-center w-full sm:w-auto">
              <button
                onClick={() => {
                  playClick();
                  onOpenOrderModal();
                }}
                className="w-full sm:w-auto btn-sketch btn-sketch-primary text-xs sm:text-sm py-3 px-5 -rotate-1 shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2 font-heading font-black"
              >
                <ShoppingBag className="w-4 h-4 text-white dark:text-slate-950" />
                <span>امتلك متجرك الآن (Buy Store)</span>
              </button>

              <button
                onClick={() => {
                  playClick();
                  onOpenStudio();
                }}
                className="w-full sm:w-auto btn-sketch text-xs sm:text-sm py-2 px-4 rotate-1 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white border-2 border-[#0F0F0F] dark:border-slate-600 flex items-center justify-center gap-2 font-heading font-black"
              >
                <Hammer className="w-4 h-4 text-[#D9722B]" />
                <span>تجربة الاستوديو لايف</span>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. SHOWCASE CENTERPIECE: VIDEO + COMPACT TEMPLATES      */}
        {/* Clean 2-column layout: Video (8 cols) + Side (4 cols)   */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          
          {/* Main Video Slot (Centerpiece - 7 to 8 Columns) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="h-full rounded-2xl md:rounded-3xl border-3 border-[#0F0F0F] dark:border-slate-700 bg-white dark:bg-[#0F172A] p-3 sm:p-4 sketch-shadow-lg flex flex-col justify-between space-y-3">
              {/* Video Bar Header */}
              <div className="flex items-center justify-between pb-2 border-b-2 border-zinc-100 dark:border-slate-800 px-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
                  </div>
                  <span className="text-xs font-heading font-black text-zinc-800 dark:text-zinc-200 mr-2">
                    فيديو شرح المنصة وشاشة المتجر التفاعلية
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#D9722B] dark:text-[#E88B4D] bg-[#D9722B]/10 px-2 py-0.5 rounded-md border border-[#D9722B]/20">
                  Full HD • فيديو حي
                </span>
              </div>

              {/* The Video Player Slot */}
              <div className="flex-1 min-h-[300px] sm:min-h-[360px] flex items-center justify-center">
                <HomeVideoSlot onOpenStudio={onOpenStudio} className="w-full h-full" />
              </div>
            </div>
          </div>

          {/* Compact Side Panel: 4 Featured Templates & Quick Selector (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="h-full rounded-2xl md:rounded-3xl border-3 border-[#0F0F0F] dark:border-slate-700 bg-white dark:bg-[#111827] p-4 sm:p-5 sketch-shadow flex flex-col justify-between space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-zinc-100 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4 text-[#D9722B]" />
                  <h3 className="font-heading font-black text-sm text-zinc-900 dark:text-white">
                    قوالب المتاجر الحية
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  9 قوالب جاهزة
                </span>
              </div>

              {/* 4 Compact Template Rows */}
              <div className="space-y-2.5 flex-1 flex flex-col justify-around">
                {featuredTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => {
                      playClick();
                      onOpenStudio();
                    }}
                    className="group flex items-center justify-between gap-3 p-2 rounded-xl border border-zinc-200 dark:border-slate-800 hover:border-[#D9722B] bg-neutral-50 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer shadow-2xs hover:-translate-x-1"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Dual Device Mini Preview (PC + Phone) */}
                      <div className="relative w-14 h-12 rounded-lg overflow-hidden border border-zinc-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0 shadow-2xs">
                        <img
                          src={template.previewImage}
                          alt={`${template.name} PC`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {/* Overlapping Phone Mockup */}
                        <div className="absolute left-0.5 bottom-0.5 w-5 h-8 rounded-[4px] border border-black bg-slate-900 shadow-md overflow-hidden">
                          <img
                            src={template.previewImage}
                            alt={`${template.name} Mobile`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="absolute top-0.5 right-0.5 text-[6px] font-mono font-black bg-black/75 text-white px-0.5 rounded">
                          PC+فون
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-black font-heading text-zinc-900 dark:text-white truncate group-hover:text-[#D9722B] transition-colors">
                          {template.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400 truncate">
                            {template.categoryBadge}
                          </span>
                          <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded hidden sm:inline">
                            📱+💻
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-zinc-300 dark:border-slate-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 group-hover:bg-[#D9722B] group-hover:text-white group-hover:border-[#D9722B] transition-colors shrink-0">
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions & Trust */}
              <div className="pt-2 border-t border-zinc-100 dark:border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    playClick();
                    onOpenTemplates();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl border-2 border-[#0F0F0F] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-neutral-100 dark:hover:bg-slate-700 text-xs font-black font-heading text-zinc-900 dark:text-white transition-all flex items-center justify-center gap-1.5"
                >
                  <Grid className="w-3.5 h-3.5 text-[#D9722B]" />
                  <span>تصفح كل القوالب الـ 9 في صفحة مستقلة</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                  <Sparkles className="w-3 h-3 text-[#D9722B]" />
                  <span>دفع لمرة واحدة • 0% عمولة • دومينك الخاص</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* 4. SOCIAL PROOF & METRICS ROW                           */}
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
      {/* 5. FLOATING BENTO DOCK (Clean, minimal quick access)     */}
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
