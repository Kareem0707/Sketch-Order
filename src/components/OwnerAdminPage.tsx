import React, { useState, useEffect } from 'react';
import {
 ArrowRight,
 CheckCircle2,
 Clock,
 DollarSign,
 Store,
 ExternalLink,
 MessageCircle,
 Trash2,
 RefreshCw,
 Sparkles,
 X,
 Plus,
 Search,
 Check,
 Sun,
 Moon,
 KeyRound,
} from 'lucide-react';
import type { ClientOrderRequest, TenantStoreAccount } from '../types';
import { playClick, playCashSound } from '../utils/soundEffects';
import logoSquareImg from '../assets/sketch-order-logo-square.png';
import mascotPng from '../assets/sketch-mascot.png';
import { STUDIO_TEMPLATES, DEFAULT_PRODUCTS_MAP, DEFAULT_CATEGORIES_MAP } from './FullPageStoreStudio';

interface OwnerAdminPageProps {
 onBackToHome: () => void;
 onOpenStoreLive: (subdomain: string) => void;
 onOpenMerchantPortal: (subdomain: string) => void;
 isDarkMode: boolean;
 onToggleDarkMode: () => void;
}

const DEFAULT_ORDERS_MOCK: ClientOrderRequest[] = [
 {
 id: 'SK-7352',
 createdAt: '2026-11-13 10:15',
 clientName: 'كريم محمود',
 whatsappNumber: '01012345678',
 brandName: 'سبورتك إيجيبت (SPORTECH)',
 subdomain: 'sportech',
 selectedPlan: 'pro',
 planName: 'باقة المحترفين والنمو',
 amount: 2400,
 templateId: 'sportech-sneakers',
 templateName: 'سبورتك الرياضي (SPORTECH)',
 paymentMethod: 'instapay',
 transactionRef: 'IP-998241284',
 receiptImageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
 notes: 'عايز أربط الدومين باسم sportech-eg.store فوراً واستلم المتجر النهاردة.',
 status: 'pending_review',
 },
 {
 id: 'SK-9281',
 createdAt: '2026-11-12 18:30',
 clientName: 'أحمد الشناوي',
 whatsappNumber: '01123456789',
 brandName: 'كوتشيات الشناوي (Sneakers Hub)',
 subdomain: 'alshinnawy',
 selectedPlan: 'standard',
 planName: 'الباقة الاقتصادية',
 amount: 1250,
 templateId: 'cloudrunner-product',
 templateName: 'صفحة منتج نايكي (Cloud Runner 2)',
 paymentMethod: 'instapay',
 transactionRef: 'IP-6452041284',
 receiptImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
 status: 'pending_review',
 },
 {
 id: 'SK-4274',
 createdAt: '2026-11-11 14:05',
 clientName: 'سارة مصطفى',
 whatsappNumber: '01208765432',
 brandName: 'فاسكو كايرو ستريت',
 subdomain: 'fasco-cairo',
 selectedPlan: 'pro',
 planName: 'باقة المحترفين والنمو',
 amount: 2400,
 templateId: 'fasco-fashion',
 templateName: 'فاسكو ستريت وير (FASCO)',
 paymentMethod: 'vodafone_cash',
 transactionRef: 'VF-19283749',
 receiptImageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80',
 status: 'deployed_live',
 approvedAt: '2026-11-11 14:30',
 },
];

export const OwnerAdminPage: React.FC<OwnerAdminPageProps> = ({
 onBackToHome,
 onOpenStoreLive,
 onOpenMerchantPortal,
 isDarkMode,
 onToggleDarkMode,
}) => {
 const [orders, setOrders] = useState<ClientOrderRequest[]>([]);
 const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all');
 const [searchQuery, setSearchQuery] = useState<string>('');
 const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);
 const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

 // Load orders from localStorage or defaults
 useEffect(() => {
 try {
 const savedOrders = localStorage.getItem('sketch_order_client_requests');
 if (savedOrders) {
 setOrders(JSON.parse(savedOrders));
 } else {
 localStorage.setItem('sketch_order_client_requests', JSON.stringify(DEFAULT_ORDERS_MOCK));
 setOrders(DEFAULT_ORDERS_MOCK);
 }
 } catch {
 setOrders(DEFAULT_ORDERS_MOCK);
 }
 }, []);

 const saveOrders = (newOrders: ClientOrderRequest[]) => {
 setOrders(newOrders);
 try {
 localStorage.setItem('sketch_order_client_requests', JSON.stringify(newOrders));
 } catch (e) {
 console.error(e);
 }
 };

 // 1-Click Store Approval & Automatic Tenant Provisioning
 const handleApproveAndDeploy = (order: ClientOrderRequest) => {
 playCashSound();
 
 // 1. Update order status
 const updated = orders.map((o) =>
 o.id === order.id
 ? {
 ...o,
 status: 'deployed_live' as const,
 approvedAt: new Date().toLocaleString('ar-EG'),
 }
 : o
 );
 saveOrders(updated);

 // 2. Automatically provision Tenant Store into `sketch_tenant_stores`
 try {
 const existingStoresRaw = localStorage.getItem('sketch_tenant_stores');
 const stores: Record<string, TenantStoreAccount> = existingStoresRaw
 ? JSON.parse(existingStoresRaw)
 : {};

 const templateMeta =
 STUDIO_TEMPLATES.find((t) => t.id === order.templateId) || STUDIO_TEMPLATES[0];
 const prods =
 DEFAULT_PRODUCTS_MAP[order.templateId] || DEFAULT_PRODUCTS_MAP['sportech-sneakers'];
 const cats =
 DEFAULT_CATEGORIES_MAP[order.templateId] || ['الكل', 'منتجات مميزة'];

 const newTenant: TenantStoreAccount = {
 tenantId: `tenant_${order.subdomain}`,
 subdomain: order.subdomain,
 brandName: order.brandName,
 ownerName: order.clientName,
 ownerPhone: order.whatsappNumber,
 planTier: order.selectedPlan,
 status: 'active',
 templateId: order.templateId,
 createdAt: new Date().toISOString(),
 salesTotal: 0,
 ordersCount: 0,
 storeConfig: {
 storeName: order.brandName,
 tagline: templateMeta.description || 'أفضل المنتجات بأعلى جودة وضمان حقيقي',
 niche: 'sneakers',
 templateId: order.templateId,
 accentColor: templateMeta.accentColor,
 customDomain: `${order.subdomain}.sketchorder.com`,
 currency: 'ج.م',
 whatsappNumber: order.whatsappNumber,
 governorate: 'القاهرة',
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
 categories: cats,
 products: prods,
 },
 };

 stores[order.subdomain] = newTenant;
 localStorage.setItem('sketch_tenant_stores', JSON.stringify(stores));

 // Dispatch storage event to alert other tabs/components
 window.dispatchEvent(
 new CustomEvent('sketch_tenant_store_activated', {
 detail: { subdomain: order.subdomain, brandName: order.brandName },
 })
 );
 } catch (err) {
 console.error('Failed to provision tenant store:', err);
 }

 setActionSuccessMessage(`تمت الموافقة وتفعيل متجر "${order.brandName}" بنجاح! `);
 setTimeout(() => setActionSuccessMessage(null), 4000);
 };

 const handleDeleteOrder = (id: string) => {
 playClick();
 if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
 const updated = orders.filter((o) => o.id !== id);
 saveOrders(updated);
 }
 };

 const handleResetDefaults = () => {
 playClick();
 if (confirm('هل تريد إعادة تعيين الطلبات التجريبية للوضع الافتراضي؟')) {
 saveOrders(DEFAULT_ORDERS_MOCK);
 }
 };

 const handleAddNewDemoOrder = () => {
 playCashSound();
 const demoId = `SK-${Math.floor(1000 + Math.random() * 9000)}`;
 const randomSub = `store-${Math.floor(100 + Math.random() * 900)}`;
 const newDemo: ClientOrderRequest = {
 id: demoId,
 createdAt: new Date().toLocaleString('ar-EG'),
 clientName: 'طارق الزيات',
 whatsappNumber: '01099887766',
 brandName: 'برجر فاكتوري إيجيبت',
 subdomain: randomSub,
 selectedPlan: 'pro',
 planName: 'باقة المحترفين والنمو',
 amount: 2400,
 templateId: 'burger-club',
 templateName: 'برجر كلوب (Burger Club & Fries)',
 paymentMethod: 'instapay',
 transactionRef: `IP-${Math.floor(100000000 + Math.random() * 900000000)}`,
 receiptImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
 notes: 'تم التحويل عبر إنستاباي، في انتظار التفعيل فوراً.',
 status: 'pending_review',
 };
 const updated = [newDemo, ...orders];
 saveOrders(updated);
 setActionSuccessMessage(`تمت إضافة طلب جديد تجريبي (#${demoId}) بنجاح! `);
 setTimeout(() => setActionSuccessMessage(null), 3500);
 };

 // KPIs
 const totalRevenue = orders
 .filter((o) => o.status === 'deployed_live')
 .reduce((sum, o) => sum + (typeof o.amount === 'number' ? o.amount : 0), 0);
 const pendingCount = orders.filter((o) => o.status === 'pending_review').length;
 const liveCount = orders.filter((o) => o.status === 'deployed_live').length;

 const filteredOrders = orders.filter((o) => {
 const matchesStatus =
 filterStatus === 'all' ||
 (filterStatus === 'pending' && o.status === 'pending_review') ||
 (filterStatus === 'approved' && o.status === 'deployed_live');
 const matchesSearch =
 searchQuery === '' ||
 o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
 o.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
 o.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
 o.whatsappNumber.includes(searchQuery) ||
 o.id.toLowerCase().includes(searchQuery.toLowerCase());
 return matchesStatus && matchesSearch;
 });

 return (
 <div
 className={`min-h-screen transition-colors duration-200 ${
 isDarkMode ? 'bg-[#0B0F17] text-[#F8FAFC]' : 'bg-[#FAF8F5] text-[#0F0F0F]'
 } font-body antialiased selection:bg-orange-500 selection:text-white pb-20`}
 >
 {/* ======================================================== */}
 {/* 1. TOP HEADER IN STRICT SKETCH THEME */}
 {/* ======================================================== */}
 <header
 className={`sticky top-0 z-40 border-b-2 transition-colors ${
 isDarkMode
 ? 'bg-[#0B0F17]/95 border-slate-700 shadow-md'
 : 'bg-[#FFFDF9]/95 border-[#0F0F0F] shadow-xs'
 } backdrop-blur-md`}
 >
 <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
 {/* Back & Logo */}
 <div className="flex items-center gap-3">
 <button
 onClick={() => {
 playClick();
 onBackToHome();
 }}
 className={`flex items-center gap-2 px-3.5 py-2 text-xs font-black transition-transform active:scale-95 ${
 isDarkMode
 ? 'btn-sketch-dark bg-slate-900 border-2 border-slate-700 text-white'
 : 'btn-sketch btn-sketch-secondary border-2 border-[#0F0F0F]'
 }`}
 >
 <ArrowRight className="w-4 h-4 ml-0.5" />
 <span>العودة للرئيسية</span>
 </button>

 <div className="flex items-center gap-2.5 border-r-2 border-inherit pr-3">
 <img
 src={logoSquareImg}
 alt="Sketch Order"
 className={`w-9 h-9 object-contain ${isDarkMode ? 'invert' : ''}`}
 />
 <img src={mascotPng} alt="Mascot" className="w-8 h-8 object-contain hidden sm:block -rotate-6" />
 <div>
 <div className="flex items-center gap-2">
 <h1 className="font-heading font-black text-lg sm:text-xl leading-none">
 لوحة تحكم إدارة المنصة (Owner Admin)
 </h1>
 <span className="text-[10px] font-mono font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full border border-emerald-600 shadow-xs">
 LIVE SAAS
 </span>
 </div>
 <p className="text-[11px] font-bold opacity-70">
 مراجعة طلبات الشراء، فحص سكرينات التحويل وتفعيل المتاجر المستقلة فوراً
 </p>
 </div>
 </div>
 </div>

 {/* Actions & Dark Theme Toggle */}
 <div className="flex items-center gap-2 sm:gap-3">
 <button
 onClick={handleAddNewDemoOrder}
 className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 -rotate-1"
 >
 <Plus className="w-4 h-4" />
 <span className="hidden sm:inline">طلب تجريبي جديد</span>
 </button>

 {/* Dark Mode Button */}
 <button
 onClick={() => {
 playClick();
 onToggleDarkMode();
 }}
 className={`p-2.5 rounded-xl border-2 font-bold text-xs flex items-center gap-1.5 transition-all ${
 isDarkMode
 ? 'bg-amber-500/10 border-amber-400 text-amber-400 hover:bg-amber-500/20'
 : 'bg-white border-[#0F0F0F] text-[#0F0F0F] hover:bg-slate-100'
 }`}
 title={isDarkMode ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي (Dark)'}
 >
 {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-800" />}
 </button>
 </div>
 </div>
 </header>

 {/* Success Banner Alert */}
 {actionSuccessMessage && (
 <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 animate-fadeIn">
 <div className="p-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-between border-2 border-emerald-600 shadow-md">
 <div className="flex items-center gap-2">
 <CheckCircle2 className="w-5 h-5 shrink-0" />
 <span>{actionSuccessMessage}</span>
 </div>
 <button onClick={() => setActionSuccessMessage(null)} className="p-1">
 <X className="w-4 h-4" />
 </button>
 </div>
 </div>
 )}

 {/* Main Container */}
 <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
 {/* ======================================================== */}
 {/* 2. SKETCH KPI CARDS (Doodle Style) */}
 {/* ======================================================== */}
 <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {/* KPI 1: Revenue */}
 <div
 className={`p-5 rounded-2xl border-2 transition-transform hover:-translate-y-1 ${
 isDarkMode
 ? 'bg-[#111827] border-slate-700 shadow-[4px_4px_0px_#1F2937]'
 : 'bg-white border-[#0F0F0F] shadow-[4px_4px_0px_#0F0F0F]'
 } sketch-border-1 relative overflow-hidden`}
 >
 <div className="flex items-center justify-between mb-2">
 <span className="text-xs font-mono font-black opacity-75">إجمالي الإيرادات المحصلة</span>
 <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
 <DollarSign className="w-4 h-4" />
 </div>
 </div>
 <div className="text-3xl font-black font-mono tracking-tight text-emerald-500">
 {totalRevenue.toLocaleString()} <span className="text-sm font-heading">ج.م</span>
 </div>
 <p className="text-[11px] font-bold opacity-60 mt-1">دفع لمرة واحدة • أرباح المنصة صافية 100%</p>
 </div>

 {/* KPI 2: Live Stores */}
 <div
 className={`p-5 rounded-2xl border-2 transition-transform hover:-translate-y-1 ${
 isDarkMode
 ? 'bg-[#111827] border-slate-700 shadow-[4px_4px_0px_#1F2937]'
 : 'bg-white border-[#0F0F0F] shadow-[4px_4px_0px_#0F0F0F]'
 } sketch-border-2 relative overflow-hidden`}
 >
 <div className="flex items-center justify-between mb-2">
 <span className="text-xs font-mono font-black opacity-75">متاجر مفعلة ونشطة (Live)</span>
 <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold">
 <Store className="w-4 h-4" />
 </div>
 </div>
 <div className="text-3xl font-black font-mono tracking-tight text-indigo-500">
 {liveCount} <span className="text-sm font-heading">متجر</span>
 </div>
 <p className="text-[11px] font-bold opacity-60 mt-1">شغالة بدومينات ساب مستقلة وقابلة للبيع</p>
 </div>

 {/* KPI 3: Pending Review */}
 <div
 className={`p-5 rounded-2xl border-2 transition-transform hover:-translate-y-1 ${
 isDarkMode
 ? 'bg-[#111827] border-slate-700 shadow-[4px_4px_0px_#1F2937]'
 : 'bg-white border-[#0F0F0F] shadow-[4px_4px_0px_#0F0F0F]'
 } sketch-border-3 relative overflow-hidden`}
 >
 <div className="flex items-center justify-between mb-2">
 <span className="text-xs font-mono font-black opacity-75">بانتظار المراجعة والتفعيل</span>
 <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold animate-pulse">
 <Clock className="w-4 h-4" />
 </div>
 </div>
 <div className="text-3xl font-black font-mono tracking-tight text-amber-500">
 {pendingCount} <span className="text-sm font-heading">طلب جديد</span>
 </div>
 <p className="text-[11px] font-bold opacity-60 mt-1">يحتاج فحص سكرين التحويل والضغط تفعيل</p>
 </div>

 {/* KPI 4: Total Orders */}
 <div
 className={`p-5 rounded-2xl border-2 transition-transform hover:-translate-y-1 ${
 isDarkMode
 ? 'bg-[#111827] border-slate-700 shadow-[4px_4px_0px_#1F2937]'
 : 'bg-white border-[#0F0F0F] shadow-[4px_4px_0px_#0F0F0F]'
 } sketch-border-1 relative overflow-hidden`}
 >
 <div className="flex items-center justify-between mb-2">
 <span className="text-xs font-mono font-black opacity-75">إجمالي الطلبات المسجلة</span>
 <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center font-bold">
 <Sparkles className="w-4 h-4" />
 </div>
 </div>
 <div className="text-3xl font-black font-mono tracking-tight text-orange-500">
 {orders.length} <span className="text-sm font-heading">طلب</span>
 </div>
 <p className="text-[11px] font-bold opacity-60 mt-1">نسبة التحويل والإغلاق 94%</p>
 </div>
 </section>

 {/* ======================================================== */}
 {/* 3. CONTROLS, SEARCH & FILTERS */}
 {/* ======================================================== */}
 <section
 className={`p-4 sm:p-5 rounded-2xl border-2 ${
 isDarkMode ? 'bg-[#111827] border-slate-700' : 'bg-white border-[#0F0F0F]'
 } sketch-border-2 flex flex-col md:flex-row items-center justify-between gap-4`}
 >
 {/* Filters */}
 <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto scrollbar-none">
 <button
 onClick={() => {
 playClick();
 setFilterStatus('all');
 }}
 className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${
 filterStatus === 'all'
 ? 'bg-orange-500 text-slate-950 border-orange-600 shadow-xs'
 : 'bg-transparent border-inherit opacity-70 hover:opacity-100'
 }`}
 >
 الكل ({orders.length})
 </button>
 <button
 onClick={() => {
 playClick();
 setFilterStatus('pending');
 }}
 className={`px-4 py-2 rounded-xl text-xs font-black transition-all border flex items-center gap-1.5 ${
 filterStatus === 'pending'
 ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
 : 'bg-transparent border-inherit opacity-70 hover:opacity-100'
 }`}
 >
 <Clock className="w-3.5 h-3.5" />
 <span>بانتظار المراجعة ({pendingCount})</span>
 </button>
 <button
 onClick={() => {
 playClick();
 setFilterStatus('approved');
 }}
 className={`px-4 py-2 rounded-xl text-xs font-black transition-all border flex items-center gap-1.5 ${
 filterStatus === 'approved'
 ? 'bg-emerald-500 text-slate-950 border-emerald-600 shadow-xs'
 : 'bg-transparent border-inherit opacity-70 hover:opacity-100'
 }`}
 >
 <CheckCircle2 className="w-3.5 h-3.5" />
 <span>متاجر مفعلة ومباشرة ({liveCount})</span>
 </button>
 </div>

 {/* Search Bar + Reset */}
 <div className="flex items-center gap-3 w-full md:w-auto">
 <div className="relative flex-1 sm:w-72">
 <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
 <input
 type="text"
 placeholder="ابحث بالاسم، البراند، الدومين، أو الهاتف..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className={`w-full pr-10 pl-3 py-2 rounded-xl text-xs font-bold border-2 transition-all outline-none ${
 isDarkMode
 ? 'bg-slate-900 border-slate-700 text-white focus:border-orange-500'
 : 'bg-[#FAF8F5] border-[#0F0F0F] text-[#0F0F0F] focus:border-orange-500'
 }`}
 />
 </div>

 <button
 onClick={handleResetDefaults}
 className={`p-2 rounded-xl border-2 transition-colors opacity-70 hover:opacity-100 ${
 isDarkMode ? 'border-slate-700 text-slate-300' : 'border-[#0F0F0F] text-[#0F0F0F]'
 }`}
 title="إعادة تعيين البيانات الافتراضية"
 >
 <RefreshCw className="w-4 h-4" />
 </button>
 </div>
 </section>

 {/* ======================================================== */}
 {/* 4. ORDERS & STORES TABLE / CARDS */}
 {/* ======================================================== */}
 <section className="space-y-4">
 <div className="flex items-center justify-between">
 <h2 className="font-heading font-black text-xl">
 طلبات المتاجر وعمليات الدفع ({filteredOrders.length})
 </h2>
 <span className="text-xs font-bold opacity-60">
 يتم حفظ أي تحديث فورياً في التخزين المحلي للمنصة
 </span>
 </div>

 {filteredOrders.length === 0 ? (
 <div
 className={`p-12 text-center rounded-3xl border-2 border-dashed ${
 isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-300 bg-white'
 } space-y-3`}
 >
 <Store className="w-10 h-10 mx-auto opacity-30" />
 <p className="font-heading font-black text-lg">لا توجد طلبات تطابق بحثك حالياً</p>
 <button
 onClick={() => {
 setSearchQuery('');
 setFilterStatus('all');
 }}
 className="text-xs font-bold text-orange-500 underline"
 >
 إلغاء الفلاتر وعرض كل الطلبات
 </button>
 </div>
 ) : (
 <div className="grid grid-cols-1 gap-4">
 {filteredOrders.map((order) => {
 const isLive = order.status === 'deployed_live';
 return (
 <div
 key={order.id}
 className={`p-5 rounded-2xl border-2 transition-all ${
 isDarkMode
 ? 'bg-[#111827] border-slate-700 hover:border-slate-500 shadow-[4px_4px_0px_#1E293B]'
 : 'bg-white border-[#0F0F0F] hover:border-orange-500 shadow-[4px_4px_0px_#0F0F0F]'
 } sketch-border-1 space-y-4`}
 >
 {/* Header Row: ID, Status, Date */}
 <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 border-inherit/20">
 <div className="flex items-center gap-3">
 <span className="font-mono font-black text-sm px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/30">
 #{order.id}
 </span>
 <h3 className="font-heading font-black text-base sm:text-lg">
 {order.brandName}
 </h3>
 <span className="text-xs font-mono font-bold text-slate-400">
 ({order.subdomain}.sketchorder.com)
 </span>
 </div>

 <div className="flex items-center gap-2">
 {isLive ? (
 <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
 <span>متجر مباشر وشغال </span>
 </span>
 ) : (
 <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
 <Clock className="w-3.5 h-3.5 animate-spin" />
 <span>بانتظار الموافقة والتفعيل </span>
 </span>
 )}
 <span className="text-xs font-mono opacity-50">{order.createdAt}</span>
 </div>
 </div>

 {/* Middle Info Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
 {/* Client info */}
 <div>
 <span className="text-slate-400 block mb-1">صاحب المتجر والواتساب:</span>
 <div className="font-black text-sm">{order.clientName}</div>
 <a
 href={`https://wa.me/20${order.whatsappNumber.replace(/^0/, '')}?text=${encodeURIComponent(
 `أهلاً يا ${order.clientName}، بخصوص طلب متجرك "${order.brandName}" على سكتش أوردر:`
 )}`}
 target="_blank"
 rel="noreferrer"
 className="text-emerald-500 font-bold flex items-center gap-1 mt-1 hover:underline"
 >
 <MessageCircle className="w-3.5 h-3.5" />
 <span className="font-mono">{order.whatsappNumber}</span>
 </a>
 </div>

 {/* Package & Template */}
 <div>
 <span className="text-slate-400 block mb-1">الباقة والقالب المختار:</span>
 <div className="font-black text-sm">{order.planName}</div>
 <div className="text-orange-500 font-bold mt-1">{order.templateName}</div>
 </div>

 {/* Payment & Amount */}
 <div>
 <span className="text-slate-400 block mb-1">طريقة الدفع والقيمة:</span>
 <div className="font-black text-base text-emerald-500 font-mono">
 {typeof order.amount === 'number' ? order.amount.toLocaleString() : order.amount} ج.م
 </div>
 <div className="font-bold opacity-80 mt-0.5">
 {order.paymentMethod === 'instapay'
 ? 'إنستاباي (InstaPay)'
 : order.paymentMethod === 'vodafone_cash'
 ? 'فودافون كاش'
 : 'فيزا كارت'}
 {order.transactionRef && (
 <span className="block text-[11px] font-mono text-slate-400">
 Ref: {order.transactionRef}
 </span>
 )}
 </div>
 </div>

 {/* Receipt Preview */}
 <div>
 <span className="text-slate-400 block mb-1">سكرين شوت التحويل:</span>
 {order.receiptImageUrl ? (
 <button
 onClick={() => setSelectedReceiptUrl(order.receiptImageUrl || null)}
 className="flex items-center gap-2 p-1.5 rounded-xl border border-inherit/30 hover:border-orange-500 transition-all bg-inherit group text-right"
 >
 <img
 src={order.receiptImageUrl}
 alt="Receipt"
 className="w-10 h-10 rounded-lg object-cover border"
 />
 <div>
 <span className="text-[11px] font-bold block group-hover:text-orange-500">
 معاينة السكرين
 </span>
 <span className="text-[10px] opacity-60">اضغط للتكبير </span>
 </div>
 </button>
 ) : (
 <span className="text-slate-400 text-[11px]">بدون سكرين مرفق</span>
 )}
 </div>
 </div>

 {order.notes && (
 <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
 <span className="font-bold">ملاحظات العميل: </span>
 {order.notes}
 </div>
 )}

 {/* Bottom Action Buttons */}
 <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-inherit/15">
 <div className="flex items-center gap-2">
 {/* 1-Click Approve Button */}
 {!isLive ? (
 <button
 onClick={() => handleApproveAndDeploy(order)}
 className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
 >
 <Check className="w-4 h-4 stroke-[3]" />
 <span>الموافقة وتفعيل المتجر فوراً </span>
 </button>
 ) : (
 <div className="flex items-center gap-2">
 {/* Open Live Store button */}
 <button
 onClick={() => {
 playClick();
 onOpenStoreLive(order.subdomain);
 }}
 className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
 >
 <ExternalLink className="w-3.5 h-3.5" />
 <span>زيارة المتجر المباشر ({order.subdomain}.sketchorder.com)</span>
 </button>

 {/* Open Merchant Portal button */}
 <button
 onClick={() => {
 playClick();
 onOpenMerchantPortal(order.subdomain);
 }}
 className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all ${
 isDarkMode
 ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600'
 : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
 }`}
 >
 <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
 <span>دخول لوحة التاجر كصاحب المتجر</span>
 </button>
 </div>
 )}
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={() => handleDeleteOrder(order.id)}
 className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
 title="حذف الطلب"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 )}
 </section>
 </main>

 {/* Lightbox for Receipt Screenshot */}
 {selectedReceiptUrl && (
 <div
 onClick={() => setSelectedReceiptUrl(null)}
 className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 flex items-center justify-center animate-fadeIn"
 >
 <div
 onClick={(e) => e.stopPropagation()}
 className="max-w-xl w-full bg-slate-900 border-2 border-slate-700 rounded-3xl p-5 space-y-4 shadow-2xl relative"
 >
 <div className="flex items-center justify-between border-b border-slate-800 pb-3">
 <h3 className="font-heading font-black text-base text-white">
 فحص سكرين التحويل البنكي / المحفظة
 </h3>
 <button
 onClick={() => setSelectedReceiptUrl(null)}
 className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 <div className="rounded-2xl overflow-hidden max-h-[70vh] flex items-center justify-center bg-black/40">
 <img
 src={selectedReceiptUrl}
 alt="Receipt Full"
 className="max-h-[68vh] w-auto object-contain rounded-xl"
 />
 </div>

 <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
 <span>تأكد من مطابقة المبلغ ورقم العملية قبل الضغط على تفعيل</span>
 <button
 onClick={() => setSelectedReceiptUrl(null)}
 className="px-4 py-2 rounded-xl bg-orange-500 text-slate-950 font-bold hover:bg-orange-400"
 >
 إغلاق
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
};
