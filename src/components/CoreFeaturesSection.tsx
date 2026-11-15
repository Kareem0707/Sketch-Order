import React, { useState } from 'react';
import {
  ShieldCheck,
  Headphones,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Maximize2,
  X,
  ArrowLeft,
  Award,
} from 'lucide-react';
import { playClick, playPaperFlip } from '../utils/soundEffects';

interface CoreFeaturesSectionProps {
  onOpenOrderModal: () => void;
  onOpenStudio: () => void;
  className?: string;
}

export const CoreFeaturesSection: React.FC<CoreFeaturesSectionProps> = ({
  onOpenOrderModal,
  onOpenStudio: _onOpenStudio,
  className = '',
}) => {
  const [selectedImageModal, setSelectedImageModal] = useState<{
    src: string;
    title: string;
    badge: string;
    description: string;
  } | null>(null);

  const features = [
    {
      id: 'buy-once',
      title: 'اشتري مرة واحدة وامتلكه للأبد',
      titleEn: 'BUY ONCE, OWN FOREVER',
      badge: '0% عمولات • بدون اشتراكات',
      tagColor: 'bg-emerald-500 text-white dark:bg-emerald-600',
      image: '/assets/features/buy-once-own-forever.jpg',
      points: [
        'ملكية كاملة 100% للمتجر والدومين وقاعدة البيانات.',
        'بدون أي اشتراكات أو تجديدات شهرية مستنزفة.',
        '0% عمولات على مبيعاتك - كل قرش تكسبه ملكك.',
      ],
      icon: ShoppingBag,
      footerNote: 'وفر أكثر من 18,000 ج.م سنوياً مقارنة بالمنصات الأخرى',
    },
    {
      id: 'support-24-7',
      title: 'دعم فني واستشارات سريعة 24/7',
      titleEn: '24/7 DEDICATED SUPPORT',
      badge: 'متصل 24 ساعة في مصر',
      tagColor: 'bg-[#D9722B] text-white dark:bg-[#D9722B]',
      image: '/assets/features/support-24-7.jpg',
      points: [
        'فريق دعم مصري متاح 24 ساعة عبر الواتساب والمكالمات.',
        'مساعدة خطوة بخطوة في رفع المنتجات وضبط الأسعار.',
        'ربط فودافون كاش وإنستاباي وضبط أسعار الشحن.',
      ],
      icon: Headphones,
      footerNote: 'دعم مباشر برقم واتساب وتواصل فوري مع مهندسي النظام',
    },
    {
      id: 'lifetime-warranty',
      title: 'ضمان شامل مدى الحياة',
      titleEn: 'LIFETIME WARRANTY & PEACE OF MIND',
      badge: 'معتمد وموثق 100% راحة بال',
      tagColor: 'bg-blue-600 text-white dark:bg-blue-600',
      image: '/assets/features/lifetime-warranty.jpg',
      points: [
        'ضمان فني شامل ضد أي أعطال أو توقف في السيرفرات.',
        'تحديثات دورية مجانية وتطويرات أمنية مستمرة.',
        'حماية قصوى 256-bit SSL ونسخ احتياطي يومي.',
      ],
      icon: ShieldCheck,
      footerNote: 'أمان كامل واستقرار يضمن تشغيل متجرك بدون أي توقف',
    },
  ];

  return (
    <section id="core-features" className={`py-8 sm:py-12 select-none ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-[#0F0F0F] dark:border-slate-700 bg-white dark:bg-[#151D2A] text-xs font-mono font-black -rotate-1 sketch-shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D9722B]" />
            <span>مميزات سكتش أوردر الحصرية</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight text-[#0F0F0F] dark:text-white">
            المميزات الثلاثة اللي بتخليك{' '}
            <span className="text-[#D9722B] dark:text-[#E88B4D] relative inline-block">
              تبيع وأنت مطمئن
            </span>
          </h2>

          <p className="text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-300 leading-relaxed">
            صممنا النظام مخصوص للتجار عشان تنهي استنزاف الاشتراكات الشهرية وتضمن استقرار متجرك للأبد.
          </p>
        </div>

        {/* 3 Compact Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className={`rounded-2xl md:rounded-3xl border-3 border-[#0F0F0F] dark:border-slate-600 bg-white dark:bg-[#111827] overflow-hidden sketch-shadow transition-transform hover:-translate-y-1.5 flex flex-col justify-between ${
                  idx === 0 ? 'sketch-border-1' : idx === 1 ? 'sketch-border-2' : 'sketch-border-3'
                }`}
              >
                {/* Card Top Artwork (Compact Height Image) */}
                <div className="relative group bg-neutral-100 dark:bg-slate-800/80 border-b-2 sm:border-b-3 border-[#0F0F0F] dark:border-slate-700 h-36 sm:h-40 md:h-44 overflow-hidden cursor-pointer">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    onClick={() => {
                      playPaperFlip();
                      setSelectedImageModal({
                        src: feature.image,
                        title: feature.title,
                        badge: feature.badge,
                        description: feature.titleEn,
                      });
                    }}
                  />
                  
                  {/* Floating Badge on Image */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full shadow-sm ${feature.tagColor}`}>
                      {feature.badge}
                    </span>
                  </div>

                  {/* Zoom Preview Cue */}
                  <button
                    onClick={() => {
                      playPaperFlip();
                      setSelectedImageModal({
                        src: feature.image,
                        title: feature.title,
                        badge: feature.badge,
                        description: feature.titleEn,
                      });
                    }}
                    className="absolute bottom-2 left-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                    title="تكبير الرسم التوضيحي"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#D9722B]/15 text-[#D9722B] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-heading font-black text-base sm:text-lg text-[#0F0F0F] dark:text-white leading-tight">
                        {feature.title}
                      </h3>
                    </div>

                    {/* Bullet Points */}
                    <ul className="space-y-1.5 pt-1">
                      {feature.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 leading-snug">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Bottom Note & CTA */}
                  <div className="pt-3 border-t-2 border-dashed border-[#0F0F0F]/15 dark:border-slate-700/80 space-y-2">
                    <div className="text-[10px] font-mono font-bold text-[#D9722B] dark:text-[#E88B4D] bg-[#D9722B]/10 p-1.5 rounded-lg border border-[#D9722B]/20 text-center truncate">
                      ✓ {feature.footerNote}
                    </div>

                    <button
                      onClick={() => {
                        playClick();
                        onOpenOrderModal();
                      }}
                      className="w-full btn-sketch btn-sketch-primary text-xs py-2 px-3 shadow-xs hover:scale-[1.02] transition-transform flex items-center justify-center gap-1.5 font-heading font-black"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>احجز متجرك بهذه الميزة</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Trust Guarantee Strip */}
        <div className="rounded-2xl border-2 border-[#0F0F0F] dark:border-slate-700 bg-neutral-50 dark:bg-slate-900 p-3.5 sm:p-4 sketch-shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-right">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm -rotate-2">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-black text-sm text-[#0F0F0F] dark:text-white">
                عقد موثق وضمان استرداد كامل خلال 14 يوماً
              </h4>
              <p className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                لو النظام مش مناسب لاحتياجاتك، بنرجعلك فلوسك كاملة بدون أي تعقيدات.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              onOpenOrderModal();
            }}
            className="btn-sketch text-xs py-1.5 px-4 bg-white dark:bg-slate-800 text-[#0F0F0F] dark:text-white border-2 border-[#0F0F0F] dark:border-slate-600 flex items-center gap-1 font-heading font-black shrink-0"
          >
            <span>طلب المتجر بالعقد والضمان</span>
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          </button>
        </div>

      </div>

      {/* ======================================================== */}
      {/* IMAGE ENLARGEMENT MODAL                                  */}
      {/* ======================================================== */}
      {selectedImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-w-2xl w-full bg-white dark:bg-[#111827] rounded-3xl border-3 border-[#0F0F0F] dark:border-slate-700 p-5 sketch-shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-slate-700 pb-3">
              <div>
                <h3 className="font-heading font-black text-lg text-[#0F0F0F] dark:text-white">
                  {selectedImageModal.title}
                </h3>
                <span className="text-xs font-mono text-zinc-400">{selectedImageModal.description}</span>
              </div>
              <button
                onClick={() => setSelectedImageModal(null)}
                className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-slate-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border-2 border-zinc-200 dark:border-slate-700 aspect-4/3 bg-neutral-100">
              <img
                src={selectedImageModal.src}
                alt={selectedImageModal.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-[#D9722B]/20 text-[#D9722B]">
                {selectedImageModal.badge}
              </span>
              <button
                onClick={() => {
                  setSelectedImageModal(null);
                  onOpenOrderModal();
                }}
                className="btn-sketch btn-sketch-primary text-xs py-2 px-5 font-heading font-black"
              >
                <span>احجز متجرك الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
