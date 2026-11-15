import React from 'react';
import type { StudioTemplateMeta } from '../FullPageStoreStudio';

interface TemplateDualDeviceMockupProps {
  template: StudioTemplateMeta;
  className?: string;
  onPreviewClick?: () => void;
}

// Template-specific realistic website UI datasets
interface TemplateUiData {
  storeName: string;
  headline: string;
  subhead: string;
  category1: string;
  category2: string;
  category3: string;
  item1Name: string;
  item1Price: string;
  item2Name: string;
  item2Price: string;
  heroTag: string;
  navBg: string;
  navText: string;
  accentBg: string;
}

const TEMPLATE_UI_CONFIGS: Record<string, TemplateUiData> = {
  'sportech-sneakers': {
    storeName: 'SPORTECH',
    headline: 'كوليكشن السنيكرز 2026',
    subhead: 'أحدث أحذية الركض والجيم الأصلية',
    category1: 'سنيكرز رياضية',
    category2: 'أحذية ركض',
    category3: 'مستلزمات جيم',
    item1Name: 'Nike Air Pegasus',
    item1Price: '1,199 ج.م',
    item2Name: 'Adidas Predator',
    item2Price: '1,499 ج.م',
    heroTag: 'خصم 25% اليوم',
    navBg: 'bg-zinc-900',
    navText: 'text-white',
    accentBg: 'bg-[#D9722B]',
  },
  'cloudrunner-product': {
    storeName: 'CLOUD RUNNER',
    headline: 'Nike Cloud Runner 2',
    subhead: 'صفحة شراء متخصصة للطلب المباشر',
    category1: 'مقاس 42-45',
    category2: 'وسادة هوائية',
    category3: 'شحن فوري',
    item1Name: 'Cloud Runner Crimson',
    item1Price: '1,299 ج.م',
    item2Name: 'Cloud Runner Volt',
    item2Price: '1,299 ج.م',
    heroTag: 'الأكثر طلباً',
    navBg: 'bg-red-700',
    navText: 'text-white',
    accentBg: 'bg-red-600',
  },
  'dinereserve-food': {
    storeName: 'DINERESERVE',
    headline: 'مطاعم وأكلات فاخرة',
    subhead: 'قائمة طعام تفاعلية مع حجز طاولات',
    category1: 'ستيك ومشاوي',
    category2: 'سوشي ياباني',
    category3: 'باستا إيطالية',
    item1Name: 'Black Angus Steak',
    item1Price: '480 ج.م',
    item2Name: 'Sushi Platter 24',
    item2Price: '520 ج.م',
    heroTag: 'فاخر VIP',
    navBg: 'bg-slate-950',
    navText: 'text-amber-400',
    accentBg: 'bg-amber-600',
  },
  'fasco-fashion': {
    storeName: 'FASCO FASHION',
    headline: 'كوليكشن ملابس الستريت وير',
    subhead: 'أوفر سايز براندات وهوديز تريند',
    category1: 'هوديز وسويت شيرت',
    category2: 'بناطيل كارجو',
    category3: 'تيشرتات أوفر سايز',
    item1Name: 'Heavyweight Hoodie',
    item1Price: '750 ج.م',
    item2Name: 'Cargo Street Pants',
    item2Price: '620 ج.م',
    heroTag: 'تريند إنستجرام',
    navBg: 'bg-zinc-900',
    navText: 'text-white',
    accentBg: 'bg-zinc-800',
  },
  'burger-club': {
    storeName: 'BURGER CLUB',
    headline: 'برجر سماش بلدي 100%',
    subhead: 'ساندوتشات وبطاطس كرسبي مع صوصات',
    category1: 'سماش برجر',
    category2: 'تشيكن كرسبي',
    category3: 'كومبو وبطاطس',
    item1Name: 'Double Smash Beef',
    item1Price: '185 ج.م',
    item2Name: 'Loaded Cheese Fries',
    item2Price: '95 ج.م',
    heroTag: 'توصيل في 30 دقيقة',
    navBg: 'bg-emerald-900',
    navText: 'text-amber-300',
    accentBg: 'bg-amber-500',
  },
  'panto-minimal': {
    storeName: 'PANTO DECOR',
    headline: 'أثاث وديكور اسكندنافي',
    subhead: 'تصاميم هادئة وعصرية للمنازل الحديثة',
    category1: 'كنب ومقاعد',
    category2: 'طاولات خشبية',
    category3: 'وحدات إضاءة',
    item1Name: 'Nordic Lounge Chair',
    item1Price: '3,200 ج.م',
    item2Name: 'Oak Coffee Table',
    item2Price: '1,850 ج.م',
    heroTag: 'خشب زان طبيعي',
    navBg: 'bg-stone-900',
    navText: 'text-emerald-300',
    accentBg: 'bg-emerald-700',
  },
  'velvety-jewelry': {
    storeName: 'VELVETY',
    headline: 'عطور ومجوهرات راقية',
    subhead: 'مستحضرات عناية وزيوت عطرية فرنسية',
    category1: 'عطور فرنسية',
    category2: 'مجوهرات ذهب',
    category3: 'بكجات عناية',
    item1Name: 'Velvet Rose Eau De Parfum',
    item1Price: '890 ج.م',
    item2Name: 'Gold Plated Bracelet',
    item2Price: '650 ج.م',
    heroTag: 'شحن هدايا مجاناً',
    navBg: 'bg-purple-950',
    navText: 'text-amber-300',
    accentBg: 'bg-purple-700',
  },
  'ctrl-yz': {
    storeName: 'CTRL YZ 3D',
    headline: '3D CYBERPUNK WEAR',
    subhead: 'أوفر سايز بطباعة ثري دي مجسمة',
    category1: 'هوديز 3D مجسم',
    category2: 'تيشرتات سايبر',
    category3: 'كابات وإكسسوارات',
    item1Name: 'CTRL Cyber Hoodie',
    item1Price: '850 ج.م',
    item2Name: 'Overprint Black Tee',
    item2Price: '480 ج.م',
    heroTag: 'كوليكشن 2026',
    navBg: 'bg-black',
    navText: 'text-[#D9722B]',
    accentBg: 'bg-[#D9722B]',
  },
  'sketch-comic': {
    storeName: 'SKETCH COMIC',
    headline: 'متجر سكتش بالرسم اليدوي',
    subhead: 'هوية مرسومة بالحبر الأسود وتميمة سكتش مان',
    category1: 'أزياء مرسومة',
    category2: 'كوتشيات سكتش',
    category3: 'لوحات واستيكرز',
    item1Name: 'Stickman Doodle Tee',
    item1Price: '390 ج.م',
    item2Name: 'Hand-drawn Shoes',
    item2Price: '990 ج.م',
    heroTag: 'هوية حصرية 100%',
    navBg: 'bg-black',
    navText: 'text-white',
    accentBg: 'bg-[#D9722B]',
  },
};

export const TemplateDualDeviceMockup: React.FC<TemplateDualDeviceMockupProps> = ({
  template,
  className = '',
  onPreviewClick,
}) => {
  const ui = TEMPLATE_UI_CONFIGS[template.id] || TEMPLATE_UI_CONFIGS['sportech-sneakers'];

  return (
    <div
      onClick={onPreviewClick}
      className={`relative w-full aspect-[16/11] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 via-zinc-100 to-slate-200 dark:from-slate-900 dark:via-slate-850 dark:to-slate-950 p-2 sm:p-2.5 flex items-center justify-center select-none group cursor-pointer border-b-2 border-inherit ${className}`}
    >
      {/* Background Dots Grid */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:10px_10px]"></div>

      {/* ======================================================== */}
      {/* 1. PC / DESKTOP WEBSITE HOMEPAGE MOCKUP (Background)     */}
      {/* Complete web layout: Header + Hero + Categories + Grid  */}
      {/* ======================================================== */}
      <div className="w-[88%] h-[84%] rounded-xl overflow-hidden border-2 border-slate-700/80 bg-white dark:bg-slate-950 shadow-md transform -translate-x-2 -translate-y-1 transition-all duration-300 group-hover:scale-[1.01] relative z-10 flex flex-col justify-between">
        
        {/* Desktop Browser Chrome Bar */}
        <div className="h-4 sm:h-5 bg-slate-200 dark:bg-slate-800 px-2 flex items-center justify-between border-b border-slate-300 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-[7px] sm:text-[8px] font-mono font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
            <span className="text-emerald-500">🔒</span>
            <span>https://{template.id}.store</span>
          </div>
          <span className="text-[6px] sm:text-[7px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded">
            💻 PC Web
          </span>
        </div>

        {/* Real Desktop Website Content */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-900 text-white relative">
          
          {/* Desktop Web Navbar */}
          <div className="h-5 sm:h-6 bg-black/90 px-2 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-[#D9722B] flex items-center justify-center text-[5px]">⚡</span>
              <span className="font-heading font-black text-[8px] tracking-wide text-white">
                {ui.storeName}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[6px] font-bold text-zinc-300">
              <span className="text-white">الرئيسية</span>
              <span>المنتجات</span>
              <span>العروض</span>
              <span>تواصل</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[6px] bg-white/10 px-1 py-0.5 rounded text-zinc-300 hidden sm:inline">🔍 بحث...</span>
              <span className="w-3.5 h-3.5 rounded bg-[#D9722B] text-white flex items-center justify-center text-[6px] font-bold">🛒 2</span>
            </div>
          </div>

          {/* Desktop Hero Banner */}
          <div className="relative flex-1 p-2 flex items-center justify-between overflow-hidden bg-gradient-to-r from-black/90 via-black/60 to-transparent">
            {/* Background Store Image */}
            <img
              src={template.previewImage}
              alt={`${template.name} Desktop Homepage`}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-45 group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />

            {/* Headline and CTA text on left */}
            <div className="relative z-10 space-y-1 max-w-[55%]">
              <span className="text-[6px] font-mono font-bold px-1 py-0.5 rounded bg-[#D9722B] text-white inline-block">
                {ui.heroTag}
              </span>
              <div className="font-heading font-black text-[9px] sm:text-[11px] leading-tight text-white drop-shadow-sm">
                {ui.headline}
              </div>
              <p className="text-[6px] sm:text-[7px] text-zinc-300 font-bold truncate">
                {ui.subhead}
              </p>
              <div className="pt-0.5">
                <span className="px-2 py-0.5 rounded bg-white text-slate-950 font-black text-[6px] inline-flex items-center gap-0.5 shadow-xs">
                  تسوق الكولكشن 🛍️
                </span>
              </div>
            </div>

            {/* Floating Hero Product Badge on right */}
            <div className="relative z-10 w-14 sm:w-18 h-12 sm:h-14 rounded-lg overflow-hidden border border-white/20 shadow-lg bg-black/60 p-1 flex flex-col justify-between shrink-0">
              <img
                src={template.previewImage}
                alt="Product feature"
                className="w-full h-7 sm:h-8 object-cover rounded"
              />
              <div className="text-[6px] font-bold text-white truncate text-center">
                {ui.item1Name}
              </div>
              <div className="text-[6px] font-mono font-black text-amber-300 text-center">
                {ui.item1Price}
              </div>
            </div>
          </div>

          {/* Desktop Categories & Mini Product Row Bar */}
          <div className="h-6 sm:h-7 bg-zinc-950/95 border-t border-white/10 px-2 flex items-center justify-between text-[6px] font-bold shrink-0">
            <div className="flex items-center gap-1">
              <span className="text-zinc-400">الأقسام:</span>
              <span className="px-1 py-0.5 rounded bg-white/10 text-white">{ui.category1}</span>
              <span className="px-1 py-0.5 rounded bg-white/10 text-white">{ui.category2}</span>
              <span className="px-1 py-0.5 rounded bg-white/10 text-white hidden sm:inline">{ui.category3}</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 font-mono">
              <span>✓ شحن لجميع المحافظات</span>
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MOBILE / PHONE WEBSITE HOMEPAGE MOCKUP (Foreground)   */}
      {/* Complete mobile layout: Topbar + Stories + Banner + WhatsApp */}
      {/* ======================================================== */}
      <div className="absolute left-2.5 sm:left-4 bottom-1.5 sm:bottom-2.5 w-[34%] sm:w-[35%] h-[88%] rounded-[18px] sm:rounded-[20px] border-[2.5px] border-slate-950 dark:border-slate-700 bg-slate-950 shadow-2xl overflow-hidden z-20 transform group-hover:scale-105 transition-all duration-300 flex flex-col justify-between">
        
        {/* Dynamic Island / Notch */}
        <div className="h-3 bg-black px-2 flex items-center justify-between text-white text-[5px] font-mono shrink-0">
          <span>10:30</span>
          <div className="w-6 h-1.5 rounded-full bg-slate-900 border border-slate-800"></div>
          <span>5G 🔋</span>
        </div>

        {/* Real Mobile Store Homepage Screen */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-900 text-white relative">
          
          {/* Mobile Store Header */}
          <div className="h-5 bg-black/95 px-1.5 flex items-center justify-between border-b border-white/15 shrink-0">
            <span className="text-[7px]">☰</span>
            <span className="font-heading font-black text-[7px] text-white truncate max-w-[60px]">
              {ui.storeName}
            </span>
            <span className="w-3 h-3 rounded-full bg-[#D9722B] text-white flex items-center justify-center text-[5px] font-bold">
              🛒
            </span>
          </div>

          {/* Mobile Stories / Quick Categories Row */}
          <div className="px-1 py-0.5 flex items-center justify-between bg-zinc-950/80 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-1 overflow-hidden">
              <span className="w-3 h-3 rounded-full border border-[#D9722B] bg-[#D9722B]/20 flex items-center justify-center text-[4px]">🔥</span>
              <span className="w-3 h-3 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-[4px]">👟</span>
              <span className="w-3 h-3 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-[4px]">⭐</span>
            </div>
            <span className="text-[5px] font-mono text-[#D9722B] font-bold">📱 موبايل</span>
          </div>

          {/* Mobile Hero Banner */}
          <div className="relative flex-1 overflow-hidden p-1 flex flex-col justify-between">
            <img
              src={template.previewImage}
              alt={`${template.name} Mobile Homepage`}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-55"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/60 pointer-events-none"></div>

            {/* Mobile Tag */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-1 rounded bg-[#D9722B] text-[5px] font-bold">
                {ui.heroTag}
              </span>
              <span className="text-[5px] font-mono text-amber-300">★ 4.9</span>
            </div>

            {/* Mobile Product Card & Quick WhatsApp Action */}
            <div className="relative z-10 space-y-0.5">
              <div className="text-[6px] font-black font-heading truncate text-white">
                {ui.item1Name}
              </div>
              <div className="text-[6px] font-mono font-black text-amber-300">
                {ui.item1Price}
              </div>
              <div className="w-full py-0.5 rounded bg-emerald-600 text-white font-black text-[5px] text-center shadow-xs flex items-center justify-center gap-0.5">
                <span>اطلب بالواتساب 💬</span>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Tabbar */}
          <div className="h-3.5 bg-black px-2 flex items-center justify-between text-[5px] text-zinc-400 border-t border-white/10 shrink-0">
            <span className="text-white">🏠 رئيسية</span>
            <span>🔍 بحث</span>
            <span>📦 طلباتي</span>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. CORNER BADGES (Matches User's Reference Screenshot)    */}
      {/* ======================================================== */}
      {/* Top Right: Green Badge "مجاني بالباقة" */}
      <div className="absolute top-2 right-2 z-30">
        <span className="px-2 py-0.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black font-mono shadow-md flex items-center gap-1 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          <span>مجاني بالباقة</span>
        </span>
      </div>

      {/* Top Left: Circular Arrow Action Button ↗ */}
      <div className="absolute top-2 left-2 z-30 w-6 h-6 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white flex items-center justify-center shadow-md border border-slate-300 dark:border-slate-700 group-hover:bg-[#D9722B] group-hover:text-white group-hover:border-[#D9722B] transition-all duration-300 group-hover:scale-110">
        <span className="text-[11px] font-black">↗</span>
      </div>

      {/* Bottom Corner Tag: Dual View Label */}
      <div className="absolute bottom-1.5 right-2 z-10 text-[8px] font-mono font-bold text-zinc-600 dark:text-zinc-300 bg-white/90 dark:bg-slate-900/90 px-1.5 py-0.5 rounded-md backdrop-blur-xs border border-zinc-200 dark:border-slate-700 shadow-2xs">
        📱 Phone + 💻 PC Web
      </div>
    </div>
  );
};
