import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { BlueprintFormData, CustomStoreConfig } from '../types';
import { playStampSlam, playClick } from '../utils/soundEffects';
import logoImg from '../assets/sketch-order-logo.png';
import mascotImg from '../assets/sketch-mascot.png';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedFeatures?: string[];
  initialStoreConfig?: CustomStoreConfig | null;
  initialPlan?: 'standard' | 'pro' | 'custom';
}

const PLAN_INFO = {
  standard: {
    name: 'الباقة الاقتصادية',
    price: 1250,
    priceDisplay: '1,250 ج.م',
    badge: 'استقبال أوردرات + داتابيز (حد أقصى 4 أقسام)',
  },
  pro: {
    name: 'باقة المحترفين والنمو',
    price: 2400,
    priceDisplay: '2,400 ج.م',
    badge: 'أقسام لا نهائية + سيستم ذكي للأرباح والمبيعات ⭐',
  },
  custom: {
    name: 'الباقة المخصصة 3D',
    price: 'custom',
    priceDisplay: 'سعر مخصص حسب المطلوب',
    badge: 'تصميم واجهة مخصصة بالكامل + عناصر ثلاثية الأبعاد 🚀',
  },
};

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  preselectedFeatures = [],
  initialStoreConfig = null,
  initialPlan = 'pro',
}) => {
  const [formData, setFormData] = useState<BlueprintFormData>({
    fullName: '',
    storeName: initialStoreConfig ? initialStoreConfig.storeName : '',
    storeType: initialStoreConfig
      ? initialStoreConfig.niche === 'sneakers'
        ? 'كوتشيات وسنيكرز رياضية'
        : initialStoreConfig.niche === 'coffee'
        ? 'قهوة ومحمصة'
        : 'مطاعم وأكل'
      : 'كوتشيات وموضة كاجوال',
    whatsapp: initialStoreConfig ? initialStoreConfig.whatsappNumber : '',
    governorate: initialStoreConfig ? initialStoreConfig.governorate : 'القاهرة والجيزة',
    paymentMethod: 'إنستاباي (InstaPay)',
    selectedPlan: initialPlan,
    notes: initialStoreConfig
      ? `تيمبليت: ${initialStoreConfig.templateId} بدومين: ${initialStoreConfig.customDomain}`
      : '',
    selectedFeatures: preselectedFeatures,
    customStoreConfig: initialStoreConfig || undefined,
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [stampDate, setStampDate] = useState<string>('');

  useEffect(() => {
    if (initialStoreConfig) {
      setFormData((prev) => ({
        ...prev,
        storeName: initialStoreConfig.storeName || prev.storeName,
        whatsapp: initialStoreConfig.whatsappNumber || prev.whatsapp,
        governorate: initialStoreConfig.governorate || prev.governorate,
        notes: `تيمبليت: ${initialStoreConfig.templateId} بدومين: ${initialStoreConfig.customDomain}`,
        customStoreConfig: initialStoreConfig,
      }));
    }
  }, [initialStoreConfig]);

  useEffect(() => {
    if (initialPlan) {
      setFormData((prev) => ({ ...prev, selectedPlan: initialPlan }));
    }
  }, [initialPlan]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playStampSlam();

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0F0F0F', '#10B981', '#4F46E5', '#F59E0B'],
      shapes: ['square', 'circle'],
    });

    setStampDate(new Date().toLocaleDateString('ar-EG'));
    setIsSubmitted(true);
  };

  const currentPlan = PLAN_INFO[formData.selectedPlan];

  const handleSendToWhatsApp = () => {
    playClick();
    const domainPart = initialStoreConfig ? `\n- الدومين المطلوب: ${initialStoreConfig.customDomain}` : '';
    const templatePart = initialStoreConfig ? `\n- التيمبليت المختار: ${initialStoreConfig.templateId}` : '';
    const message = `أهلاً فريق سكتش أوردر! 🇪🇬✏️
أنا جاهز لامتلاك متجري الإلكتروني بالكامل:
- الباقة المختارة: ${currentPlan.name} (${currentPlan.priceDisplay})
- الاسم: ${formData.fullName}
- اسم المتجر: ${formData.storeName}
- النشاط: ${formData.storeType}
- المحافظة: ${formData.governorate}
- طريقة الدفع المفضلة: ${formData.paymentMethod}${domainPart}${templatePart}
- رقم الواتساب: ${formData.whatsapp}
- ملاحظات: ${formData.notes || 'لا يوجد'}

عايز أستلم متجري والدومين المستقل في خلال دقايق!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/201000000000?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs overflow-y-auto">
      <div className="relative max-w-xl w-full my-8 bg-white border-3 md:border-4 border-[#0F0F0F] sketch-border-1 p-5 sm:p-7 sketch-shadow-xl paper-pattern max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute top-4 left-4 p-2 border-2 border-[#0F0F0F] sketch-border-circle bg-white hover:bg-neutral-100 sketch-shadow-sm"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Logo & Mascot */}
        <div className="text-center border-b-2 border-[#0F0F0F] pb-4 mb-5">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src={mascotImg} alt="سكتش مان" className="w-10 h-10 object-contain rounded-full border border-[#0F0F0F]" />
            <img src={logoImg} alt="SKETCH ORDER" className="h-7 object-contain" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-heading text-[#0F0F0F]">
            امتلك موقعك بدومينك الخاص
          </h2>

          {/* 3 Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>الدفع مرة واحدة</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-indigo-800">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>الضمان مدى الحياة</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-orange-800">
              <Zap className="w-3.5 h-3.5 text-orange-500" />
              <span>تسليم في خلال دقايق</span>
            </span>
          </div>

          {initialStoreConfig && (
            <div className="mt-3 p-2 border border-dashed border-[#0F0F0F] sketch-border-tag bg-emerald-50 text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>تم اختيار متجر "{initialStoreConfig.storeName}" بنجاح من الاستوديو</span>
            </div>
          )}
        </div>

        {/* VIEW 1: THE INPUT FORM */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-right">
            
            {/* Plan Selector */}
            <div>
              <label className="block text-xs font-black mb-1.5 text-[#0F0F0F]">
                اختر الباقة المطلوبة:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(['standard', 'pro', 'custom'] as const).map((planKey) => {
                  const plan = PLAN_INFO[planKey];
                  const isSelected = formData.selectedPlan === planKey;
                  return (
                    <button
                      key={planKey}
                      type="button"
                      onClick={() => {
                        playClick();
                        setFormData({ ...formData, selectedPlan: planKey });
                      }}
                      className={`p-2.5 text-right border-2 border-[#0F0F0F] sketch-border-tag transition-all ${
                        isSelected
                          ? 'bg-[#0F0F0F] text-white sketch-shadow-sm -translate-y-0.5'
                          : 'bg-white hover:bg-neutral-50 text-[#0F0F0F]'
                      }`}
                    >
                      <div className="text-xs font-black">{plan.name}</div>
                      <div className="text-sm font-black mt-1">
                        {plan.priceDisplay}
                      </div>
                      <div className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-[#0F0F0F]/60'}`}>
                        {planKey === 'standard' ? '4 أقسام فقط' : planKey === 'pro' ? 'أقسام + سيستم الأرباح' : 'حسب المطلوب (مش ثابت)'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-black mb-1">
                الاسم الكريم / صاحب المتجر *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: أحمد عبد الرحمن"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2.5 text-sm font-bold border-2 border-[#0F0F0F] sketch-border-2 bg-white focus:outline-hidden"
              />
            </div>

            {/* Store Name & Niche */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black mb-1">
                  اسم المتجر أو البراند *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: سبورتك، فاسكو ستريت، برجر كلوب..."
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full p-2.5 text-sm font-bold border-2 border-[#0F0F0F] sketch-border-3 bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black mb-1">
                  مجال النشاط
                </label>
                <select
                  value={formData.storeType}
                  onChange={(e) => setFormData({ ...formData, storeType: e.target.value })}
                  className="w-full p-2.5 text-sm font-bold border-2 border-[#0F0F0F] sketch-border-2 bg-white focus:outline-hidden"
                >
                  <option value="كوتشيات وسنيكرز ومستلزمات رياضية">كوتشيات وسنيكرز ومستلزمات رياضية</option>
                  <option value="ملابس وستريت وير وأوفر سايز">ملابس وستريت وير وأوفر سايز</option>
                  <option value="مطاعم ومأكولات سريعة وحجز طاولات">مطاعم ومأكولات سريعة وحجز طاولات</option>
                  <option value="عطور ومجوهرات ومستحضرات تجميل">عطور ومجوهرات ومستحضرات تجميل</option>
                  <option value="أثاث وديكور منزلي">أثاث وديكور منزلي</option>
                  <option value="أخرى">أخرى (سأوضحها في الملاحظات)</option>
                </select>
              </div>
            </div>

            {/* Phone & Governorate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black mb-1">
                  رقم الواتساب للتواصل وتفعيل المتجر *
                </label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="010XXXXXXXX or 011/012/015"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full p-2.5 text-sm font-bold font-mono border-2 border-[#0F0F0F] sketch-border-1 bg-white text-right focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black mb-1">
                  المحافظة الرئيسية
                </label>
                <select
                  value={formData.governorate}
                  onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                  className="w-full p-2.5 text-sm font-bold border-2 border-[#0F0F0F] sketch-border-2 bg-white focus:outline-hidden"
                >
                  <option value="القاهرة">القاهرة</option>
                  <option value="الجيزة">الجيزة</option>
                  <option value="الإسكندرية">الإسكندرية</option>
                  <option value="القليوبية والدلتا">القليوبية والدلتا</option>
                  <option value="المنصورة والشرقية">المنصورة والشرقية</option>
                  <option value="مدن القناة والبحر الأحمر">مدن القناة والبحر الأحمر</option>
                  <option value="محافظات الصعيد">محافظات الصعيد</option>
                </select>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-black mb-1">
                طريقة الدفع والتملك المفضلة لديك:
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full p-2.5 text-sm font-bold border-2 border-[#0F0F0F] sketch-border-2 bg-white focus:outline-hidden"
              >
                <option value="إنستاباي (InstaPay)">إنستاباي (InstaPay) - تحويل لحظي فوري</option>
                <option value="محفظة فودافون كاش">محفظة فودافون كاش / أورنج كاش / اتصالات كاش</option>
                <option value="كروت بنكية وفيزا وميزة">بطاقة بنكية / فيزا / ميزة (دفع إلكتروني آمن)</option>
                <option value="كود فوري">كود فوري (الدفع في أي كشك أو سوبرماركت)</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-black mb-1">
                ملاحظات أو رغبات خاصة لمتجرك
              </label>
              <textarea
                rows={2}
                placeholder="مثال: محتاج دومين باسم mybrand.com ومعايا 15 منتج جاهزين للرفع..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2 text-xs font-bold border-2 border-[#0F0F0F] sketch-border-2 bg-white focus:outline-hidden resize-none"
              ></textarea>
            </div>

            {/* Price Summary Box */}
            <div className="p-3 border-2 border-[#0F0F0F] bg-[#FAF9F6] sketch-border-1 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#0F0F0F]/70">المطلوب دفعه:</span>
                <div className="text-xl font-black font-heading text-[#0F0F0F]">
                  {currentPlan.priceDisplay}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                  دفع مرة واحدة • ملكك مدى الحياة
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="btn-sketch btn-sketch-primary w-full text-base py-3.5 -rotate-1 font-heading"
              >
                <Send className="w-4 h-4" />
                <span>اعتماد طلب المتجر والتسليم في خلال دقايق</span>
              </button>
            </div>

            <div className="text-[11px] text-center text-[#0F0F0F]/70 pt-1 font-bold">
              * الدفع بعد المعاينة والتأكد من كل التفاصيل • سرعة التواصل عبر الدعم الفني
            </div>

          </form>
        ) : (
          /* VIEW 2: SUCCESS WITH APPROVED RUBBER STAMP */
          <div className="text-center py-4 space-y-6">
            
            <div className="inline-block border-4 border-[#0F0F0F] p-4 sm:p-6 sketch-border-2 bg-white animate-stamp sketch-shadow-lg rotate-[-3deg]">
              <div className="flex items-center justify-center gap-2 mb-2 border-b-2 border-[#0F0F0F] pb-1">
                <img src={mascotImg} alt="سكتش مان" className="w-6 h-6 rounded-full" />
                <span className="text-sm font-black">سكتش أوردر • اعتماد رسمي</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black font-heading text-[#0F0F0F] tracking-tight">
                معتمد للتسليم في دقائق ✓
              </div>
              <div className="text-xs font-bold mt-2 text-[#0F0F0F]/80">
                التاريخ: {stampDate} • الباقة: {currentPlan.name} • {currentPlan.priceDisplay}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black font-heading">
                ألف مبروك يا {formData.fullName}! تم استلام طلبك بنجاح
              </h3>
              <p className="text-sm font-bold text-[#0F0F0F]/80 max-w-md mx-auto leading-relaxed">
                مهندس سكتش بيجهز حالياً ملفات ودومين متجر "{formData.storeName}" لتسليمه لك في خلال دقايق بدون أي اشتراكات دورية.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleSendToWhatsApp}
                className="btn-sketch btn-sketch-primary w-full sm:w-auto text-sm py-3 px-6 -rotate-1"
              >
                <span>متابعة فورية عبر الواتساب</span>
                <Send className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="btn-sketch w-full sm:w-auto text-sm py-3 px-6 rotate-1"
              >
                إغلاق والرجوع للموقع
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
