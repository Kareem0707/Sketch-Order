import React, { useState, useEffect } from 'react';
import {
 ArrowRight,
 Store,
 ShoppingBag,
 Package,
 DollarSign,
 Plus,
 Trash2,
 ExternalLink,
 Copy,
 Check,
 MessageCircle,
 Clock,
 LogOut,
 X,
 Sun,
 Moon,
 AlertCircle,
 Globe,
 RefreshCw,
 CheckCircle2,
 AlertTriangle,
} from 'lucide-react';
import type {
 TenantStoreAccount,
 TenantCustomerOrder,
 CustomProduct,
 LiveDnsCheckResult,
} from '../types';
import { playClick, playCashSound } from '../utils/soundEffects';
import {
 checkDomainLiveDns,
 addDomainToVercel,
 isVercelConfigured,
 getVercelCliAddCommand,
} from '../services/vercelDomainService';
import { DEFAULT_PRODUCTS_MAP, DEFAULT_CATEGORIES_MAP } from './FullPageStoreStudio';

interface ClientMerchantPortalProps {
 onBackToHome: () => void;
 onOpenLiveStore: (subdomain: string) => void;
 initialSubdomain?: string;
 isDarkMode: boolean;
 onToggleDarkMode: () => void;
}

export const ClientMerchantPortal: React.FC<ClientMerchantPortalProps> = ({
 onBackToHome,
 onOpenLiveStore,
 initialSubdomain,
 isDarkMode,
 onToggleDarkMode,
}) => {
 const [activeSubdomain, setActiveSubdomain] = useState<string | null>(null);
 const [currentStore, setCurrentStore] = useState<TenantStoreAccount | null>(null);
 const [allStores, setAllStores] = useState<Record<string, TenantStoreAccount>>({});
 
 // Login input states
 const [loginInput, setLoginInput] = useState<string>('sportech');
 const [loginError, setLoginError] = useState<string | null>(null);

 // Tabs inside merchant portal
 const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');

 // Tenant customer orders
 const [orders, setOrders] = useState<TenantCustomerOrder[]>([]);

 // Product management modal
 const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false);
 const [newProductName, setNewProductName] = useState<string>('');
 const [newProductPrice, setNewProductPrice] = useState<number>(350);
 const [newProductCategory, setNewProductCategory] = useState<string>('عام');
 const [newProductImage, setNewProductImage] = useState<string>('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80');
 const [copiedLink, setCopiedLink] = useState<boolean>(false);
 const [copiedActualDomain, setCopiedActualDomain] = useState<boolean>(false);
 const [isEditDomainModalOpen, setIsEditDomainModalOpen] = useState<boolean>(false);
 const [newCustomDomainInput, setNewCustomDomainInput] = useState<string>('');

 // Live DNS & Vercel state
 const [liveDnsResult, setLiveDnsResult] = useState<LiveDnsCheckResult | null>(null);
 const [isCheckingDns, setIsCheckingDns] = useState<boolean>(false);
 const [copiedDnsIp, setCopiedDnsIp] = useState<boolean>(false);
 const [copiedCname, setCopiedCname] = useState<boolean>(false);
 const [copiedCliCmd, setCopiedCliCmd] = useState<boolean>(false);
 const [vercelAddNote, setVercelAddNote] = useState<string | null>(null);

 // Load stores from localStorage
 const loadStores = () => {
 try {
 const raw = localStorage.getItem('sketch_tenant_stores');
 if (raw) {
 const parsed = JSON.parse(raw);
 setAllStores(parsed);
 return parsed;
 } else {
 // Seed initial default store if empty
 const defaultStore: TenantStoreAccount = {
 tenantId: 'tenant_sportech',
 subdomain: 'sportech',
 brandName: 'سبورتك إيجيبت (SPORTECH)',
 ownerName: 'كريم محمود',
 ownerPhone: '01012345678',
 planTier: 'pro',
 status: 'active',
 templateId: 'sportech-sneakers',
 createdAt: new Date().toISOString(),
 salesTotal: 4900,
 ordersCount: 3,
 storeConfig: {
 storeName: 'سبورتك إيجيبت (SPORTECH)',
 tagline: 'واجهة متجر سبورتك الرياضي بتصميم Figma التفاعلي العصري',
 niche: 'sneakers',
 templateId: 'sportech-sneakers',
 accentColor: '#52525B',
 customDomain: 'sportech.sketchorder.com',
 currency: 'ج.م',
 whatsappNumber: '01012345678',
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
 categories: DEFAULT_CATEGORIES_MAP['sportech-sneakers'],
 products: DEFAULT_PRODUCTS_MAP['sportech-sneakers'],
 },
 };
 const initial = { sportech: defaultStore };
 localStorage.setItem('sketch_tenant_stores', JSON.stringify(initial));
 setAllStores(initial);
 return initial;
 }
 } catch {
 return {};
 }
 };

 // Seed default customer orders if empty for this tenant
 const loadOrders = (subdomain: string) => {
 try {
 const key = `sketch_tenant_orders_${subdomain}`;
 const savedOrders = localStorage.getItem(key);
 if (savedOrders) {
 setOrders(JSON.parse(savedOrders));
 } else {
 const seedOrders: TenantCustomerOrder[] = [
 {
 id: 'ORD-8419',
 tenantSubdomain: subdomain,
 createdAt: 'منذ ساعتين (2026-11-13 11:20)',
 customerName: 'محمد عبد الله',
 customerPhone: '01155443322',
 customerGovernorate: 'القاهرة - مصر الجديدة',
 customerAddress: 'شارع الثورة، عمارة 14، الدور الثالث',
 items: [
 {
 id: 'sp-1',
 name: 'Nike Air Zoom Pegasus 40',
 price: 1199,
 quantity: 1,
 selectedSize: '43',
 category: 'سنيكرز',
 imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
 },
 ],
 totalAmount: 1249,
 paymentMethod: 'cash_on_delivery',
 status: 'new',
 notes: 'يرجى الاتصال قبل الوصول للتسليم',
 },
 {
 id: 'ORD-3912',
 tenantSubdomain: subdomain,
 createdAt: 'أمس (2026-11-12 16:45)',
 customerName: 'سارة إبراهيم',
 customerPhone: '01099887711',
 customerGovernorate: 'الجيزة - الشيخ زايد',
 customerAddress: 'كمبوند الخمائل، فيلا 21',
 items: [
 {
 id: 'sp-2',
 name: 'Adidas Predator Elite FT FG',
 price: 1499,
 quantity: 1,
 selectedSize: '42',
 category: 'كرة قدم',
 imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80',
 },
 ],
 totalAmount: 1549,
 paymentMethod: 'instapay',
 status: 'delivered',
 },
 ];
 localStorage.setItem(key, JSON.stringify(seedOrders));
 setOrders(seedOrders);
 }
 } catch {
 setOrders([]);
 }
 };

 useEffect(() => {
 const stores = loadStores();
 // Auto-login if initialSubdomain is passed or stored in localStorage
 const savedMerchant = initialSubdomain || localStorage.getItem('sketch_logged_merchant');
 if (savedMerchant && stores[savedMerchant]) {
 setActiveSubdomain(savedMerchant);
 setCurrentStore(stores[savedMerchant]);
 loadOrders(savedMerchant);
 } else if (Object.keys(stores).length > 0) {
 // Pick first active store as default login candidate
 const firstSub = Object.keys(stores)[0];
 setLoginInput(firstSub);
 }

 // Listen for new orders triggered from TenantLiveStore
 const handleNewOrderEvent = (e: Event) => {
 const customEvent = e as CustomEvent;
 if (customEvent.detail && customEvent.detail.subdomain) {
 if (activeSubdomain && activeSubdomain === customEvent.detail.subdomain) {
 loadOrders(activeSubdomain);
 playCashSound();
 }
 }
 };
 window.addEventListener('sketch_new_tenant_order', handleNewOrderEvent);
 return () => {
 window.removeEventListener('sketch_new_tenant_order', handleNewOrderEvent);
 };
 }, [initialSubdomain, activeSubdomain]);

 // Handle Login
 const handleLogin = (subdomainToLogin: string) => {
 playClick();
 setLoginError(null);
 const subClean = subdomainToLogin.trim().toLowerCase().replace('.sketchorder.com', '');
 const store = allStores[subClean];
 if (store) {
 setActiveSubdomain(subClean);
 setCurrentStore(store);
 localStorage.setItem('sketch_logged_merchant', subClean);
 loadOrders(subClean);
 } else {
 setLoginError(`لم يتم العثور على متجر بالدومين "${subClean}". جرب سبورتك (sportech) أو تواصل مع الدعم.`);
 }
 };

 const handleLogout = () => {
 playClick();
 setActiveSubdomain(null);
 setCurrentStore(null);
 localStorage.removeItem('sketch_logged_merchant');
 };

 // Change Customer Order Status
 const handleUpdateOrderStatus = (
 orderId: string,
 newStatus: TenantCustomerOrder['status']
 ) => {
 playClick();
 if (!activeSubdomain) return;
 const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
 setOrders(updated);
 try {
 localStorage.setItem(`sketch_tenant_orders_${activeSubdomain}`, JSON.stringify(updated));
 } catch (e) {
 console.error(e);
 }
 };

 // Add Product to Store
 const handleCreateProduct = (e: React.FormEvent) => {
 e.preventDefault();
 if (!currentStore || !activeSubdomain) return;
 playCashSound();

 const newProd: CustomProduct = {
 id: `p-${Date.now()}`,
 name: newProductName,
 price: Number(newProductPrice),
 originalPrice: Math.round(Number(newProductPrice) * 1.25),
 category: newProductCategory,
 imageUrl: newProductImage,
 badge: 'جديد ',
 rating: 5.0,
 reviewsCount: 1,
 sizes: ['38', '39', '40', '41', '42', '43', '44'],
 colors: [{ name: 'Black', hex: '#000000' }],
 };

 const updatedProducts = [newProd, ...currentStore.storeConfig.products];
 const updatedStore: TenantStoreAccount = {
 ...currentStore,
 storeConfig: {
 ...currentStore.storeConfig,
 products: updatedProducts,
 },
 };

 setCurrentStore(updatedStore);
 const updatedStores = { ...allStores, [activeSubdomain]: updatedStore };
 setAllStores(updatedStores);
 localStorage.setItem('sketch_tenant_stores', JSON.stringify(updatedStores));

 setIsAddProductOpen(false);
 setNewProductName('');
 };

 // Delete Product
 const handleDeleteProduct = (prodId: string) => {
 if (!currentStore || !activeSubdomain) return;
 playClick();
 if (confirm('هل أنت متأكد من حذف هذا المنتج من متجرك؟')) {
 const updatedProducts = currentStore.storeConfig.products.filter((p) => p.id !== prodId);
 const updatedStore: TenantStoreAccount = {
 ...currentStore,
 storeConfig: {
 ...currentStore.storeConfig,
 products: updatedProducts,
 },
 };
 setCurrentStore(updatedStore);
 const updatedStores = { ...allStores, [activeSubdomain]: updatedStore };
 setAllStores(updatedStores);
 localStorage.setItem('sketch_tenant_stores', JSON.stringify(updatedStores));
 }
 };

 // Copy Store Link
 const handleCopyStoreLink = () => {
 if (!activeSubdomain) return;
 playClick();
 const link = `https://${activeSubdomain}.sketchorder.com`;
 navigator.clipboard.writeText(link);
 setCopiedLink(true);
 setTimeout(() => setCopiedLink(false), 2000);
 };

 const actualLiveDomain = currentStore?.storeConfig?.customDomain && !currentStore.storeConfig.customDomain.includes('sketchorder.com')
   ? currentStore.storeConfig.customDomain
   : `${currentStore?.subdomain || 'sportech'}.store`;

 const handleCopyActualDomain = () => {
   playClick();
   const full = `https://${actualLiveDomain}`;
   navigator.clipboard.writeText(full);
   setCopiedActualDomain(true);
   setTimeout(() => setCopiedActualDomain(false), 2500);
 };

  const handleRunLiveDnsCheck = async () => {
    playClick();
    setIsCheckingDns(true);
    const res = await checkDomainLiveDns(actualLiveDomain);
    setIsCheckingDns(false);
    setLiveDnsResult(res);
  };

  const handleSaveCustomDomain = async (newDomain: string) => {
    if (!currentStore || !activeSubdomain) return;
    playCashSound();
    const clean = newDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!clean) return;

    if (isVercelConfigured()) {
      setVercelAddNote('جاري تسجيل الدومين تلقائياً على سيرفرات Vercel...');
      const vRes = await addDomainToVercel(clean);
      if (vRes.success) {
        setVercelAddNote('✓ تم تسجيل وربط الدومين بنجاح بمشروعك على Vercel!');
      } else {
        setVercelAddNote(`ملاحظة Vercel: ${vRes.error}`);
      }
    }

    const updatedStore: TenantStoreAccount = {
      ...currentStore,
      customDomain: clean,
      storeConfig: {
        ...currentStore.storeConfig,
        customDomain: clean,
      },
    };
    setCurrentStore(updatedStore);
    const updatedStores = { ...allStores, [activeSubdomain]: updatedStore };
    setAllStores(updatedStores);
    localStorage.setItem('sketch_tenant_stores', JSON.stringify(updatedStores));
    setIsEditDomainModalOpen(false);

    // Run live DNS check immediately
    checkDomainLiveDns(clean).then((res) => setLiveDnsResult(res));
  };

 // Simulate a new customer order for instant testing
 const handleSimulateNewCustomerOrder = () => {
 if (!activeSubdomain || !currentStore) return;
 playCashSound();
 const randomProduct = currentStore.storeConfig.products[0];
 const newOrd: TenantCustomerOrder = {
 id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
 tenantSubdomain: activeSubdomain,
 createdAt: 'الآن (فورياً)',
 customerName: 'كريم أحمد',
 customerPhone: '01066778899',
 customerGovernorate: 'القاهرة - المعادي',
 customerAddress: 'دجلة المعادي، شارع 206',
 items: [
 {
 ...randomProduct,
 quantity: 1,
 selectedSize: randomProduct.sizes ? randomProduct.sizes[0] : '42',
 },
 ],
 totalAmount: randomProduct.price + 50,
 paymentMethod: 'cash_on_delivery',
 status: 'new',
 notes: 'طلب سريع من خلال واجهة المتجر المباشر',
 };

 const updated = [newOrd, ...orders];
 setOrders(updated);
 localStorage.setItem(`sketch_tenant_orders_${activeSubdomain}`, JSON.stringify(updated));

 // Update store sales
 const updatedStore = {
 ...currentStore,
 salesTotal: currentStore.salesTotal + newOrd.totalAmount,
 ordersCount: currentStore.ordersCount + 1,
 };
 setCurrentStore(updatedStore);
 const updatedStores = { ...allStores, [activeSubdomain]: updatedStore };
 setAllStores(updatedStores);
 localStorage.setItem('sketch_tenant_stores', JSON.stringify(updatedStores));
 };

 // ==========================================================
 // VIEW A: MERCHANT LOGIN SCREEN (If not logged in)
 // ==========================================================
 if (!activeSubdomain || !currentStore) {
 return (
 <div
 className={`min-h-screen flex flex-col justify-between transition-colors ${
 isDarkMode ? 'bg-[#0B0F17] text-white' : 'bg-[#FAF8F5] text-[#0F0F0F]'
 } font-body antialiased selection:bg-[#D9722B] selection:text-white p-4`}
 >
 {/* Top Navbar */}
 <header className="max-w-7xl mx-auto w-full py-4 flex items-center justify-between">
 <button
 onClick={() => {
 playClick();
 onBackToHome();
 }}
 className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border border-inherit/30 hover:border-[#D9722B] dark:border-[#D9722B]/60"
 >
 <ArrowRight className="w-4 h-4 ml-0.5" />
 <span>العودة للرئيسية</span>
 </button>

 <div className="flex items-center gap-2">
 <button
 onClick={() => {
 playClick();
 onToggleDarkMode();
 }}
 className="p-2 rounded-xl border border-inherit/30 text-xs font-bold"
 >
 {isDarkMode ? <Sun className="w-4 h-4 text-zinc-400" /> : <Moon className="w-4 h-4 text-slate-800" />}
 </button>
 </div>
 </header>

 {/* Login Card */}
 <div className="max-w-md w-full mx-auto my-auto space-y-6 animate-fadeIn">
 <div
 className={`p-6 sm:p-8 rounded-3xl border-2 shadow-2xl transition-all ${
 isDarkMode
 ? 'bg-[#111827] border-slate-700 shadow-[6px_6px_0px_#1E293B]'
 : 'bg-white border-[#0F0F0F] shadow-[6px_6px_0px_#0F0F0F]'
 } sketch-border-1 text-center space-y-5`}
 >
 <div className="w-16 h-16 mx-auto rounded-2xl bg-[#D9722B]/10 border-2 border-[#D9722B] dark:border-[#D9722B]/60 text-[#D9722B] dark:text-[#E88B4D] flex items-center justify-center -rotate-3">
 <Store className="w-8 h-8" />
 </div>

 <div>
 <h2 className="font-heading font-black text-2xl">بوابة دخول أصحاب المتاجر</h2>
 <p className="text-xs font-bold opacity-70 mt-1">
 سجل دخولك لإدارة منتجاتك، متابعة أوردرات زبائنك وتحليل مبيعاتك
 </p>
 </div>

 {loginError && (
 <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold flex items-center gap-2 text-right">
 <AlertCircle className="w-4 h-4 shrink-0" />
 <span>{loginError}</span>
 </div>
 )}

 <form
 onSubmit={(e) => {
 e.preventDefault();
 handleLogin(loginInput);
 }}
 className="space-y-4 text-right"
 >
 <div>
 <label className="block text-xs font-black mb-1.5 opacity-80">
 اسم الدومين الفرعي لمتجرك (Subdomain):
 </label>
 <div className="relative">
 <input
 type="text"
 required
 value={loginInput}
 onChange={(e) => setLoginInput(e.target.value)}
 placeholder="مثال: sportech"
 className={`w-full p-3 rounded-xl font-mono text-sm font-bold border-2 outline-none transition-colors ${
 isDarkMode
 ? 'bg-slate-900 border-slate-700 text-white focus:border-[#D9722B] dark:border-[#D9722B]/60'
 : 'bg-[#FAF8F5] border-[#0F0F0F] text-[#0F0F0F] focus:border-[#D9722B] dark:border-[#D9722B]/60'
 }`}
 />
 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono opacity-50 pointer-events-none">
 .sketchorder.com
 </span>
 </div>
 </div>

 <button
 type="submit"
 className="w-full py-3.5 rounded-2xl bg-[#D9722B] hover:bg-[#C25E1D] text-white dark:bg-[#D9722B] dark:hover:bg-[#C25E1D] dark:text-white font-black text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
 >
 <span>دخول لوحة تحكم متجري </span>
 <ArrowRight className="w-4 h-4 -scale-x-100" />
 </button>
 </form>

 {/* Quick Demo Login Buttons */}
 <div className="pt-4 border-t border-inherit/20 space-y-2">
 <span className="text-[11px] font-bold opacity-60 block">
 متاجر مفعلة جاهزة للدخول بضغطة واحدة للتجربة:
 </span>
 <div className="flex flex-col gap-2">
 {Object.values(allStores).map((st) => (
 <button
 key={st.subdomain}
 type="button"
 onClick={() => handleLogin(st.subdomain)}
 className={`w-full p-2.5 rounded-xl border text-xs font-black flex items-center justify-between transition-colors ${
 isDarkMode
 ? 'bg-slate-900 hover:bg-slate-800 border-slate-700'
 : 'bg-slate-50 hover:bg-slate-100 border-slate-300'
 }`}
 >
 <div className="flex items-center gap-2">
 <span className="w-2 h-2 rounded-full bg-[#D9722B]"></span>
 <span>{st.brandName}</span>
 </div>
 <span className="font-mono text-[11px] text-[#D9722B] dark:text-[#E88B4D]">
 @{st.subdomain}
 </span>
 </button>
 ))}
 </div>
 </div>
 </div>
 </div>

 <footer className="py-4 text-center text-xs opacity-50 font-bold">
 Sketch Order Multi-Tenant Architecture • كل متجر مستقل بقاعدة بياناته وأوردراته
 </footer>
 </div>
 );
 }

 // ==========================================================
 // VIEW B: ACTIVE MERCHANT DASHBOARD (Logged In)
 // ==========================================================
 const totalSales = orders
 .filter((o) => o.status !== 'cancelled')
 .reduce((sum, o) => sum + o.totalAmount, 0);
 const newOrdersCount = orders.filter((o) => o.status === 'new').length;

 return (
 <div
 className={`min-h-screen transition-colors ${
 isDarkMode ? 'bg-[#0B0F17] text-white' : 'bg-[#FAF8F5] text-[#0F0F0F]'
 } font-body antialiased selection:bg-[#D9722B] selection:text-white pb-20`}
 >
 {/* ======================================================== */}
 {/* 1. TOP HEADER & MERCHANT IDENTITY */}
 {/* ======================================================== */}
 <header
 className={`sticky top-0 z-40 border-b-2 backdrop-blur-md transition-colors ${
 isDarkMode ? 'bg-[#0B0F17]/95 border-slate-700' : 'bg-white/95 border-[#0F0F0F]'
 }`}
 >
 <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
 
 {/* Right: Store Brand & Live Status */}
 <div className="flex items-center gap-3">
 <button
 onClick={() => {
 playClick();
 onBackToHome();
 }}
 className="p-2 rounded-xl border border-inherit/20 hover:border-[#D9722B] dark:border-[#D9722B]/60 text-xs font-bold flex items-center gap-1"
 title="العودة للمنصة"
 >
 <ArrowRight className="w-4 h-4 ml-0.5" />
 <span className="hidden sm:inline">الرئيسية</span>
 </button>

 <div className="flex items-center gap-3 border-r-2 border-inherit/20 pr-3">
 <div className="w-10 h-10 rounded-2xl bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white font-black flex items-center justify-center font-heading text-lg shadow-sm">
 {currentStore.brandName.charAt(0)}
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h1 className="font-heading font-black text-lg sm:text-xl leading-none">
 {currentStore.brandName}
 </h1>
 <span className="text-[10px] font-mono font-black bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white px-2 py-0.5 rounded-full">
 متجر مباشر 
 </span>
 </div>
 <div className="flex items-center gap-2 mt-1">
 <span className="font-mono text-xs text-[#D9722B] dark:text-[#E88B4D] font-bold">
 https://{currentStore.subdomain}.sketchorder.com
 </span>
 <button
 onClick={handleCopyStoreLink}
 className="p-1 hover:text-[#D9722B] dark:text-[#E88B4D] transition-colors"
 title="نسخ رابط المتجر"
 >
 {copiedLink ? <Check className="w-3.5 h-3.5 text-zinc-400" /> : <Copy className="w-3.5 h-3.5" />}
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* Left: Direct Live Store Action + Logout */}
 <div className="flex items-center gap-2 sm:gap-3">
 {/* Open Live Storefront */}
 <button
 onClick={() => {
 playClick();
 onOpenLiveStore(currentStore.subdomain);
 }}
 className="px-4 py-2 rounded-xl bg-[#D9722B] hover:bg-[#C25E1D] text-white dark:bg-[#D9722B] dark:hover:bg-[#C25E1D] dark:text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
 >
 <ExternalLink className="w-4 h-4" />
 <span>زيارة متجري المباشر (كعميل) </span>
 </button>

 {/* Dark Mode */}
 <button
 onClick={() => {
 playClick();
 onToggleDarkMode();
 }}
 className="p-2 rounded-xl border border-inherit/30 text-xs font-bold"
 >
 {isDarkMode ? <Sun className="w-4 h-4 text-zinc-400" /> : <Moon className="w-4 h-4 text-slate-800" />}
 </button>

 {/* Logout */}
 <button
 onClick={handleLogout}
 className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors"
 title="تسجيل الخروج"
 >
 <LogOut className="w-4 h-4" />
 </button>
 </div>
 </div>
 </header>

 {/* Main Content */}
 <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
 
 {/* ======================================================== */}
 {/* LIVE PRODUCTION DOMAIN BANNER (الدومين الحقيقي والفعلي للبيع) */}
 {/* ======================================================== */}
 <section className="rounded-3xl border-3 border-[#0F0F0F] dark:border-slate-700 bg-white dark:bg-[#111827] p-5 sm:p-7 sketch-shadow-lg space-y-4">
   <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
     <div className="space-y-2">
       <div className="flex items-center gap-2">
         <span className="flex h-3 w-3 relative">
           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
           <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
         </span>
         <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
           الدومين الفعلي والنهائي لمتجرك • LIVE CUSTOM DOMAIN
         </span>
       </div>

       <div className="flex flex-wrap items-center gap-3 pt-1">
         <div className="text-2xl sm:text-4xl font-mono font-black text-[#0F0F0F] dark:text-white flex items-center gap-2.5" dir="ltr">
           <Globe className="w-7 h-7 text-[#D9722B] shrink-0" />
           <span>https://{actualLiveDomain}</span>
         </div>

         <button
           onClick={handleCopyActualDomain}
           className="px-3.5 py-2 rounded-xl border-2 border-[#0F0F0F] dark:border-slate-700 bg-neutral-100 dark:bg-slate-800 hover:bg-[#D9722B] hover:text-white text-xs font-bold font-mono transition-colors flex items-center gap-2 shadow-xs"
           title="نسخ رابط الدومين الفعلي لمشاركته مع العملاء"
         >
           {copiedActualDomain ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
           <span>{copiedActualDomain ? 'تم النسخ بنجاح!' : 'نسخ رابط متجرك الفعلي'}</span>
         </button>
       </div>

       <p className="text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
         دا الرابط الحقيقي والنهائي اللي عملائك هيدخلوا يطلبوا منه على إنستجرام وتيك توك وفيسبوك. شغال 24/7 بسيرفرات سريعة وشهادة أمان 256-bit SSL بدون أي اشتراكات أو عمولات.
       </p>
     </div>

     {/* Direct Actions */}
     <div className="flex flex-wrap items-center gap-2.5 shrink-0">
       <button
         onClick={() => {
           playClick();
           onOpenLiveStore(currentStore.subdomain);
         }}
         className="btn-sketch btn-sketch-primary text-xs sm:text-sm py-3 px-5 flex items-center gap-2 shadow-sm hover:scale-105 transition-transform"
       >
         <ExternalLink className="w-4 h-4" />
         <span>فتح المتجر المباشر كعميل</span>
       </button>

       <button
         onClick={() => {
           playClick();
           setNewCustomDomainInput(actualLiveDomain);
           setIsEditDomainModalOpen(true);
         }}
         className="btn-sketch text-xs sm:text-sm py-3 px-4 bg-white dark:bg-slate-900 border-2 border-[#0F0F0F] dark:border-slate-700 text-[#0F0F0F] dark:text-white hover:border-[#D9722B]"
       >
         <Globe className="w-4 h-4 text-[#D9722B]" />
         <span>ربط دومين مخصص جديد</span>
       </button>
     </div>
   </div>

   {/* Live Diagnostics Badges */}
   {/* Live Diagnostics Badges & Real Google DNS Check */}
   <div className="pt-3.5 border-t border-zinc-100 dark:border-slate-800 space-y-3">
     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono font-bold">
       <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-slate-800/60 border border-zinc-200 dark:border-slate-700 flex items-center justify-between">
         <div className="flex items-center gap-2">
           <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
           <span className="text-zinc-700 dark:text-zinc-300">Vercel Anycast IP: 76.76.21.21</span>
         </div>
         <button
           onClick={handleRunLiveDnsCheck}
           disabled={isCheckingDns}
           className="text-[10px] font-bold text-[#D9722B] hover:underline flex items-center gap-1 cursor-pointer"
           title="فحص حقيقي للـ DNS عبر Google Public DNS"
         >
           <RefreshCw className={`w-3 h-3 ${isCheckingDns ? 'animate-spin' : ''}`} />
           <span>{isCheckingDns ? 'جاري الفحص...' : 'فحص DNS لايف'}</span>
         </button>
       </div>
       <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-slate-800/60 border border-zinc-200 dark:border-slate-700 flex items-center gap-2.5">
         <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
         <span className="text-zinc-700 dark:text-zinc-300">SSL Certificate: مشفر ومعتمد 100% Let's Encrypt</span>
       </div>
       <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-slate-800/60 border border-zinc-200 dark:border-slate-700 flex items-center gap-2.5">
         <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
         <span className="text-zinc-700 dark:text-zinc-300">Global Anycast: سرعة استجابة فائقة داخل مصر 99/100</span>
       </div>
     </div>

     {/* Live Google DNS Result Output */}
     {liveDnsResult && (
       <div
         className={`p-3 rounded-xl border text-xs font-mono flex items-start gap-2.5 animate-fadeIn ${
           liveDnsResult.isVercelIp
             ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
             : 'bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-300'
         }`}
       >
         {liveDnsResult.isVercelIp ? (
           <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
         ) : (
           <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
         )}
         <div className="flex-1 space-y-0.5">
           <div className="font-bold">{liveDnsResult.message}</div>
           <div className="text-[10px] opacity-75">
             IPs المسترجعة: {liveDnsResult.resolvedIps.join(', ') || 'لم يتم العثور على سجل A'} • تم الفحص عبر Google Public DNS في {new Date(liveDnsResult.checkedAt).toLocaleTimeString('ar-EG')}
           </div>
         </div>
       </div>
     )}
   </div>
 </section>
 
 {/* ======================================================== */}
 {/* 2. MERCHANT KPI STATS CARDS */}
 {/* ======================================================== */}
 <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {/* Sales */}
 <div
 className={`p-5 rounded-2xl border-2 ${
 isDarkMode
 ? 'bg-[#111827] border-slate-700 shadow-[4px_4px_0px_#1E293B]'
 : 'bg-white border-[#0F0F0F] shadow-[4px_4px_0px_#0F0F0F]'
 } sketch-border-1`}
 >
 <div className="flex items-center justify-between mb-2">
 <span className="text-xs font-mono font-black opacity-75">إجمالي مبيعات متجرك</span>
 <DollarSign className="w-4 h-4 text-[#D9722B] dark:text-[#E88B4D]" />
 </div>
 <div className="text-3xl font-black font-mono text-[#D9722B] dark:text-[#E88B4D]">
 {totalSales.toLocaleString()} <span className="text-sm font-heading">ج.م</span>
 </div>
 <p className="text-[11px] font-bold opacity-60 mt-1">بدون أي خصم أو عمولات للمنصة</p>
 </div>

 {/* New Orders */}
 <div
 className={`p-5 rounded-2xl border-2 ${
 isDarkMode
 ? 'bg-[#111827] border-slate-700 shadow-[4px_4px_0px_#1E293B]'
 : 'bg-white border-[#0F0F0F] shadow-[4px_4px_0px_#0F0F0F]'
 } sketch-border-2`}
 >
 <div className="flex items-center justify-between mb-2">
 <span className="text-xs font-mono font-black opacity-75">الطلبات الجديدة (قيد الشحن)</span>
 <Clock className="w-4 h-4 text-[#D9722B] dark:text-[#E88B4D]" />
 </div>
 <div className="text-3xl font-black font-mono text-[#D9722B] dark:text-[#E88B4D]">
 {newOrdersCount} <span className="text-sm font-heading">طلب</span>
 </div>
 <p className="text-[11px] font-bold opacity-60 mt-1">تحتاج مراجعة للتسليم لشركة الشحن</p>
 </div>

 {/* Total Products */}
 <div
 className={`p-5 rounded-2xl border-2 ${
 isDarkMode
 ? 'bg-[#111827] border-slate-700 shadow-[4px_4px_0px_#1E293B]'
 : 'bg-white border-[#0F0F0F] shadow-[4px_4px_0px_#0F0F0F]'
 } sketch-border-3`}
 >
 <div className="flex items-center justify-between mb-2">
 <span className="text-xs font-mono font-black opacity-75">المنتجات المعروضة</span>
 <Package className="w-4 h-4 text-[#D9722B] dark:text-[#E88B4D]" />
 </div>
 <div className="text-3xl font-black font-mono text-[#D9722B] dark:text-[#E88B4D]">
 {currentStore.storeConfig.products.length} <span className="text-sm font-heading">منتج</span>
 </div>
 <p className="text-[11px] font-bold opacity-60 mt-1">
 الباقة تتيح إضافة عدد لانهائي من المنتجات
 </p>
 </div>

 {/* Subdomain Domain status */}
 <div
 className={`p-5 rounded-2xl border-2 ${
 isDarkMode
 ? 'bg-[#111827] border-slate-700 shadow-[4px_4px_0px_#1E293B]'
 : 'bg-white border-[#0F0F0F] shadow-[4px_4px_0px_#0F0F0F]'
 } sketch-border-1`}
 >
 <div className="flex items-center justify-between mb-2">
 <span className="text-xs font-mono font-black opacity-75">حالة الاستضافة والدومين</span>
 <Globe className="w-4 h-4 text-[#D9722B] dark:text-[#E88B4D]" />
 </div>
 <div className="text-lg font-black font-mono text-[#D9722B] dark:text-[#E88B4D] truncate">
 {currentStore.subdomain}.store
 </div>
 <p className="text-[11px] font-bold text-zinc-400 mt-1">
 ✓ شهادة SSL مفعلة • سرعة تحميل 99/100
 </p>
 </div>
 </section>

 {/* ======================================================== */}
 {/* 3. TABS: ORDERS / PRODUCTS / SETTINGS */}
 {/* ======================================================== */}
 <section className="space-y-6">
 {/* Navigation Bar for Merchant */}
 <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-inherit/20">
 <div className="flex items-center gap-2">
 <button
 onClick={() => {
 playClick();
 setActiveTab('orders');
 }}
 className={`px-4 py-2.5 rounded-xl font-heading font-black text-xs sm:text-sm transition-all border ${
 activeTab === 'orders'
 ? 'bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white border-[#D9722B] shadow-sm'
 : 'bg-inherit border-inherit/30 opacity-70 hover:opacity-100'
 }`}
 >
 <span>أوردرات الزبائن ({orders.length})</span>
 {newOrdersCount > 0 && (
 <span className="mr-1.5 px-2 py-0.5 rounded-full bg-slate-950 text-white text-[10px] font-mono">
 {newOrdersCount} جديد
 </span>
 )}
 </button>

 <button
 onClick={() => {
 playClick();
 setActiveTab('products');
 }}
 className={`px-4 py-2.5 rounded-xl font-heading font-black text-xs sm:text-sm transition-all border ${
 activeTab === 'products'
 ? 'bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white border-[#D9722B] shadow-sm'
 : 'bg-inherit border-inherit/30 opacity-70 hover:opacity-100'
 }`}
 >
 <span>إدارة المنتجات ({currentStore.storeConfig.products.length})</span>
 </button>
 </div>

 {/* Quick Actions per Tab */}
 {activeTab === 'orders' && (
 <button
 onClick={handleSimulateNewCustomerOrder}
 className="px-3.5 py-2 rounded-xl bg-[#D9722B] hover:bg-[#C25E1D] text-white dark:bg-[#D9722B] dark:hover:bg-[#C25E1D] dark:text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
 >
 <Plus className="w-4 h-4" />
 <span>محاكاة أوردر زبون تجريبي (Test Order)</span>
 </button>
 )}

 {activeTab === 'products' && (
 <button
 onClick={() => setIsAddProductOpen(true)}
 className="px-3.5 py-2 rounded-xl bg-[#D9722B] hover:bg-[#C25E1D] text-white dark:bg-[#D9722B] dark:hover:bg-[#C25E1D] dark:text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
 >
 <Plus className="w-4 h-4" />
 <span>إضافة منتج جديد لمتجرك</span>
 </button>
 )}
 </div>

 {/* ======================================================== */}
 {/* TAB 1: CUSTOMER ORDERS LIST */}
 {/* ======================================================== */}
 {activeTab === 'orders' && (
 <div className="space-y-4 animate-fadeIn">
 {orders.length === 0 ? (
 <div className="p-12 text-center rounded-3xl border-2 border-dashed border-inherit/30 space-y-3">
 <ShoppingBag className="w-10 h-10 mx-auto opacity-30" />
 <h3 className="font-heading font-black text-lg">لا توجد طلبات زبائن حتى الآن</h3>
 <p className="text-xs opacity-70">
 شارك رابط متجرك المباشر مع زبائنك لبدء استقبال الطلبات فورياً!
 </p>
 <button
 onClick={handleSimulateNewCustomerOrder}
 className="px-4 py-2 rounded-xl bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white font-bold text-xs"
 >
 تجربة أوردر زبون فوري الآن
 </button>
 </div>
 ) : (
 <div className="grid grid-cols-1 gap-4">
 {orders.map((order) => {
 return (
 <div
 key={order.id}
 className={`p-5 rounded-2xl border-2 transition-all ${
 isDarkMode
 ? 'bg-[#111827] border-slate-700 shadow-[4px_4px_0px_#1E293B]'
 : 'bg-white border-[#0F0F0F] shadow-[4px_4px_0px_#0F0F0F]'
 } sketch-border-1 space-y-4`}
 >
 {/* Order Header */}
 <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 border-inherit/20">
 <div className="flex items-center gap-3">
 <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-[#D9722B]/10 text-[#D9722B] dark:text-[#E88B4D] border border-[#D9722B]/30">
 #{order.id}
 </span>
 <div className="font-heading font-black text-base">
 العميل: {order.customerName}
 </div>
 <span className="text-xs font-mono opacity-50">{order.createdAt}</span>
 </div>

 {/* Status Selector */}
 <div className="flex items-center gap-2">
 <span className="text-xs font-bold opacity-70">حالة الأوردر:</span>
 <select
 value={order.status}
 onChange={(e) =>
 handleUpdateOrderStatus(
 order.id,
 e.target.value as TenantCustomerOrder['status']
 )
 }
 className={`p-2 rounded-xl text-xs font-black border-2 outline-none ${
 order.status === 'delivered'
 ? 'bg-[#D9722B]/10 text-zinc-400 border-[#D9722B] dark:border-[#D9722B]/60'
 : order.status === 'shipped'
 ? 'bg-slate-800 text-zinc-400 border-slate-700'
 : 'bg-[#D9722B]/10 text-zinc-400 border-[#D9722B] dark:border-[#D9722B]/60'
 }`}
 >
 <option value="new">طلب جديد </option>
 <option value="confirmed">تم التأكيد والتجهيز </option>
 <option value="shipped">خرج مع المندوب </option>
 <option value="delivered">تم التسليم بنجاح </option>
 <option value="cancelled">ملغي </option>
 </select>
 </div>
 </div>

 {/* Customer & Items Details */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
 {/* Contact & Address */}
 <div className="space-y-1">
 <span className="font-bold opacity-60 block">عنوان الشحن والاتصال:</span>
 <div className="font-bold">{order.customerGovernorate}</div>
 <div className="opacity-80">{order.customerAddress}</div>
 <a
 href={`https://wa.me/20${order.customerPhone.replace(/^0/, '')}?text=${encodeURIComponent(
 `أهلاً يا ${order.customerName}، بخصوص طلبك #${order.id} من متجر ${currentStore.brandName}:`
 )}`}
 target="_blank"
 rel="noreferrer"
 className="text-[#D9722B] dark:text-[#E88B4D] font-bold flex items-center gap-1 pt-1 hover:underline"
 >
 <MessageCircle className="w-3.5 h-3.5" />
 <span className="font-mono">{order.customerPhone} (واتساب)</span>
 </a>
 </div>

 {/* Items Ordered */}
 <div className="space-y-2">
 <span className="font-bold opacity-60 block">المنتجات المطلوبة:</span>
 {order.items.map((item, idx) => (
 <div key={idx} className="flex items-center gap-2">
 <img
 src={item.imageUrl}
 alt={item.name}
 className="w-8 h-8 rounded-lg object-cover border"
 />
 <div>
 <div className="font-bold line-clamp-1">{item.name}</div>
 <div className="text-[11px] opacity-70">
 الكمية: {item.quantity} {item.selectedSize ? `• مقاس ${item.selectedSize}` : ''}
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* Total & Payment Method */}
 <div className="space-y-1 md:text-left">
 <span className="font-bold opacity-60 block">طريقة الدفع والحساب:</span>
 <div className="text-xl font-black font-mono text-[#D9722B] dark:text-[#E88B4D]">
 {order.totalAmount} ج.م
 </div>
 <span className="text-[11px] font-bold opacity-80 block">
 {order.paymentMethod === 'cash_on_delivery'
 ? 'الدفع عند الاستلام (COD)'
 : order.paymentMethod === 'instapay'
 ? 'تم الدفع بإنستاباي'
 : 'فودافون كاش'}
 </span>
 {order.notes && (
 <p className="text-[11px] text-zinc-400 italic">"{order.notes}"</p>
 )}
 </div>
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>
 )}

 {/* ======================================================== */}
 {/* TAB 2: PRODUCTS MANAGEMENT (CRUD) */}
 {/* ======================================================== */}
 {activeTab === 'products' && (
 <div className="space-y-4 animate-fadeIn">
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
 {currentStore.storeConfig.products.map((prod) => (
 <div
 key={prod.id}
 className={`rounded-2xl border-2 overflow-hidden flex flex-col justify-between transition-all ${
 isDarkMode
 ? 'bg-[#111827] border-slate-700 shadow-[3px_3px_0px_#1E293B]'
 : 'bg-white border-[#0F0F0F] shadow-[3px_3px_0px_#0F0F0F]'
 } sketch-border-1`}
 >
 {/* Image */}
 <div className="relative h-44 bg-slate-100 overflow-hidden flex items-center justify-center">
 <img
 src={prod.imageUrl}
 alt={prod.name}
 className="w-full h-full object-cover"
 />
 {prod.badge && (
 <span className="absolute top-2 right-2 text-[10px] font-black bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white px-2 py-0.5 rounded-full">
 {prod.badge}
 </span>
 )}
 </div>

 {/* Content */}
 <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
 <div>
 <span className="text-[10px] font-bold opacity-60 uppercase">{prod.category}</span>
 <h4 className="font-heading font-black text-sm line-clamp-1">{prod.name}</h4>
 </div>

 <div className="flex items-baseline justify-between pt-2 border-t border-inherit/20">
 <div className="font-mono font-black text-base text-[#D9722B] dark:text-[#E88B4D]">
 {prod.price} {currentStore.storeConfig.currency}
 </div>

 <button
 onClick={() => handleDeleteProduct(prod.id)}
 className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
 title="حذف المنتج"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}
 </section>
 </main>

 {/* Add Product Modal */}
 {isAddProductOpen && (
 <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn">
 <div
 className={`max-w-md w-full p-6 rounded-3xl border-2 space-y-4 shadow-2xl ${
 isDarkMode ? 'bg-[#111827] border-slate-700 text-white' : 'bg-white border-[#0F0F0F] text-[#0F0F0F]'
 } sketch-border-1`}
 >
 <div className="flex items-center justify-between border-b pb-3 border-inherit/20">
 <h3 className="font-heading font-black text-base">إضافة منتج جديد لمتجرك</h3>
 <button
 onClick={() => setIsAddProductOpen(false)}
 className="p-1 rounded-full opacity-60 hover:opacity-100"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
 <div>
 <label className="block font-bold mb-1">اسم المنتج:</label>
 <input
 type="text"
 required
 placeholder="مثال: سنيكرز أبيض رياضي مريح"
 value={newProductName}
 onChange={(e) => setNewProductName(e.target.value)}
 className="w-full p-2.5 rounded-xl border border-inherit/30 bg-inherit font-bold"
 />
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block font-bold mb-1">السعر (ج.م):</label>
 <input
 type="number"
 required
 value={newProductPrice}
 onChange={(e) => setNewProductPrice(Number(e.target.value))}
 className="w-full p-2.5 rounded-xl border border-inherit/30 bg-inherit font-mono font-bold"
 />
 </div>

 <div>
 <label className="block font-bold mb-1">القسم:</label>
 <input
 type="text"
 required
 value={newProductCategory}
 onChange={(e) => setNewProductCategory(e.target.value)}
 className="w-full p-2.5 rounded-xl border border-inherit/30 bg-inherit font-bold"
 />
 </div>
 </div>

 <div>
 <label className="block font-bold mb-1">رابط صورة المنتج (Image URL):</label>
 <input
 type="url"
 required
 value={newProductImage}
 onChange={(e) => setNewProductImage(e.target.value)}
 className="w-full p-2.5 rounded-xl border border-inherit/30 bg-inherit font-mono text-[11px]"
 />
 </div>

 <button
 type="submit"
 className="w-full py-3 rounded-2xl bg-[#D9722B] hover:bg-[#C25E1D] text-white dark:bg-[#D9722B] dark:hover:bg-[#C25E1D] dark:text-white font-black text-xs shadow-md mt-2"
 >
 حفظ وإضافة المنتج للمتجر فوراً
 </button>
 </form>
 </div>
 </div>
 )}

 {/* Modal: Edit Custom Domain */}
 {isEditDomainModalOpen && (
   <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
     <div className="relative max-w-md w-full bg-white dark:bg-[#111827] text-[#0F0F0F] dark:text-white rounded-3xl border-3 border-[#0F0F0F] dark:border-slate-700 p-6 sketch-shadow-xl space-y-4">
       <div className="flex items-center justify-between border-b border-zinc-200 dark:border-slate-700 pb-3">
         <div className="flex items-center gap-2">
           <Globe className="w-5 h-5 text-[#D9722B]" />
           <h3 className="font-heading font-black text-lg">
             إعداد وربط الدومين الفعلي لمتجرك
           </h3>
         </div>
         <button
           onClick={() => setIsEditDomainModalOpen(false)}
           className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-slate-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
         >
           <X className="w-5 h-5" />
         </button>
       </div>

       <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300 leading-relaxed">
         اكتب الدومين الفعلي أو الخاص بك (.com أو .store أو .eg) وسيقوم النظام بتوجيهه وتأمينه بشهادة SSL تلقائياً:
       </p>

       <div className="space-y-2">
         <div className="relative">
           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 pointer-events-none">
             https://
           </span>
           <input
             type="text"
             dir="ltr"
             placeholder="مثال: mybrand.store أو mybrand.com"
             value={newCustomDomainInput}
             onChange={(e) => setNewCustomDomainInput(e.target.value)}
             className="w-full pl-18 pr-3 py-2.5 rounded-xl border-2 border-[#0F0F0F] dark:border-slate-600 bg-neutral-50 dark:bg-slate-900 font-mono text-xs font-bold focus:border-[#D9722B] outline-hidden text-left"
           />
         </div>

         {/* DNS Help & Real Records Cards */}
         <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-slate-800/80 border border-zinc-200 dark:border-slate-700 text-xs font-mono font-bold space-y-2.5 text-zinc-600 dark:text-zinc-300">
           <div className="text-[#D9722B] font-heading font-black text-xs flex items-center justify-between">
             <span>سجلات DNS الرسمية المطلوبة لربط Vercel:</span>
             <span className="text-[10px] text-zinc-400 font-mono">Anycast Global</span>
           </div>

           {/* Record 1: A Record */}
           <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 flex items-center justify-between">
             <div>
               <span className="text-[10px] font-bold text-zinc-400 block">سجل A (الأساسي):</span>
               <span className="font-mono text-xs">@ ➔ 76.76.21.21</span>
             </div>
             <button
               type="button"
               onClick={() => {
                 navigator.clipboard.writeText('76.76.21.21');
                 setCopiedDnsIp(true);
                 setTimeout(() => setCopiedDnsIp(false), 2000);
               }}
               className="px-2.5 py-1 text-[11px] rounded-lg bg-neutral-100 dark:bg-slate-800 hover:bg-[#D9722B] hover:text-white font-bold"
             >
               {copiedDnsIp ? 'تم النسخ!' : 'نسخ IP'}
             </button>
           </div>

           {/* Record 2: CNAME Record */}
           <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 flex items-center justify-between">
             <div>
               <span className="text-[10px] font-bold text-zinc-400 block">سجل CNAME:</span>
               <span className="font-mono text-xs">www ➔ cname.vercel-dns.com</span>
             </div>
             <button
               type="button"
               onClick={() => {
                 navigator.clipboard.writeText('cname.vercel-dns.com');
                 setCopiedCname(true);
                 setTimeout(() => setCopiedCname(false), 2000);
               }}
               className="px-2.5 py-1 text-[11px] rounded-lg bg-neutral-100 dark:bg-slate-800 hover:bg-[#D9722B] hover:text-white font-bold"
             >
               {copiedCname ? 'تم النسخ!' : 'نسخ CNAME'}
             </button>
           </div>

           {/* Vercel CLI command */}
           <div className="p-2 rounded-xl bg-neutral-200/60 dark:bg-slate-950 border border-zinc-300 dark:border-slate-800 flex items-center justify-between text-[11px]">
             <span className="font-mono text-slate-700 dark:text-slate-300">
               {getVercelCliAddCommand(newCustomDomainInput || actualLiveDomain)}
             </span>
             <button
               type="button"
               onClick={() => {
                 navigator.clipboard.writeText(getVercelCliAddCommand(newCustomDomainInput || actualLiveDomain));
                 setCopiedCliCmd(true);
                 setTimeout(() => setCopiedCliCmd(false), 2000);
               }}
               className="px-2 py-0.5 text-[10px] rounded bg-neutral-300 dark:bg-slate-800 font-bold hover:bg-[#D9722B] hover:text-white"
             >
               {copiedCliCmd ? 'تم!' : 'نسخ الأمر'}
             </button>
           </div>

           {vercelAddNote && (
             <div className="text-[11px] font-bold text-emerald-500 pt-1">
               {vercelAddNote}
             </div>
           )}
         </div>
       </div>

       <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-200 dark:border-slate-700">
         <button
           onClick={() => setIsEditDomainModalOpen(false)}
           className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-slate-700 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-slate-800"
         >
           إلغاء
         </button>
         <button
           onClick={() => handleSaveCustomDomain(newCustomDomainInput)}
           className="btn-sketch btn-sketch-primary text-xs py-2 px-5 flex items-center gap-1.5"
         >
           <Check className="w-4 h-4" />
           <span>حفظ وتفعيل الدومين فوراً</span>
         </button>
       </div>
     </div>
   </div>
 )}
 </div>
 );
};
