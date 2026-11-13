import React, { useState, useRef, useCallback } from 'react';
import { ShoppingCart, Check, ArrowLeftRight } from 'lucide-react';
import { HandDrawnDivider } from './common/HandDrawnDivider';
import { playPencilScratch, playClick } from '../utils/soundEffects';

export const SplitSimulator: React.FC = () => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  const handlePointerDown = () => {
    isDragging.current = true;
    playPencilScratch();
  };

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const offset = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (offset / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const setPreset = (val: number) => {
    playClick();
    playPencilScratch();
    setSliderPos(val);
  };

  return (
    <section id="split-simulator" className="py-16 paper-ruled relative overflow-hidden select-none dark:bg-[#0B0F17] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Explanation */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-block border-2 border-[#0F0F0F] dark:border-slate-700 bg-white dark:bg-[#151D2A] text-[#0F0F0F] dark:text-slate-100 px-3 py-1 sketch-border-tag text-xs font-black -rotate-2 mb-3 sketch-shadow-sm">
            ✂️ محاكي الورقة المقسومة • اسحب القلم للمقارنة الحية (Before & After)
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight mb-4 text-[#0F0F0F] dark:text-white">
            امسح فوضى الشات القديمة بجرّة قلم واحدة!
          </h2>

          <p className="text-base sm:text-lg font-bold text-[#0F0F0F]/80 dark:text-slate-300">
            اسحب الخط الفاصل يمين وشمال وشوف الفرق الكبير بين طريقة البيع اليدوية القديمة على الواتس وإنستجرام، وبين متجر سكتش أوردر السريع.
          </p>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPreset(15)}
              className={`px-3 py-1.5 text-xs font-black border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-pill transition-all ${
                sliderPos < 25
                  ? 'bg-[#0F0F0F] text-white dark:bg-orange-500 dark:text-slate-950'
                  : 'bg-white dark:bg-[#151D2A] text-[#0F0F0F] dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-800'
              }`}
            >
              قبل سيستم الويبسايت (فوضى الشات)
            </button>
            <button
              onClick={() => setPreset(50)}
              className={`px-3 py-1.5 text-xs font-black border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-pill transition-all ${
                sliderPos >= 25 && sliderPos <= 75
                  ? 'bg-[#0F0F0F] text-white dark:bg-orange-500 dark:text-slate-950'
                  : 'bg-white dark:bg-[#151D2A] text-[#0F0F0F] dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-800'
              }`}
            >
              مقارنة النص بالنص (Before vs After)
            </button>
            <button
              onClick={() => setPreset(85)}
              className={`px-3 py-1.5 text-xs font-black border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-pill transition-all ${
                sliderPos > 75
                  ? 'bg-[#0F0F0F] text-white dark:bg-orange-500 dark:text-slate-950'
                  : 'bg-white dark:bg-[#151D2A] text-[#0F0F0F] dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-800'
              }`}
            >
              بعد سيستم الويبسايت (المتجر السريع)
            </button>
          </div>
        </div>

        {/* The Split Canvas Frame */}
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative max-w-5xl mx-auto h-[660px] sm:h-[540px] border-3 md:border-4 border-[#0F0F0F] dark:border-slate-600 sketch-border-1 bg-white dark:bg-[#111827] sketch-shadow-xl overflow-hidden cursor-ew-resize"
        >
          {/* LAYER 1: RIGHT SIDE (BEFORE - الطريقة التقليدية) */}
          <div className="absolute inset-0 p-3.5 sm:p-8 bg-[#FAF9F6] dark:bg-[#151D2A] text-[#0F0F0F] dark:text-slate-200 flex flex-col justify-between overflow-hidden">
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between border-b-2 border-dashed border-[#0F0F0F] dark:border-slate-700 pb-2 sm:pb-3 gap-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-[#0F0F0F] dark:border-red-500 rounded-full flex items-center justify-center font-bold text-xs bg-white dark:bg-slate-900 text-red-600">
                  ❌
                </span>
                <span className="text-sm sm:text-lg font-black font-heading text-[#0F0F0F] dark:text-white">
                  قبل سيستم الويبسايت (فوضى الشات)
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-mono font-bold line-through opacity-80 text-red-500">
                تضييع وقت 5 ساعات يومياً
              </span>
            </div>

            {/* Chaotic Desk Mockup Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto relative">
              {/* Crumpled Note 1: Manual Math Errors */}
              <div className="border-2 border-[#0F0F0F] dark:border-slate-700 p-4 sketch-border-2 bg-white dark:bg-[#1E293B] rotate-1 sketch-shadow-sm space-y-2">
                <div className="text-xs font-mono font-bold text-[#0F0F0F]/70 dark:text-slate-400 border-b border-[#0F0F0F] dark:border-slate-700 pb-1">
                  حسابات يدوية بدون سيستم (أخطاء ملخبطة)
                </div>
                <div className="text-sm font-bold space-y-1">
                  <div>2 كوتشي سنيكرز = <span className="line-through text-red-500">2200</span> 2450 ج.م؟</div>
                  <div>شحن للهرم وفيصل = <span className="line-through text-red-500">40</span> 60 ج.م</div>
                  <div className="text-xs border-t border-dashed border-[#0F0F0F] dark:border-slate-700 pt-1 font-mono text-red-500">
                    الإجمالي: <span className="line-through font-bold">2510</span> غلطة في الجمع! ❌
                  </div>
                </div>
              </div>

              {/* Crumpled Note 2: Lost WhatsApp Chat */}
              <div className="border-2 border-[#0F0F0F] dark:border-slate-700 p-4 sketch-border-3 bg-white dark:bg-[#1E293B] -rotate-2 sketch-shadow-sm space-y-2">
                <div className="text-xs font-mono font-bold text-[#0F0F0F]/70 dark:text-slate-400 border-b border-[#0F0F0F] dark:border-slate-700 pb-1">
                  رسايل معلقة وتأخير تأكيد الأوردر
                </div>
                <div className="text-xs space-y-1.5 font-bold">
                  <div className="p-1 border border-[#0F0F0F] dark:border-slate-700 sketch-border-tag bg-slate-50 dark:bg-slate-900/60">
                    💬 "يا باشا حولت الـ 1200 جنيه إنستاباي، اتأكد ورد عليا ضروري!"
                  </div>
                  <div className="p-1 border border-[#0F0F0F] dark:border-slate-700 sketch-border-tag bg-neutral-100 dark:bg-slate-900/60">
                    💬 "الكوتشي مقاس 43 طلع ضيق ومحدش نبهني بالجدول!"
                  </div>
                </div>
              </div>

              {/* Note 3 */}
              <div className="border-2 border-dashed border-[#0F0F0F] dark:border-amber-500/40 p-3 sketch-border-1 bg-white dark:bg-amber-500/10 text-[#0F0F0F] dark:text-amber-200 rotate-2 sm:col-span-2 text-center text-xs font-bold">
                ⚠️ أزمة المخزون: بيع مقاسات خلصانة من المخزن بسبب تأخير التحديث في الشات!
              </div>
            </div>

            {/* Bottom Status */}
            <div className="border-t-2 border-[#0F0F0F] dark:border-slate-700 pt-3 text-xs font-mono font-bold flex justify-between items-center text-[#0F0F0F]/80 dark:text-slate-400">
              <span>نسبة الإلغاء والمرتجع: 35% في الشحن</span>
              <span>تقييم الزباين: 📉 2.8 نجوم بسبب البطء</span>
            </div>
          </div>

          {/* LAYER 2: LEFT SIDE (AFTER - مع سكتش أوردر) */}
          <div
            className="absolute inset-y-0 left-0 bg-white dark:bg-[#111827] text-[#0F0F0F] dark:text-white p-3.5 sm:p-8 flex flex-col justify-between overflow-hidden border-r-3 border-[#0F0F0F] dark:border-orange-500"
            style={{ width: `${sliderPos}%` }}
          >
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between border-b-2 border-[#0F0F0F] dark:border-slate-700 pb-2 sm:pb-3 gap-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-[#0F0F0F] dark:border-emerald-500 rounded-full flex items-center justify-center font-bold text-xs bg-[#0F0F0F] dark:bg-emerald-500 text-white dark:text-slate-950">
                  ✓
                </span>
                <span className="text-sm sm:text-lg font-black font-heading whitespace-nowrap text-[#0F0F0F] dark:text-white">
                  بعد سيستم الويبسايت
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-mono font-bold bg-[#0F0F0F] dark:bg-orange-500 text-white dark:text-slate-950 px-2 py-0.5 sketch-border-pill">
                0 دقيقة وقت ضائع ⚡
              </span>
            </div>

            {/* Clean Wireframe Store Flow Mockup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-auto">
              {/* Feature 1 */}
              <div className="border-2 border-[#0F0F0F] dark:border-slate-700 p-4 sketch-border-1 bg-neutral-50 dark:bg-[#1E293B] sketch-shadow-sm space-y-2">
                <div className="flex items-center justify-between border-b border-[#0F0F0F] dark:border-slate-700 pb-1">
                  <span className="text-xs font-bold flex items-center gap-1 text-orange-500">
                    <ShoppingCart className="w-3.5 h-3.5" /> سلة واختيار مقاس فوري
                  </span>
                  <span className="text-xs font-mono font-bold text-orange-500">1,350 ج.م</span>
                </div>
                <p className="text-xs font-bold text-[#0F0F0F]/80 dark:text-slate-300">
                  الزبون بيختار المقاس (42، 43، 44) واللون بوضوح تام، وبدون ما يسأل ولا سؤال مكرر!
                </p>
                <div className="text-[10px] font-mono font-bold text-right border-t border-dashed border-[#0F0F0F] dark:border-slate-700 pt-1 text-emerald-500">
                  المخزون: بيقل تلقائياً مع كل أوردر ✓
                </div>
              </div>

              {/* Feature 2 */}
              <div className="border-2 border-[#0F0F0F] dark:border-slate-700 p-4 sketch-border-2 bg-white dark:bg-[#1E293B] sketch-shadow-sm space-y-2">
                <div className="flex items-center justify-between border-b border-[#0F0F0F] dark:border-slate-700 pb-1">
                  <span className="text-xs font-bold flex items-center gap-1 text-emerald-500">
                    <Check className="w-3.5 h-3.5" /> إشعار واتساب مفصص
                  </span>
                  <span className="text-[10px] bg-[#0F0F0F] dark:bg-slate-900 text-white px-1.5 py-0.5 sketch-border-pill font-mono border dark:border-slate-700">
                    أوردر #EG-920
                  </span>
                </div>
                <p className="text-xs font-bold text-[#0F0F0F]/80 dark:text-slate-300">
                  بيوصلك إشعار بالاسم، المحافظة، ورابط اللوكيشن وطريقة الدفع بضغطة زر!
                </p>
                <div className="text-[10px] font-mono font-bold border-t border-dashed border-[#0F0F0F] dark:border-slate-700 pt-1 text-emerald-400">
                  إيصال وفاتورة سكتش جاهزة للمندوب فوراً ✓
                </div>
              </div>

              {/* Feature 3 */}
              <div className="border-2 border-[#0F0F0F] dark:border-orange-500/50 p-3 sketch-border-3 bg-[#0F0F0F] dark:bg-orange-500 text-white dark:text-slate-950 sm:col-span-2 text-center text-xs font-bold flex items-center justify-center gap-2">
                <span>🎯 وفّر 25 ساعة أسبوعياً وركز في تسويق منتجاتك وتكبير شغلك</span>
              </div>
            </div>

            {/* Bottom Status */}
            <div className="border-t-2 border-[#0F0F0F] dark:border-slate-700 pt-3 text-xs font-mono font-bold flex justify-between items-center text-[#0F0F0F] dark:text-slate-300 min-w-[320px]">
              <span>نسبة الغلط في الأوردرات: 0% معدومة تماماً</span>
              <span>تقييم الزباين: 🌟 4.9/5 نجوم وسرعة قياسية</span>
            </div>
          </div>

          {/* DRAGGABLE SLIDER DIVIDER */}
          <div
            className="absolute inset-y-0 z-30 flex items-center justify-center pointer-events-auto"
            style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
            onPointerDown={handlePointerDown}
          >
            <div className="w-[3px] sm:w-[4px] h-full bg-[#0F0F0F] dark:bg-orange-500"></div>

            <div className="absolute top-1/2 -translate-y-1/2 w-11 h-11 border-2 border-[#0F0F0F] dark:border-white bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white sketch-border-circle flex items-center justify-center sketch-shadow cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
              <ArrowLeftRight className="w-5 h-5" />
            </div>

            <div className="absolute -top-1 bg-[#0F0F0F] dark:bg-orange-500 text-white dark:text-slate-950 text-[10px] font-mono font-bold px-2 py-0.5 sketch-border-pill -rotate-3 whitespace-nowrap">
              ✏️ اسحب القلم (قارن قبل وبعد)
            </div>
          </div>
        </div>

      </div>

      <HandDrawnDivider variant="pencil" height={14} className="mt-14 mb-0" />
    </section>
  );
};
