import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, ShieldCheck, Zap, Upload } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { BlueprintFormData, CustomStoreConfig, ClientOrderRequest } from '../types';
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
    badge: 'استقبال أوردرات + DataBase (حد أقصى 4 أقسام)',
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
  const [receiptBase64, setReceiptBase64] = useState<string | null>(null);
  const [desiredSubdomain, setDesiredSubdomain] = useState<string>('');
  const [generatedOrderId, setGeneratedOrderId] = useState<string>('');

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
      if (initialStoreConfig.customDomain) {
        setDesiredSubdomain(initialStoreConfig.customDomain.replace(/\..+$/, ''));
      }
    }
  }, [initialStoreConfig]);

  useEffect(() => {
    if (initialPlan) {
      setFormData((prev) => ({ ...prev, selectedPlan: initialPlan }));
    }
  }, [initialPlan]);

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptBase64(reader.result as string);
        playClick();
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const currentPlan = PLAN_INFO[formData.selectedPlan];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playStampSlam();

    const orderId = `SK-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedOrderId(orderId);

    // Build subDomain name
    const cleanSubdomain = desiredSubdomain.trim()
      ? `${desiredSubdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')}.sketchorder.com`
      : `${formData.storeName.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'mybrand'}.sketchorder.com`;

    // Save order in localStorage so it appears in the Owner Admin Dashboard
    const newOrder: ClientOrderRequest = {
      id: orderId,
      createdAt: new Date().toLocaleString('ar-EG'),
      clientName: formData.fullName,
      whatsappNumber: formData.whatsapp,
      brandName: formData.storeName,
      subdomain: cleanSubdomain,
      selectedPlan: formData.selectedPlan,
      planName: currentPlan.name,
      amount: currentPlan.price,
      templateId: initialStoreConfig ? initialStoreConfig.templateId : 'sportech-sneakers',
      templateName: initialStoreConfig ? initialStoreConfig.storeName : 'سبورتك الرياضي',
      paymentMethod: formData.paymentMethod.includes('إنستاباي')
        ? 'instapay'
        : formData.paymentMethod.includes('فودافون')
        ? 'vodafone_cash'
        : 'card',
      receiptImageUrl: receiptBase64 || undefined,
      notes: formData.notes,
      status: 'pending_review',
    };

    try {
      const existing = localStorage.getItem('sketch_order_client_requests');
      const parsed = existing ? JSON.parse(existing) : [];
      const updated = [newOrder, ...parsed];
      localStorage.setItem('sketch_order_client_requests', JSON.stringify(updated));
      window.dispatchEvent(new Event('sketch_order_new_request'));
    } catch {
      // ignore
    }

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

  const handleSendToWhatsApp = () => {
    playClick();
    const domainPart = `\n- الساب دومين المطلوب: ${desiredSubdomain || formData.storeName}.sketchorder.com`;
    const templatePart = initialStoreConfig ? `\n- التيمبليت المختار: ${initialStoreConfig.templateId}` : '';
    const receiptPart = receiptBase64 ? '\n- سكرين شوت التحويل: تم إرفاقها ومحفوظة بالسيستم ✓' : '';
    const message = `أهلاً فريق سكتش أوردر! 🇪🇬✏️
تم إرسال طلب جديد عبر الموقع برقم (${generatedOrderId}):
- الباقة المختارة: ${currentPlan.name} (${currentPlan.priceDisplay})
- الاسم: ${formData.fullName}
- اسم المتجر: ${formData.storeName}
- النشاط: ${formData.storeType}
- المحافظة: ${formData.governorate}${domainPart}${templatePart}
- طريقة الدفع: ${formData.paymentMethod}${receiptPart}
- رقم الواتساب: ${formData.whatsapp}
- ملاحظات: ${formData.notes || 'لا يوجد'}

يرجى مراجعة التحويل وتفعيل المتجر فوراً!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/201000000000?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative max-w-xl w-full my-8 bg-white dark:bg-[#111827] border-3 md:border-4 border-[#0F0F0F] dark:border-slate-700 text-[#0F0F0F] dark:text-white p-5 sm:p-7 sketch-shadow-xl paper-pattern max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute top-4 left-4 p-2 border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-circle bg-white dark:bg-slate-800 text-[#0F0F0F] dark:text-white hover:bg-neutral-100 dark:hover:bg-slate-700 sketch-shadow-sm"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Logo & Mascot */}
        <div className="text-center border-b-2 border-[#0F0F0F] dark:border-slate-700 pb-4 mb-5">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src={mascotImg} alt="سكتش مان" className="w-10 h-10 object-contain rounded-full border border-[#0F0F0F] dark:border-slate-600 bg-white dark:bg-slate-800" />
            <img src={logoImg} alt="SKETCH ORDER" className="h-7 object-contain dark:invert" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-heading text-[#0F0F0F] dark:text-white">
            امتلك موقعك بدومينك الخاص
          </h2>

          {/* 3 Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>الدفع مرة واحدة</span>
            </span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="flex items-center gap-1 text-indigo-800 dark:text-indigo-400">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>الضمان مدى الحياة</span>
            </span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="flex items-center gap-1 text-orange-800 dark:text-orange-400">
              <Zap className="w-3.5 h-3.5 text-orange-500" />
              <span>تسليم في خلال دقايق</span>
            </span>
          </div>

          {initialStoreConfig && (
            <div className="mt-3 p-2 border border-dashed border-[#0F0F0F] dark:border-emerald-500/50 sketch-border-tag bg-emerald-50 dark:bg-emerald-950/40 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>تم اختيار متجر "{initialStoreConfig.storeName}" بنجاح من الاستوديو</span>
            </div>
          )}
        </div>

        {/* VIEW 1: THE INPUT FORM */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-right">
            
            {/* Plan Selector */}
            <div>
              <label className="block text-xs font-black mb-1.5 text-[#0F0F0F] dark:text-white">
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
                      className={`p-2.5 text-right border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-tag transition-all ${
                        isSelected
                          ? 'bg-[#0F0F0F] text-white dark:bg-orange-500 dark:text-slate-950 sketch-shadow-sm -translate-y-0.5'
                          : 'bg-white dark:bg-slate-800 hover:bg-neutral-50 dark:hover:bg-slate-700 text-[#0F0F0F] dark:text-slate-200'
                      }`}
                    >
                      <div className="text-xs font-black">{plan.name}</div>
                      <div className="text-sm font-black mt-1">
                        {plan.priceDisplay}
                      </div>
                      <div className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? 'text-slate-300 dark:text-slate-900 font-bold' : 'text-[#0F0F0F]/60 dark:text-slate-400'}`}>
                        {planKey === 'standard' ? '4 أقسام فقط' : planKey === 'pro' ? 'أقسام + سيستم الأرباح' : 'حسب المطلوب (مش ثابت)'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-black mb-1 text-[#0F0F0F] dark:text-slate-200">
                الاسم الكريم / صاحب المتجر *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: أحمد عبد الرحمن"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2.5 text-sm font-bold border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-2 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white focus:outline-hidden"
              />
            </div>

            {/* Store Name & Subdomain */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black mb-1 text-[#0F0F0F] dark:text-slate-200">
                  اسم المتجر أو البراند *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: سبورتك، فاسكو ستريت، برجر كلوب..."
                  value={formData.storeName}
                  onChange={(e) => {
                    setFormData({ ...formData, storeName: e.target.value });
                    if (!desiredSubdomain) {
                      setDesiredSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                    }
                  }}
                  className="w-full p-2.5 text-sm font-bold border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-3 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black mb-1 text-[#0F0F0F] dark:text-slate-200">
                  الساب دومين المطلوب (Subdomain) *
                </label>
                <div className="flex items-center" dir="ltr">
                  <input
                    type="text"
                    required
                    placeholder="mybrand"
                    value={desiredSubdomain}
                    onChange={(e) => setDesiredSubdomain(e.target.value)}
                    className="w-full p-2.5 text-xs font-bold font-mono border-2 border-r-0 border-[#0F0F0F] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white text-left focus:outline-hidden"
                  />
                  <span className="p-2.5 bg-neutral-100 dark:bg-slate-800 border-2 border-[#0F0F0F] dark:border-slate-700 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    .sketchorder.com
                  </span>
                </div>
              </div>
            </div>

            {/* Niche & Governorate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black mb-1 text-[#0F0F0F] dark:text-slate-200">
                  مجال النشاط
                </label>
                <select
                  value={formData.storeType}
                  onChange={(e) => setFormData({ ...formData, storeType: e.target.value })}
                  className="w-full p-2.5 text-sm font-bold border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-2 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white focus:outline-hidden"
                >
                  <option value="كوتشيات وسنيكرز ومستلزمات رياضية">كوتشيات وسنيكرز ومستلزمات رياضية</option>
                  <option value="ملابس وستريت وير وأوفر سايز">ملابس وستريت وير وأوفر سايز</option>
                  <option value="مطاعم ومأكولات سريعة وحجز طاولات">مطاعم ومأكولات سريعة وحجز طاولات</option>
                  <option value="عطور ومجوهرات ومستحضرات تجميل">عطور ومجوهرات ومستحضرات تجميل</option>
                  <option value="أثاث وديكور منزلي">أثاث وديكور منزلي</option>
                  <option value="أخرى">أخرى (سأوضحها في الملاحظات)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black mb-1 text-[#0F0F0F] dark:text-slate-200">
                  المحافظة الرئيسية
                </label>
                <select
                  value={formData.governorate}
                  onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                  className="w-full p-2.5 text-sm font-bold border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-2 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white focus:outline-hidden"
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

            {/* WhatsApp Phone */}
            <div>
              <label className="block text-xs font-black mb-1 text-[#0F0F0F] dark:text-slate-200">
                رقم الواتساب للتواصل وتفعيل المتجر *
              </label>
              <input
                type="tel"
                required
                dir="ltr"
                placeholder="010XXXXXXXX or 011/012/015"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full p-2.5 text-sm font-bold font-mono border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-1 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white text-right focus:outline-hidden"
              />
            </div>

            {/* Payment Method & Receipt Upload Box */}
            <div className="p-3.5 border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-2 bg-amber-50/50 dark:bg-amber-500/10 space-y-2.5">
              <label className="block text-xs font-black text-[#0F0F0F] dark:text-amber-200">
                طريقة الدفع والتأكيد الفوري:
              </label>

              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full p-2.5 text-xs font-bold border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-2 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white focus:outline-hidden"
              >
                <option value="إنستاباي (InstaPay)">⚡ إنستاباي (InstaPay) - تحويل فوري لحظي</option>
                <option value="محفظة فودافون كاش">📱 محفظة فودافون كاش / أورنج كاش</option>
                <option value="كروت بنكية وفيزا وميزة">💳 بطاقة بنكية / فيزا / ميزة</option>
              </select>

              <div className="text-xs font-bold space-y-1.5 pt-1">
                <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 border border-[#0F0F0F]/30 dark:border-slate-700 rounded-md">
                  <span className="text-slate-800 dark:text-slate-300">⚡ عنوان إنستاباي (InstaPay IPA):</span>
                  <span className="font-mono font-black text-indigo-700 dark:text-indigo-400 select-all">kareem07@instapay</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 border border-[#0F0F0F]/30 dark:border-slate-700 rounded-md">
                  <span className="text-slate-800 dark:text-slate-300">📱 رقم فودافون كاش:</span>
                  <span className="font-mono font-black text-rose-700 dark:text-rose-400 select-all">01023456789</span>
                </div>
              </div>

              {/* Receipt File Upload */}
              <div className="pt-2 border-t border-dashed border-[#0F0F0F]/30 dark:border-slate-700">
                <label className="block text-xs font-black mb-1.5 text-slate-900 dark:text-slate-200">
                  إرفاق سكرين شوت التحويل لتسريع قبول وتفعيل الموقع:
                </label>
                {receiptBase64 ? (
                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border-2 border-[#0F0F0F] dark:border-slate-700 rounded-xl shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <img src={receiptBase64} alt="Receipt preview" className="w-12 h-12 object-cover rounded-lg border border-slate-300 dark:border-slate-700" />
                      <div>
                        <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> تم إرفاق السكرين شوت
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">سيظهر مباشرة في لوحة إدارة صاحب الموقع</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReceiptBase64(null)}
                      className="text-xs text-red-600 dark:text-red-400 font-bold hover:underline px-2 py-1"
                    >
                      حذف واستبدال
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-[#0F0F0F] dark:border-slate-700 sketch-border-tag bg-white dark:bg-slate-900 hover:bg-neutral-50 dark:hover:bg-slate-800 cursor-pointer text-xs font-black transition-colors">
                    <Upload className="w-4 h-4 text-[#0F0F0F] dark:text-slate-200" />
                    <span>اضغط هنا لرفع سكرين شوت التحويل (PNG / JPG) 📎</span>
                    <input type="file" accept="image/*" onChange={handleReceiptUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-black mb-1 text-[#0F0F0F] dark:text-slate-200">
                ملاحظات أو رغبات خاصة لمتجرك
              </label>
              <textarea
                rows={2}
                placeholder="مثال: محتاج دومين باسم mybrand.com ومعايا 15 منتج جاهزين للرفع..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2 text-xs font-bold border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-2 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white focus:outline-hidden resize-none"
              ></textarea>
            </div>

            {/* Price Summary Box */}
            <div className="p-3 border-2 border-[#0F0F0F] dark:border-slate-700 bg-[#FAF9F6] dark:bg-slate-900 sketch-border-1 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#0F0F0F]/70 dark:text-slate-400">المطلوب دفعه:</span>
                <div className="text-xl font-black font-heading text-[#0F0F0F] dark:text-white">
                  {currentPlan.priceDisplay}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-sm border border-emerald-200 dark:border-emerald-800">
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

            <div className="text-[11px] text-center text-[#0F0F0F]/70 dark:text-slate-400 pt-1 font-bold">
              * الدفع بعد المعاينة والتأكد من كل التفاصيل • سرعة التواصل عبر الدعم الفني
            </div>

          </form>
        ) : (
          /* VIEW 2: SUCCESS WITH APPROVED RUBBER STAMP */
          <div className="text-center py-4 space-y-6">
            
            <div className="inline-block border-4 border-[#0F0F0F] dark:border-slate-600 p-4 sm:p-6 sketch-border-2 bg-white dark:bg-slate-900 animate-stamp sketch-shadow-lg rotate-[-3deg]">
              <div className="flex items-center justify-center gap-2 mb-2 border-b-2 border-[#0F0F0F] dark:border-slate-700 pb-1">
                <img src={mascotImg} alt="سكتش مان" className="w-6 h-6 rounded-full" />
                <span className="text-sm font-black text-[#0F0F0F] dark:text-white">سكتش أوردر • اعتماد رسمي</span>
              </div>
              <div className="text-2xl sm:text-4xl font-black font-heading text-[#0F0F0F] dark:text-white tracking-tight">
                تم اعتماد الطلب #{generatedOrderId} ✓
              </div>
              <div className="text-xs font-bold mt-2 text-[#0F0F0F]/80 dark:text-slate-300">
                التاريخ: {stampDate} • الباقة: {currentPlan.name} • {currentPlan.priceDisplay}
              </div>
              <div className="text-xs font-mono font-bold mt-2 text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 py-1 px-3 rounded-md border border-indigo-200 dark:border-indigo-800">
                🌐 الساب دومين: {desiredSubdomain || formData.storeName}.sketchorder.com
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black font-heading text-[#0F0F0F] dark:text-white">
                ألف مبروك يا {formData.fullName}! ظهر طلبك في لوحة تحكم المنصة
              </h3>
              <p className="text-sm font-bold text-[#0F0F0F]/80 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                تم تسجيل إيصال التحويل وحجز الساب دومين لمتجر "{formData.storeName}". جاري المراجعة والتسليم فوراً في دقائق معدودة!
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
