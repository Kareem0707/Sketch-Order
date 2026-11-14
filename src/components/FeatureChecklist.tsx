import React, { useState } from 'react';
import { CheckSquare, Sparkles, ArrowLeft } from 'lucide-react';
import type { FeatureItem } from '../types';
import { HandDrawnDivider } from './common/HandDrawnDivider';
import { playCheckmark, playClick } from '../utils/soundEffects';

interface FeatureChecklistProps {
 onSelectPlanAndOrder: (selectedFeatures: string[]) => void;
}

const AVAILABLE_FEATURES: FeatureItem[] = [
 // Category: Core
 {
 id: 'f-core-store',
 title: 'متجر سكتش متجاوب وسريع كالصاروخ',
 description: 'واجهة متجر تفاعلية بأسلوب الرسم اليدوي، بتفتح في أقل من ثانية على شبكات الـ 4G والموبايل في مصر.',
 category: 'core',
 basePrice: 1850,
 daysNeeded: 2,
 blueprintModule: 'core_canvas',
 sketchIcon: '',
 },
 {
 id: 'f-core-cart',
 title: 'سلة مشتريات فورية مرسومة (Fast Sketch Cart)',
 description: 'إضافة المنتجات وتحديد المقاسات والكميات بنقرة واحدة، مع حساب فوري للإجمالي والشحن.',
 category: 'core',
 basePrice: 500,
 daysNeeded: 1,
 blueprintModule: 'cart_drawer',
 sketchIcon: '',
 },
 {
 id: 'f-core-domain',
 title: 'دومين خاص باسمك (.com أو .store) وشهادة SSL',
 description: 'عنوان مستقل ببراندك ملكك بالكامل مع حماية وتشفير عالي وأعلى درجات الموثوقية.',
 category: 'core',
 basePrice: 450,
 daysNeeded: 1,
 blueprintModule: 'domain_ssl',
 sketchIcon: '',
 },

 // Category: Orders & WhatsApp
 {
 id: 'f-ord-whatsapp',
 title: 'ربط فوري مباشر بالواتساب (Direct WhatsApp Sync)',
 description: 'تفاصيل السلة، الاسم، المقاس، ورابط اللوكيشن بتتحول لرسالة واتساب منسقة فور الضغط على تأكيد الأوردر.',
 category: 'orders',
 basePrice: 650,
 daysNeeded: 1,
 blueprintModule: 'whatsapp_bridge',
 sketchIcon: '',
 },
 {
 id: 'f-ord-invoice',
 title: 'مولّد الفواتير الورقية المرسومة (Handmade Invoices)',
 description: 'إصدار فواتير وإيصالات استلام بتصميم الورق والكربون مع باركود سكتش جاهز للطباعة وتسليمه للمندوب.',
 category: 'orders',
 basePrice: 400,
 daysNeeded: 1,
 blueprintModule: 'invoice_gen',
 sketchIcon: '',
 },
 {
 id: 'f-ord-tracking',
 title: 'تتبع حالة الأوردر بالرسوم الكرتونية',
 description: 'صفحة مرحة لزبونك توضح مراحل الطلب (جاري تجهيز الكوتشي -> تم الشحن للمندوب -> تم التسليم ).',
 category: 'orders',
 basePrice: 550,
 daysNeeded: 2,
 blueprintModule: 'order_tracker',
 sketchIcon: '',
 },

 // Category: Custom Identity & Mascots
 {
 id: 'f-brand-stickman',
 title: 'تصميم شخصية ستيك مان كرتونية مخصوصة لبراندك',
 description: 'رسم تميمة كرتونية تعبر عن نشاطك (باريستا، خياط، ديزاينر، كوتش) بـ 6 وضعيات كرتونية مصرية مبهجة.',
 category: 'identity',
 basePrice: 950,
 daysNeeded: 3,
 blueprintModule: 'custom_mascot',
 sketchIcon: '',
 },
 {
 id: 'f-brand-icons',
 title: 'حزمة أيقونات مرسومة يدوياً خصيصاً لمنتجاتك',
 description: 'أيقونات فريدة تعكس هويتك وتستبدل الأيقونات الجاهزة والمملة المنتشرة في السوق.',
 category: 'identity',
 basePrice: 450,
 daysNeeded: 2,
 blueprintModule: 'sketch_icons',
 sketchIcon: '',
 },
 {
 id: 'f-brand-sound',
 title: 'مؤثرات صوتية تفاعلية (صوت قلم رصاص وورق كشكول)',
 description: 'أصوات خفيفة وممتعة عند النقر على الأزرار والإضافة للسلة تشد انتباه المتسوق.',
 category: 'identity',
 basePrice: 350,
 daysNeeded: 1,
 blueprintModule: 'audio_engine',
 sketchIcon: '',
 },

 // Category: Integrations & Payments
 {
 id: 'f-pay-online',
 title: 'ربط إنستاباي، فودافون كاش، وكروت ميزة والفيزا',
 description: 'تحصيل الفلوس فورياً في محفظتك أو حسابك البنكي بدون وسطاء وبأعلى معايير الأمان المالي.',
 category: 'integrations',
 basePrice: 850,
 daysNeeded: 2,
 blueprintModule: 'payment_gateway',
 sketchIcon: '',
 },
 {
 id: 'f-ship-sync',
 title: 'ربط شركات الشحن والتوصيل لمحافظات مصر',
 description: 'حساب تكلفة الشحن التلقائية حسب المحافظة (القاهرة، الجيزة، الإسكندرية، الصعيد) وطباعة البوليصة بنقرة واحدة.',
 category: 'integrations',
 basePrice: 650,
 daysNeeded: 2,
 blueprintModule: 'shipping_bridge',
 sketchIcon: '',
 },
];

export const FeatureChecklist: React.FC<FeatureChecklistProps> = ({
 onSelectPlanAndOrder,
}) => {
 const [selectedIds, setSelectedIds] = useState<string[]>([
 'f-core-store',
 'f-core-cart',
 'f-ord-whatsapp',
 'f-brand-stickman',
 ]);

 const [activeCategory, setActiveCategory] = useState<string>('all');

 const toggleFeature = (id: string) => {
 playCheckmark();
 setSelectedIds((prev) =>
 prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
 );
 };

 const selectAll = () => {
 playClick();
 setSelectedIds(AVAILABLE_FEATURES.map((f) => f.id));
 };

 const resetSelection = () => {
 playClick();
 setSelectedIds(['f-core-store', 'f-core-cart', 'f-ord-whatsapp']);
 };

 const selectedItems = AVAILABLE_FEATURES.filter((f) => selectedIds.includes(f.id));
 const rawTotal = selectedItems.reduce((acc, f) => acc + f.basePrice, 0);
 const discount = Math.round(rawTotal * 0.2);
 const finalPrice = rawTotal - discount;

 const filteredFeatures =
 activeCategory === 'all'
 ? AVAILABLE_FEATURES
 : AVAILABLE_FEATURES.filter((f) => f.category === activeCategory);

 return (
 <section id="blueprint-builder" className="py-16 paper-grid relative">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 
 {/* Header */}
 <div className="text-center max-w-3xl mx-auto mb-12">
 <div className="inline-block border-2 border-[#0F0F0F] bg-white px-3 py-1 sketch-border-tag text-xs font-black rotate-1 mb-3 sketch-shadow-sm">
 منضدة المهندس المعماري • حدد احتياجاتك بالجنيه المصري
 </div>

 <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight mb-4 text-[#0F0F0F]">
 ابنِ باقة متجرك قطعة بقطعة وبسعر شفاف
 </h2>

 <p className="text-base sm:text-lg font-bold text-[#0F0F0F]/80">
 انقر على المربعات المرسومة يدوياً لاختيار ميزات متجرك، وشاهد التكلفة الإجمالية ومدة التسليم بتتحسب قدام عينك بدون أي رسوم خفية.
 </p>

 {/* Category Filter Tabs */}
 <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
 {[
 { id: 'all', label: 'الكل (11 ميزة)' },
 { id: 'core', label: 'الأساسيات الهندسية ' },
 { id: 'orders', label: 'الطلبات والواتساب ' },
 { id: 'identity', label: 'الهوية والستيك مان ' },
 { id: 'integrations', label: 'إنستاباي والشحن ' },
 ].map((tab) => (
 <button
 key={tab.id}
 onClick={() => {
 playClick();
 setActiveCategory(tab.id);
 }}
 className={`px-3 py-1.5 text-xs sm:text-sm font-bold border-2 border-[#0F0F0F] sketch-border-pill transition-all ${
 activeCategory === tab.id
 ? 'bg-[#0F0F0F] text-white sketch-shadow-sm'
 : 'bg-white hover:bg-neutral-100 text-[#0F0F0F]'
 }`}
 >
 {tab.label}
 </button>
 ))}
 </div>
 </div>

 {/* Two-Column Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
 
 {/* LEFT: LIVE BLUEPRINT BOARD */}
 <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
 
 <div className="border-3 border-[#0F0F0F] sketch-border-1 bg-white p-5 sm:p-6 sketch-shadow-lg relative overflow-hidden">
 
 <div className="flex items-center justify-between border-b-2 border-[#0F0F0F] pb-3 mb-4">
 <div className="flex items-center gap-2">
 <div className="w-3 h-3 bg-[#0F0F0F] sketch-border-circle"></div>
 <span className="font-mono text-xs font-black tracking-wider">
 BLUEPRINT SCHEMATIC #EG-2026
 </span>
 </div>
 <span className="text-[11px] font-mono font-bold bg-[#0F0F0F] text-white px-2 py-0.5 sketch-border-pill">
 LIVE COMPILER
 </span>
 </div>

 {/* Blueprint Visual Rendering Canvas */}
 <div className="border-2 border-dashed border-[#0F0F0F] p-4 sketch-border-2 bg-[#FBFBFB] min-h-[260px] flex flex-col justify-between relative">
 
 <div className="space-y-3">
 <div className="flex items-center justify-between border border-[#0F0F0F] p-2 bg-white sketch-border-pill">
 <span className="text-[11px] font-mono font-bold">
 {selectedIds.includes('f-core-domain') ? ' your-brand.com [SECURE SSL]' : ' your-brand.sketch-order.store'}
 </span>
 <span className="text-[10px] font-bold">
 {selectedIds.includes('f-brand-sound') ? ' أصوات مفعلة' : ' صامت'}
 </span>
 </div>

 <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
 <div className="border border-[#0F0F0F] p-2.5 bg-white sketch-border-tag flex flex-col items-center justify-center">
 <span className="text-xl"></span>
 <span className="text-[11px] mt-1">كتالوج سكتش حي</span>
 </div>

 <div
 className={`border border-[#0F0F0F] p-2.5 sketch-border-tag flex flex-col items-center justify-center transition-colors ${
 selectedIds.includes('f-ord-whatsapp') ? 'bg-white' : 'bg-neutral-100 opacity-50'
 }`}
 >
 <span className="text-xl">
 {selectedIds.includes('f-ord-whatsapp') ? '' : ''}
 </span>
 <span className="text-[11px] mt-1">
 {selectedIds.includes('f-ord-whatsapp') ? 'ربط واتساب فوري' : 'بدون واتساب'}
 </span>
 </div>
 </div>

 {selectedIds.includes('f-brand-stickman') && (
 <div className="border-2 border-[#0F0F0F] p-2 bg-white sketch-border-3 text-xs font-bold flex items-center justify-between">
 <span> تميمة ستيك مان مخصصة للعلامة</span>
 <span className="font-mono text-[10px] bg-[#0F0F0F] text-white px-1.5 py-0.5 sketch-border-pill">
 6 وضعيات
 </span>
 </div>
 )}

 <div className="flex flex-wrap gap-1.5 pt-1">
 {selectedIds.includes('f-pay-online') && (
 <span className="text-[10px] border border-[#0F0F0F] bg-white px-2 py-0.5 sketch-border-pill font-mono font-bold">
 إنستاباي + فودافون كاش
 </span>
 )}
 {selectedIds.includes('f-ship-sync') && (
 <span className="text-[10px] border border-[#0F0F0F] bg-white px-2 py-0.5 sketch-border-pill font-mono font-bold">
 شحن محافظات مصر
 </span>
 )}
 {selectedIds.includes('f-ord-invoice') && (
 <span className="text-[10px] border border-[#0F0F0F] bg-white px-2 py-0.5 sketch-border-pill font-mono font-bold">
 فواتير ورقية
 </span>
 )}
 </div>
 </div>

 <div className="border-t border-dashed border-[#0F0F0F] pt-2 mt-3 flex justify-between items-center text-[11px] font-mono font-bold text-[#0F0F0F]/80">
 <span>المكونات المختارة: {selectedIds.length} من 11</span>
 <span>المخطط: جاهز للتنفيذ الفوري ✓</span>
 </div>
 </div>

 {/* Price & Delivery Live Estimate Box */}
 <div className="mt-4 pt-4 border-t-2 border-[#0F0F0F] space-y-3">
 <div className="flex justify-between items-baseline">
 <span className="text-sm font-bold">التكلفة التقديرية الإجمالية:</span>
 <div className="text-right">
 <span className="text-xs text-[#0F0F0F]/60 line-through font-mono ml-2">
 {rawTotal} ج.م
 </span>
 <span className="text-3xl font-black font-heading tracking-tight">
 {finalPrice} <span className="text-sm font-bold">ج.م</span>
 </span>
 </div>
 </div>

 <div className="flex justify-between items-center text-xs font-bold text-[#0F0F0F]/85 border-b border-dashed border-[#0F0F0F] pb-2">
 <span> مدة التسليم المتوقعة:</span>
 <span className="font-bold text-[#D9722B] dark:text-[#E88B4D]">في خلال دقايق معدودة </span>
 </div>

 <div className="p-2 border-2 border-dashed border-[#0F0F0F] bg-neutral-50 sketch-border-tag text-xs font-bold text-center -rotate-1">
 وفّرت <span className="font-mono font-black text-sm">{discount} ج.م</span> بخصم حزمة المخطط الهندسي!
 </div>

 <button
 onClick={() => {
 playClick();
 onSelectPlanAndOrder(selectedIds);
 }}
 className="btn-sketch btn-sketch-primary w-full text-base py-3.5 -rotate-1"
 >
 <Sparkles className="w-5 h-5" />
 <span>اعتمد هذا المخطط واطلب الآن</span>
 <ArrowLeft className="w-4 h-4 mr-auto" />
 </button>
 </div>

 </div>

 <div className="flex items-center justify-between px-2 text-xs font-bold">
 <button
 onClick={selectAll}
 className="hover:underline flex items-center gap-1"
 >
 <CheckSquare className="w-4 h-4" /> تحديد جميع المميزات (الحزمة الشاملة)
 </button>
 <button
 onClick={resetSelection}
 className="hover:underline opacity-70"
 >
 ↺ إعادة الضبط
 </button>
 </div>

 </div>

 {/* RIGHT: THE INTERACTIVE CHECKLIST CARDS */}
 <div className="lg:col-span-7 space-y-3">
 {filteredFeatures.map((item) => {
 const isChecked = selectedIds.includes(item.id);

 return (
 <div
 key={item.id}
 onClick={() => toggleFeature(item.id)}
 className={`border-2.5 p-4 sm:p-5 transition-all cursor-pointer select-none sketch-shadow-sm ${
 isChecked
 ? 'border-[#0F0F0F] bg-white sketch-border-1 -translate-y-0.5 sketch-shadow'
 : 'border-[#0F0F0F]/60 bg-white/70 sketch-border-2 hover:border-[#0F0F0F]'
 }`}
 >
 <div className="flex items-start gap-3.5">
 
 <div
 className={`w-7 h-7 shrink-0 border-2.5 border-[#0F0F0F] flex items-center justify-center transition-all ${
 isChecked
 ? 'bg-[#0F0F0F] text-white sketch-border-tag'
 : 'bg-white sketch-border-tag hover:scale-105'
 }`}
 >
 {isChecked ? (
 <svg
 className="w-5 h-5 text-white check-marker"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="3.5"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <polyline points="20 6 9 17 4 12" />
 </svg>
 ) : (
 <span className="opacity-0">✓</span>
 )}
 </div>

 <div className="flex-1 space-y-1">
 <div className="flex items-center justify-between gap-2">
 <h3 className="text-base sm:text-lg font-black font-heading text-[#0F0F0F] flex items-center gap-2">
 <span>{item.sketchIcon}</span>
 <span>{item.title}</span>
 </h3>
 <span className="text-sm font-mono font-black shrink-0">
 +{item.basePrice} ج.م
 </span>
 </div>

 <p className="text-xs sm:text-sm font-bold text-[#0F0F0F]/75 leading-relaxed">
 {item.description}
 </p>

 <div className="flex items-center gap-3 pt-1 text-[11px] font-mono font-bold text-[#0F0F0F]/60">
 <span className="text-[#D9722B] dark:text-[#E88B4D]">التسليم: في خلال دقايق</span>
 <span>•</span>
 <span>وحدة المخطط: {item.blueprintModule}</span>
 </div>
 </div>

 </div>
 </div>
 );
 })}
 </div>

 </div>

 </div>

 <HandDrawnDivider variant="squiggly" height={16} className="mt-14 mb-2" />
 </section>
 );
};
