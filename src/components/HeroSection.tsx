import React, { useState } from 'react';
import { Sparkles, RefreshCw, CheckCircle2, ShieldCheck, Zap, Hammer } from 'lucide-react';
import { StickmanDoodle } from './common/StickmanDoodle';
import { ComicSpeechBubble } from './common/ComicSpeechBubble';
import { playPaperFlip, playPencilScratch, playClick } from '../utils/soundEffects';

interface HeroSectionProps {
  onOpenOrderModal: () => void;
  onExplorePlayground: () => void;
  onOpenStudio: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenOrderModal,
  onExplorePlayground,
  onOpenStudio,
}) => {
  // State: 'mess' (Chaos) or 'solution' (Blueprint)
  const [viewState, setViewState] = useState<'mess' | 'solution'>('mess');
  const [isScribbling, setIsScribbling] = useState(false);

  const triggerTransition = (targetState: 'mess' | 'solution') => {
    playPencilScratch();
    setIsScribbling(true);

    setTimeout(() => {
      setViewState(targetState);
      playPaperFlip();
    }, 450);

    setTimeout(() => {
      setIsScribbling(false);
    }, 850);
  };

  return (
    <section id="story-chaos" className="relative pt-6 pb-16 overflow-hidden paper-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Headline & Value Guarantees */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          
          {/* 3 Core Guarantees: الدفع مرة واحدة • الضمان مدى الحياة • سرعة التواصل مع الدعم */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 py-2 border-2 border-[#0F0F0F] sketch-border-pill text-xs sm:text-sm font-black mb-5 sketch-shadow-sm bg-white -rotate-1">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>الدفع مرة واحدة فقط (بدون اشتراكات)</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-indigo-800">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>الضمان مدى الحياة لمتجرك</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-orange-800">
              <Zap className="w-4 h-4 text-orange-500" />
              <span>سرعة فائقة في التواصل مع الدعم</span>
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-heading tracking-tight leading-tight md:leading-none text-[#0F0F0F] mb-6">
            متجرك كأنه <span className="underline decoration-wavy decoration-3 underline-offset-8">مرسوم بقلمك</span> على ورقة كشكول!
          </h1>

          {/* New User-Specified Copy */}
          <p className="text-lg sm:text-2xl font-bold text-[#0F0F0F]/85 max-w-3xl mx-auto leading-relaxed">
            حوّل فوضى رسايل الواتس وإنستجرام ومشاكل فودافون كاش وتأخير الردود لمتجر تفاعلي شيك وسريع بأسلوب <span className="font-comic text-xl sm:text-3xl font-black px-1.5 border-b-2 border-[#0F0F0F]">سكتش أوردر الحصري</span> اللي يدخل قلب زبونك من أول ثانية!
          </p>

          {/* Call to Action Studio Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                playClick();
                onOpenStudio();
              }}
              className="btn-sketch btn-sketch-primary text-base py-3 px-6 -rotate-1"
            >
              <Hammer className="w-5 h-5 text-emerald-400" />
              <span>جرب بناء وتعديل متجرك بنفسك (لايف)</span>
            </button>

            <div className="p-1.5 border-2 border-[#0F0F0F] sketch-border-2 bg-white sketch-shadow flex items-center gap-2">
              <button
                onClick={() => triggerTransition('mess')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-black transition-all ${
                  viewState === 'mess'
                    ? 'bg-[#0F0F0F] text-white sketch-border-1'
                    : 'hover:bg-neutral-100 text-[#0F0F0F]'
                }`}
              >
                <span className="inline-block ml-1">🤯</span>
                مشهد 1: فوضى الشات
              </button>

              <button
                onClick={() => triggerTransition('solution')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-black transition-all ${
                  viewState === 'solution'
                    ? 'bg-[#0F0F0F] text-white sketch-border-1'
                    : 'hover:bg-neutral-100 text-[#0F0F0F]'
                }`}
              >
                <span className="inline-block ml-1">✨</span>
                مشهد 2: حل سكتش السريع
              </button>
            </div>

            <button
              onClick={() => triggerTransition(viewState === 'mess' ? 'solution' : 'mess')}
              className="p-2.5 border-2 border-[#0F0F0F] sketch-border-circle bg-white hover:bg-neutral-100 sketch-shadow-sm active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs font-bold"
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
            <div className="bg-[#0F0F0F] text-white text-xs font-bold px-3 py-1 sketch-border-tag -rotate-2">
              {viewState === 'mess' ? 'المشهد الأول: فوضى الشات والطلبات الضايعة' : 'المشهد الثاني: متجر سكتش المنظم التلقائي'}
            </div>
            <div className="border border-[#0F0F0F] bg-white text-xs font-bold px-2 py-0.5 sketch-border-pill rotate-1">
              التسليم في خلال دقايق ⚡
            </div>
          </div>

          {/* Main Comic Panel Box */}
          <div className="relative border-3 md:border-4 border-[#0F0F0F] sketch-border-1 bg-white p-6 sm:p-10 sketch-shadow-xl min-h-[440px] flex flex-col justify-between overflow-hidden">
            
            {/* Scribble Overlay Animation (Stop-motion transition effect) */}
            {isScribbling && (
              <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center bg-white/40 backdrop-blur-3xs">
                <svg className="w-full h-full text-[#0F0F0F]" viewBox="0 0 800 500" fill="none">
                  <path
                    d="M 20 50 L 780 450 M 760 30 L 40 470 M 10 250 L 790 230 M 350 20 L 420 480 M 100 80 L 700 420 M 680 90 L 120 410"
                    stroke="#0F0F0F"
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
                <div className="border-2 border-dashed border-[#0F0F0F] p-3 sketch-border-3 bg-[#FAF9F6] text-center text-xs sm:text-sm font-bold">
                  ⚠️ تحذير: 68% من أصحاب المتاجر في مصر بيخسروا زباينهم بسبب بطء الرد وتداخل تحويلات إنستاباي وسكرينات فودافون كاش!
                </div>

                {/* Overlapping Chat Messages Grid */}
                <div className="relative min-h-[220px] my-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  {/* Chat Bubbles Left Side */}
                  <div className="md:col-span-5 space-y-4">
                    <ComicSpeechBubble className="-rotate-2">
                      <div className="text-xs font-mono font-bold text-[#0F0F0F]/60 mb-0.5">عميل مستعجل:</div>
                      <div>"يا كابتن الكوتشي دا متاح مقاس 43؟ وبكام الشحن للمهندسين؟"</div>
                      <div className="text-xs font-bold text-red-600 mt-1 border-t border-dashed border-[#0F0F0F] pt-1">
                        رد متأخر: متاح بس الشحن على حسب المندوب...
                      </div>
                    </ComicSpeechBubble>

                    <ComicSpeechBubble className="rotate-2" variant="scream">
                      <div className="text-xs font-mono font-bold text-red-600 mb-0.5">زبونة قلقانة:</div>
                      <div>"حولت 650 جنيه فودافون كاش من الصبح ومحدش أكد الأوردر لحد دلوقتي!"</div>
                      <div className="text-xs font-bold text-slate-500 mt-1 border-t border-dashed border-[#0F0F0F] pt-1">
                        رد: معلش الرسايل كتير اديني نص ساعة أراجع المحفظة...
                      </div>
                    </ComicSpeechBubble>
                  </div>

                  {/* Center: The Official Mascot Stressed / Overwhelmed */}
                  <div className="md:col-span-3 flex flex-col items-center justify-center text-center">
                    <StickmanDoodle size={160} />
                    <span className="text-xs font-black bg-white border border-[#0F0F0F] px-2 py-0.5 sketch-border-tag mt-1">
                      صاحب المتجر محتار في وسط الرسايل!
                    </span>
                  </div>

                  {/* Chat Bubbles Right Side */}
                  <div className="md:col-span-4 space-y-4">
                    <ComicSpeechBubble className="rotate-3">
                      <div className="text-xs font-mono font-bold text-[#0F0F0F]/60 mb-0.5">مندوب الشحن:</div>
                      <div>"اللوكيشن مش واضح ورقم العميل مقفول.. هكنسل الأوردر وهرجع الشحنة!"</div>
                    </ComicSpeechBubble>

                    <div className="p-3 border-2 border-[#0F0F0F] sketch-border-2 bg-neutral-100 text-xs font-bold -rotate-1 text-center">
                      ❌ أوردر ملغي بسبب التأخير في الرد
                    </div>
                  </div>

                </div>

                {/* Bottom Actions for Mess */}
                <div className="pt-4 border-t-2 border-[#0F0F0F] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs sm:text-sm font-bold text-[#0F0F0F]/80">
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
                <div className="border-2 border-[#0F0F0F] p-3 sketch-border-2 bg-white flex items-center justify-between text-xs sm:text-sm font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#0F0F0F] text-white flex items-center justify-center text-xs">
                      ✓
                    </span>
                    <span>متجرك المستقل جاهز: منظم، سريع، وبيستقبل الأوردرات في ثواني!</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                    ضمان مدى الحياة
                  </span>
                </div>

                {/* 3 Structured Blueprint Columns */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-2">
                  
                  {/* Left Column: Interactive Store Preview Mockup */}
                  <div className="md:col-span-5 border-2 border-[#0F0F0F] p-4 sketch-border-1 bg-white sketch-shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b-2 border-[#0F0F0F] pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full border border-[#0F0F0F] bg-[#0F0F0F]"></span>
                        <span className="w-3 h-3 rounded-full border border-[#0F0F0F] bg-white"></span>
                        <span className="w-3 h-3 rounded-full border border-[#0F0F0F] bg-white"></span>
                      </div>
                      <span className="text-xs font-mono font-bold">kicks-eg.store</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border border-[#0F0F0F] sketch-border-pill bg-neutral-50 text-xs font-bold">
                        <span>👟 المنتج: كوتشي Cloud Runner مقاس 43</span>
                        <span className="font-mono">1,290 ج.م</span>
                      </div>

                      <div className="flex items-center justify-between p-2 border border-[#0F0F0F] sketch-border-pill bg-neutral-50 text-xs font-bold">
                        <span>📍 التوصيل: القاهرة - مدينة نصر</span>
                        <span className="font-bold text-emerald-700">في خلال دقايق ✓</span>
                      </div>

                      <div className="p-2 border-2 border-[#0F0F0F] sketch-border-1 bg-[#0F0F0F] text-white text-center text-xs font-bold">
                        ✓ تم تحويل الأوردر بفاتورته ورابط اللوكيشن تلقائياً للواتساب
                      </div>
                    </div>

                    <div className="text-[11px] font-bold text-[#0F0F0F]/70 pt-1 text-center">
                      * بدون لوحات تحكم معقدة ولا اشتراكات شهرية مستنزفة
                    </div>
                  </div>

                  {/* Center Column: Happy Official Mascot Pointing */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
                    <StickmanDoodle size={160} />
                    <div className="mt-1 bg-white border-2 border-[#0F0F0F] text-xs font-black px-3 py-1 sketch-border-pill sketch-shadow-sm -rotate-2">
                      "الزبون يطلب وأنت مرتاح وبتشرب قهوتك!"
                    </div>
                  </div>

                  {/* Right Column: Hand-Drawn Growth Chart */}
                  <div className="md:col-span-3 border-2 border-[#0F0F0F] p-4 sketch-border-3 bg-white sketch-shadow-sm space-y-2 text-center">
                    <div className="text-xs font-bold text-[#0F0F0F]/80">
                      معدل إتمام الشراء 📈
                    </div>

                    <svg viewBox="0 0 160 100" className="w-full h-24 text-[#0F0F0F]" fill="none">
                      <line x1="10" y1="90" x2="150" y2="90" stroke="#0F0F0F" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="10" y1="10" x2="10" y2="90" stroke="#0F0F0F" strokeWidth="2.5" strokeLinecap="round" />
                      
                      <path
                        d="M 15 82 L 40 70 L 65 75 L 90 48 L 115 54 L 145 18"
                        stroke="#0F0F0F"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M 132 18 L 145 18 L 145 32" stroke="#0F0F0F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      
                      <circle cx="15" cy="82" r="3" fill="#0F0F0F" />
                      <circle cx="40" cy="70" r="3" fill="#0F0F0F" />
                      <circle cx="65" cy="75" r="3" fill="#0F0F0F" />
                      <circle cx="90" cy="48" r="3" fill="#0F0F0F" />
                      <circle cx="115" cy="54" r="3" fill="#0F0F0F" />
                      <circle cx="145" cy="18" r="4" fill="#0F0F0F" />
                    </svg>

                    <div className="text-xl font-black font-heading leading-none">
                      +320% مبيعات
                    </div>
                    <div className="text-[10px] font-bold text-[#0F0F0F]/70">
                      في سرعة تقفيل الأوردرات بدون أسئلة متكررة
                    </div>
                  </div>

                </div>

                {/* Bottom Actions for Solution */}
                <div className="pt-4 border-t-2 border-[#0F0F0F] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        playClick();
                        onOpenStudio();
                      }}
                      className="btn-sketch btn-sketch-primary text-base py-3 px-6 -rotate-1"
                    >
                      <Hammer className="w-5 h-5 text-emerald-400" />
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
                      className="text-xs font-bold underline hover:opacity-75 transition-opacity"
                    >
                      <span>معاينة المتجر التجريبي</span>
                    </button>
                  </div>

                  <button
                    onClick={() => triggerTransition('mess')}
                    className="text-xs font-bold underline underline-offset-4 hover:opacity-70 transition-opacity"
                  >
                    ↺ رجوع لمشهد الفوضى للمقارنة
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
