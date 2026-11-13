import React, { useState } from 'react';
import {
 ArrowRight,
 ShoppingBag,
 Plus,
 Trash2,
 Rocket,
 Sliders,
 Layers,
 BarChart3,
 TrendingUp,
 DollarSign,
 Package,
 CheckCircle2,
 Heart,
 Share2,
 ChevronLeft,
 Search,
 Star,
 Clock,
 Utensils,
 Footprints,
 Flame,
 X,
 Send,
 Eye,
 Settings,
 Grid,
 Maximize2,
 Minimize2,
 Calendar,
 Users,
 Menu,
 Sun,
 Moon,
 Smartphone,
 Tablet,
 Monitor,
} from 'lucide-react';
import type {
 TemplateId,
 CustomProduct,
 CartItem,
 CustomStoreConfig,
} from '../types';
import { playClick, playPencilScratch, playPaperFlip } from '../utils/soundEffects';
import brushLogoWhite from '../assets/sketch-brush-logo-white.png';

interface FullPageStoreStudioProps {
 onBackToHome: () => void;
 onBuyAndDeploy: (config: CustomStoreConfig) => void;
 initialConfig?: CustomStoreConfig | null;
  initialTemplateId?: TemplateId;
 onOpenTemplatesPage?: () => void;
 isDarkMode?: boolean;
 onToggleDarkMode?: () => void;
}

// -------------------------------------------------------------
// TEMPLATES CATALOG (Figma Style Visual Grid)
// -------------------------------------------------------------

export interface StudioTemplateMeta {
 id: TemplateId;
 name: string;
 nameEn: string;
 categoryBadge: string;
 themeStyle: 'modern' | 'luxury-dark' | 'minimal' | 'retro' | 'sketch';
 accentColor: string;
 bgPage: string;
 cardBg: string;
 description: string;
 tag: string;
 previewImage: string;
}

export const STUDIO_TEMPLATES: StudioTemplateMeta[] = [
 {
 id: 'sportech-sneakers',
 name: 'سبورتك الرياضي (SPORTECH)',
 nameEn: 'Sports & Athletic Gear',
 categoryBadge: 'كوتشيات ومستلزمات رياضية',
 themeStyle: 'modern',
 accentColor: '#F97316',
 bgPage: '#F8FAFC',
 cardBg: '#FFFFFF',
 description: 'واجهة متجر سبورتك بتصميم رياضي جريء، بنر تفاعلي، أقسام بالأيقونات وبادجات Best Seller.',
 tag: 'الأكثر طلباً للكوتشيات ',
 previewImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
 },
 {
 id: 'cloudrunner-product',
 name: 'صفحة منتج نايكي (Cloud Runner 2)',
 nameEn: 'Single Product Showcase',
 categoryBadge: 'صفحة هبوط منتج متخصص',
 themeStyle: 'modern',
 accentColor: '#DC2626',
 bgPage: '#FFFFFF',
 cardBg: '#FFFFFF',
 description: 'صفحة شراء تفصيلية للكوتشي مع محدد ألوان (Crimson/Volt)، مقاسات US، وشريط شراء سفلي ثابت.',
 tag: 'أعلى نسبة تحويل مبيعات ',
 previewImage: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80',
 },
 {
 id: 'dinereserve-food',
 name: 'داين ريزيرف الفاخر (DineReserve)',
 nameEn: 'Dark Luxury Dining & Gourmet',
 categoryBadge: 'مطاعم وأكلات فاخرة',
 themeStyle: 'luxury-dark',
 accentColor: '#EA580C',
 bgPage: '#090D16',
 cardBg: '#131A29',
 description: 'واجهة داكنة فاخرة للمطاعم والكافيهات، حجز طاولات فوري، وأقسام السوشي والستيك والبيتزا الإيطالية.',
 tag: 'فخامة وغموض دارك ',
 previewImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
 },
 {
 id: 'fasco-fashion',
 name: 'فاسكو ستريت وير (FASCO)',
 nameEn: 'Minimalist Clothing & Streetwear',
 categoryBadge: 'أزياء وملابس كاجوال',
 themeStyle: 'minimal',
 accentColor: '#0F172A',
 bgPage: '#F5F5F4',
 cardBg: '#FFFFFF',
 description: 'تصميم نيوترال عصري لبراندات الملابس والأوفر سايز والستريت وير مستوحى من Figma FASCO.',
 tag: 'شبابي وتريند إنستجرام ',
 previewImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
 },
 {
 id: 'burger-club',
 name: 'برجر كلوب (Burger Club & Fries)',
 nameEn: 'Fast Food & Smash Burgers',
 categoryBadge: 'مطاعم وساندوتشات سريعة',
 themeStyle: 'retro',
 accentColor: '#D97706',
 bgPage: '#064E3B',
 cardBg: '#022C22',
 description: 'ستايل ريترو جذاب باللون الأخضر الغامق والأصفر للمطاعم والبرجر السماش والمقبلات.',
 tag: 'شهي ومغري للطلب ',
 previewImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
 },
 {
 id: 'panto-minimal',
 name: 'بانتو للأثاث (Panto Scandinavian)',
 nameEn: 'Minimal Furniture & Decor',
 categoryBadge: 'أثاث وديكور منزلي',
 themeStyle: 'minimal',
 accentColor: '#047857',
 bgPage: '#FAFAF9',
 cardBg: '#FFFFFF',
 description: 'أثاث وديكور اسكندنافي أنيق بخطوط ناعمة وظلال خفيفة مستوحى من فيجما Panto Furniture.',
 tag: 'ديكور دافئ وفاخر ',
 previewImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80',
 },
 {
 id: 'velvety-jewelry',
 name: 'فيلفيتي للمجوهرات والعطور (Velvety)',
 nameEn: 'Luxury Jewelry & Perfumes',
 categoryBadge: 'عطور ومجوهرات ومستحضرات تجميل',
 themeStyle: 'minimal',
 accentColor: '#9333EA',
 bgPage: '#FAF5FF',
 cardBg: '#FFFFFF',
 description: 'واجهة عطرية راقية بلمسات ذهبية وبنفسجية ناعمة لبراندات العناية، العطور المركزة والمجوهرات.',
 tag: 'أنوثة ورقي ساحر ',
 previewImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
 },
 {
 id: 'sketch-comic',
 name: 'سكتش كوميكس (Hand-Drawn Sketch)',
 nameEn: 'Comic & Stickman Ink',
 categoryBadge: 'طابع ورقي مرسوم',
 themeStyle: 'sketch',
 accentColor: '#0F0F0F',
 bgPage: '#FFFFFF',
 cardBg: '#FFFFFF',
 description: 'الهوية الأصلية لسكتش أوردر: حبر أسود وظلال قاسية 0px بدون تدرجات وتميمة سكتش مان.',
 tag: 'الهوية الأصلية ',
 previewImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
 },
];

// -------------------------------------------------------------
// REALISTIC PRODUCTS DATASETS
// -------------------------------------------------------------

export const DEFAULT_PRODUCTS_MAP: Record<TemplateId, CustomProduct[]> = {
 'sportech-sneakers': [
 {
 id: 'sp-1',
 name: 'Nike Air Zoom Pegasus - أحمر وأبيض للركض',
 price: 1199,
 originalPrice: 1450,
 costPrice: 720,
 category: 'سنيكرز',
 tag: 'Best Seller',
 badge: 'الأكثر مبيعاً ',
 imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
 rating: 4.8,
 reviewsCount: 320,
 sizes: ['40', '41', '42', '43', '44', '45'],
 colors: [
 { name: 'Red Crimson', hex: '#DC2626' },
 { name: 'Pure White', hex: '#FFFFFF' },
 { name: 'Midnight Black', hex: '#0F172A' },
 ],
 description: 'حذاء نايكي بيجاسوس المخصص للركض والماراثونات اليومية. نعل خفيف ممتص للصدمات بتقنية React Foam ونعل سفلي وافل متين يضمن ثباتاً مطلقاً على مختلف الأسطح.',
 },
 {
 id: 'sp-2',
 name: 'Adidas Predator Elite Football Boots - أسود وبرتقالي',
 price: 1499,
 originalPrice: 1890,
 costPrice: 900,
 category: 'كرة قدم',
 tag: 'New',
 badge: 'جديد 2026',
 imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80',
 rating: 4.9,
 reviewsCount: 210,
 sizes: ['41', '42', '43', '44'],
 colors: [
 { name: 'Solar Orange', hex: '#F97316' },
 { name: 'Core Black', hex: '#18181B' },
 ],
 description: 'حذاء كرة قدم أديداس بريداتور المحترف لنجوم الملاعب العشبية. مزود بزعانف تحكم مطاطية Strikeskin لدقة تسديد لا تضاهى.',
 },
 {
 id: 'sp-3',
 name: 'ساعة رياضية ذكية Smart Track Pro - تتبع نبضات ومسافات',
 price: 540,
 originalPrice: 680,
 costPrice: 310,
 category: 'جيم وتدريب',
 badge: '20% OFF',
 imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
 rating: 4.7,
 reviewsCount: 154,
 description: 'ساعة ذكية مقاومة للماء مع شاشة AMOLED لعرض السعرات الحرارية ومعدل ضربات القلب والمسافة مع بطارية تدوم 7 أيام متواصلة.',
 },
 {
 id: 'sp-4',
 name: 'تيشرت مانشستر الرياضي الأصلي للتدريب الاحترافي',
 price: 790,
 originalPrice: 950,
 costPrice: 420,
 category: 'قمصان',
 tag: 'New',
 badge: 'إصدار رسمي',
 imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
 rating: 4.8,
 reviewsCount: 88,
 sizes: ['M', 'L', 'XL', '2XL'],
 description: 'قميص تدريب رياضي رسمي بخامة Dri-FIT سريعة الجفاف تمنحك انتعاشاً دائماً أثناء المباريات والتمارين الشاقة.',
 },
 ],

 'cloudrunner-product': [
 {
 id: 'cr-1',
 name: 'Cloud Runner 2 Knit Running Shoe',
 price: 1290,
 originalPrice: 1590,
 costPrice: 780,
 category: 'كوتشيات ركض',
 description: 'حذاء نايكي كلاود رانر 2 المحبوك بتقنية التهوية الذكية ونعل ممتص للصدمات يمنحك سرعة وخفة فائقة على الإسفلت والتراك.',
 tag: 'New Edition',
 badge: 'خصم 19%',
 imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
 rating: 4.8,
 reviewsCount: 2341,
 soldCount: '1.2k مباع في مصر',
 sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5'],
 colors: [
 { name: 'Crimson / Ember', hex: '#DC2626' },
 { name: 'Dark Stealth', hex: '#18181B' },
 { name: 'Volt Green', hex: '#84CC16' },
 ],
 },
 ],

 'dinereserve-food': [
 {
 id: 'dr-1',
 name: 'The Golden Fork • شرائح ستيك بلاك آنجوس مدخنة',
 price: 480,
 originalPrice: 590,
 costPrice: 240,
 category: 'ستيك هاوس',
 description: 'أرقى مطعم ستيك هاوس في الزمالك • لحم بلاك آنجوس مشوي على خشب الأوك الطبيعي مع صوص الفلفل الأسود والبطاطس البوريه.',
 tag: 'Best Rated',
 badge: 'الأعلى تقييماً ',
 imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
 rating: 4.8,
 reviewsCount: 512,
 soldCount: 'الزمالك • 0.3 كم',
 },
 {
 id: 'dr-2',
 name: 'Sakura Sushi • بلاتر سوشي وساشيمي فاخر (18 قطعة)',
 price: 360,
 originalPrice: 440,
 costPrice: 190,
 category: 'سوشي',
 description: 'أصناف السوشي والساشيمي المحضرة بأعلى جودة مع سالمون نرويجي وتونا طازجة يومياً مع أرز ياباني متبل.',
 badge: 'حجز فوري',
 imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80',
 rating: 4.7,
 reviewsCount: 418,
 soldCount: 'المعادي • 0.6 كم',
 },
 {
 id: 'dr-3',
 name: 'Mario\'s Trattoria • بيتزا نابوليتانا بالتروفل والموزاريلا',
 price: 240,
 originalPrice: 290,
 costPrice: 120,
 category: 'إيطالي',
 description: 'عجينة مخمرة 48 ساعة ومخبوزة في فرن الحطب الإيطالي مع جبن موزاريلا دي بوفالا وأوراق الريحان الطازج.',
 badge: 'موصى به',
 imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
 rating: 4.9,
 reviewsCount: 390,
 soldCount: 'التجمع الخامس • 1.5 كم',
 },
 {
 id: 'dr-4',
 name: 'Molten Belgian Chocolate • كيك شوكولاتة بلجيكية دافئة مع آيس كريم',
 price: 190,
 originalPrice: 240,
 costPrice: 85,
 category: 'كافيه وحلويات',
 badge: 'شيف سبيشال ',
 imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
 rating: 4.9,
 reviewsCount: 480,
 soldCount: 'الزمالك • 0.3 كم',
 description: 'كيكة شوكولاتة بلجيكية ساخنة بقلب يذوب فوراً، تقدم مع بولة آيس كريم فانيليا مدغشقر وتوت طازج.',
 },
 ],

 'fasco-fashion': [
 {
 id: 'fa-1',
 name: 'FASCO Oversized Heavyweight Tee - بيج نيوترال 280 GSM',
 price: 490,
 originalPrice: 650,
 costPrice: 220,
 category: 'أوفر سايز تيشرت',
 tag: 'Drop 01',
 badge: 'قطن مصري 100%',
 imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
 rating: 4.9,
 reviewsCount: 412,
 sizes: ['S', 'M', 'L', 'XL', '2XL'],
 colors: [
 { name: 'Oatmeal Beige', hex: '#D6C7B2' },
 { name: 'Washed Black', hex: '#262626' },
 ],
 description: 'تيشيرت أوفر سايز بقصة بوكسي دروب شولدر خامة قطن مصري فاخر ثقيل لا ينكمش مع الغسيل.',
 },
 {
 id: 'fa-2',
 name: 'Urban Cargo Parachute Pants - رمادي فحم مطفي',
 price: 780,
 originalPrice: 950,
 costPrice: 380,
 category: 'بناطيل كارجو',
 badge: 'تريند الموسم',
 imageUrl: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&auto=format&fit=crop&q=80',
 rating: 4.8,
 reviewsCount: 190,
 sizes: ['M', 'L', 'XL'],
 description: 'بنطلون كارجو باراشوت بجيوب جانبية متعددة ورباط كاحل قابل للتعديل لمظهر ستريت وير جريء.',
 },
 {
 id: 'fa-3',
 name: 'Acid Wash Boxy Hoodie - هودي شتوي مبطن فائق النعومة',
 price: 890,
 originalPrice: 1150,
 costPrice: 450,
 category: 'هوديز وسويت شيرت',
 badge: 'شتاء 2026',
 imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
 rating: 4.9,
 reviewsCount: 260,
 sizes: ['L', 'XL', '2XL'],
 description: 'هودي شتوي مغسول معالجة آسيد واش مع بطانة داخلية صوفية دافئة وجيب كنغر أمامي واسع.',
 },
 {
 id: 'fa-4',
 name: 'FASCO Vintage Washed Cap - كاب ستريت قطني مطرز',
 price: 290,
 originalPrice: 380,
 costPrice: 130,
 category: 'إكسسوارات وكابات',
 badge: 'إصدار محدود',
 imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80',
 rating: 4.8,
 reviewsCount: 145,
 description: 'كاب قطني مغسول بتطريز FASCO البارز مع إبزيم معدني خلفي قابل للتعديل.',
 },
 ],

 'burger-club': [
 {
 id: 'bc-1',
 name: 'The Beast Double Smash Burger • بيف بلدي مع شيدر سايح',
 price: 210,
 originalPrice: 260,
 costPrice: 110,
 category: 'سندوتشات برجر',
 tag: 'Best Seller',
 badge: 'الأكثر مبيعاً ',
 imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
 rating: 4.9,
 reviewsCount: 680,
 description: 'شريحتان من اللحم البقري الطازج المشوي على الصاج الساخن مع جبن شيدر أمريكي ذائب وصوص البرجر السري في خبز بريوش بالزبدة.',
 },
 {
 id: 'bc-2',
 name: 'تشيزي بيكون فرايز • بطاطس مقرمشة بقطع البيكون المقرمش',
 price: 85,
 originalPrice: 110,
 costPrice: 40,
 category: 'مقبلات وفرايز',
 badge: 'ساخن ولذيذ',
 imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
 rating: 4.7,
 reviewsCount: 310,
 description: 'أصابع بطاطس مقرمشة مغطاة بصوص الجبن الشيدر الساخن وقطع بيف بيكون مدخن ورشة هلابينو.',
 },
 ],

 'panto-minimal': [
 {
 id: 'pa-1',
 name: 'كرسي لاونج نورديك مريح - قماش بوكليه ناعم وأرجل خشب زان',
 price: 2450,
 originalPrice: 3100,
 costPrice: 1400,
 category: 'كراسي ولاونج',
 description: 'تصميم اسكندنافي بسيط يضفي لمسة من الفخامة والهدوء لغرفة المعيشة أو ركن القراءة.',
 tag: 'Best Interior',
 badge: 'خشب طبيعي 100%',
 imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80',
 rating: 4.9,
 reviewsCount: 178,
 },
 {
 id: 'pa-2',
 name: 'طاولة قهوة دائرية خشب بلوط بتشطيب يدوي غير لامع',
 price: 1850,
 originalPrice: 2200,
 costPrice: 950,
 category: 'طاولات وترابيزات',
 badge: 'تصميم مينيمال',
 imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&auto=format&fit=crop&q=80',
 rating: 4.8,
 reviewsCount: 94,
 },
 {
 id: 'pa-3',
 name: 'مصباح أرضي مودرن بقاعدة رخام أسود وإضاءة دافئة',
 price: 1200,
 originalPrice: 1550,
 costPrice: 620,
 category: 'إضاءة وديكور',
 badge: 'إضاءة محيطية',
 imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
 rating: 4.7,
 reviewsCount: 82,
 },
 ],

 'velvety-jewelry': [
 {
 id: 'vj-1',
 name: 'عطر أورينتال رويال عود مركز - زجاجة كريستال 100ml',
 price: 1450,
 originalPrice: 1850,
 costPrice: 680,
 category: 'عطور فاخرة',
 tag: 'Exclusive',
 badge: 'ثبات 48 ساعة ',
 imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
 rating: 4.9,
 reviewsCount: 290,
 description: 'توليفة شرقية آسرة من دهن العود الكمبودي النادر ولمسات العنبر الدافئ مع خشب الصندل العطري.',
 },
 {
 id: 'vj-2',
 name: 'خاتم ذهب عيار 18 بتصميم مينيمال بحجر زركون برّاق',
 price: 2850,
 originalPrice: 3400,
 costPrice: 1900,
 category: 'مجوهرات وذهب',
 badge: 'ذهب أصلي معتمد',
 imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80',
 rating: 5.0,
 reviewsCount: 145,
 description: 'خاتم سوليتير أنيق من الذهب الأصفر عيار 18 معتمد مع شهادة ضمان وضبط مقاس مجاني مدى الحياة.',
 },
 ],

 'sketch-comic': [
 {
 id: 'sk-1',
 name: 'كوتشي سنيكرز مرسوم بحبر أسود Sketch Edition',
 price: 1350,
 originalPrice: 1750,
 costPrice: 700,
 category: 'كوتشيات سكتش',
 tag: 'يدوي 100%',
 badge: 'إصدار ستيك مان',
 imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
 rating: 5.0,
 reviewsCount: 640,
 sizes: ['40', '41', '42', '43', '44'],
 description: 'حذاء سنيكرز فني أبيض مرسوم يدوياً بخطوط الحبر الكوميدي المستوحاة من كشكول الرسم والستيك مان.',
 },
 ],
};

export const DEFAULT_TAGLINES_MAP: Record<TemplateId, string> = {
  'sportech-sneakers': 'المتجر الأول في مصر للكوتشيات والمستلزمات الرياضية الأصلية',
  'cloudrunner-product': 'حذاء الجري فائق الخفة والممتص للصدمات لتجربة مشي وركض استثنائية',
  'dinereserve-food': 'تجربة طعام فاخرة في قلب القاهرة مع حجوزات طاولات فورية وقائمة استثنائية',
  'fasco-fashion': 'تشكيلة أوفر سايز 100% قطن مصري شبابي بستايل الستريت وير الكاجوال',
  'burger-club': 'أشهى برجر سماش باللحم البلدي، صوصات سرية وبطاطس كريسبي ساخنة',
  'panto-minimal': 'أثاث وديكور اسكندنافي عصري بخطوط ناعمة وخامات خشبية طبيعية',
  'velvety-jewelry': 'عطور شرقية وفرنسية نادرة ومجوهرات مطلية بالذهب بتصاميم راقية',
  'sketch-comic': 'تصميم ورقي مصري مميز مستوحى من فن الكوميكس والرسومات اليدوية',
};

export const DEFAULT_CATEGORIES_MAP: Record<TemplateId, string[]> = {
 'sportech-sneakers': ['الكل', 'سنيكرز', 'كرة قدم', 'كرة سلة', 'جيم وتدريب', 'قمصان'],
 'cloudrunner-product': ['الكل', 'كوتشيات ركض', 'ملابس ركض', 'إكسسوارات'],
 'dinereserve-food': ['الكل', 'ستيك هاوس', 'سوشي', 'إيطالي', 'كافيه وحلويات'],
 'fasco-fashion': ['الكل', 'هوديز وسويت شيرت', 'بناطيل كارجو', 'أوفر سايز تيشرت', 'كولكشن الشتاء'],
 'burger-club': ['الكل', 'سندوتشات برجر', 'مقبلات وفرايز', 'مشروبات وشيك'],
 'panto-minimal': ['الكل', 'كراسي ولاونج', 'طاولات وترابيزات', 'كنب وأنتريه', 'إضاءة وديكور'],
 'velvety-jewelry': ['الكل', 'عطور فاخرة', 'مجوهرات وذهب', 'عناية وتجميل', 'مجموعات الهدايا'],
 'sketch-comic': ['الكل', 'كوتشيات سكتش', 'ملابس مانجا', 'ستيكرز ورقية', 'كشاكيل ودفاتر'],
};

// -------------------------------------------------------------
// COMPONENT
// -------------------------------------------------------------

export const FullPageStoreStudio: React.FC<FullPageStoreStudioProps> = ({
 onBackToHome,
 onBuyAndDeploy,
 initialConfig = null,
  initialTemplateId,
 onOpenTemplatesPage,
 isDarkMode = false,
 onToggleDarkMode,
}) => {
 // Main Studio States
 const [activeView, setActiveView] = useState<'preview' | 'admin'>('preview');
 const [adminTab, setAdminTab] = useState<'products' | 'categories' | 'analytics' | 'branding'>('products');
 
 // USER INSTRUCTION 1: "خلي دا الشكل اللي يظهر اول ما يفتح الاستوديو" (Catalog open by default)
 
 // USER INSTRUCTION 6: "واعمل زر يدخلك جوا تيمبليت الويب بشكل كامل كأنك مستخدم"
 const [isFullScreenStorefront, setIsFullScreenStorefront] = useState<boolean>(false);

 // USER INSTRUCTION: Live Studio Viewport Switcher (iPhone 13 Pro 390px, Tablet 768px, Desktop 100%)
 const [viewportMode, setViewportMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

 // Active Store Configuration
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>(
    initialTemplateId || (initialConfig ? initialConfig.templateId : 'sportech-sneakers')
  );

  React.useEffect(() => {
    if (initialTemplateId && initialTemplateId !== selectedTemplateId) {
      handleSelectTemplate(initialTemplateId);
    }
  }, [initialTemplateId]);

 const [storeConfig, setStoreConfig] = useState<CustomStoreConfig>(
 initialConfig || {
 storeName: 'سبورتك إيجيبت (SPORTECH)',
 tagline: 'المتجر الأول في مصر للكوتشيات والمستلزمات الرياضية الأصلية',
 niche: 'sneakers',
 templateId: 'sportech-sneakers',
 accentColor: '#F97316',
 customDomain: 'sportech-eg.store',
 currency: 'ج.م',
 whatsappNumber: '01012345678',
 governorate: 'القاهرة والجيزة',
 sections: {
 heroBanner: true,
 categoriesBar: true,
 sizeGuide: true,
 bestSellers: true,
 flashSale: true,
 reviewsSection: true,
 instantWhatsappCart: true,
 analyticsDashboard: true,
 },
 categories: DEFAULT_CATEGORIES_MAP['sportech-sneakers'],
 products: DEFAULT_PRODUCTS_MAP['sportech-sneakers'],
 }
 );

 // USER INSTRUCTION 5: In-Phone Screen & Interaction states
 const [phoneScreen, setPhoneScreen] = useState<'home' | 'product_detail' | 'cart' | 'categories' | 'wishlist' | 'search' | 'reservation'>('home');
 const [activeProductInPhone, setActiveProductInPhone] = useState<CustomProduct>(storeConfig.products[0]);
 const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
 const [selectedSubTab, setSelectedSubTab] = useState<string>('Top Picks');
 const [selectedSize, setSelectedSize] = useState<string>('42');
 const [selectedColor, setSelectedColor] = useState<string>('Red Crimson');
 const [searchQuery, setSearchQuery] = useState<string>('');
 const [wishlistIds, setWishlistIds] = useState<string[]>([]);
 const [sizeGuideModalOpen, setSizeGuideModalOpen] = useState<boolean>(false);
 const [tableBookingSuccess, setTableBookingSuccess] = useState<boolean>(false);
 const [isReservationModalOpen, setIsReservationModalOpen] = useState<boolean>(false);
 const [reservationDate, setReservationDate] = useState<string>('2026-11-20');
 const [reservationTime, setReservationTime] = useState<string>('08:30 م');
 const [reservationGuests, setReservationGuests] = useState<string>('2 أشخاص');

 // Simulated Cart
 const [simulatedCart, setSimulatedCart] = useState<CartItem[]>([
 {
 ...storeConfig.products[0],
 quantity: 1,
 selectedSize: storeConfig.products[0].sizes ? storeConfig.products[0].sizes[0] : '42',
 selectedColor: storeConfig.products[0].colors ? storeConfig.products[0].colors[0].name : undefined,
 },
 ]);
 const [cartSuccessPill, setCartSuccessPill] = useState<boolean>(false);

 // Admin New Product Form State
 const [newProdName, setNewProdName] = useState('');
 const [newProdPrice, setNewProdPrice] = useState(950);
 const [newProdCostPrice, setNewProdCostPrice] = useState(550);
 const [newProdOriginalPrice, setNewProdOriginalPrice] = useState(1200);
 const [newProdCategory, setNewProdCategory] = useState(storeConfig.categories[0] || 'سنيكرز');
 const [newProdBadge, setNewProdBadge] = useState('خصم 20%');
 const [newProdImageUrl, setNewProdImageUrl] = useState('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80');
 const [newCategoryName, setNewCategoryName] = useState('');
 const [simulatedPlan, setSimulatedPlan] = useState<'standard' | 'pro' | 'custom'>('pro');

 // Change Template Handler
 const handleSelectTemplate = (tmplId: TemplateId) => {
 playPaperFlip();
 const meta = STUDIO_TEMPLATES.find((t) => t.id === tmplId) || STUDIO_TEMPLATES[0];
 const newProds = DEFAULT_PRODUCTS_MAP[tmplId] || DEFAULT_PRODUCTS_MAP['sportech-sneakers'];
 const newCats = DEFAULT_CATEGORIES_MAP[tmplId] || ['عام'];

 setSelectedTemplateId(tmplId);
 setPhoneScreen('home');
 setActiveProductInPhone(newProds[0]);
 setStoreConfig((prev) => ({
 ...prev,
 templateId: tmplId,
 accentColor: meta.accentColor,
 storeName:
 tmplId === 'sportech-sneakers'
 ? 'سبورتك إيجيبت (SPORTECH)'
 : tmplId === 'cloudrunner-product'
 ? 'نايكي ستور • Cloud Runner 2'
 : tmplId === 'dinereserve-food'
 ? 'داين ريزيرف • DineReserve'
 : tmplId === 'fasco-fashion'
 ? 'فاسكو ستريت وير (FASCO)'
 : tmplId === 'burger-club'
 ? 'برجر كلوب (Burger Club)'
 : tmplId === 'panto-minimal'
 ? 'بانتو للأثاث الاسكندنافي'
 : tmplId === 'velvety-jewelry'
 ? 'فيلفيتي للعطور والمجوهرات'
 : 'سكتش أوردر كوميكس',
 customDomain:
 tmplId === 'sportech-sneakers'
 ? 'sportech-eg.store'
 : tmplId === 'cloudrunner-product'
 ? 'cloudrunner-nike.eg'
 : tmplId === 'dinereserve-food'
 ? 'dinereserve.com'
 : tmplId === 'fasco-fashion'
 ? 'fasco-urban.store'
 : tmplId === 'burger-club'
 ? 'burgerclub.store'
 : tmplId === 'panto-minimal'
 ? 'panto-interior.shop'
 : tmplId === 'velvety-jewelry'
 ? 'velvety-glam.store'
 : 'sketch-comic.store',
 categories: newCats,
 products: newProds,
 }));
 setSimulatedCart([{ ...newProds[0], quantity: 1, selectedSize: newProds[0].sizes ? newProds[0].sizes[0] : '42' }]);
 setSelectedCategory('الكل');
 };

 // Open Product Details INSIDE THE PHONE
 const handleOpenProductInsidePhone = (product: CustomProduct) => {
 playClick();
 setActiveProductInPhone(product);
 if (product.sizes && product.sizes.length > 0) {
 setSelectedSize(product.sizes[0]);
 }
 if (product.colors && product.colors.length > 0) {
 setSelectedColor(product.colors[0].name);
 }
 setPhoneScreen('product_detail');
 };

 // Toggle Wishlist
 const handleToggleWishlist = (id: string, e?: React.MouseEvent) => {
 if (e) e.stopPropagation();
 playClick();
 setWishlistIds((prev) =>
 prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
 );
 };

 // Add Product to Cart from anywhere inside the phone
 const handleAddToCart = (product: CustomProduct, sizeOverride?: string, colorOverride?: string) => {
 playClick();
 const finalSize = sizeOverride || selectedSize || (product.sizes ? product.sizes[0] : undefined);
 const finalColor = colorOverride || selectedColor;

 setSimulatedCart((prev) => {
 const existing = prev.find((item) => item.id === product.id && item.selectedSize === finalSize);
 if (existing) {
 return prev.map((item) =>
 item.id === product.id && item.selectedSize === finalSize
 ? { ...item, quantity: item.quantity + 1 }
 : item
 );
 }
 return [
 ...prev,
 {
 ...product,
 quantity: 1,
 selectedSize: finalSize,
 selectedColor: finalColor,
 },
 ];
 });

 setCartSuccessPill(true);
 setTimeout(() => setCartSuccessPill(false), 2500);
 };

 const updateQuantity = (id: string, delta: number) => {
 playClick();
 setSimulatedCart((prev) =>
 prev
 .map((item) => {
 if (item.id === id) {
 const newQ = item.quantity + delta;
 return newQ > 0 ? { ...item, quantity: newQ } : null;
 }
 return item;
 })
 .filter(Boolean) as CartItem[]
 );
 };

 const cartTotal = simulatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

 // Admin add product
 const handleAddProduct = (e: React.FormEvent) => {
 e.preventDefault();
 if (!newProdName.trim()) return;
 playClick();

 const newProduct: CustomProduct = {
 id: `prod-${Date.now()}`,
 name: newProdName,
 price: Number(newProdPrice),
 originalPrice: Number(newProdOriginalPrice),
 costPrice: Number(newProdCostPrice),
 category: newProdCategory,
 badge: newProdBadge || undefined,
 imageUrl: newProdImageUrl,
 rating: 4.9,
 reviewsCount: 1,
 sizes: ['M', 'L', 'XL'],
 };

 setStoreConfig((prev) => ({
 ...prev,
 products: [newProduct, ...prev.products],
 }));

 setNewProdName('');
 setAdminTab('products');
 };

 const handleDeleteProduct = (id: string) => {
 playPencilScratch();
 setStoreConfig((prev) => ({
 ...prev,
 products: prev.products.filter((p) => p.id !== id),
 }));
 setSimulatedCart((prev) => prev.filter((item) => item.id !== id));
 };

 const handleAddCategory = () => {
 if (!newCategoryName.trim()) return;
 if (simulatedPlan === 'standard' && storeConfig.categories.length >= 4) {
 alert('الباقة الاقتصادية لها حد أقصى 4 أقسام فقط! قم بالترقية إلى باقة المحترفين لإضافة أقسام غير محدودة.');
 return;
 }
 playClick();
 setStoreConfig((prev) => ({
 ...prev,
 categories: [...prev.categories, newCategoryName.trim()],
 }));
 setNewCategoryName('');
 };

 const handleDeleteCategory = (catName: string) => {
 playClick();
 setStoreConfig((prev) => ({
 ...prev,
 categories: prev.categories.filter((c) => c !== catName),
 }));
 };

 const activeTmplMeta = STUDIO_TEMPLATES.find((t) => t.id === selectedTemplateId) || STUDIO_TEMPLATES[0];

 // Filtered Products for Phone Screen
 const filteredProducts = storeConfig.products.filter((prod) => {
 const matchesCategory = selectedCategory === 'الكل' || prod.category === selectedCategory;
 const matchesSearch = searchQuery === '' || prod.name.toLowerCase().includes(searchQuery.toLowerCase());
 return matchesCategory && matchesSearch;
 });

 return (
 <div className="min-h-screen bg-[#0A0E17] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
 
 {/* ======================================================== */}
 {/* TOP SAAS STUDIO NAVBAR */}
 {/* ======================================================== */}
 {!isFullScreenStorefront && (
 <header className="h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-2.5 sm:px-6 flex items-center justify-between sticky top-0 z-50 gap-2">
 
 {/* Left: Back button & Brand Logo (Transparent White PNG + Mascot) */}
 <div className="flex items-center gap-2 sm:gap-3 shrink-0">
 <button
 onClick={() => {
 playClick();
 onBackToHome();
 }}
 className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700 shrink-0"
 title="الرجوع للرئيسية"
 >
 <ArrowRight className="w-4 h-4 ml-0.5 sm:ml-1" />
 <span className="hidden sm:inline">الرئيسية</span>
 </button>

 {/* Official Brush Typography Logo */}
 <div className="hidden md:flex items-center gap-2 border-r border-slate-800 pr-3">
 <img src={brushLogoWhite} alt="SKETCH ORDER" className="h-7 object-contain" />
 <span className="text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full">
 LIVE STUDIO
 </span>
 </div>
 </div>

 {/* Center: Mode Switcher & Viewport Controls */}
 <div className="flex items-center gap-2 shrink-0">
 <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
 <button
 onClick={() => {
 playClick();
 setActiveView('preview');
 }}
 className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition-all ${
 activeView === 'preview'
 ? 'bg-indigo-600 text-white shadow-xs'
 : 'text-slate-400 hover:text-white'
 }`}
 >
 <Eye className="w-3.5 h-3.5" />
 <span className="hidden sm:inline">معاينة المتجر لايف</span>
 <span className="sm:hidden">المعاينة</span>
 </button>

 <button
 onClick={() => {
 playClick();
 setActiveView('admin');
 }}
 className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition-all ${
 activeView === 'admin'
 ? 'bg-orange-500 text-slate-950 font-black shadow-xs'
 : 'text-slate-400 hover:text-white'
 }`}
 >
 <Settings className="w-3.5 h-3.5" />
 <span className="hidden sm:inline">لوحة تحكم التاجر</span>
 <span className="sm:hidden">التحكم</span>
 </button>
 </div>

 {/* Viewport Switcher (Mobile 390px / Tablet 768px / Desktop 100%) */}
 {activeView === 'preview' && (
 <div className="hidden lg:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
 <button
 type="button"
 onClick={() => {
 playClick();
 setViewportMode('mobile');
 }}
 className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
 viewportMode === 'mobile'
 ? 'bg-orange-500 text-slate-950 shadow-xs'
 : 'text-slate-400 hover:text-white'
 }`}
 title="معاينة شاشة الهاتف (390px)"
 >
 <Smartphone className="w-3.5 h-3.5" />
 <span>موبايل (390px)</span>
 </button>
 <button
 type="button"
 onClick={() => {
 playClick();
 setViewportMode('tablet');
 }}
 className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
 viewportMode === 'tablet'
 ? 'bg-orange-500 text-slate-950 shadow-xs'
 : 'text-slate-400 hover:text-white'
 }`}
 title="معاينة تابلت (768px)"
 >
 <Tablet className="w-3.5 h-3.5" />
 <span>تابلت (768px)</span>
 </button>
 <button
 type="button"
 onClick={() => {
 playClick();
 setViewportMode('desktop');
 }}
 className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
 viewportMode === 'desktop'
 ? 'bg-orange-500 text-slate-950 shadow-xs'
 : 'text-slate-400 hover:text-white'
 }`}
 title="معاينة كمبيوتر (100%)"
 >
 <Monitor className="w-3.5 h-3.5" />
 <span>كمبيوتر (100%)</span>
 </button>
 </div>
 )}
 </div>

 {/* Right Action Buttons */}
 <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
 
 {/* Fullscreen Storefront Mode Trigger */}
 <button
 onClick={() => {
 playClick();
 setIsFullScreenStorefront(true);
 }}
 className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
 title="تصفح المتجر بشاشة كاملة كأنك عميل حقيقي"
 >
 <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
 <span className="hidden md:inline">عرض الموقع كعميل حقيقي</span>
 <span className="hidden sm:inline md:hidden">ملء الشاشة</span>
 </button>

 {/* Catalog Button */}
 <button
 onClick={() => {
 playClick();
 if (onOpenTemplatesPage) onOpenTemplatesPage();
 }}
 className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-white font-bold text-xs transition-all shadow-xs"
 >
 <Grid className="w-3.5 h-3.5" />
 <span className="hidden sm:inline">الكتالوج (8)</span>
 <span className="sm:hidden">الكتالوج</span>
 </button>

 {/* Dark Mode Toggle if provided */}
 {onToggleDarkMode && (
 <button
 onClick={() => {
 playClick();
 onToggleDarkMode();
 }}
 className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 text-amber-400 hover:bg-slate-800"
 title="تبديل الثيم"
 >
 {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
 </button>
 )}

 {/* Buy Store */}
 <button
 onClick={() => {
 playClick();
 onBuyAndDeploy(storeConfig);
 }}
 className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs transition-all shadow-sm shadow-emerald-500/20 active:scale-95 shrink-0"
 >
 <Rocket className="w-3.5 h-3.5" />
 <span className="hidden sm:inline">امتلك موقعك الآن</span>
 <span className="sm:hidden">شراء</span>
 </button>
 </div>
 </header>
 )}

 {/* Floating Header when in Fullscreen Storefront Mode */}
 {isFullScreenStorefront && (
 <div className="fixed top-3 inset-x-0 mx-auto max-w-xl z-50 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-2 rounded-2xl shadow-2xl flex items-center justify-between text-xs font-bold px-4">
 <div className="flex items-center gap-2">
 <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
 <span className="text-white">أنت تتصفح متجر "{storeConfig.storeName}" كعميل حقيقي</span>
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={() => setIsFullScreenStorefront(false)}
 className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
 >
 <Minimize2 className="w-3.5 h-3.5" />
 <span>الرجوع للاستوديو</span>
 </button>

 <button
 onClick={() => onBuyAndDeploy(storeConfig)}
 className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-slate-950 font-black"
 >
 امتلك هذا المتجر
 </button>
 </div>
 </div>
 )}

 {/* ======================================================== */}
 {/* SECONDARY BAR: RESPONSIVE TEMPLATE SELECTOR */}
 {/* ======================================================== */}
 {!isFullScreenStorefront && (
 <div className="bg-slate-900 border-b border-slate-800 px-3 sm:px-6 py-2 flex items-center justify-between gap-2 text-xs font-bold">
 <div className="flex items-center gap-2 min-w-0 flex-1">
 <span className="text-slate-400 shrink-0 hidden sm:inline">القالب النشط:</span>
 <select
 value={selectedTemplateId}
 onChange={(e) => handleSelectTemplate(e.target.value as TemplateId)}
 className="bg-slate-950 border border-slate-700 text-white font-bold text-xs rounded-xl px-2.5 py-1.5 outline-none hover:border-orange-500 transition-colors cursor-pointer max-w-full truncate"
 >
 {STUDIO_TEMPLATES.map((tmpl) => (
 <option key={tmpl.id} value={tmpl.id}>
 {tmpl.name} ({tmpl.categoryBadge})
 </option>
 ))}
 </select>
 </div>

 <div className="flex items-center gap-2 shrink-0">
 <button
                onClick={() => {
                  if (onOpenTemplatesPage) onOpenTemplatesPage();
                }}
 className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 transition-colors whitespace-nowrap text-xs font-bold"
 >
 <Grid className="w-3.5 h-3.5" />
 <span className="hidden sm:inline">كتالوج القوالب (8 تيمبليتس)</span>
 <span className="sm:hidden">الكتالوج (8)</span>
 </button>
 </div>
 </div>
 )}

 {/* ======================================================== */}
 {/* MAIN BODY AREA */}
 {/* ======================================================== */}
 <div className="flex-1 flex flex-col overflow-hidden">
 
 {/* ======================================================== */}
 {/* VIEW 1: LIVE STORE INSIDE iPHONE 13 PRO MOCKUP */}
 {/* ======================================================== */}
 {activeView === 'preview' && (
 <div className={`flex-1 p-1 sm:p-6 flex items-center justify-center bg-[#070A11] overflow-y-auto ${isFullScreenStorefront ? 'p-0 sm:p-0' : ''}`}>
 
 {/* ==================================================== */}
 {/* Dynamic Viewport Chassis (iPhone 13 Pro / Tablet / Desktop) */}
 {/* ==================================================== */}
 <div
 className={`transition-all duration-300 mx-auto relative ${
 isFullScreenStorefront
 ? 'w-full min-h-screen rounded-none border-none shadow-none'
 : viewportMode === 'tablet'
 ? 'w-full max-w-[768px] rounded-[32px] border-[8px] border-[#1E293B] bg-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_2px_#334155] my-2 sm:my-4'
 : viewportMode === 'desktop'
 ? 'w-full max-w-5xl rounded-2xl border-4 border-slate-700 bg-slate-950 shadow-2xl my-2 sm:my-4 overflow-hidden'
 : 'w-full max-w-[390px] rounded-[36px] sm:rounded-[50px] border-[6px] sm:border-[10px] border-[#1E293B] bg-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_2px_#334155] my-1 sm:my-4'
 }`}
 >
 
 {/* iPhone 13 Pro Physical Side Buttons (Only for mobile view) */}
 {!isFullScreenStorefront && viewportMode === 'mobile' && (
 <div className="hidden sm:block">
 {/* Left Mute Switch */}
 <div className="absolute -left-[14px] top-24 w-[4px] h-7 bg-slate-700 rounded-l-md pointer-events-none"></div>
 {/* Left Volume Up */}
 <div className="absolute -left-[14px] top-36 w-[4px] h-11 bg-slate-700 rounded-l-md pointer-events-none"></div>
 {/* Left Volume Down */}
 <div className="absolute -left-[14px] top-50 w-[4px] h-11 bg-slate-700 rounded-l-md pointer-events-none"></div>
 {/* Right Power Button */}
 <div className="absolute -right-[14px] top-40 w-[4px] h-16 bg-slate-700 rounded-r-md pointer-events-none"></div>
 </div>
 )}

 {/* Desktop Browser Chrome Bar */}
 {!isFullScreenStorefront && viewportMode === 'desktop' && (
 <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between select-none">
 <div className="flex items-center gap-2">
 <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
 <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
 <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
 </div>
 <div className="flex-1 max-w-md mx-auto flex items-center justify-center gap-2 bg-slate-950 px-4 py-1 rounded-full border border-slate-800 text-xs font-mono text-slate-300" dir="ltr">
 <span className="text-emerald-400"> https://</span>
 <span>{storeConfig.customDomain || 'mybrand.sketchorder.com'}</span>
 </div>
 <div className="text-[11px] text-orange-400 font-bold hidden sm:block font-mono">
 DESKTOP VIEW (100%)
 </div>
 </div>
 )}

 {/* Tablet Bezel Bar */}
 {!isFullScreenStorefront && viewportMode === 'tablet' && (
 <div className="bg-slate-950 px-6 py-2 flex items-center justify-between text-xs font-mono text-slate-400 select-none border-b border-slate-800/60">
 <span className="text-[11px] font-bold">iPad Air • 768px</span>
 <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
 <span className="text-[11px] font-bold">100% </span>
 </div>
 )}

 {/* Display Container */}
 <div
 className={`overflow-hidden flex flex-col justify-between ${
 isFullScreenStorefront
 ? 'min-h-screen rounded-none'
 : viewportMode === 'desktop'
 ? 'min-h-[780px] max-h-[85vh] overflow-y-auto'
 : viewportMode === 'tablet'
 ? 'rounded-[24px] min-h-[800px] max-h-[85vh] overflow-y-auto'
 : 'rounded-[40px] min-h-[820px] max-h-[840px] overflow-y-auto'
 } ${
 activeTmplMeta.themeStyle === 'luxury-dark'
 ? 'bg-[#090D16] text-white'
 : activeTmplMeta.themeStyle === 'retro'
 ? 'bg-[#064E3B] text-amber-50'
 : activeTmplMeta.themeStyle === 'sketch'
 ? 'bg-white text-[#0F0F0F]'
 : 'bg-white text-slate-900'
 }`}
 >
 
 {/* Realistic iPhone 13 Pro Notch & Status Bar */}
 {!isFullScreenStorefront && viewportMode === 'mobile' && (
 <div className="sticky top-0 z-40 bg-inherit/95 backdrop-blur-md px-7 pt-2.5 pb-2 text-[12px] font-semibold select-none border-b border-inherit/10">
 <div className="flex items-center justify-between">
 <span className="font-semibold text-xs tracking-tight">9:41</span>

 <div className="flex items-center gap-1.5 text-xs">
 <svg className="w-3.5 h-3" viewBox="0 0 17 12" fill="currentColor">
 <rect x="0" y="8" width="3" height="4" rx="0.5" />
 <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" />
 <rect x="9" y="3" width="3" height="9" rx="0.5" />
 <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
 </svg>
 <svg className="w-3.5 h-3" viewBox="0 0 16 12" fill="currentColor">
 <path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM4.1 7.2a5.5 5.5 0 017.8 0 .8.8 0 001.1-1.1 7 7 0 00-10 0 .8.8 0 001.1 1.1zM1.3 4.4a9.5 9.5 0 0113.4 0 .8.8 0 101.1-1.1 11 11 0 00-15.6 0 .8.8 0 001.1 1.1z" />
 </svg>
 <div className="w-[20px] h-[10px] border-[1.2px] border-current rounded-[3px] p-[1px] flex items-center relative ml-0.5">
 <div className="h-full w-[85%] bg-current rounded-[1px]"></div>
 <div className="w-[1.5px] h-[3.5px] bg-current rounded-r-[1px] absolute -right-[2.5px] top-[2px]"></div>
 </div>
 </div>
 </div>

 {/* Center-Anchored iPhone 13 Pro Notch */}
 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[124px] h-[24px] bg-slate-950 rounded-b-[18px] border-b border-x border-slate-800/90 shadow-inner flex items-center justify-center gap-3">
 <div className="w-12 h-1 bg-zinc-700/80 rounded-full"></div>
 <div className="w-2.5 h-2.5 rounded-full bg-[#0a1128] border border-slate-700/60 ring-1 ring-blue-500/20 flex items-center justify-center">
 <div className="w-1 h-1 rounded-full bg-blue-900/80"></div>
 </div>
 </div>
 </div>
 )}

 {/* Cart Success Notification Pill inside Phone */}
 {cartSuccessPill && (
 <div className="absolute top-12 inset-x-3 z-50 bg-emerald-600 text-white text-xs font-bold py-2.5 px-3 rounded-2xl shadow-xl flex items-center justify-between animate-fadeIn border border-emerald-400">
 <div className="flex items-center gap-1.5">
 <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
 <span>تمت إضافة المنتج للسلة بنجاح!</span>
 </div>
 <button
 onClick={() => setPhoneScreen('cart')}
 className="text-[11px] font-black underline bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-lg shrink-0"
 >
 السلة 
 </button>
 </div>
 )}

 {/* ================================================== */}
 {/* IN-PHONE SCREEN 1: HOME FEED (Main Storefront) */}
 {/* ================================================== */}
 {/* ================================================== */}
 {/* IN-PHONE SCREEN 1: HOME FEED (Main Storefront) */}
 {/* ================================================== */}
 {phoneScreen === 'home' && (
 <>
 {/* -------------------------------------------------- */}
 {/* TEMPLATE A: CLOUD RUNNER 2 (Single Product Showcase - Image 1 & 2 "After" Design) */}
 {/* -------------------------------------------------- */}
 {selectedTemplateId === 'cloudrunner-product' ? (
 <div className="flex-1 flex flex-col justify-between bg-white text-slate-900 animate-fadeIn" dir="ltr">
 <div className="p-4 space-y-3.5">
 {/* Top Navigation */}
 <div className="flex items-center justify-between">
 <button
 onClick={() => {
                    if (onOpenTemplatesPage) onOpenTemplatesPage();
 }}
 className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shadow-xs"
 title="Catalog"
 >
 <ChevronLeft className="w-5 h-5 text-slate-800" />
 </button>

 <button
 onClick={(e) => handleToggleWishlist('cr-1', e)}
 className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shadow-xs"
 >
 <Heart
 className={`w-4 h-4 ${
 wishlistIds.includes('cr-1') ? 'fill-red-500 text-red-500' : 'text-slate-700'
 }`}
 />
 </button>
 </div>

 {/* Crimson Red Hero Card Container (Exact Match to User Image 1/2 "After") */}
 <div className="rounded-[28px] bg-[#B91C1C] p-6 shadow-md relative flex flex-col items-center justify-center min-h-[250px] overflow-hidden">
 <img
 src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
 alt="Cloud Runner 2"
 className="w-60 h-44 object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.45)] hover:scale-105 transition-transform duration-300"
 onError={(e) => {
 e.currentTarget.src = 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80';
 }}
 />

 {/* Carousel Dot Indicators: 1 Black Pill + 3 Light Pink/Red Dots */}
 <div className="flex items-center gap-1.5 mt-3">
 <span className="w-5 h-1.5 rounded-full bg-slate-950"></span>
 <span className="w-1.5 h-1.5 rounded-full bg-red-300"></span>
 <span className="w-1.5 h-1.5 rounded-full bg-red-300"></span>
 <span className="w-1.5 h-1.5 rounded-full bg-red-300"></span>
 </div>
 </div>

 {/* Product Details Section */}
 <div className="space-y-3 px-1 text-left">
 <div>
 <h2 className="text-xl font-black font-heading text-slate-950 tracking-tight">
 Cloud Runner 2
 </h2>
 <p className="text-xs text-slate-500 font-medium">
 New • Knit running shoe
 </p>
 </div>

 {/* Price Row: $129 $159 19% off */}
 <div className="flex items-baseline gap-2">
 <span className="text-2xl font-black font-mono text-slate-950">$129</span>
 <span className="text-xs text-slate-400 line-through font-mono">$159</span>
 <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-md border border-red-100">
 19% off
 </span>
 </div>

 {/* Social Proof: Star 4.8 • 2,341 reviews • 1.2k sold */}
 <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
 <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
 <span className="font-bold text-slate-900">4.8</span>
 <span className="text-slate-400">•</span>
 <span>2,341 reviews</span>
 <span className="text-slate-400">•</span>
 <span>1.2k sold</span>
 </div>

 {/* Color Selector with Text Labels underneath (Exact Match to User Reference) */}
 <div className="space-y-1.5 pt-1">
 <div className="text-xs font-bold text-slate-800">
 Color: <span className="font-semibold text-slate-600">{selectedColor}</span>
 </div>
 <div className="flex items-center gap-4">
 {[
 { label: 'Crimson', name: 'Crimson / Ember', hex: '#DC2626' },
 { label: 'Black', name: 'Black', hex: '#18181B' },
 { label: 'Volt', name: 'Volt', hex: '#A3E635' },
 ].map((c) => {
 const isColSelected = selectedColor === c.name || (selectedColor === 'Red Crimson' && c.label === 'Crimson');
 return (
 <div key={c.label} className="flex flex-col items-center gap-1">
 <button
 key={c.label}
 onClick={() => {
 playClick();
 setSelectedColor(c.name);
 }}
 className={`w-7 h-7 rounded-full transition-all relative ${
 isColSelected
 ? 'ring-2 ring-offset-2 ring-slate-900 scale-105'
 : 'hover:scale-105'
 }`}
 style={{ backgroundColor: c.hex }}
 title={c.name}
 />
 <span className={`text-[10px] ${isColSelected ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
 {c.label}
 </span>
 </div>
 );
 })}
 </div>
 </div>

 {/* Size Selector with 8 pills in 2 rows (8.5 selected, 9.5 disabled with strikethrough) */}
 <div className="space-y-1.5 pt-1">
 <div className="flex items-center justify-between text-xs font-bold text-slate-800">
 <span>Size (US)</span>
 <button
 onClick={() => setSizeGuideModalOpen(true)}
 className="text-[11px] text-slate-500 hover:text-slate-900 underline underline-offset-2 font-semibold"
 >
 Size guide
 </button>
 </div>
 <div className="grid grid-cols-4 gap-2">
 {['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5'].map((sz) => {
 const isSelected = selectedSize === sz;
 const isDisabled = sz === '9.5';
 return (
 <button
 key={sz}
 disabled={isDisabled}
 onClick={() => {
 playClick();
 setSelectedSize(sz);
 }}
 className={`py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
 isDisabled
 ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed line-through'
 : isSelected
 ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
 : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
 }`}
 >
 {sz}
 </button>
 );
 })}
 </div>
 </div>
 </div>
 </div>

 {/* Sticky Bottom Bar for Cloud Runner 2: $129 Free shipping + [Add to Bag] */}
 <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0 z-30 flex items-center justify-between">
 <div>
 <div className="text-lg font-black font-mono text-slate-950 leading-tight">$129</div>
 <div className="text-[10px] text-slate-400 font-medium">Free shipping</div>
 </div>

 <button
 onClick={() => {
 handleAddToCart({
 id: 'cr-1',
 name: 'Cloud Runner 2 Knit Running Shoe',
 price: 129,
 costPrice: 70,
 category: 'كوتشيات ركض',
 imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
 });
 }}
 className="px-6 py-3 rounded-2xl bg-slate-950 hover:bg-black text-white font-black text-xs flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
 >
 <ShoppingBag className="w-4 h-4" />
 <span>Add to Bag</span>
 </button>
 </div>
 </div>
 ) : selectedTemplateId === 'sportech-sneakers' ? (
 /* -------------------------------------------------- */
 /* TEMPLATE B: SPORTECH (Athletic App Redesign - Image 2 & 4) */
 /* -------------------------------------------------- */
 <div className="flex-1 flex flex-col justify-between bg-[#F8FAFC] text-slate-900 animate-fadeIn">
 <div>
 {/* Top Header */}
 <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-30">
 <div className="flex items-center gap-2">
 <button
 onClick={() => { if (onOpenTemplatesPage) onOpenTemplatesPage(); }}
 className="p-1 text-slate-800 hover:text-black"
 >
 <Menu className="w-5 h-5" />
 </button>
 <div className="flex items-center gap-1.5">
 <span className="w-2.5 h-2.5 rounded-xs bg-red-600"></span>
 <span className="font-heading font-black text-lg tracking-tight text-slate-900">
 SPORTECH
 </span>
 </div>
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={() => setPhoneScreen('search')}
 className="p-1.5 text-slate-700 hover:text-black"
 >
 <Search className="w-4 h-4" />
 </button>
 <button
 onClick={() => setPhoneScreen('cart')}
 className="relative p-1.5 text-slate-800 hover:text-black"
 >
 <ShoppingBag className="w-5 h-5" />
 <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center">
 {simulatedCart.reduce((sum, i) => sum + i.quantity, 0) || 3}
 </span>
 </button>
 </div>
 </div>

 {/* Hero Banner (Black Card + Dynamic Orange/Red Slashes) */}
 <div className="p-4">
 <div className="relative rounded-2xl bg-gradient-to-r from-[#0B0F19] via-[#111827] to-[#1F2937] p-4 text-white overflow-hidden shadow-lg flex items-center justify-between">
 <div className="max-w-[175px] space-y-1.5 z-10">
 <h2 className="text-xl font-black font-heading leading-tight tracking-tight uppercase">
 FUEL YOUR <br />
 <span className="text-orange-500">PASSION</span>
 </h2>
 <p className="text-[11px] text-slate-300 leading-snug">
 Premium gear for a stronger, healthier you
 </p>
 <button
 onClick={() => handleOpenProductInsidePhone(storeConfig.products[0])}
 className="mt-1 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-md flex items-center gap-1 transition-transform active:scale-95"
 >
 <span>Shop Now</span>
 <ArrowRight className="w-3 h-3 -scale-x-100" />
 </button>
 </div>

 <div className="w-32 h-28 relative z-10 flex items-center justify-center">
 <img
 src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
 alt="Nike Shoe"
 className="w-full h-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] rotate-[-15deg] hover:scale-105 transition-transform"
 />
 </div>
 </div>

 {/* Carousel Dots */}
 <div className="flex items-center justify-center gap-1.5 mt-2">
 <span className="w-3.5 h-1.5 rounded-full bg-orange-500"></span>
 <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
 <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
 <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
 </div>
 </div>

 {/* Categories Row (Circular Icons) */}
 <div className="px-4 py-1 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
 {[
 { name: 'Sneakers', icon: '', filter: 'سنيكرز', color: 'bg-orange-100 text-orange-600' },
 { name: 'Football', icon: '', filter: 'كرة قدم', color: 'bg-slate-100 text-slate-800' },
 { name: 'Basketball', icon: '', filter: 'كرة سلة', color: 'bg-slate-100 text-slate-800' },
 { name: 'Gym', icon: '', filter: 'جيم وتدريب', color: 'bg-slate-100 text-slate-800' },
 { name: 'Jerseys', icon: '', filter: 'قمصان', color: 'bg-slate-100 text-slate-800' },
 ].map((item) => (
 <button
 key={item.name}
 onClick={() => {
 playClick();
 setSelectedCategory(item.filter);
 }}
 className="flex flex-col items-center gap-1 shrink-0 group"
 >
 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-2xs transition-transform group-hover:scale-105 ${
 selectedCategory === item.filter ? 'bg-orange-500 text-white shadow-xs' : item.color
 }`}>
 {item.icon}
 </div>
 <span className="text-[10px] font-bold text-slate-600 group-hover:text-slate-900">
 {item.name}
 </span>
 </button>
 ))}
 </div>

 {/* Subtabs Filter */}
 <div className="px-4 pt-4 flex items-center justify-between">
 <div className="flex items-center gap-1.5 text-xs font-bold">
 {['Top Picks', 'New Arrivals', 'Best Sellers', 'Sale'].map((tab) => (
 <button
 key={tab}
 onClick={() => {
 playClick();
 setSelectedSubTab(tab);
 }}
 className={`px-3 py-1 rounded-full transition-all ${
 selectedSubTab === tab
 ? 'bg-orange-500 text-white font-black shadow-xs'
 : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
 }`}
 >
 {tab}
 </button>
 ))}
 </div>
 </div>

 {/* 2-Column Product Cards Grid */}
 <div className="p-4 grid grid-cols-2 gap-3">
 {filteredProducts.length > 0 ? (
 filteredProducts.map((prod) => {
 const isWish = wishlistIds.includes(prod.id);
 return (
 <div
 key={prod.id}
 onClick={() => handleOpenProductInsidePhone(prod)}
 className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
 >
 {/* Image Box */}
 <div className="relative rounded-xl h-32 flex items-center justify-center mb-2 overflow-hidden bg-slate-50">
 {prod.badge && (
 <span className={`absolute top-2 right-2 text-[9px] font-black px-2 py-0.5 rounded-full z-10 shadow-xs ${
 prod.badge === 'Best Seller' ? 'bg-orange-500 text-white' : 'bg-slate-900 text-white'
 }`}>
 {prod.badge}
 </span>
 )}
 <button
 onClick={(e) => handleToggleWishlist(prod.id, e)}
 className="absolute top-2 left-2 p-1.5 rounded-full bg-white/90 z-10 transition-transform active:scale-125 shadow-xs"
 >
 <Heart
 className={`w-3.5 h-3.5 ${
 isWish ? 'fill-red-500 text-red-500' : 'text-slate-400'
 }`}
 />
 </button>
 <img
 src={prod.imageUrl}
 alt={prod.name}
 className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
 />
 </div>

 {/* Info */}
 <div>
 <h4 className="text-xs font-black text-slate-900 line-clamp-1">
 {prod.name}
 </h4>
 <p className="text-[10px] text-slate-500 font-medium">
 {prod.tag || prod.category}
 </p>

 <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-1">
 <Star className="w-3 h-3 fill-amber-400" />
 <span>{prod.rating || 4.8}</span>
 <span className="text-slate-400">({prod.reviewsCount || 120})</span>
 </div>

 <div className="mt-2 flex items-baseline justify-between">
 <span className="text-sm font-black font-mono text-slate-900">
 ${prod.price}
 </span>

 <button
 onClick={(e) => {
 e.stopPropagation();
 handleAddToCart(prod);
 }}
 className="w-7 h-7 rounded-lg bg-slate-950 hover:bg-black text-white flex items-center justify-center transition-colors shadow-xs"
 title="Add to cart"
 >
 <Plus className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>
 </div>
 );
 })
 ) : (
 <div className="col-span-2 text-center py-8 space-y-2">
 <p className="text-xs text-slate-500 font-bold">لا توجد منتجات مطابقة لهذا القسم</p>
 <button
 onClick={() => setSelectedCategory('الكل')}
 className="px-3 py-1 rounded-xl bg-orange-500 text-white font-black text-xs"
 >
 عرض كل المنتجات
 </button>
 </div>
 )}
 </div>
 </div>

 {/* SPORTECH Bottom Bar */}
 <div className="border-t border-slate-100 px-6 py-2 bg-white flex items-center justify-between text-[11px] font-bold sticky bottom-0 z-30">
 <button onClick={() => setPhoneScreen('home')} className="flex flex-col items-center text-orange-500">
 <Footprints className="w-4 h-4" />
 <span className="text-[10px]">Home</span>
 </button>
 <button onClick={() => setPhoneScreen('categories')} className="flex flex-col items-center text-slate-500 hover:text-slate-900">
 <Layers className="w-4 h-4" />
 <span className="text-[10px]">Categories</span>
 </button>
 <button onClick={() => setPhoneScreen('cart')} className="flex flex-col items-center text-slate-500 hover:text-slate-900 relative">
 <ShoppingBag className="w-4 h-4" />
 <span className="text-[10px]">Cart</span>
 </button>
 <button onClick={() => setPhoneScreen('wishlist')} className="flex flex-col items-center text-slate-500 hover:text-slate-900">
 <Heart className="w-4 h-4" />
 <span className="text-[10px]">Wishlist</span>
 </button>
 </div>
 </div>
 ) : (
 /* -------------------------------------------------- */
 /* TEMPLATE C: GENERAL THEMED MULTI-PRODUCT FEED (FASCO, DineReserve, Burger Club, Panto, Velvety) */
 /* -------------------------------------------------- */
 <div className="flex-1 flex flex-col justify-between">
 <div>
 {/* Store Header Inside Phone */}
 <div className="p-4 border-b flex items-center justify-between sticky top-0 z-30 bg-inherit/95 backdrop-blur-md border-inherit/15">
 <div className="flex items-center gap-2">
 <span className="font-heading font-black text-xl tracking-tight">
 {storeConfig.storeName}
 </span>
 </div>

 <div className="flex items-center gap-3">
 <button
 onClick={() => setPhoneScreen('search')}
 className="p-1.5 opacity-80 hover:opacity-100 transition-opacity"
 >
 <Search className="w-4 h-4" />
 </button>
 <button
 onClick={() => setPhoneScreen('cart')}
 className="relative p-1.5"
 >
 <ShoppingBag className="w-5 h-5 text-orange-500" />
 {simulatedCart.length > 0 && (
 <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center">
 {simulatedCart.reduce((sum, i) => sum + i.quantity, 0)}
 </span>
 )}
 </button>
 </div>
 </div>

 {/* Store Hero Banner */}
 <div className="p-4">
 <div
 className="relative rounded-2xl p-5 text-white overflow-hidden shadow-lg flex items-center justify-between"
 style={{
 background:
 activeTmplMeta.themeStyle === 'luxury-dark'
 ? 'linear-gradient(135deg, #0F172A, #1E1B4B)'
 : activeTmplMeta.themeStyle === 'retro'
 ? 'linear-gradient(135deg, #022C22, #064E3B)'
 : 'linear-gradient(135deg, #0F172A, #C2410C)',
 }}
 >
 <div className="max-w-[200px] space-y-2 z-10">
 <span className="text-[10px] font-mono tracking-wider font-bold text-orange-400 uppercase">
 COLLECTION 2026
 </span>
 <h2 className="text-2xl font-black font-heading leading-tight">
 {storeConfig.tagline}
 </h2>
 <div className="flex items-center gap-2 pt-1">
 <button
 onClick={() => {
 if (storeConfig.products?.[0]) {
 handleOpenProductInsidePhone(storeConfig.products[0]);
 }
 }}
 className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
 >
 <span>{selectedTemplateId === 'dinereserve-food' ? 'قائمة الطعام' : 'اكتشف العروض'}</span>
 <ArrowRight className="w-3.5 h-3.5 -scale-x-100" />
 </button>
 {selectedTemplateId === 'dinereserve-food' && (
 <button
 onClick={() => setIsReservationModalOpen(true)}
 className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs border border-white/30 transition-transform active:scale-95 flex items-center gap-1"
 >
 <Calendar className="w-3.5 h-3.5" />
 <span>حجز طاولة</span>
 </button>
 )}
 </div>
 </div>

 <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0 border border-white/20 shadow-xl bg-slate-800">
 <img
 src={storeConfig.products?.[0]?.imageUrl || activeTmplMeta.previewImage}
 alt={storeConfig.storeName}
 className="w-full h-full object-cover"
 onError={(e) => {
 e.currentTarget.onerror = null;
 e.currentTarget.src = activeTmplMeta.previewImage;
 }}
 />
 </div>
 </div>
 </div>

 {/* DineReserve Table Booking Modal inside Phone */}
 {isReservationModalOpen && (
 <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn">
 <div className="w-full bg-slate-900 border border-slate-700 rounded-3xl p-5 text-white space-y-4 shadow-2xl">
 <div className="flex items-center justify-between border-b border-slate-800 pb-2">
 <div className="flex items-center gap-2">
 <Utensils className="w-5 h-5 text-orange-500" />
 <h3 className="font-heading font-black text-base">حجز طاولة VIP فاخرة</h3>
 </div>
 <button
 onClick={() => setIsReservationModalOpen(false)}
 className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 <div className="space-y-3 text-xs">
 <div>
 <label className="block text-slate-400 mb-1 flex items-center gap-1 font-bold">
 <Calendar className="w-3.5 h-3.5 text-orange-400" />
 <span>تاريخ الحجز:</span>
 </label>
 <input
 type="date"
 value={reservationDate}
 onChange={(e) => setReservationDate(e.target.value)}
 className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
 />
 </div>

 <div className="grid grid-cols-2 gap-2">
 <div>
 <label className="block text-slate-400 mb-1 flex items-center gap-1 font-bold">
 <Clock className="w-3.5 h-3.5 text-orange-400" />
 <span>الوقت:</span>
 </label>
 <select
 value={reservationTime}
 onChange={(e) => setReservationTime(e.target.value)}
 className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
 >
 <option value="07:00 PM">07:00 PM (عشاء مبكر)</option>
 <option value="09:00 PM">09:00 PM (ذروة السهرة)</option>
 <option value="11:00 PM">11:00 PM (سهرة متأخرة)</option>
 </select>
 </div>

 <div>
 <label className="block text-slate-400 mb-1 flex items-center gap-1 font-bold">
 <Users className="w-3.5 h-3.5 text-orange-400" />
 <span>عدد الأفراد:</span>
 </label>
 <select
 value={reservationGuests}
 onChange={(e) => setReservationGuests(e.target.value)}
 className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
 >
 <option value="فردين (طاولة ثنائية رومانسية)">فردين</option>
 <option value="4 أفراد (طاولة عائلية)">4 أفراد</option>
 <option value="6-8 أفراد (VIP Lounge)">6-8 أفراد (VIP)</option>
 </select>
 </div>
 </div>
 </div>

 <button
 onClick={() => {
 setIsReservationModalOpen(false);
 setTableBookingSuccess(true);
 }}
 className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
 >
 <Send className="w-4 h-4" />
 <span>تأكيد الحجز الفوري وإرسال التفاصيل</span>
 </button>
 </div>
 </div>
 )}

 {/* Table Booking Success Modal */}
 {tableBookingSuccess && (
 <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn">
 <div className="w-full bg-slate-900 border-2 border-emerald-500 rounded-3xl p-5 text-center text-white space-y-3 shadow-2xl">
 <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
 <CheckCircle2 className="w-7 h-7" />
 </div>
 <h3 className="text-base font-black font-heading">تم تسجيل طلب الحجز بنجاح! </h3>
 <p className="text-xs text-slate-300 leading-relaxed">
 تم تأكيد حجز طاولة لـ {reservationGuests} بتاريخ {reservationDate} الساعة {reservationTime}.
 سيصلك واتساب فوراً من إدارة المطعم.
 </p>
 <button
 onClick={() => setTableBookingSuccess(false)}
 className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs"
 >
 حسناً، عودة للتصفح
 </button>
 </div>
 </div>
 )}

 {/* Categories Strip */}
 <div className="px-4 py-1 flex items-center gap-2 overflow-x-auto scrollbar-none">
 {storeConfig.categories.map((cat, i) => (
 <button
 key={i}
 onClick={() => {
 playClick();
 setSelectedCategory(cat);
 }}
 className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
 selectedCategory === cat
 ? 'bg-orange-600 text-white shadow-xs'
 : 'bg-slate-800/10 hover:bg-slate-800/20 border border-slate-500/20'
 }`}
 >
 {cat}
 </button>
 ))}
 </div>

 {/* Subtabs Filter */}
 <div className="px-4 pt-4 flex items-center justify-between">
 <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800/10 text-xs font-bold">
 {['Top Picks', 'New Arrivals', 'Best Sellers', 'Sale'].map((tab) => (
 <button
 key={tab}
 onClick={() => {
 playClick();
 setSelectedSubTab(tab);
 }}
 className={`px-2.5 py-1 rounded-lg transition-all ${
 selectedSubTab === tab
 ? 'bg-orange-500 text-white font-black shadow-xs'
 : 'opacity-70 hover:opacity-100'
 }`}
 >
 {tab}
 </button>
 ))}
 </div>

 <span className="text-[11px] font-bold text-orange-500 cursor-pointer">
 {filteredProducts.length} منتجات
 </span>
 </div>

 {/* Products Grid with REAL CLICKABLE ITEMS */}
 <div className="p-4 grid grid-cols-2 gap-3">
 {filteredProducts.length > 0 ? (
 filteredProducts.map((prod) => {
 const isWish = wishlistIds.includes(prod.id);
 return (
 <div
 key={prod.id}
 onClick={() => handleOpenProductInsidePhone(prod)}
 className="rounded-2xl p-3 border shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group border-slate-500/20 bg-inherit"
 >
 {/* Image Box */}
 <div className="relative rounded-xl h-36 flex items-center justify-center mb-2 overflow-hidden bg-slate-100/10">
 {prod.badge && (
 <span className="absolute top-2 right-2 text-[10px] font-black bg-orange-600 text-white px-2 py-0.5 rounded-full z-10 shadow-xs">
 {prod.badge}
 </span>
 )}
 <button
 onClick={(e) => handleToggleWishlist(prod.id, e)}
 className="absolute top-2 left-2 p-1.5 rounded-full bg-white/80 dark:bg-black/60 z-10 transition-transform active:scale-125"
 >
 <Heart
 className={`w-3.5 h-3.5 ${
 isWish ? 'fill-red-500 text-red-500' : 'text-slate-400'
 }`}
 />
 </button>

 <img
 src={prod.imageUrl}
 alt={prod.name}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
 onError={(e) => {
 e.currentTarget.onerror = null;
 e.currentTarget.src = activeTmplMeta.previewImage;
 }}
 />
 </div>

 {/* Info */}
 <div>
 <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mb-0.5">
 <Star className="w-3 h-3 fill-amber-400" />
 <span>{prod.rating || 4.8}</span>
 <span className="opacity-60">({prod.reviewsCount || 120})</span>
 </div>

 <h4 className="text-xs font-black line-clamp-2 leading-tight">
 {prod.name}
 </h4>

 <div className="mt-2 flex items-baseline justify-between">
 <div>
 <span className="text-sm font-black font-mono">
 {prod.price} {storeConfig.currency}
 </span>
 {prod.originalPrice && (
 <span className="text-[10px] opacity-50 line-through mr-1 font-mono">
 {prod.originalPrice}
 </span>
 )}
 </div>

 <button
 onClick={(e) => {
 e.stopPropagation();
 handleAddToCart(prod);
 }}
 className="w-7 h-7 rounded-lg bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center transition-colors shadow-xs"
 title="إضافة للسلة"
 >
 <Plus className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>
 </div>
 );
 })
 ) : (
 <div className="col-span-2 text-center py-8 space-y-2">
 <p className="text-xs opacity-60 font-bold">لا توجد منتجات مطابقة لهذا القسم</p>
 <button
 onClick={() => setSelectedCategory('الكل')}
 className="px-3 py-1 rounded-xl bg-orange-600 text-white font-black text-xs"
 >
 عرض كل المنتجات
 </button>
 </div>
 )}
 </div>

 </div>

 {/* Bottom App Bar Inside iPhone 13 Pro */}
 <div className="border-t px-6 py-2.5 flex items-center justify-between text-[11px] font-bold border-inherit/20 bg-inherit/95 sticky bottom-0 z-30">
 <button
 onClick={() => setPhoneScreen('home')}
 className="flex flex-col items-center text-orange-500"
 >
 <Footprints className="w-4 h-4" />
 <span>الرئيسية</span>
 </button>

 <button
 onClick={() => setPhoneScreen('categories')}
 className="flex flex-col items-center opacity-70 hover:opacity-100"
 >
 <Layers className="w-4 h-4" />
 <span>الأقسام</span>
 </button>

 <button
 onClick={() => setPhoneScreen('cart')}
 className="flex flex-col items-center relative opacity-90 hover:opacity-100"
 >
 <ShoppingBag className="w-4 h-4" />
 <span>السلة</span>
 {simulatedCart.length > 0 && (
 <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-orange-600 animate-ping"></span>
 )}
 </button>

 <button
 onClick={() => setPhoneScreen('wishlist')}
 className="flex flex-col items-center opacity-70 hover:opacity-100"
 >
 <Heart className="w-4 h-4" />
 <span>المفضلة ({wishlistIds.length})</span>
 </button>
 </div>

 </div>
 )}
 </>
 )}

 {/* ================================================== */}
 {/* IN-PHONE SCREEN 2: PRODUCT DETAIL PAGE */}
 {/* ================================================== */}
 {phoneScreen === 'product_detail' && (
 <div className="flex-1 flex flex-col justify-between animate-fadeIn">
 <div>
 {/* Top Bar with Back Button */}
 <div className="p-4 flex items-center justify-between border-b border-inherit/15">
 <button
 onClick={() => setPhoneScreen('home')}
 className="w-8 h-8 rounded-full border border-slate-500/30 flex items-center justify-center"
 >
 <ChevronLeft className="w-4 h-4 -scale-x-100" />
 </button>

 <div className="flex items-center gap-2">
 <button
 onClick={() => handleToggleWishlist(activeProductInPhone.id)}
 className="w-8 h-8 rounded-full border border-slate-500/30 flex items-center justify-center"
 >
 <Heart
 className={`w-4 h-4 ${
 wishlistIds.includes(activeProductInPhone.id)
 ? 'fill-red-500 text-red-500'
 : 'text-slate-400'
 }`}
 />
 </button>
 <button
 onClick={() => alert('تم نسخ رابط المنتج للمشاركة بنجاح!')}
 className="w-8 h-8 rounded-full border border-slate-500/30 flex items-center justify-center"
 >
 <Share2 className="w-4 h-4" />
 </button>
 </div>
 </div>

 {/* Product Main Image */}
 <div className="p-4">
 <div className="relative rounded-3xl overflow-hidden h-64 border border-slate-500/20 shadow-md">
 <img
 src={activeProductInPhone.imageUrl}
 alt={activeProductInPhone.name}
 className="w-full h-full object-cover"
 />
 {activeProductInPhone.badge && (
 <span className="absolute top-3 right-3 text-xs font-black bg-orange-600 text-white px-3 py-1 rounded-full shadow-md">
 {activeProductInPhone.badge}
 </span>
 )}
 </div>
 </div>

 {/* Product Information */}
 <div className="p-4 space-y-4">
 <div>
 <div className="flex items-center justify-between">
 <span className="text-xs font-mono text-orange-500 font-bold">
 {activeProductInPhone.category}
 </span>
 <span className="text-xs font-bold flex items-center text-amber-500">
 {activeProductInPhone.rating || 4.9} ({activeProductInPhone.reviewsCount || 230} تقييم)
 </span>
 </div>

 <h2 className="text-xl font-black font-heading mt-1 leading-snug">
 {activeProductInPhone.name}
 </h2>

 <div className="mt-2 flex items-baseline gap-2">
 <span className="text-2xl font-black font-mono text-orange-500">
 {activeProductInPhone.price} {storeConfig.currency}
 </span>
 {activeProductInPhone.originalPrice && (
 <span className="text-xs opacity-50 line-through font-mono">
 {activeProductInPhone.originalPrice} {storeConfig.currency}
 </span>
 )}
 <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
 متاح للتسليم في خلال دقايق
 </span>
 </div>
 </div>

 {/* Description */}
 <p className="text-xs opacity-80 leading-relaxed font-medium">
 {activeProductInPhone.description ||
 'منتج أصلي 100% بأعلى معايير الجودة والتصنيع مع إمكانية المعاينة قبل الدفع والاستلام.'}
 </p>

 {/* Color Selector */}
 {activeProductInPhone.colors && (
 <div>
 <div className="flex items-center justify-between text-xs font-bold mb-2">
 <span>اللون المختار:</span>
 <span className="text-orange-500 font-black">{selectedColor}</span>
 </div>
 <div className="flex items-center gap-3">
 {activeProductInPhone.colors.map((c) => (
 <button
 key={c.name}
 onClick={() => setSelectedColor(c.name)}
 className={`w-7 h-7 rounded-full p-0.5 border-2 transition-transform ${
 selectedColor === c.name
 ? 'border-orange-500 scale-110 shadow-sm'
 : 'border-transparent'
 }`}
 >
 <div
 className="w-full h-full rounded-full"
 style={{ backgroundColor: c.hex }}
 ></div>
 </button>
 ))}
 </div>
 </div>
 )}

 {/* Size Selector */}
 {activeProductInPhone.sizes && (
 <div>
 <div className="flex items-center justify-between text-xs font-bold mb-2">
 <span>اختر المقاس المطلوب:</span>
 <button
 onClick={() => setSizeGuideModalOpen(true)}
 className="text-orange-500 underline underline-offset-2"
 >
 جدول المقاسات
 </button>
 </div>
 <div className="grid grid-cols-4 gap-2">
 {activeProductInPhone.sizes.map((sz) => (
 <button
 key={sz}
 onClick={() => setSelectedSize(sz)}
 className={`py-2 rounded-xl text-xs font-mono font-black border transition-all ${
 selectedSize === sz
 ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
 : 'border-slate-500/30 hover:border-orange-500'
 }`}
 >
 {sz}
 </button>
 ))}
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Bottom Checkout Action inside Phone */}
 <div className="p-4 border-t border-inherit/15 bg-inherit sticky bottom-0 z-30 flex items-center justify-between">
 <div>
 <div className="text-lg font-black font-mono">
 {activeProductInPhone.price} {storeConfig.currency}
 </div>
 <span className="text-[10px] text-emerald-600 font-bold">
 شحن سريع لجميع محافظات مصر
 </span>
 </div>

 <button
 onClick={() => handleAddToCart(activeProductInPhone)}
 className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
 >
 <ShoppingBag className="w-4 h-4" />
 <span>أضف للحقيبة</span>
 </button>
 </div>
 </div>
 )}

 {/* ================================================== */}
 {/* IN-PHONE SCREEN 3: CART & WHATSAPP CHECKOUT */}
 {/* ================================================== */}
 {phoneScreen === 'cart' && (
 <div className="flex-1 flex flex-col justify-between animate-fadeIn">
 <div>
 {/* Cart Header */}
 <div className="p-4 border-b border-inherit/15 flex items-center justify-between">
 <button
 onClick={() => setPhoneScreen('home')}
 className="w-8 h-8 rounded-full border border-slate-500/30 flex items-center justify-center"
 >
 <ChevronLeft className="w-4 h-4 -scale-x-100" />
 </button>
 <h3 className="font-heading font-black text-lg">
 حقيبة التسوق ({simulatedCart.length})
 </h3>
 <div className="w-8"></div>
 </div>

 {/* Cart Items */}
 <div className="p-4 space-y-3">
 {simulatedCart.length === 0 ? (
 <div className="py-16 text-center opacity-60 text-xs font-bold space-y-2">
 <ShoppingBag className="w-12 h-12 mx-auto stroke-1" />
 <p>حقيبة التسوق فارغة حالياً</p>
 <button
 onClick={() => setPhoneScreen('home')}
 className="px-4 py-2 rounded-xl bg-orange-600 text-white font-black mt-2 text-xs"
 >
 تصفح المنتجات الآن
 </button>
 </div>
 ) : (
 simulatedCart.map((item) => (
 <div
 key={item.id}
 className="p-3 rounded-2xl border border-slate-500/20 flex items-center justify-between gap-3 shadow-xs"
 >
 <div className="flex items-center gap-3">
 <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
 <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
 </div>
 <div>
 <h4 className="text-xs font-black line-clamp-1">{item.name}</h4>
 <div className="text-[11px] opacity-70 font-mono mt-0.5">
 {item.selectedSize && `مقاس: ${item.selectedSize}`}{' '}
 {item.selectedColor && `• ${item.selectedColor}`}
 </div>
 <div className="text-xs font-black font-mono text-orange-500 mt-1">
 {item.price} {storeConfig.currency}
 </div>
 </div>
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={() => updateQuantity(item.id, -1)}
 className="w-6 h-6 rounded-md border border-slate-500/30 flex items-center justify-center font-bold text-xs"
 >
 -
 </button>
 <span className="text-xs font-mono font-black">{item.quantity}</span>
 <button
 onClick={() => updateQuantity(item.id, 1)}
 className="w-6 h-6 rounded-md border border-slate-500/30 flex items-center justify-center font-bold text-xs"
 >
 +
 </button>
 </div>
 </div>
 ))
 )}
 </div>
 </div>

 {/* Cart Summary & Instant WhatsApp Button */}
 {simulatedCart.length > 0 && (
 <div className="p-4 border-t border-inherit/15 bg-inherit space-y-3">
 <div className="flex items-center justify-between text-sm">
 <span className="font-bold opacity-80">إجمالي الطلب:</span>
 <span className="font-black font-mono text-xl text-orange-500">
 {cartTotal.toLocaleString()} {storeConfig.currency}
 </span>
 </div>

 <button
 onClick={() => {
 playPaperFlip();
 alert(`✓ تم إرسال الأوردر التجريبي للواتساب برقم #${Math.floor(1000 + Math.random()*9000)}!\n\nهكذا يستلم التاجر تفاصيل الطلب والمقاسات والعنوان في ثانية واحدة.`);
 }}
 className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
 >
 <Send className="w-4 h-4" />
 <span>تأكيد الأوردر عبر الواتساب أوتوماتيك</span>
 </button>
 </div>
 )}
 </div>
 )}

 {/* ================================================== */}
 {/* IN-PHONE SCREEN 4: SEARCH OVERLAY */}
 {/* ================================================== */}
 {phoneScreen === 'search' && (
 <div className="flex-1 p-4 space-y-4 animate-fadeIn">
 <div className="flex items-center gap-2">
 <input
 type="text"
 autoFocus
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="ابحث عن كوتشي، تيشيرت، مقاس..."
 className="w-full p-2.5 rounded-xl border border-slate-500/30 bg-inherit text-xs font-bold focus:border-orange-500 focus:outline-hidden"
 />
 <button
 onClick={() => {
 setSearchQuery('');
 setPhoneScreen('home');
 }}
 className="p-2.5 rounded-xl bg-slate-800/10 text-xs font-bold"
 >
 إلغاء
 </button>
 </div>

 <div className="space-y-2">
 <span className="text-xs font-bold opacity-70">
 نتائج البحث ({filteredProducts.length})
 </span>
 <div className="space-y-2">
 {filteredProducts.map((p) => (
 <div
 key={p.id}
 onClick={() => handleOpenProductInsidePhone(p)}
 className="p-2.5 rounded-xl border border-slate-500/20 flex items-center justify-between cursor-pointer hover:border-orange-500"
 >
 <div className="flex items-center gap-2">
 <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
 <span className="text-xs font-bold">{p.name}</span>
 </div>
 <span className="text-xs font-mono font-black text-orange-500">{p.price} ج.م</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 )}

 {/* ================================================== */}
 {/* IN-PHONE SCREEN 5: WISHLIST */}
 {/* ================================================== */}
 {phoneScreen === 'wishlist' && (
 <div className="flex-1 flex flex-col justify-between animate-fadeIn">
 <div>
 <div className="p-4 border-b border-inherit/15 flex items-center justify-between">
 <button
 onClick={() => setPhoneScreen('home')}
 className="w-8 h-8 rounded-full border border-slate-500/30 flex items-center justify-center"
 >
 <ChevronLeft className="w-4 h-4 -scale-x-100" />
 </button>
 <h3 className="font-heading font-black text-lg">
 قائمة رغباتك والمفضلة ({wishlistIds.length})
 </h3>
 <div className="w-8"></div>
 </div>

 <div className="p-4 space-y-3">
 {wishlistIds.length === 0 ? (
 <div className="py-16 text-center opacity-60 text-xs font-bold space-y-2">
 <Heart className="w-12 h-12 mx-auto stroke-1 text-slate-400" />
 <p>لم تقم بإضافة أي منتج للمفضلة بعد</p>
 </div>
 ) : (
 storeConfig.products
 .filter((p) => wishlistIds.includes(p.id))
 .map((p) => (
 <div
 key={p.id}
 onClick={() => handleOpenProductInsidePhone(p)}
 className="p-3 rounded-2xl border border-slate-500/20 flex items-center justify-between cursor-pointer"
 >
 <div className="flex items-center gap-3">
 <img src={p.imageUrl} alt={p.name} className="w-14 h-14 rounded-xl object-cover" />
 <div>
 <h4 className="text-xs font-black">{p.name}</h4>
 <span className="text-xs font-mono font-black text-orange-500 mt-1 block">
 {p.price} {storeConfig.currency}
 </span>
 </div>
 </div>
 <button
 onClick={(e) => handleToggleWishlist(p.id, e)}
 className="p-2 text-red-500"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 ))
 )}
 </div>
 </div>
 </div>
 )}

 {/* ================================================== */}
 {/* IN-PHONE SCREEN 6: CATEGORIES BROWSER */}
 {/* ================================================== */}
 {phoneScreen === 'categories' && (
 <div className="flex-1 flex flex-col justify-between animate-fadeIn">
 <div>
 <div className="p-4 border-b border-inherit/15 flex items-center justify-between">
 <button
 onClick={() => setPhoneScreen('home')}
 className="w-8 h-8 rounded-full border border-slate-500/30 flex items-center justify-center"
 >
 <ChevronLeft className="w-4 h-4 -scale-x-100" />
 </button>
 <h3 className="font-heading font-black text-lg">
 أقسام المتجر ({storeConfig.categories.length})
 </h3>
 <div className="w-8"></div>
 </div>

 <div className="p-4 grid grid-cols-2 gap-3">
 {storeConfig.categories.map((cat, i) => (
 <button
 key={i}
 onClick={() => {
 setSelectedCategory(cat);
 setPhoneScreen('home');
 }}
 className="p-4 rounded-2xl border border-slate-500/20 bg-slate-500/5 hover:bg-orange-500/10 hover:border-orange-500 transition-all text-center space-y-2 group"
 >
 <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 mx-auto flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
 
 </div>
 <h4 className="font-heading font-black text-xs">{cat}</h4>
 <span className="text-[10px] text-orange-500 font-bold block">
 تصفح المنتجات
 </span>
 </button>
 ))}
 </div>
 </div>
 </div>
 )}

 {/* Bottom Home Indicator Bar (Mobile & Tablet) */}
 {!isFullScreenStorefront && (viewportMode === 'mobile' || viewportMode === 'tablet') && (
 <div className="pb-1.5 pt-1 bg-inherit">
 <div className="w-32 h-1 bg-slate-400/40 rounded-full mx-auto"></div>
 </div>
 )}

 </div>
 </div>

 </div>
 )}

 {/* ======================================================== */}
 {/* VIEW 2: MERCHANT ADMIN CONTROL PANEL (لوحة تحكم التاجر) */}
 {/* ======================================================== */}
 {activeView === 'admin' && (
 <div className="flex-1 p-4 sm:p-8 bg-slate-950 overflow-y-auto">
 <div className="max-w-5xl mx-auto space-y-6">
 
 {/* Admin Control Panel Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-5">
 <div className="space-y-1">
 <div className="flex items-center gap-2 flex-wrap">
 <h2 className="text-xl sm:text-2xl font-black font-heading text-white leading-normal">
 لوحة تحكم وإدارة المتجر (Merchant Admin)
 </h2>
 <span className="text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full whitespace-nowrap">
 نظام إدارة فوري
 </span>
 </div>
 <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
 تحكم في منتجاتك، الأقسام، وشاهد تحليلات الأرباح وصافي المبيعات كأنك تاجر حقيقي.
 </p>
 </div>

 <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs shrink-0 flex-wrap">
 <span className="text-slate-400 font-bold px-1">محاكاة الباقة:</span>
 <button
 onClick={() => {
 playClick();
 setSimulatedPlan('standard');
 }}
 className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
 simulatedPlan === 'standard'
 ? 'bg-amber-600 text-white'
 : 'text-slate-400 hover:text-white'
 }`}
 >
 الاقتصادية (1,250 ج.م)
 </button>
 <button
 onClick={() => {
 playClick();
 setSimulatedPlan('pro');
 }}
 className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
 simulatedPlan === 'pro'
 ? 'bg-emerald-600 text-white'
 : 'text-slate-400 hover:text-white'
 }`}
 >
 المحترفين (2,400 ج.م)
 </button>
 </div>
 </div>

 {/* Admin Tabs with shrink-0 and whitespace-nowrap */}
 <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
 <button
 onClick={() => {
 playClick();
 setAdminTab('products');
 }}
 className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap ${
 adminTab === 'products'
 ? 'bg-orange-500 text-slate-950 font-black shadow-xs'
 : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800'
 }`}
 >
 <Package className="w-4 h-4" />
 <span>إدارة المنتجات ({storeConfig.products.length})</span>
 </button>

 <button
 onClick={() => {
 playClick();
 setAdminTab('categories');
 }}
 className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap ${
 adminTab === 'categories'
 ? 'bg-orange-500 text-slate-950 font-black shadow-xs'
 : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800'
 }`}
 >
 <Layers className="w-4 h-4" />
 <span>الأقسام ({storeConfig.categories.length})</span>
 </button>

 <button
 onClick={() => {
 playClick();
 setAdminTab('analytics');
 }}
 className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap ${
 adminTab === 'analytics'
 ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
 : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800'
 }`}
 >
 <BarChart3 className="w-4 h-4" />
 <span>تحليل المبيعات وصافي الربح</span>
 </button>

 <button
 onClick={() => {
 playClick();
 setAdminTab('branding');
 }}
 className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap ${
 adminTab === 'branding'
 ? 'bg-orange-500 text-slate-950 font-black shadow-xs'
 : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800'
 }`}
 >
 <Sliders className="w-4 h-4" />
 <span>الهوية والدومين</span>
 </button>
 </div>

 {/* Add Product Form */}
 {adminTab === 'products' && (
 <div className="space-y-6">
 <form
 onSubmit={handleAddProduct}
 className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
 >
 <div className="flex items-center justify-between border-b border-slate-800 pb-3">
 <div className="flex items-center gap-2">
 <Plus className="w-4 h-4 text-emerald-400" />
 <h3 className="font-heading font-black text-base text-white">
 إضافة منتج جديد يظهر فوراً في شاشة الهاتف
 </h3>
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 <div className="sm:col-span-2">
 <label className="block text-xs font-bold text-slate-300 mb-1">اسم المنتج *</label>
 <input
 type="text"
 required
 value={newProdName}
 onChange={(e) => setNewProdName(e.target.value)}
 placeholder="مثال: كوتشي نايكي أصلي..."
 className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold"
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-slate-300 mb-1">القسم</label>
 <select
 value={newProdCategory}
 onChange={(e) => setNewProdCategory(e.target.value)}
 className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold"
 >
 {storeConfig.categories.map((c, i) => (
 <option key={i} value={c}>{c}</option>
 ))}
 </select>
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
 <div>
 <label className="block text-xs font-bold text-slate-300 mb-1">سعر البيع (ج.م) *</label>
 <input
 type="number"
 required
 value={newProdPrice}
 onChange={(e) => setNewProdPrice(Number(e.target.value))}
 className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono font-bold"
 />
 </div>
 <div>
 <label className="block text-xs font-bold text-slate-300 mb-1">قبل الخصم (ج.م)</label>
 <input
 type="number"
 value={newProdOriginalPrice}
 onChange={(e) => setNewProdOriginalPrice(Number(e.target.value))}
 className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-400 text-xs font-mono font-bold"
 />
 </div>
 <div>
 <label className="block text-xs font-bold text-slate-300 mb-1">سعر التكلفة (ج.م)</label>
 <input
 type="number"
 value={newProdCostPrice}
 onChange={(e) => setNewProdCostPrice(Number(e.target.value))}
 className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 text-xs font-mono font-bold"
 />
 </div>
 <div>
 <label className="block text-xs font-bold text-slate-300 mb-1">الشارة الترويجية</label>
 <input
 type="text"
 value={newProdBadge}
 onChange={(e) => setNewProdBadge(e.target.value)}
 placeholder="مثال: الأكثر مبيعاً "
 className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold"
 />
 </div>
 </div>

 <div>
 <label className="block text-xs font-bold text-slate-300 mb-1">رابط صورة المنتج (HD):</label>
 <input
 type="url"
 value={newProdImageUrl}
 onChange={(e) => setNewProdImageUrl(e.target.value)}
 className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 text-xs font-mono mb-2"
 />
 </div>

 <div className="pt-2 flex justify-end">
 <button
 type="submit"
 className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs flex items-center gap-1.5"
 >
 <Plus className="w-4 h-4" />
 <span>أضف المنتج للمتجر فوراً</span>
 </button>
 </div>
 </form>

 {/* Existing Products */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {storeConfig.products.map((p) => (
 <div key={p.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
 <div className="flex items-center gap-3">
 <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
 <div>
 <h4 className="text-xs font-black text-white">{p.name}</h4>
 <span className="text-xs text-orange-400 font-mono font-bold">{p.price} ج.م</span>
 </div>
 </div>
 <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 text-slate-400 hover:text-red-400">
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Categories Tab */}
 {adminTab === 'categories' && (
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <input
 type="text"
 value={newCategoryName}
 onChange={(e) => setNewCategoryName(e.target.value)}
 placeholder="اسم القسم الجديد..."
 className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold"
 />
 <button
 onClick={handleAddCategory}
 className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shrink-0"
 >
 إضافة قسم
 </button>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
 {storeConfig.categories.map((cat, i) => (
 <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
 <span className="text-xs font-bold text-white">{cat}</span>
 <button onClick={() => handleDeleteCategory(cat)} className="text-slate-400 hover:text-red-400">
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Analytics Tab */}
 {adminTab === 'analytics' && (
 <div className="space-y-4">
 <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
 <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
 <div className="flex items-center justify-between text-slate-400 text-xs">
 <span>إجمالي المبيعات</span>
 <DollarSign className="w-4 h-4 text-indigo-400" />
 </div>
 <div className="text-2xl font-black font-mono text-white">48,650 ج.م</div>
 <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
 <TrendingUp className="w-3 h-3" /> +18.4% نمو أسبوعي
 </span>
 </div>

 <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
 <div className="flex items-center justify-between text-slate-400 text-xs">
 <span>تكلفة البضاعة</span>
 <Package className="w-4 h-4 text-slate-400" />
 </div>
 <div className="text-2xl font-black font-mono text-slate-300">31,200 ج.م</div>
 <span className="text-[10px] text-slate-400">حسب أسعار التكلفة</span>
 </div>

 <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-1 bg-emerald-950/20">
 <div className="flex items-center justify-between text-emerald-400 text-xs font-bold">
 <span>صافي الربح الحقيقي </span>
 <TrendingUp className="w-4 h-4" />
 </div>
 <div className="text-2xl font-black font-mono text-emerald-400">17,450 ج.م</div>
 <span className="text-[10px] text-emerald-300 font-bold">هامش ربح صافي 35.8%</span>
 </div>

 <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-1 bg-amber-950/20">
 <div className="flex items-center justify-between text-amber-400 text-xs font-bold">
 <span>المنتج الأكثر طلباً </span>
 <Flame className="w-4 h-4" />
 </div>
 <div className="text-xs font-black text-amber-200 line-clamp-1">
 {storeConfig.products[0]?.name || 'كوتشي نايكي بيجاسوس'}
 </div>
 <span className="text-[10px] text-amber-300/80 font-bold">128 طلب ناجح هذا الشهر</span>
 </div>
 </div>
 </div>
 )}

 {/* Branding Tab */}
 {adminTab === 'branding' && (
 <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
 <div>
 <label className="block text-xs font-bold text-slate-300 mb-1">اسم المتجر</label>
 <input
 type="text"
 value={storeConfig.storeName}
 onChange={(e) => setStoreConfig({ ...storeConfig, storeName: e.target.value })}
 className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold"
 />
 </div>
 <div>
 <label className="block text-xs font-bold text-slate-300 mb-1">الدومين المطلوب</label>
 <input
 type="text"
 value={storeConfig.customDomain}
 onChange={(e) => setStoreConfig({ ...storeConfig, customDomain: e.target.value })}
 className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-indigo-400 text-xs font-mono font-bold"
 />
 </div>
 </div>
 )}

 </div>
 </div>
 )}

 </div>

 {/* ======================================================== */}
 {/* USER INSTRUCTION 1: FIGMA-STYLE TEMPLATES CATALOG MODAL */}
 {/* (SHOWN FIRST ON STUDIO LAUNCH AS REQUESTED IN IMAGE 1) */}
 {/* ======================================================== */}
 {/* ======================================================== */}
 {/* FIGMA COMMUNITY STYLE TEMPLATES CATALOG MODAL (ARABIC & DARK THEME) */}
 {/* ======================================================== */}
 {sizeGuideModalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
 <div className="bg-slate-900 text-white rounded-2xl p-5 max-w-sm w-full space-y-4 border border-slate-700">
 <div className="flex items-center justify-between border-b border-slate-800 pb-2">
 <h4 className="font-heading font-black text-sm">جدول المقاسات (US / EU / مصر)</h4>
 <button onClick={() => setSizeGuideModalOpen(false)}>
 <X className="w-4 h-4" />
 </button>
 </div>
 <table className="w-full text-center text-xs font-mono">
 <thead>
 <tr className="border-b border-slate-800 text-orange-400">
 <th className="pb-1">US</th>
 <th className="pb-1">مصر / EU</th>
 <th className="pb-1">طول القدم (CM)</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-800/50">
 <tr><td className="py-1">7.5</td><td>40.5</td><td>25.5 cm</td></tr>
 <tr><td className="py-1">8.0</td><td>41.0</td><td>26.0 cm</td></tr>
 <tr><td className="py-1">8.5</td><td>42.0</td><td>26.5 cm</td></tr>
 <tr><td className="py-1">9.0</td><td>42.5</td><td>27.0 cm</td></tr>
 <tr><td className="py-1">9.5</td><td>43.0</td><td>27.5 cm</td></tr>
 <tr><td className="py-1">10.0</td><td>44.0</td><td>28.0 cm</td></tr>
 </tbody>
 </table>
 </div>
 </div>
 )}

 </div>
 );
};
