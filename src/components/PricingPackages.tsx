import React from 'react';
import { Database, BarChart3, Box, ArrowLeft, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import type { PricingPlan } from '../types';
import { playClick } from '../utils/soundEffects';

interface PricingPackagesProps {
  onSelectPlan: (planId: 'standard' | 'pro' | 'custom') => void;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'standard',
    name: 'الباقة الاقتصادية',
    nameEn: 'Economy Store',
    price: 1250,
    priceDisplay: '1,250 ج.م',
    description: 'مناسبة للمشاريع الناشئة والبدايات البسيطة اللي محتاجة متجر سريع ومنظم لاستقبال الأوردرات بدون تعقيد.',
    features: [
      'استقبال وتنظيم الأوردرات أوتوماتيك على الواتساب',
      'قاعدة بيانات سريعة (Database) لحفظ بيانات الزباين والطلبات',
      'لوحة تحكم سهلة لإضافة وتعديل المنتجات والأسعار',
      'إمكانية إضافة حتى 4 أقسام/تصنيفات فقط',
      'دومين خاص (.store أو .shop) مجاناً',
      'الدفع مرة واحدة فقط والضمان مدى الحياة',
      'تسليم وتفعيل المتجر في خلال دقايق معدودة',
    ],
    limitations: 'حد أقصى 4 أقسام داخل المتجر',
  },
  {
    id: 'pro',
    name: 'باقة المحترفين والنمو',
    nameEn: 'Growth & Analytics Pro',
    price: 2400,
    priceDisplay: '2,400 ج.م',
    isPopular: true,
    badge: 'الأكثر طلباً واختياراً ⭐',
    description: 'الحل الشامل لبراندات الملابس، الكوتشيات، والمطاعم اللي محتاجة سيستم إدارة متكامل وتحليل أرباح احترافي.',
    features: [
      'عدد لا نهائي من إضافة الأقسام والمنتجات والصور بدون أي حدود',
      'سيستم ذكي متكامل لتحليل المبيعات وصافي الأرباح (Analytics Dashboard)',
      'تقارير إجمالي الأرباح، التكاليف، وحساب صافي الربح الحقيقي',
      'معرفة أكثر المنتجات مبيعاً وأوقات الذروة في الأوردرات',
      'ربط الدفع الإلكتروني: إنستاباي، فودافون كاش، وكروت ميزة وفيزا',
      'تحديد مقاسات وألوان ديناميكية مع فحص فوري للمخزون',
      'الدفع مرة واحدة فقط والضمان مدى الحياة لمتجرك',
      'سرعة فائقة في التواصل مع الدعم الفني المباشر',
      'تسليم وتفعيل المتجر في خلال دقايق',
    ],
  },
  {
    id: 'custom',
    name: 'الباقة المخصصة (Custom 3D)',
    nameEn: 'VIP Custom Experience',
    price: 'custom',
    priceDisplay: 'سعر مخصص حسب المطلوب',
    badge: 'واجهة خاصة بالكامل 🚀',
    description: 'تصميم واجهة حصرية لعلامتك التجارية من الصفر مع عناصر 3D تفاعلية وأنيميشن (السعر يختلف على حسب المطلوب ومتطلبات براندك).',
    features: [
      'كل مميزات باقة الـ Pro (أقسام لا نهائية + سيستم الأرباح والداتا)',
      'تصميم واجهة مخصصة بالكامل (Custom UI/UX) مش مجرد تيمبليت جاهز',
      'عناصر ثلاثية الأبعاد تفاعلية (3D Interactive Models) للمنتجات',
      'إمكانية دوران المنتج 360 درجة وتفاعل حركي فائق السلاسة',
      'أنيميشن سينمائي مخصص ومؤثرات صوتية فريدة لشخصية براندك',
      'ربط مباشر مع شركات الشحن المصرية (بوالص شحن بنقرة واحدة)',
      'أولوية دعم فني VIP وتحديثات مستمرة لمتجرك',
      'الضمان مدى الحياة وتواصل فوري ومباشر مع الدعم',
    ],
  },
];

export const PricingPackages: React.FC<PricingPackagesProps> = ({ onSelectPlan }) => {
  return (
    <section id="pricing-plans" className="py-16 bg-white border-t-2 border-[#0F0F0F] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          
          {/* Guarantees Tag */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 px-4 py-1.5 border-2 border-[#0F0F0F] sketch-border-pill text-xs font-black mb-4 bg-[#FAF9F6] -rotate-1">
            <span className="flex items-center gap-1 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>دفع مرة واحدة فقط</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-indigo-800">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>الضمان مدى الحياة</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-orange-800">
              <Zap className="w-3.5 h-3.5 text-orange-500" />
              <span>سرعة التواصل مع الدعم</span>
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-heading text-[#0F0F0F] tracking-tight mb-4">
            3 باقات عملية واضحة.. اختار اللي يناسب حجم شغلك
          </h2>

          <p className="text-base sm:text-lg font-bold text-[#0F0F0F]/80">
            دفع مرة واحدة فقط وبدون أي اشتراكات شهرية أو نسب مقتطعة من مبيعاتك. متجرك بيكون ملكك 100% ويتم تسليمه في خلال دقايق.
          </p>
        </div>

        {/* 3 Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const isPro = plan.id === 'pro';
            const isCustom = plan.id === 'custom';

            return (
              <div
                key={plan.id}
                className={`relative border-3 p-6 sm:p-7 flex flex-col justify-between transition-all ${
                  isPro
                    ? 'border-[#0F0F0F] bg-white sketch-border-1 sketch-shadow-xl scale-100 lg:-translate-y-2 ring-2 ring-[#0F0F0F]'
                    : isCustom
                    ? 'border-[#0F0F0F] bg-[#FAF9F6] sketch-border-2 sketch-shadow-lg'
                    : 'border-[#0F0F0F]/70 bg-white sketch-border-3 sketch-shadow-sm hover:border-[#0F0F0F]'
                }`}
              >
                {/* Popular / VIP Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 right-6 bg-[#0F0F0F] text-white text-xs font-black px-3 py-1 sketch-border-pill -rotate-2 shadow-xs">
                    {plan.badge}
                  </div>
                )}

                <div>
                  {/* Plan Title & En label */}
                  <div className="border-b-2 border-[#0F0F0F] pb-4 mb-4">
                    <div className="text-xs font-mono font-bold text-[#0F0F0F]/60">
                      {plan.nameEn}
                    </div>
                    <h3 className="text-2xl font-black font-heading text-[#0F0F0F] mt-0.5">
                      {plan.name}
                    </h3>

                    {/* Price in EGP */}
                    <div className="mt-3 flex items-baseline gap-1">
                      {typeof plan.price === 'number' ? (
                        <>
                          <span className="text-4xl font-black font-mono tracking-tight text-[#0F0F0F]">
                            {plan.price.toLocaleString()}
                          </span>
                          <span className="text-sm font-bold text-[#0F0F0F]/80">
                            ج.م <span className="text-xs text-[#0F0F0F]/60">(دفع مرة واحدة)</span>
                          </span>
                        </>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="text-2xl font-black font-heading text-indigo-700">
                            سعر مخصص حسب المطلوب
                          </span>
                          <span className="block text-[11px] font-bold text-[#0F0F0F]/65">
                            (السعر بيختلف على حسب المتطلبات والـ 3D)
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs font-bold text-[#0F0F0F]/75 mt-2 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Feature Icons Highlights */}
                  <div className="py-2 mb-3 grid grid-cols-2 gap-2 text-[11px] font-bold text-[#0F0F0F]/80">
                    <div className="flex items-center gap-1.5 p-1.5 border border-dashed border-[#0F0F0F] sketch-border-tag">
                      <Database className="w-3.5 h-3.5" />
                      <span>داتابيز للطلبات</span>
                    </div>

                    <div className="flex items-center gap-1.5 p-1.5 border border-dashed border-[#0F0F0F] sketch-border-tag">
                      {isCustom ? (
                        <>
                          <Box className="w-3.5 h-3.5 text-indigo-600" />
                          <span>3D تفاعلي مخصص</span>
                        </>
                      ) : (
                        <>
                          <BarChart3 className="w-3.5 h-3.5" />
                          <span>{isPro ? 'سيستم الأرباح' : 'لوحة تحكم'}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2.5 my-4 text-xs font-bold text-[#0F0F0F]/90">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full border border-[#0F0F0F] bg-[#0F0F0F] text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                          ✓
                        </span>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Limitation warning if any */}
                  {plan.limitations && (
                    <div className="p-2 border border-[#0F0F0F] bg-neutral-100 sketch-border-tag text-[11px] font-bold text-[#0F0F0F]/70 text-center my-2">
                      ملاحظة: {plan.limitations}
                    </div>
                  )}
                </div>

                {/* Plan Action CTA Button */}
                <div className="pt-4 border-t-2 border-[#0F0F0F] mt-4">
                  <button
                    onClick={() => {
                      playClick();
                      onSelectPlan(plan.id);
                    }}
                    className={`btn-sketch w-full py-3 text-sm font-heading ${
                      isPro
                        ? 'btn-sketch-primary -rotate-1'
                        : isCustom
                        ? 'bg-[#0F0F0F] text-white rotate-1 hover:bg-neutral-800'
                        : 'bg-white hover:bg-neutral-100'
                    }`}
                  >
                    <span>اختر هذه الباقة واستلم في دقايق</span>
                    <ArrowLeft className="w-4 h-4 mr-auto" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Ownership Guarantee Callout */}
        <div className="mt-12 p-4 sm:p-6 border-2 border-dashed border-[#0F0F0F] sketch-border-1 bg-[#FAF9F6] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 border-2 border-[#0F0F0F] sketch-border-circle flex items-center justify-center font-black text-xl bg-white shrink-0">
              🛡️
            </div>
            <div>
              <h4 className="text-base font-black font-heading">
                ضمان الملكية الكاملة مدى الحياة • تواصل فوري مع الدعم
              </h4>
              <p className="text-xs font-bold text-[#0F0F0F]/75 mt-0.5">
                كل الباقات تشمل تسليم المتجر والدومين في خلال دقايق بدون أي اشتراك شهري، وأرباحك كلها لك بدون أي نسب مبيعات.
              </p>
            </div>
          </div>

          <div className="text-xs font-bold bg-white border border-[#0F0F0F] px-4 py-2 sketch-border-pill shrink-0">
            طرق الدفع في مصر: إنستاباي • فودافون كاش • فيزا • فوري
          </div>
        </div>

      </div>
    </section>
  );
};
