import React, { useState, useEffect } from 'react';
import {
 X,
 Send,
 CheckCircle2,
 ShieldCheck,
 Zap,
 Upload,
 Copy,
 Check,
 ArrowRight,
 ArrowLeft,
 Sparkles,
 Phone,
 Store,
 MapPin,
 AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { BlueprintFormData, CustomStoreConfig, ClientOrderRequest } from '../types';
import { playStampSlam, playClick, playCashSound } from '../utils/soundEffects';
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
 features: ['ربط داتابيز واستقبال أوردرات', 'لوحة تحكم لإضافة المنتجات', 'حد أقصى 4 أقسام داخل المتجر', 'دفع مرة واحدة ومدى الحياة'],
 },
 pro: {
 name: 'باقة المحترفين والنمو',
 price: 2400,
 priceDisplay: '2,400 ج.م',
 badge: 'أقسام لا نهائية + سيستم ذكي للأرباح والمبيعات ',
 features: ['عدد لا نهائي من الأقسام والصور', 'سيستم ذكي لتحليل الأرباح وصافي الدخل', 'تقارير أعلى المنتجات مبيعاً', 'دعم فني سريع ومباشر'],
 },
 custom: {
 name: 'الباقة المخصصة (Custom 3D)',
 price: 'custom',
 priceDisplay: 'سعر مخصص حسب المطلوب',
 badge: 'تصميم واجهة مخصصة بالكامل + عناصر ثلاثية الأبعاد ',
 features: ['واجهة تفاعلية ثلاثية الأبعاد 3D', 'أنيميشن سينمائي ومؤثرات صوتية فريدة', 'إمكانية دوران المنتج 360 درجة', 'أولوية قصوى ودعم VIP على مدار الساعة'],
 },
};

export const OrderModal: React.FC<OrderModalProps> = ({
 isOpen,
 onClose,
 preselectedFeatures = [],
 initialStoreConfig = null,
 initialPlan = 'pro',
}) => {
 // Wizard Step state: 1, 2, or 3
 const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

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
 governorate: initialStoreConfig ? initialStoreConfig.governorate : 'القاهرة',
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
 const [copiedField, setCopiedField] = useState<'instapay' | 'vodafone' | null>(null);
 const [stepErrors, setStepErrors] = useState<{ [key: string]: string }>({});

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

 if (!isOpen) return null;

 const currentPlan = PLAN_INFO[formData.selectedPlan];

 // Subdomain sanitization
 const cleanSubdomain = desiredSubdomain.trim()
 ? desiredSubdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
 : formData.storeName.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'mybrand';

 // Copy helper with feedback
 const handleCopyText = (text: string, type: 'instapay' | 'vodafone') => {
 navigator.clipboard.writeText(text);
 playCashSound();
 setCopiedField(type);
 setTimeout(() => {
 setCopiedField(null);
 }, 2500);
 };

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

 // Step 1 Validation
 const validateStep1 = () => {
 const errors: { [key: string]: string } = {};
 if (!formData.storeName.trim()) {
 errors.storeName = 'يرجى كتابة اسم المتجر أو البراند';
 }
 if (!cleanSubdomain.trim()) {
 errors.subdomain = 'يرجى إدخال الساب دومين المطلوب';
 }
 setStepErrors(errors);
 return Object.keys(errors).length === 0;
 };

 // Step 2 Validation (WhatsApp regex for Egypt)
 const validateStep2 = () => {
 const errors: { [key: string]: string } = {};
 if (!formData.fullName.trim()) {
 errors.fullName = 'يرجى إدخال اسم صاحب المتجر بالكامل';
 }
 const cleanPhone = formData.whatsapp.replace(/\D/g, '');
 const isEgyptianPhone = /^(010|011|012|015)[0-9]{8}$/.test(cleanPhone) || /^201[0-9]{9}$/.test(cleanPhone);
 if (!formData.whatsapp.trim()) {
 errors.whatsapp = 'يرجى إدخال رقم الواتساب للتواصل';
 } else if (!isEgyptianPhone && cleanPhone.length < 10) {
 errors.whatsapp = 'يرجى إدخال رقم واتساب مصري صحيح (مثال: 01012345678)';
 }
 setStepErrors(errors);
 return Object.keys(errors).length === 0;
 };

 const handleGoToStep2 = () => {
 playClick();
 if (validateStep1()) {
 setCurrentStep(2);
 setStepErrors({});
 }
 };

 const handleGoToStep3 = () => {
 playClick();
 if (validateStep2()) {
 setCurrentStep(3);
 setStepErrors({});
 }
 };

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 playStampSlam();

 const orderId = `SK-${Math.floor(1000 + Math.random() * 9000)}`;
 setGeneratedOrderId(orderId);

 const fullSubdomain = `${cleanSubdomain}.sketchorder.com`;

 // Save order in localStorage so it appears in the Owner Admin Dashboard
 const newOrder: ClientOrderRequest = {
 id: orderId,
 createdAt: new Date().toLocaleString('ar-EG'),
 clientName: formData.fullName,
 whatsappNumber: formData.whatsapp,
 brandName: formData.storeName,
 subdomain: fullSubdomain,
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
 particleCount: 90,
 spread: 75,
 origin: { y: 0.6 },
 colors: ['#EA580C', '#10B981', '#FFBD24', '#0F172A'],
 shapes: ['square', 'circle'],
 });

 setStampDate(new Date().toLocaleDateString('ar-EG'));
 setIsSubmitted(true);
 };

 const handleSendToWhatsApp = () => {
 playClick();
 const domainPart = `\n- الساب دومين المطلوب: ${cleanSubdomain}.sketchorder.com`;
 const templatePart = initialStoreConfig ? `\n- التيمبليت المختار: ${initialStoreConfig.templateId}` : '';
 const receiptPart = receiptBase64 ? '\n- سكرين شوت التحويل: تم إرفاقها ومحفوظة بالسيستم ✓' : '';
 const message = `أهلاً فريق سكتش أوردر! 
تم إرسال طلب متجر جديد برقم (${generatedOrderId}):
- الباقة المختارة: ${currentPlan.name} (${currentPlan.priceDisplay})
- اسم المالك: ${formData.fullName}
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
 <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
 <div className="relative max-w-xl w-full my-6 bg-white dark:bg-[#0F172A] border-3 md:border-4 border-[#0F0F0F] dark:border-slate-700 text-[#0F0F0F] dark:text-white p-5 sm:p-7 sketch-shadow-xl paper-pattern max-h-[94vh] overflow-y-auto">
 
 {/* Close Button */}
 <button
 onClick={() => {
 playClick();
 onClose();
 }}
 className="absolute top-4 left-4 p-2 border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-circle bg-white dark:bg-slate-800 text-[#0F0F0F] dark:text-white hover:bg-neutral-100 dark:hover:bg-slate-700 sketch-shadow-sm transition-transform active:scale-95"
 aria-label="إغلاق"
 >
 <X className="w-5 h-5" />
 </button>

 {/* Modal Header */}
 <div className="text-center border-b-2 border-[#0F0F0F] dark:border-slate-700 pb-4 mb-4">
 <div className="flex items-center justify-center gap-3 mb-2">
 <img src={mascotImg} alt="سكتش مان" className="w-10 h-10 object-contain rounded-full border border-[#0F0F0F] dark:border-slate-600 bg-white dark:bg-slate-800" />
 <img src={logoImg} alt="SKETCH ORDER" className="h-7 object-contain dark:invert" />
 </div>

 <h2 className="text-2xl sm:text-3xl font-black font-heading text-[#0F0F0F] dark:text-white">
 امتلك موقعك بدومينك الخاص
 </h2>

 {/* 3 Guarantees */}
 <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
 <span className="flex items-center gap-1 text-orange-700 dark:text-orange-400">
 <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
 <span>الدفع مرة واحدة</span>
 </span>
 <span className="text-slate-400 dark:text-slate-600">•</span>
 <span className="flex items-center gap-1 text-orange-700 dark:text-orange-400">
 <ShieldCheck className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
 <span>الضمان مدى الحياة</span>
 </span>
 <span className="text-slate-400 dark:text-slate-600">•</span>
 <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
 <Zap className="w-3.5 h-3.5 text-orange-500" />
 <span>تسليم في خلال دقائق</span>
 </span>
 </div>

 {initialStoreConfig && (
 <div className="mt-2.5 p-2 border border-dashed border-[#0F0F0F] dark:border-orange-500/50 sketch-border-tag bg-orange-50 dark:bg-orange-950/40 text-xs font-bold text-orange-800 dark:text-orange-300 flex items-center justify-center gap-1.5">
 <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
 <span>تم اختيار تيمبليت متجر "{initialStoreConfig.storeName}" بنجاح</span>
 </div>
 )}
 </div>

 {/* ======================================================== */}
 {/* MULTI-STEP WIZARD PROGRESS BAR (3 STEPS) */}
 {/* ======================================================== */}
 {!isSubmitted && (
 <div className="mb-5 pb-3 border-b border-dashed border-slate-300 dark:border-slate-800">
 <div className="flex items-center justify-between relative px-2 sm:px-6">
 
 {/* Connector line */}
 <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 -z-0">
 <div
 className="h-full bg-orange-500 transition-all duration-300"
 style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
 />
 </div>

 {/* Step 1 Pill */}
 <button
 type="button"
 onClick={() => {
 playClick();
 setCurrentStep(1);
 }}
 className={`relative z-10 flex flex-col items-center gap-1 group transition-all ${
 currentStep >= 1 ? 'opacity-100' : 'opacity-60'
 }`}
 >
 <div
 className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border-2 transition-all ${
 currentStep === 1
 ? 'bg-orange-500 text-slate-950 border-[#0F0F0F] dark:border-orange-400 scale-110 shadow-md'
 : currentStep > 1
 ? 'bg-orange-500 text-white border-[#0F0F0F] dark:border-orange-400'
 : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
 }`}
 >
 {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
 </div>
 <span className={`text-[11px] font-black ${currentStep === 1 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400'}`}>
 الباقة والدومين
 </span>
 </button>

 {/* Step 2 Pill */}
 <button
 type="button"
 onClick={() => {
 if (validateStep1()) {
 playClick();
 setCurrentStep(2);
 }
 }}
 className={`relative z-10 flex flex-col items-center gap-1 group transition-all ${
 currentStep >= 2 ? 'opacity-100' : 'opacity-60'
 }`}
 >
 <div
 className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border-2 transition-all ${
 currentStep === 2
 ? 'bg-orange-500 text-slate-950 border-[#0F0F0F] dark:border-orange-400 scale-110 shadow-md'
 : currentStep > 2
 ? 'bg-orange-500 text-white border-[#0F0F0F] dark:border-orange-400'
 : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
 }`}
 >
 {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
 </div>
 <span className={`text-[11px] font-black ${currentStep === 2 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400'}`}>
 بيانات المالك
 </span>
 </button>

 {/* Step 3 Pill */}
 <button
 type="button"
 onClick={() => {
 if (validateStep1() && validateStep2()) {
 playClick();
 setCurrentStep(3);
 }
 }}
 className={`relative z-10 flex flex-col items-center gap-1 group transition-all ${
 currentStep === 3 ? 'opacity-100' : 'opacity-60'
 }`}
 >
 <div
 className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border-2 transition-all ${
 currentStep === 3
 ? 'bg-orange-500 text-slate-950 border-[#0F0F0F] dark:border-orange-400 scale-110 shadow-md'
 : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
 }`}
 >
 3
 </div>
 <span className={`text-[11px] font-black ${currentStep === 3 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400'}`}>
 الدفع والتأكيد
 </span>
 </button>

 </div>
 </div>
 )}

 {/* ======================================================== */}
 {/* VIEW 1: MULTI-STEP FORM */}
 {/* ======================================================== */}
 {!isSubmitted ? (
 <form onSubmit={handleSubmit} className="text-right">
 
 {/* ---------------------------------------------------- */}
 {/* STEP 1: PLAN & SUBDOMAIN */}
 {/* ---------------------------------------------------- */}
 {currentStep === 1 && (
 <div className="space-y-4 animate-in fade-in duration-200">
 
 {/* Plan Selection */}
 <div>
 <label className="block text-xs font-black mb-1.5 text-[#0F0F0F] dark:text-white">
 1. اختر الباقة المناسبة لحجم شغلك:
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
 className={`p-3 text-right border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-tag transition-all ${
 isSelected
 ? 'bg-[#0F0F0F] text-white dark:bg-orange-500 dark:text-slate-950 sketch-shadow-sm -translate-y-0.5 ring-2 ring-orange-500/50'
 : 'bg-white dark:bg-slate-800 hover:bg-neutral-50 dark:hover:bg-slate-700 text-[#0F0F0F] dark:text-slate-200'
 }`}
 >
 <div className="text-xs font-black">{plan.name}</div>
 <div className="text-base font-black mt-1 font-heading">
 {plan.priceDisplay}
 </div>
 <div className={`text-[10px] mt-1.5 line-clamp-2 leading-tight ${isSelected ? 'text-slate-300 dark:text-slate-950 font-bold' : 'text-[#0F0F0F]/65 dark:text-slate-400'}`}>
 {plan.badge}
 </div>
 </button>
 );
 })}
 </div>
 </div>

 {/* Store Name & Subdomain */}
 <div className="space-y-3 pt-1">
 <div>
 <label className="block text-xs font-black mb-1 text-[#0F0F0F] dark:text-slate-200">
 اسم المتجر أو البراند بالكامل *
 </label>
 <div className="relative">
 <Store className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
 <input
 type="text"
 required
 placeholder="مثال: سبورتك ستور، فاسكو للأزياء، برجر كلوب..."
 value={formData.storeName}
 onChange={(e) => {
 const val = e.target.value;
 setFormData({ ...formData, storeName: val });
 if (!desiredSubdomain || desiredSubdomain === formData.storeName.toLowerCase().replace(/[^a-z0-9]/g, '')) {
 setDesiredSubdomain(val.toLowerCase().replace(/[^a-z0-9]/g, ''));
 }
 if (stepErrors.storeName) {
 setStepErrors((prev) => ({ ...prev, storeName: '' }));
 }
 }}
 className={`w-full pr-9 pl-3 py-2.5 text-sm font-bold border-2 ${
 stepErrors.storeName ? 'border-red-500' : 'border-[#0F0F0F] dark:border-slate-700'
 } sketch-border-3 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white focus:outline-hidden`}
 />
 </div>
 {stepErrors.storeName && (
 <p className="text-xs text-red-500 font-bold mt-1 flex items-center gap-1">
 <AlertCircle className="w-3.5 h-3.5" /> {stepErrors.storeName}
 </p>
 )}
 </div>

 <div>
 <div className="flex items-center justify-between mb-1">
 <label className="text-xs font-black text-[#0F0F0F] dark:text-slate-200">
 الساب دومين المطلوب (رابط موقعك) *
 </label>
 <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold flex items-center gap-1">
 <Sparkles className="w-3 h-3" /> متاح مجاناً مع الباقة
 </span>
 </div>

 <div className="flex items-center" dir="ltr">
 <input
 type="text"
 required
 placeholder="mybrand"
 value={desiredSubdomain}
 onChange={(e) => {
 setDesiredSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
 if (stepErrors.subdomain) {
 setStepErrors((prev) => ({ ...prev, subdomain: '' }));
 }
 }}
 className="w-full p-2.5 text-xs font-bold font-mono border-2 border-r-0 border-[#0F0F0F] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white text-left focus:outline-hidden"
 />
 <span className="p-2.5 bg-neutral-100 dark:bg-slate-800 border-2 border-[#0F0F0F] dark:border-slate-700 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
 .sketchorder.com
 </span>
 </div>

 {/* LIVE SUBDOMAIN AVAILABILITY BADGE */}
 <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-800 rounded-lg flex items-center justify-between text-xs font-bold text-orange-800 dark:text-orange-300">
 <div className="flex items-center gap-1.5">
 <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
 <span>مبروك! الدومين ده متاح حالياً ✓</span>
 </div>
 <span className="font-mono text-[11px] text-orange-700 dark:text-orange-400" dir="ltr">
 {cleanSubdomain}.sketchorder.com
 </span>
 </div>
 </div>
 </div>

 {/* Step 1 Actions */}
 <div className="pt-3">
 <button
 type="button"
 onClick={handleGoToStep2}
 className="btn-sketch btn-sketch-primary w-full text-base py-3 font-heading flex items-center justify-center gap-2 -rotate-1"
 >
 <span>متابعة للخطوة 2: بيانات المالك</span>
 <ArrowLeft className="w-4 h-4" />
 </button>
 </div>

 </div>
 )}

 {/* ---------------------------------------------------- */}
 {/* STEP 2: OWNER & BUSINESS DETAILS */}
 {/* ---------------------------------------------------- */}
 {currentStep === 2 && (
 <div className="space-y-4 animate-in fade-in duration-200">
 
 {/* Full Name */}
 <div>
 <label className="block text-xs font-black mb-1 text-[#0F0F0F] dark:text-slate-200">
 الاسم الكريم / صاحب المتجر بالكامل *
 </label>
 <input
 type="text"
 required
 placeholder="مثال: كريم أحمد عبد الرحمن"
 value={formData.fullName}
 onChange={(e) => {
 setFormData({ ...formData, fullName: e.target.value });
 if (stepErrors.fullName) {
 setStepErrors((prev) => ({ ...prev, fullName: '' }));
 }
 }}
 className={`w-full p-2.5 text-sm font-bold border-2 ${
 stepErrors.fullName ? 'border-red-500' : 'border-[#0F0F0F] dark:border-slate-700'
 } sketch-border-2 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white focus:outline-hidden`}
 />
 {stepErrors.fullName && (
 <p className="text-xs text-red-500 font-bold mt-1 flex items-center gap-1">
 <AlertCircle className="w-3.5 h-3.5" /> {stepErrors.fullName}
 </p>
 )}
 </div>

 {/* WhatsApp Phone with Live Validation */}
 <div>
 <label className="block text-xs font-black mb-1 text-[#0F0F0F] dark:text-slate-200">
 رقم الواتساب للتواصل وتفعيل المتجر *
 </label>
 <div className="relative">
 <Phone className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
 <input
 type="tel"
 required
 dir="ltr"
 placeholder="01012345678"
 value={formData.whatsapp}
 onChange={(e) => {
 setFormData({ ...formData, whatsapp: e.target.value });
 if (stepErrors.whatsapp) {
 setStepErrors((prev) => ({ ...prev, whatsapp: '' }));
 }
 }}
 className={`w-full pr-9 pl-3 py-2.5 text-sm font-bold font-mono border-2 ${
 stepErrors.whatsapp ? 'border-red-500' : 'border-[#0F0F0F] dark:border-slate-700'
 } sketch-border-1 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white text-right focus:outline-hidden`}
 />
 </div>
 {stepErrors.whatsapp ? (
 <p className="text-xs text-red-500 font-bold mt-1 flex items-center gap-1">
 <AlertCircle className="w-3.5 h-3.5" /> {stepErrors.whatsapp}
 </p>
 ) : formData.whatsapp && (
 <p className="text-[11px] text-orange-600 dark:text-orange-400 font-bold mt-1 flex items-center gap-1">
 <CheckCircle2 className="w-3.5 h-3.5" /> رقم هاتف صالح للاستقبال عبر واتساب
 </p>
 )}
 </div>

 {/* Niche & Governorate */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <div>
 <label className="block text-xs font-black mb-1 text-[#0F0F0F] dark:text-slate-200">
 مجال النشاط التجاري
 </label>
 <select
 value={formData.storeType}
 onChange={(e) => setFormData({ ...formData, storeType: e.target.value })}
 className="w-full p-2.5 text-xs sm:text-sm font-bold border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-2 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white focus:outline-hidden"
 >
 <option value="كوتشيات وسنيكرز ومستلزمات رياضية"> كوتشيات وسنيكرز رياضية</option>
 <option value="ملابس وستريت وير وأوفر سايز"> أزياء وستريت وير</option>
 <option value="مطاعم ومأكولات سريعة وحجز طاولات"> مطاعم ومأكولات سريعة</option>
 <option value="عطور ومجوهرات ومستحضرات تجميل"> عطور ومجوهرات فاخرة</option>
 <option value="أثاث وديكور منزلي"> أثاث وديكور منزلي</option>
 <option value="أخرى"> نشاط تجاري آخر</option>
 </select>
 </div>

 <div>
 <label className="block text-xs font-black mb-1 text-[#0F0F0F] dark:text-slate-200">
 المحافظة الرئيسية
 </label>
 <div className="relative">
 <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
 <select
 value={formData.governorate}
 onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
 className="w-full p-2.5 text-xs sm:text-sm font-bold border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-2 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white focus:outline-hidden"
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
 </div>

 {/* Step 2 Actions (Back & Next) */}
 <div className="pt-3 flex items-center gap-2">
 <button
 type="button"
 onClick={() => {
 playClick();
 setCurrentStep(1);
 }}
 className="btn-sketch w-1/3 text-xs sm:text-sm py-3 font-heading flex items-center justify-center gap-1.5"
 >
 <ArrowRight className="w-4 h-4" />
 <span>رجوع</span>
 </button>

 <button
 type="button"
 onClick={handleGoToStep3}
 className="btn-sketch btn-sketch-primary w-2/3 text-sm sm:text-base py-3 font-heading flex items-center justify-center gap-2 -rotate-1"
 >
 <span>متابعة للدفع (خطوة 3)</span>
 <ArrowLeft className="w-4 h-4" />
 </button>
 </div>

 </div>
 )}

 {/* ---------------------------------------------------- */}
 {/* STEP 3: PAYMENT, RECEIPT & CONFIRMATION */}
 {/* ---------------------------------------------------- */}
 {currentStep === 3 && (
 <div className="space-y-4 animate-in fade-in duration-200">
 
 {/* Payment Methods */}
 <div>
 <label className="block text-xs font-black mb-1.5 text-[#0F0F0F] dark:text-white">
 اختر طريقة الدفع المناسبة لك:
 </label>
 <select
 value={formData.paymentMethod}
 onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
 className="w-full p-2.5 text-xs sm:text-sm font-bold border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-2 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white focus:outline-hidden"
 >
 <option value="إنستاباي (InstaPay)"> إنستاباي (InstaPay) - تحويل فوري لحظي</option>
 <option value="محفظة فودافون كاش"> محفظة فودافون كاش / أورنج كاش</option>
 <option value="كروت بنكية وفيزا وميزة"> بطاقة بنكية / فيزا / ميزة</option>
 </select>
 </div>

 {/* 1-Click Copy Accounts Box */}
 <div className="p-3.5 border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-2 bg-orange-50/60 dark:bg-orange-500/10 space-y-2.5">
 <span className="text-xs font-black text-[#0F0F0F] dark:text-orange-200 block">
 بيانات التحويل المباشر (اضغط للنسخ فوراً):
 </span>

 {/* InstaPay Copy Row */}
 <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-[#0F0F0F]/30 dark:border-slate-700 rounded-xl">
 <div className="text-right">
 <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400"> عنوان إنستاباي (InstaPay IPA):</div>
 <div className="font-mono font-black text-sm text-orange-700 dark:text-orange-400">
 kareem07@instapay
 </div>
 </div>

 <button
 type="button"
 onClick={() => handleCopyText('kareem07@instapay', 'instapay')}
 className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${
 copiedField === 'instapay'
 ? 'bg-orange-600 text-white'
 : 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 hover:bg-orange-100'
 }`}
 >
 {copiedField === 'instapay' ? (
 <>
 <Check className="w-3.5 h-3.5" />
 <span>تم النسخ ✓</span>
 </>
 ) : (
 <>
 <Copy className="w-3.5 h-3.5" />
 <span>نسخ بضغطة واحدة</span>
 </>
 )}
 </button>
 </div>

 {/* Vodafone Cash Copy Row */}
 <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-[#0F0F0F]/30 dark:border-slate-700 rounded-xl">
 <div className="text-right">
 <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400"> رقم فودافون كاش:</div>
 <div className="font-mono font-black text-sm text-orange-700 dark:text-orange-400" dir="ltr">
 01023456789
 </div>
 </div>

 <button
 type="button"
 onClick={() => handleCopyText('01023456789', 'vodafone')}
 className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${
 copiedField === 'vodafone'
 ? 'bg-orange-600 text-white'
 : 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 hover:bg-orange-100'
 }`}
 >
 {copiedField === 'vodafone' ? (
 <>
 <Check className="w-3.5 h-3.5" />
 <span>تم النسخ ✓</span>
 </>
 ) : (
 <>
 <Copy className="w-3.5 h-3.5" />
 <span>نسخ بضغطة واحدة</span>
 </>
 )}
 </button>
 </div>
 </div>

 {/* Receipt Upload Box */}
 <div>
 <label className="block text-xs font-black mb-1.5 text-slate-900 dark:text-slate-200">
 إرفاق إيصال التحويل (لتسريع اعتماد وتفعيل المتجر):
 </label>
 {receiptBase64 ? (
 <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border-2 border-orange-500 dark:border-orange-600 rounded-xl shadow-xs">
 <div className="flex items-center gap-2.5">
 <img src={receiptBase64} alt="إيصال التحويل" className="w-12 h-12 object-cover rounded-lg border border-slate-300 dark:border-slate-700" />
 <div>
 <span className="text-xs font-black text-orange-700 dark:text-orange-400 flex items-center gap-1">
 <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400" /> تم إرفاق صورة الإيصال
 </span>
 <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">ستظهر فوراً في لوحة تحكم التاجر للإدارة</span>
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
 <span>اضغط هنا لرفع سكرين شوت التحويل (PNG / JPG) </span>
 <input type="file" accept="image/*" onChange={handleReceiptUpload} className="hidden" />
 </label>
 )}
 </div>

 {/* Notes */}
 <div>
 <label className="block text-xs font-black mb-1 text-[#0F0F0F] dark:text-slate-200">
 ملاحظات أو رغبات خاصة لمتجرك
 </label>
 <textarea
 rows={2}
 placeholder="أي تفاصيل تحب نضيفها في تصميم متجرك أو منتجاتك..."
 value={formData.notes}
 onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
 className="w-full p-2 text-xs font-bold border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-2 bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white focus:outline-hidden resize-none"
 ></textarea>
 </div>

 {/* Price Summary Box */}
 <div className="p-3 border-2 border-[#0F0F0F] dark:border-slate-700 bg-[#FAF9F6] dark:bg-slate-900 sketch-border-1 flex items-center justify-between">
 <div>
 <span className="text-xs font-bold text-[#0F0F0F]/70 dark:text-slate-400">إجمالي المطلوب دفعه:</span>
 <div className="text-xl font-black font-heading text-[#0F0F0F] dark:text-white">
 {currentPlan.priceDisplay}
 </div>
 </div>
 <div className="text-right">
 <span className="text-xs font-black text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/50 px-2 py-0.5 rounded-sm border border-orange-200 dark:border-orange-800">
 دفع مرة واحدة • ملكك مدى الحياة
 </span>
 </div>
 </div>

 {/* Step 3 Actions (Back & Submit) */}
 <div className="pt-2 flex items-center gap-2">
 <button
 type="button"
 onClick={() => {
 playClick();
 setCurrentStep(2);
 }}
 className="btn-sketch w-1/3 text-xs sm:text-sm py-3 font-heading flex items-center justify-center gap-1.5"
 >
 <ArrowRight className="w-4 h-4" />
 <span>رجوع</span>
 </button>

 <button
 type="submit"
 className="btn-sketch btn-sketch-primary w-2/3 text-sm sm:text-base py-3.5 -rotate-1 font-heading flex items-center justify-center gap-2"
 >
 <Send className="w-4 h-4" />
 <span>اعتماد طلب المتجر والتسليم في دقائق </span>
 </button>
 </div>

 <div className="text-[11px] text-center text-[#0F0F0F]/70 dark:text-slate-400 pt-1 font-bold">
 * الدفع بعد المعاينة والتأكد من كل التفاصيل • سرعة فائقة في التواصل عبر الدعم الفني
 </div>

 </div>
 )}

 </form>
 ) : (
 /* ======================================================== */
 /* VIEW 2: SUCCESS WITH APPROVED RUBBER STAMP (5% REDUCED) */
 /* ======================================================== */
 <div className="text-center py-3 space-y-4 animate-in zoom-in-95 duration-300">
 
 {/* Rubber Stamp Card - Scaled to 0.95 for comfortable breathing room */}
 <div className="inline-block border-4 border-[#0F0F0F] dark:border-slate-600 p-4 sm:p-5 sketch-border-2 bg-white dark:bg-slate-900 animate-stamp sketch-shadow-lg rotate-[-2.5deg] scale-[0.95] max-w-md mx-auto">
 <div className="flex items-center justify-center gap-2 mb-2 border-b-2 border-[#0F0F0F] dark:border-slate-700 pb-1.5">
 <img src={mascotImg} alt="سكتش مان" className="w-6 h-6 rounded-full" />
 <span className="text-xs font-black text-[#0F0F0F] dark:text-white">سكتش أوردر • اعتماد رسمي للمتجر</span>
 </div>
 <div className="text-2xl sm:text-3xl font-black font-heading text-[#0F0F0F] dark:text-white tracking-tight">
 تم اعتماد الطلب #{generatedOrderId} ✓
 </div>
 <div className="text-xs font-bold mt-2 text-[#0F0F0F]/80 dark:text-slate-300">
 التاريخ: {stampDate} • {currentPlan.name} • {currentPlan.priceDisplay}
 </div>
 <div className="text-xs font-mono font-bold mt-2 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 py-1 px-3 rounded-md border border-orange-200 dark:border-orange-800" dir="ltr">
 https://{cleanSubdomain}.sketchorder.com
 </div>
 </div>

 <div className="space-y-1.5 px-2">
 <h3 className="text-xl sm:text-2xl font-black font-heading text-[#0F0F0F] dark:text-white">
 ألف مبروك يا {formData.fullName}! 
 </h3>
 <p className="text-xs sm:text-sm font-bold text-[#0F0F0F]/80 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
 تم حفظ حجز الساب دومين لمتجر "{formData.storeName}" وتسجيل إيصال التحويل في لوحة تحكم المنصة. جاري تفعيل استضافتك وتسليم لوحة تحكم التاجر المستقلة في دقائق معدودة!
 </p>
 </div>

 <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
 <button
 onClick={handleSendToWhatsApp}
 className="btn-sketch btn-sketch-primary w-full sm:w-auto text-xs sm:text-sm py-2.5 px-6 -rotate-1 flex items-center justify-center gap-2"
 >
 <span>متابعة فورية عبر الواتساب</span>
 <Send className="w-4 h-4" />
 </button>

 <button
 onClick={() => {
 playClick();
 onClose();
 }}
 className="btn-sketch w-full sm:w-auto text-xs sm:text-sm py-2.5 px-5 rotate-1"
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
