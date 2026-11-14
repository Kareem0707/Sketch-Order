import React, { useState } from 'react';
import {
 Sparkles,
 RefreshCw,
 CheckCircle2,
 ShieldCheck,
 Zap,
 Hammer,
 Film,
 X,
 Volume2,
 VolumeX,
  Grid,
  Smartphone,
} from 'lucide-react';
import { StickmanDoodle } from './common/StickmanDoodle';
import { ComicSpeechBubble } from './common/ComicSpeechBubble';
import { playPaperFlip, playPencilScratch, playClick, playCashSound } from '../utils/soundEffects';

interface HeroSectionProps {
 onOpenOrderModal: () => void;
 onExplorePlayground: () => void;
 onOpenStudio: () => void;
  onOpenTemplates: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
 onOpenOrderModal,
 onExplorePlayground,
 onOpenStudio,
  onOpenTemplates,
}) => {
 // State: 'mess' (Chaos) or 'solution' (Blueprint)
 const [viewState, setViewState] = useState<'mess' | 'solution'>('mess');
 const [isScribbling, setIsScribbling] = useState(false);
 const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
 const [videoAudio, setVideoAudio] = useState(true);

 const triggerTransition = (targetState: 'mess' | 'solution') => {
 playPencilScratch();
 setIsScribbling(true);

 setTimeout(() => {
 setViewState(targetState);
 playPaperFlip();
 if (targetState === 'solution') {
 playCashSound();
 }
 }, 450);

 setTimeout(() => {
 setIsScribbling(false);
 }, 850);
 };

 return (
 <section id="story-chaos" className="relative pt-10 sm:pt-14 pb-16 sm:pb-24 overflow-hidden paper-pattern">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
 
 {/* Main Headline & Value Guarantees with Generous Whitespace */}
 <div className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
 
 {/* 3 Core Guarantees: الدفع مرة واحدة • الضمان مدى الحياة • سرعة التواصل مع الدعم */}
 <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-5 py-2.5 border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-pill text-xs sm:text-sm font-black sketch-shadow-sm bg-white dark:bg-[#151D2A] text-[#0F0F0F] dark:text-slate-100 -rotate-1 hover:rotate-0 transition-transform">
 <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400">
 <CheckCircle2 className="w-4 h-4 text-orange-500 dark:text-orange-400" />
 <span>الدفع مرة واحدة فقط (بدون أي اشتراكات شهرية)</span>
 </span>
 <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
 <span className="flex items-center gap-1.5 text-indigo-800 dark:text-indigo-400">
 <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
 <span>الضمان مدى الحياة لمتجرك المستقل</span>
 </span>
 <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
 <span className="flex items-center gap-1.5 text-orange-800 dark:text-orange-400">
 <Zap className="w-4 h-4 text-orange-500" />
 <span>سرعة فائقة في التواصل مع الدعم</span>
 </span>
 </div>

 {/* Headline with Live Animated Hand-drawn Underline */}
 <div className="relative">
 <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-heading tracking-tight leading-[1.2] sm:leading-[1.15] text-[#0F0F0F] dark:text-white">
 متجرك كأنه{' '}
 <span className="relative inline-block text-orange-500 dark:text-orange-400">
 مرسوم بقلمك
 {/* SVG Stroke Animation Live Wavy Underline */}
 <svg
 className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 text-orange-500 dark:text-orange-400 overflow-visible"
 viewBox="0 0 250 20"
 fill="none"
 >
 <path
 d="M 5 12 Q 40 2, 75 12 T 145 12 T 215 12 T 245 10"
 stroke="currentColor"
 strokeWidth="4"
 strokeLinecap="round"
 className="animate-svg-draw"
 />
 </svg>
 </span>{' '}
 على ورقة كشكول!
 </h1>
 </div>

 {/* New User-Specified Copy with High Contrast */}
 <p className="text-lg sm:text-2xl font-bold text-[#0F0F0F]/85 dark:text-slate-200 max-w-3xl mx-auto leading-relaxed pt-2">
 حوّل فوضى رسايل الواتس وإنستجرام ومشاكل فودافون كاش وتأخير الردود لمتجر تفاعلي شيك وسريع بأسلوب{' '}
 <span className="font-comic text-xl sm:text-3xl font-black px-2 py-0.5 border-b-3 border-[#0F0F0F] dark:border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-500/10 rounded-sm">
 سكتش أوردر
 </span>{' '}
 اللي يدخل قلب زبونك من أول ثانية!
 </p>

          {/* Call to Action Studio Buttons + 2D Animation Story Button */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            {/* Primary CTA: Open Figma Templates Showcase */}
            <button
              onClick={() => {
                playClick();
                onOpenTemplates();
              }}
              className="btn-sketch btn-sketch-primary text-base py-3 px-6 -rotate-1 shadow-md hover:shadow-lg transition-all"
            >
              <Grid className="w-5 h-5 text-slate-950" />
              <span>تصفح قوالب المتاجر (Figma Showcase)</span>
            </button>

            {/* Secondary CTA: Live Mobile Studio */}
            <button
              onClick={() => {
                playClick();
                onOpenStudio();
              }}
              className="btn-sketch btn-sketch-secondary text-base py-3 px-6 rotate-1 shadow-md hover:shadow-lg transition-all"
            >
              <Smartphone className="w-5 h-5 text-orange-500" />
              <span>جرب بناء وتعديل متجرك (لايف)</span>
            </button>

            {/* 2D Animation Story Button */}
            <button
              onClick={() => {
                playClick();
                setIsVideoModalOpen(true);
              }}
              className="btn-sketch text-sm sm:text-base py-3 px-5 border-2 border-orange-500/50 text-orange-500 flex items-center gap-2 -rotate-1"
              title="مشاهدة فيديو القصة الكرتونية 2D في شاشة التلفزيون"
            >
              <Film className="w-4 h-4 text-orange-500 animate-pulse" />
              <span className="font-black">شوف القصة في 30 ثانية</span>
            </button>
          </div>

          {/* Switch Scene Pill */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="p-1.5 border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-2 bg-white dark:bg-[#151D2A] sketch-shadow flex items-center gap-2">
 <button
 onClick={() => triggerTransition('mess')}
 className={`px-3 py-1.5 text-xs sm:text-sm font-black transition-all ${
 viewState === 'mess'
 ? 'bg-[#0F0F0F] text-white dark:bg-orange-500 dark:text-slate-950 sketch-border-1'
 : 'hover:bg-neutral-100 dark:hover:bg-slate-800 text-[#0F0F0F] dark:text-slate-300'
 }`}
 >
 
 مشهد 1: فوضى الشات
 </button>

 <button
 onClick={() => triggerTransition('solution')}
 className={`px-3 py-1.5 text-xs sm:text-sm font-black transition-all ${
 viewState === 'solution'
 ? 'bg-[#0F0F0F] text-white dark:bg-orange-500 dark:text-slate-950 sketch-border-1'
 : 'hover:bg-neutral-100 dark:hover:bg-slate-800 text-[#0F0F0F] dark:text-slate-300'
 }`}
 >
 
 مشهد 2: حل سكتش السريع
 </button>
 </div>

 <button
 onClick={() => triggerTransition(viewState === 'mess' ? 'solution' : 'mess')}
 className="p-2.5 border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-circle bg-white dark:bg-[#151D2A] text-[#0F0F0F] dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-slate-800 sketch-shadow-sm active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs font-bold"
 title="اشطب الصفحة واقلب المشهد"
 >
 <RefreshCw className={`w-4 h-4 ${isScribbling ? 'animate-spin' : ''}`} />
 </button>
 </div>
 </div>

 {/* Comic Strip Hero Frame / The Canvas */}
 <div className="relative max-w-5xl mx-auto">
 
 {/* Comic Panel Header Label */}
 <div className="flex items-center justify-between px-3 -mb-3 z-10 relative">
 <div className="bg-[#0F0F0F] text-white dark:bg-slate-950 dark:border dark:border-slate-700 text-xs font-bold px-3 py-1 sketch-border-tag -rotate-2">
 {viewState === 'mess' ? 'المشهد الأول: فوضى الشات والطلبات الضايعة' : 'المشهد الثاني: متجر سكتش المنظم التلقائي'}
 </div>
 <div className="border border-[#0F0F0F] dark:border-slate-700 bg-white dark:bg-[#151D2A] text-xs font-bold px-2.5 py-1 sketch-border-pill rotate-1 text-[#0F0F0F] dark:text-slate-200">
 التسليم في خلال دقائق 
 </div>
 </div>

 {/* Main Comic Panel Box */}
 <div className="relative border-3 md:border-4 border-[#0F0F0F] dark:border-slate-600 sketch-border-1 bg-white dark:bg-[#111827] text-[#0F0F0F] dark:text-white p-6 sm:p-10 sketch-shadow-xl min-h-[440px] flex flex-col justify-between overflow-hidden">
 
 {/* Scribble Overlay Animation (Stop-motion transition effect) */}
 {isScribbling && (
 <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-3xs">
 <svg className="w-full h-full text-[#0F0F0F] dark:text-white" viewBox="0 0 800 500" fill="none">
 <path
 d="M 20 50 L 780 450 M 760 30 L 40 470 M 10 250 L 790 230 M 350 20 L 420 480 M 100 80 L 700 420 M 680 90 L 120 410"
 stroke="currentColor"
 strokeWidth="10"
 strokeLinecap="round"
 strokeLinejoin="round"
 />
 </svg>
 </div>
 )}

 {/* ========================================================= */}
 {/* STATE 1: THE MESS (فوضى رسائل الزباين والمندوب) */}
 {/* ========================================================= */}
 {viewState === 'mess' && (
 <div className="space-y-6 animate-fadeIn">
 
 {/* Warning Notification Banner */}
 <div className="border-2 border-dashed border-[#0F0F0F] dark:border-amber-500/40 p-3.5 sketch-border-3 bg-[#FAF9F6] dark:bg-amber-500/10 text-center text-xs sm:text-sm font-bold text-[#0F0F0F] dark:text-amber-200">
 تحذير: 68% من أصحاب المتاجر في مصر بيخسروا زباينهم بسبب بطء الرد وتداخل تحويلات إنستاباي وسكرينات فودافون كاش!
 </div>

 {/* Overlapping Chat Messages Grid with STAGGERED POP-IN ANIMATION */}
 <div className="relative min-h-[220px] my-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
 
 {/* Chat Bubbles Left Side */}
 <div className="md:col-span-5 space-y-4">
 <div className="animate-pop-in-1">
 <ComicSpeechBubble className="-rotate-2">
 <div className="text-xs font-mono font-bold text-[#0F0F0F]/60 dark:text-slate-400 mb-0.5">عميل مستعجل:</div>
 <div>"يا كابتن الكوتشي دا متاح مقاس 43؟ وبكام الشحن للمهندسين؟"</div>
 <div className="text-xs font-bold text-orange-500 dark:text-orange-400 mt-1 border-t border-dashed border-[#0F0F0F] dark:border-slate-600 pt-1">
 رد متأخر: متاح بس الشحن على حسب المندوب...
 </div>
 </ComicSpeechBubble>
 </div>

 <div className="animate-pop-in-2">
 <ComicSpeechBubble className="rotate-2" variant="scream">
 <div className="text-xs font-mono font-bold text-orange-500 dark:text-orange-400 mb-0.5">زبونة قلقانة:</div>
 <div>"حولت 650 جنيه فودافون كاش من الصبح ومحدش أكد الأوردر لحد دلوقتي!"</div>
 <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 border-t border-dashed border-[#0F0F0F] dark:border-slate-600 pt-1">
 رد: معلش الرسايل كتير اديني نص ساعة أراجع المحفظة...
 </div>
 </ComicSpeechBubble>
 </div>
 </div>

 {/* Center: The Official Mascot Stressed / Overwhelmed with Live Wobble */}
 <div className="md:col-span-3 flex flex-col items-center justify-center text-center animate-wobble-slow">
 <StickmanDoodle size={160} />
 <span className="text-xs font-black bg-white dark:bg-slate-900 border border-[#0F0F0F] dark:border-slate-700 px-2.5 py-1 sketch-border-tag mt-2 text-[#0F0F0F] dark:text-slate-200 shadow-xs">
 صاحب المتجر محتار في وسط الرسايل!
 </span>
 </div>

 {/* Chat Bubbles Right Side */}
 <div className="md:col-span-4 space-y-4">
 <div className="animate-pop-in-3">
 <ComicSpeechBubble className="rotate-3">
 <div className="text-xs font-mono font-bold text-[#0F0F0F]/60 dark:text-slate-400 mb-0.5">مندوب الشحن:</div>
 <div>"اللوكيشن مش واضح ورقم العميل مقفول.. هكنسل الأوردر وهرجع الشحنة!"</div>
 </ComicSpeechBubble>
 </div>

 <div className="animate-pop-in-4">
 <div className="p-3 border-2 border-[#0F0F0F] dark:border-orange-500/40 sketch-border-2 bg-neutral-100 dark:bg-orange-500/10 text-xs font-bold -rotate-1 text-center text-orange-500 dark:text-orange-300">
 أوردر ملغي بسبب التأخير في الرد
 </div>
 </div>
 </div>

 </div>

 {/* Bottom Actions for Mess */}
 <div className="pt-4 border-t-2 border-[#0F0F0F] dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
 <div className="text-xs sm:text-sm font-bold text-[#0F0F0F]/80 dark:text-slate-300">
 مستعد تخلص من الصداع دا؟ وفر 5 ساعات يومياً بنقرة واحدة:
 </div>

 <button
 onClick={() => triggerTransition('solution')}
 className="btn-sketch btn-sketch-primary text-sm sm:text-base py-2.5 px-6 -rotate-1"
 >
 <span>امسح الفوضى وشوف حل سكتش أوردر</span>
 <Sparkles className="w-4 h-4 ml-2" />
 </button>
 </div>

 </div>
 )}

 {/* ========================================================= */}
 {/* STATE 2: THE SOLUTION (متجر سكتش المنظم التلقائي) */}
 {/* ========================================================= */}
 {viewState === 'solution' && (
 <div className="space-y-6 animate-fadeIn">
 
 {/* Blueprint Header */}
 <div className="border-2 border-[#0F0F0F] dark:border-slate-700 p-3 sketch-border-2 bg-white dark:bg-[#151D2A] flex items-center justify-between text-xs sm:text-sm font-bold">
 <div className="flex items-center gap-2">
 <span className="w-5 h-5 rounded-full bg-[#0F0F0F] dark:bg-emerald-500 text-white dark:text-slate-950 flex items-center justify-center text-xs">
 ✓
 </span>
 <span className="text-[#0F0F0F] dark:text-white">متجرك المستقل جاهز: منظم، سريع، وبيستقبل الأوردرات في ثواني!</span>
 </div>
 <span className="text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 text-orange-400 px-2.5 py-0.5 rounded-full">
 ضمان مدى الحياة
 </span>
 </div>

 {/* 3 Structured Blueprint Columns */}
 <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-2">
 
 {/* Left Column: Interactive Store Preview Mockup */}
 <div className="md:col-span-5 border-2 border-[#0F0F0F] dark:border-slate-700 p-4 sketch-border-1 bg-white dark:bg-[#151D2A] sketch-shadow-sm space-y-3">
 <div className="flex items-center justify-between border-b-2 border-[#0F0F0F] dark:border-slate-700 pb-2">
 <div className="flex items-center gap-1.5">
 <span className="w-3 h-3 rounded-full border border-[#0F0F0F] dark:border-slate-600 bg-[#0F0F0F] dark:bg-orange-400"></span>
 <span className="w-3 h-3 rounded-full border border-[#0F0F0F] dark:border-slate-600 bg-white dark:bg-slate-700"></span>
 <span className="w-3 h-3 rounded-full border border-[#0F0F0F] dark:border-slate-600 bg-white dark:bg-slate-700"></span>
 </div>
 <span className="text-xs font-mono font-bold text-orange-500">kicks-eg.store</span>
 </div>

 <div className="space-y-2">
 <div className="flex items-center justify-between p-2 border border-[#0F0F0F] dark:border-slate-700 sketch-border-pill bg-neutral-50 dark:bg-slate-900 text-xs font-bold">
 <span> المنتج: كوتشي Cloud Runner مقاس 43</span>
 <span className="font-mono text-orange-500">1,290 ج.م</span>
 </div>

 <div className="flex items-center justify-between p-2 border border-[#0F0F0F] dark:border-slate-700 sketch-border-pill bg-neutral-50 dark:bg-slate-900 text-xs font-bold">
 <span> التوصيل: القاهرة - مدينة نصر</span>
 <span className="font-bold text-orange-500 dark:text-orange-400">في خلال دقايق ✓</span>
 </div>

 <div className="p-2 border-2 border-[#0F0F0F] dark:border-orange-500/40 sketch-border-1 bg-[#0F0F0F] dark:bg-slate-900 text-white dark:text-orange-200 text-center text-xs font-bold">
 ✓ تم تحويل الأوردر بفاتورته ورابط اللوكيشن تلقائياً للواتساب
 </div>
 </div>

 <div className="text-[11px] font-bold text-[#0F0F0F]/70 dark:text-slate-400 pt-1 text-center">
 * بدون لوحات تحكم معقدة ولا اشتراكات شهرية مستنزفة
 </div>
 </div>

 {/* Center Column: Happy Official Mascot Pointing */}
 <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
 <StickmanDoodle size={160} />
 <div className="mt-1 bg-white dark:bg-slate-900 border-2 border-[#0F0F0F] dark:border-slate-700 text-xs font-black px-3 py-1 sketch-border-pill sketch-shadow-sm -rotate-2 text-[#0F0F0F] dark:text-slate-100">
 "الزبون يطلب وأنت مرتاح وبتشرب قهوتك!"
 </div>
 </div>

 {/* Right Column: Hand-Drawn Growth Chart */}
 <div className="md:col-span-3 border-2 border-[#0F0F0F] dark:border-slate-700 p-4 sketch-border-3 bg-white dark:bg-[#151D2A] sketch-shadow-sm space-y-2 text-center">
 <div className="text-xs font-bold text-[#0F0F0F]/80 dark:text-slate-300">
 معدل إتمام الشراء 
 </div>

 <svg viewBox="0 0 160 100" className="w-full h-24 text-[#0F0F0F] dark:text-white" fill="none">
 <line x1="10" y1="90" x2="150" y2="90" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
 <line x1="10" y1="10" x2="10" y2="90" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
 
 <path
 d="M 15 82 L 40 70 L 65 75 L 90 48 L 115 54 L 145 18"
 stroke="#F97316"
 strokeWidth="3.2"
 strokeLinecap="round"
 strokeLinejoin="round"
 />
 <path d="M 132 18 L 145 18 L 145 32" stroke="#F97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
 
 <circle cx="15" cy="82" r="3" fill="#F97316" />
 <circle cx="40" cy="70" r="3" fill="#F97316" />
 <circle cx="65" cy="75" r="3" fill="#F97316" />
 <circle cx="90" cy="48" r="3" fill="#F97316" />
 <circle cx="115" cy="54" r="3" fill="#F97316" />
 <circle cx="145" cy="18" r="4" fill="#F97316" />
 </svg>

 <div className="text-xl font-black font-heading leading-none text-orange-500 dark:text-orange-400">
 +320% مبيعات
 </div>
 <div className="text-[10px] font-bold text-[#0F0F0F]/70 dark:text-slate-400">
 في سرعة تقفيل الأوردرات بدون أسئلة متكررة
 </div>
 </div>

 </div>

 {/* Bottom Actions for Solution */}
 <div className="pt-4 border-t-2 border-[#0F0F0F] dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
 <div className="flex flex-wrap items-center gap-3">
 <button
 onClick={() => {
 playClick();
 onOpenStudio();
 }}
 className="btn-sketch btn-sketch-primary text-base py-3 px-6 -rotate-1"
 >
 <Hammer className="w-5 h-5 text-emerald-400 dark:text-slate-950" />
 <span>ابنِ متجرك وجربه في الاستوديو</span>
 </button>

 <button
 onClick={() => {
 playClick();
 onOpenOrderModal();
 }}
 className="btn-sketch text-base py-3 px-6 rotate-1"
 >
 <Sparkles className="w-5 h-5" />
 <span>امتلك موقعك الآن</span>
 </button>

 <button
 onClick={() => {
 playClick();
 onExplorePlayground();
 }}
 className="text-xs font-bold underline hover:opacity-75 transition-opacity text-[#0F0F0F] dark:text-slate-300"
 >
 <span>معاينة المتجر التجريبي</span>
 </button>
 </div>

 <button
 onClick={() => triggerTransition('mess')}
 className="text-xs font-bold underline underline-offset-4 hover:opacity-70 transition-opacity text-[#0F0F0F] dark:text-slate-400"
 >
 ↺ رجوع لمشهد الفوضى للمقارنة
 </button>
 </div>

 </div>
 )}

 </div>

 </div>

 {/* ======================================================== */}
 {/* SOCIAL PROOF & LIVE METRICS MARQUEE (الثقل والتاريخ التجاري) */}
 {/* ======================================================== */}
 <div className="pt-4 border-t-2 border-[#0F0F0F]/10 dark:border-slate-800">
 <div className="text-center mb-6">
 <span className="inline-block text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-4 py-1.5 sketch-border-pill">
 موثوق ومعتمد من +140 متجر وبراند مصري نشط يعملون بنظام سكتش أوردر
 </span>
 </div>

 {/* Marquee Brand Track */}
 <div className="overflow-hidden relative py-3 bg-neutral-50 dark:bg-slate-900/40 border-y border-[#0F0F0F]/10 dark:border-slate-800">
 <div className="animate-marquee items-center gap-8 text-xs sm:text-sm font-black whitespace-nowrap text-slate-700 dark:text-slate-300">
 {[
 { name: ' سبورتك إيجيبت (SPORTECH)', cat: 'كوتشيات ومستلزمات' },
 { name: ' بن الصعيدي الأصلي', cat: 'قهوة ومحمصة' },
 { name: ' برجر كلوب & فرايز', cat: 'سماش برجر' },
 { name: ' فاسكو ستريت وير (FASCO)', cat: 'أوفر سايز' },
 { name: ' داين ريزيرف الزمالك', cat: 'مطاعم فاخرة' },
 { name: ' بانتو إسكندنافيان ديكور', cat: 'أثاث منزلي' },
 { name: ' فيلفيتي للعطور والمجوهرات', cat: 'عطور باريسية' },
 { name: ' كيكس كايرو ستور', cat: 'سنيكرز نادرة' },
 { name: ' سبورتك إيجيبت (SPORTECH)', cat: 'كوتشيات ومستلزمات' },
 { name: ' بن الصعيدي الأصلي', cat: 'قهوة ومحمصة' },
 { name: ' برجر كلوب & فرايز', cat: 'سماش برجر' },
 { name: ' فاسكو ستريت وير (FASCO)', cat: 'أوفر سايز' },
 ].map((b, idx) => (
 <div
 key={idx}
 className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border border-[#0F0F0F]/15 dark:border-slate-700 bg-white dark:bg-[#151D2A] shadow-2xs hover:scale-105 transition-transform"
 >
 <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
 <span className="font-heading">{b.name}</span>
 <span className="text-[10px] text-slate-400 font-mono">({b.cat})</span>
 </div>
 ))}
 </div>
 </div>

 {/* Key Metrics Counters */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
 <div className="p-3 border border-[#0F0F0F]/15 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#151D2A]">
 <div className="text-2xl sm:text-3xl font-black font-mono text-orange-500">+24,500</div>
 <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5">أوردر تم تنفيذه تلقائياً</div>
 </div>
 <div className="p-3 border border-[#0F0F0F]/15 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#151D2A]">
 <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-500">0%</div>
 <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5">عمولات على أرباح مبيعاتك</div>
 </div>
 <div className="p-3 border border-[#0F0F0F]/15 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#151D2A]">
 <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-500">100%</div>
 <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5">ملكية كاملة برابط ودومين خاص</div>
 </div>
 <div className="p-3 border border-[#0F0F0F]/15 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#151D2A]">
 <div className="text-2xl sm:text-3xl font-black font-mono text-amber-500">24 ساعة</div>
 <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5">تسليم المتجر وبدء البيع فوراً</div>
 </div>
 </div>
 </div>

 </div>

 {/* ======================================================== */}
 {/* 2D ANIMATION STORY MODAL (شاشة التلفزيون المرسومة CRT) */}
 {/* ======================================================== */}
 {isVideoModalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
 <div className="relative max-w-2xl w-full bg-[#18181B] border-4 border-amber-500/80 rounded-[36px] p-6 text-white shadow-[0_0_50px_rgba(245,158,11,0.25)] space-y-4">
 
 {/* TV Frame Top Bar with Knobs & Antenna */}
 <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
 <div className="flex items-center gap-2">
 <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
 <h3 className="font-heading font-black text-base text-amber-400">
 سكتش تي في • قصة الستيك مان في 30 ثانية
 </h3>
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={() => setVideoAudio(!videoAudio)}
 className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
 title="كتم / تشغيل الصوت"
 >
 {videoAudio ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
 </button>
 <button
 onClick={() => {
 playClick();
 setIsVideoModalOpen(false);
 }}
 className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
 aria-label="إغلاق"
 >
 <X className="w-5 h-5" />
 </button>
 </div>
 </div>

 {/* CRT TV Screen with Scanlines & 2D Animation Story Simulator */}
 <div className="relative rounded-2xl bg-[#090D16] border-2 border-zinc-700 aspect-video flex flex-col items-center justify-center overflow-hidden p-6 text-center select-none">
 
 {/* Scanlines Effect */}
 <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40"></div>

 {/* Story Narrative Progression */}
 <div className="relative z-10 space-y-4 max-w-lg">
 <div className="w-24 h-24 mx-auto animate-wobble-slow">
 <StickmanDoodle size={100} />
 </div>

 <div className="bg-black/70 backdrop-blur-xs border border-amber-500/30 p-4 rounded-2xl shadow-lg space-y-2">
 <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
 2D ANIMATION STORYLINE
 </span>
 <h4 className="text-lg sm:text-xl font-heading font-black text-white">
 من زحمة رسايل "بكام الشحن للمهندسين" إلى متجر أوتوماتيك يستقبل أوردراتك وأنت نايم!
 </h4>
 <p className="text-xs text-zinc-300 leading-relaxed">
 وداعاً لضياع أرقام العملاء، وداعاً لتحويلات فودافون كاش المتشابهة. سكتش أوردر بينقل متجرك لمستوى المنصات العالمية بهوية مصرية كوميدية خفيفة على قلب الزبون.
 </p>
 </div>

 <div className="flex items-center justify-center gap-3 pt-2">
 <button
 onClick={() => {
 playClick();
 setIsVideoModalOpen(false);
 onOpenStudio();
 }}
 className="btn-sketch btn-sketch-primary text-xs py-2 px-5"
 >
 <Hammer className="w-4 h-4 text-emerald-400" />
 <span>ادخل الاستوديو وجرب بنفسك لايف</span>
 </button>
 </div>
 </div>

 {/* Bottom Channel Indicator */}
 <div className="absolute bottom-2 right-3 font-mono text-[10px] text-zinc-500">
 CH 01 • SKETCH-ORDER 2026
 </div>
 </div>

 {/* TV Bottom Speaker Grille & Controls */}
 <div className="flex items-center justify-between px-2 text-xs text-zinc-400">
 <span className="font-mono text-[11px]">HD 1080p • 2D VECTOR ANIMATION READY</span>
 <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
 <span>تكتكة زرار الموبايل شغالة ✓</span>
 </div>
 </div>

 </div>
 </div>
 )}

 </section>
 );
};
