import React, { useState, useEffect } from 'react';
import {
 ShoppingBag,
 ArrowRight,
 Heart,
 Star,
 Search,
 CheckCircle2,
 X,
 Send,
 Plus,
} from 'lucide-react';
import type {
 TenantStoreAccount,
 TenantCustomerOrder,
 CustomProduct,
 CartItem,
} from '../types';
import { playClick, playCashSound } from '../utils/soundEffects';
import { DEFAULT_PRODUCTS_MAP, DEFAULT_CATEGORIES_MAP } from './FullPageStoreStudio';

interface TenantLiveStoreProps {
 subdomain: string;
 onBackToMerchantPortal: () => void;
 onBackToHome: () => void;
}

export const TenantLiveStore: React.FC<TenantLiveStoreProps> = ({
 subdomain,
 onBackToMerchantPortal,
 onBackToHome,
}) => {
 const [store, setStore] = useState<TenantStoreAccount | null>(null);
 const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
 const [searchQuery, setSearchQuery] = useState<string>('');
 const [cart, setCart] = useState<CartItem[]>([]);
 const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
 const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
 const [activeProduct, setActiveProduct] = useState<CustomProduct | null>(null);
 const [selectedSize, setSelectedSize] = useState<string>('42');
 const [selectedColor, setSelectedColor] = useState<string>('Crimson / Ember');
 const [wishlist, setWishlist] = useState<string[]>([]);
 const [orderConfirmed, setOrderConfirmed] = useState<TenantCustomerOrder | null>(null);

 // Checkout form states
 const [customerName, setCustomerName] = useState<string>('');
 const [customerPhone, setCustomerPhone] = useState<string>('');
 const [customerGov, setCustomerGov] = useState<string>('القاهرة');
 const [customerAddress, setCustomerAddress] = useState<string>('');
 const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'instapay' | 'vodafone_cash'>('cash_on_delivery');
 const [orderNotes, setOrderNotes] = useState<string>('');

 // Load store config
 useEffect(() => {
 try {
 const raw = localStorage.getItem('sketch_tenant_stores');
 if (raw) {
 const parsed: Record<string, TenantStoreAccount> = JSON.parse(raw);
 if (parsed[subdomain]) {
 setStore(parsed[subdomain]);
 return;
 }
 }
 } catch (e) {
 console.error(e);
 }

 // Fallback if not found
 const fallbackStore: TenantStoreAccount = {
 tenantId: `tenant_${subdomain}`,
 subdomain,
 brandName: subdomain === 'sportech' ? 'سبورتك إيجيبت (SPORTECH)' : `${subdomain.toUpperCase()} Store`,
 ownerName: 'المدير',
 ownerPhone: '01012345678',
 planTier: 'pro',
 status: 'active',
 templateId: 'sportech-sneakers',
 createdAt: new Date().toISOString(),
 salesTotal: 0,
 ordersCount: 0,
 storeConfig: {
 storeName: subdomain === 'sportech' ? 'سبورتك إيجيبت (SPORTECH)' : `${subdomain.toUpperCase()} Store`,
 tagline: 'تسوق أفضل المنتجات العصرية بأعلى جودة وضمان حقيقي',
 niche: 'sneakers',
 templateId: 'sportech-sneakers',
 accentColor: '#F97316',
 customDomain: `${subdomain}.sketchorder.com`,
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
 setStore(fallbackStore);
 }, [subdomain]);

 if (!store) {
 return (
 <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-sans">
 <div className="text-center space-y-3">
 <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
 <p className="font-bold">جاري تحميل المتجر المستقل...</p>
 </div>
 </div>
 );
 }

 const { storeConfig } = store;
 const isDarkTemplate = store.templateId === 'dinereserve-food';

 const handleAddToCart = (product: CustomProduct, size = selectedSize, color = selectedColor) => {
 playCashSound();
 setCart((prev) => {
 const existing = prev.find(
 (item) => item.id === product.id && item.selectedSize === size
 );
 if (existing) {
 return prev.map((item) =>
 item.id === product.id && item.selectedSize === size
 ? { ...item, quantity: item.quantity + 1 }
 : item
 );
 }
 return [
 ...prev,
 {
 ...product,
 quantity: 1,
 selectedSize: size,
 selectedColor: color,
 },
 ];
 });
 };

 const handleUpdateQty = (index: number, delta: number) => {
 playClick();
 setCart((prev) => {
 const updated = [...prev];
 updated[index].quantity += delta;
 if (updated[index].quantity <= 0) {
 return updated.filter((_, i) => i !== index);
 }
 return updated;
 });
 };

 const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
 const shippingFee = cartSubtotal > 0 ? 50 : 0;
 const grandTotal = cartSubtotal + shippingFee;

 // Submit Order
 const handleCompleteOrder = (e: React.FormEvent) => {
 e.preventDefault();
 if (cart.length === 0) return;
 playCashSound();

 const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
 const newOrder: TenantCustomerOrder = {
 id: orderId,
 tenantSubdomain: subdomain,
 createdAt: new Date().toLocaleString('ar-EG'),
 customerName,
 customerPhone,
 customerGovernorate: customerGov,
 customerAddress,
 items: cart,
 totalAmount: grandTotal,
 paymentMethod,
 status: 'new',
 notes: orderNotes,
 };

 // 1. Save in tenant orders
 try {
 const orderKey = `sketch_tenant_orders_${subdomain}`;
 const savedOrdersRaw = localStorage.getItem(orderKey);
 const currentOrders: TenantCustomerOrder[] = savedOrdersRaw ? JSON.parse(savedOrdersRaw) : [];
 const updatedOrders = [newOrder, ...currentOrders];
 localStorage.setItem(orderKey, JSON.stringify(updatedOrders));

 // 2. Update store stats
 const rawStores = localStorage.getItem('sketch_tenant_stores');
 if (rawStores) {
 const stores = JSON.parse(rawStores);
 if (stores[subdomain]) {
 stores[subdomain].salesTotal = (stores[subdomain].salesTotal || 0) + grandTotal;
 stores[subdomain].ordersCount = (stores[subdomain].ordersCount || 0) + 1;
 localStorage.setItem('sketch_tenant_stores', JSON.stringify(stores));
 }
 }

 // 3. Dispatch global event so merchant dashboard updates live
 window.dispatchEvent(
 new CustomEvent('sketch_new_tenant_order', {
 detail: { subdomain, order: newOrder },
 })
 );
 } catch (err) {
 console.error(err);
 }

 setOrderConfirmed(newOrder);
 setCart([]);
 setIsCheckoutOpen(false);
 };

 const filteredProducts = storeConfig.products.filter((p) => {
 const matchesCategory =
 selectedCategory === 'الكل' || p.category === selectedCategory;
 const matchesSearch =
 searchQuery === '' ||
 p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
 p.category.toLowerCase().includes(searchQuery.toLowerCase());
 return matchesCategory && matchesSearch;
 });

 return (
 <div
 className={`min-h-screen font-body antialiased selection:bg-orange-500 selection:text-white ${
 isDarkTemplate ? 'bg-[#090D16] text-white' : 'bg-[#FAFAFA] text-slate-900'
 }`}
 >
 {/* ======================================================== */}
 {/* 0. SIMULATOR CONTROLS BAR (Top of Page) */}
 {/* ======================================================== */}
 {store?.status === 'suspended' && (
        <div className="bg-orange-500 text-slate-950 px-4 py-2 text-center text-xs font-black flex items-center justify-center gap-2">
          <span>تنبيه: هذا المتجر معطل مؤقتاً بواسطة الإدارة. يُرجى مراجعة إدارة منصة سكتش أوردر لإعادة تفعيله.</span>
        </div>
      )}
      <div className="bg-slate-950 text-white border-b border-slate-800 text-xs py-2 px-4 flex items-center justify-between select-none">
 <div className="flex items-center gap-2">
 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
 <span className="font-bold">أنت الآن تتصفح المتجر المباشر الحقيقي للزبائن:</span>
 <span className="font-mono text-orange-400 font-black">
 https://{subdomain}.sketchorder.com
 </span>
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={() => {
 playClick();
 onBackToMerchantPortal();
 }}
 className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-white font-bold transition-transform active:scale-95"
 >
 لوحة تحكم التاجر 
 </button>
 <button
 onClick={() => {
 playClick();
 onBackToHome();
 }}
 className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
 >
 الرئيسية
 </button>
 </div>
 </div>

 {/* ======================================================== */}
 {/* 1. STORE HEADER */}
 {/* ======================================================== */}
 <header
 className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${
 isDarkTemplate
 ? 'bg-[#090D16]/95 border-slate-800 text-white'
 : 'bg-white/95 border-slate-200 text-slate-900'
 }`}
 >
 {/* Announcement Strip */}
 <div className="bg-orange-500 text-slate-950 text-[11px] font-black py-1.5 px-4 text-center">
 شحن سريع لجميع المحافظات خلال 24-48 ساعة • الدفع عند الاستلام أو إنستاباي
 </div>

 <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
 {/* Brand */}
 <div className="flex items-center gap-2">
 <span className="font-heading font-black text-xl sm:text-2xl tracking-tight">
 {storeConfig.storeName}
 </span>
 </div>

 {/* Search Bar */}
 <div className="hidden md:flex items-center flex-1 max-w-md mx-6 relative">
 <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
 <input
 type="text"
 placeholder="ابحث عن أي منتج..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className={`w-full pr-10 pl-4 py-2 rounded-full text-xs font-bold border transition-colors outline-none ${
 isDarkTemplate
 ? 'bg-slate-900 border-slate-700 text-white focus:border-orange-500'
 : 'bg-slate-100 border-slate-300 text-slate-900 focus:border-orange-500'
 }`}
 />
 </div>

 {/* Cart Icon & Actions */}
 <div className="flex items-center gap-3">
 <button
 onClick={() => {
 playClick();
 setIsCartOpen(true);
 }}
 className="relative p-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
 >
 <ShoppingBag className="w-5 h-5" />
 <span className="hidden sm:inline">السلة</span>
 {cart.length > 0 && (
 <span className="w-5 h-5 rounded-full bg-slate-950 text-white text-[11px] font-bold flex items-center justify-center">
 {cart.reduce((sum, item) => sum + item.quantity, 0)}
 </span>
 )}
 </button>
 </div>
 </div>

 {/* Categories Bar */}
 <div className="border-t border-inherit/20 overflow-x-auto scrollbar-none">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-2">
 {storeConfig.categories.map((cat, i) => (
 <button
 key={i}
 onClick={() => {
 playClick();
 setSelectedCategory(cat);
 }}
 className={`px-4 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all ${
 selectedCategory === cat
 ? 'bg-orange-500 text-slate-950 shadow-xs'
 : 'bg-inherit hover:bg-slate-500/10 opacity-70 hover:opacity-100'
 }`}
 >
 {cat}
 </button>
 ))}
 </div>
 </div>
 </header>

 {/* ======================================================== */}
 {/* 2. STORE HERO BANNER */}
 {/* ======================================================== */}
 <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
 <div
 className={`relative rounded-3xl p-6 sm:p-12 overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-white ${
 isDarkTemplate
 ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800'
 : 'bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950'
 }`}
 >
 <div className="max-w-xl space-y-4 text-right">
 <span className="text-xs font-mono font-bold bg-orange-500 text-slate-950 px-3 py-1 rounded-full uppercase inline-block">
 LIMITED COLLECTION 2026
 </span>
 <h1 className="text-3xl sm:text-5xl font-black font-heading leading-tight">
 {storeConfig.tagline}
 </h1>
 <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-bold">
 استكشف أحدث التشكيلات الأصلية بضمان جودة 100% مع شحن سريع ومعاينة قبل الاستلام.
 </p>
 <div className="pt-2">
 <button
 onClick={() => {
 const el = document.getElementById('products-section');
 if (el) el.scrollIntoView({ behavior: 'smooth' });
 }}
 className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-sm shadow-lg transition-transform active:scale-95 inline-flex items-center gap-2"
 >
 <span>تسوق المجموعة الآن</span>
 <ArrowRight className="w-4 h-4 -scale-x-100" />
 </button>
 </div>
 </div>

 {storeConfig.products[0] && (
 <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shrink-0 border-2 border-white/20 shadow-2xl">
 <img
 src={storeConfig.products[0].imageUrl}
 alt={storeConfig.storeName}
 className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
 />
 </div>
 )}
 </div>
 </section>

 {/* ======================================================== */}
 {/* 3. PRODUCTS GRID */}
 {/* ======================================================== */}
 <main id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-xl sm:text-2xl font-black font-heading">
 أحدث المنتجات المعروضة ({filteredProducts.length})
 </h2>
 <p className="text-xs opacity-60 font-bold mt-0.5">
 اضغط على أي منتج لمعاينة المقاسات والألوان والطلب الفوري
 </p>
 </div>

 <span className="text-xs font-mono font-bold text-orange-500">
 {selectedCategory}
 </span>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
 {filteredProducts.map((prod) => {
 const isWish = wishlist.includes(prod.id);
 return (
 <div
 key={prod.id}
 onClick={() => {
 playClick();
 setActiveProduct(prod);
 if (prod.sizes && prod.sizes.length > 0) setSelectedSize(prod.sizes[0]);
 }}
 className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 group cursor-pointer hover:-translate-y-1 hover:shadow-xl ${
 isDarkTemplate
 ? 'bg-[#131A29] border-slate-800'
 : 'bg-white border-slate-200'
 }`}
 >
 {/* Image Container */}
 <div className="relative h-44 sm:h-56 bg-slate-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center p-3">
 {prod.badge && (
 <span className="absolute top-3 right-3 text-[10px] font-black bg-orange-500 text-slate-950 px-2.5 py-0.5 rounded-full z-10 shadow-xs">
 {prod.badge}
 </span>
 )}

 <button
 onClick={(e) => {
 e.stopPropagation();
 playClick();
 setWishlist((prev) =>
 prev.includes(prod.id) ? prev.filter((id) => id !== prod.id) : [...prev, prod.id]
 );
 }}
 className="absolute top-3 left-3 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-xs z-10"
 >
 <Heart
 className={`w-4 h-4 ${
 isWish ? 'fill-red-500 text-red-500' : 'text-slate-400'
 }`}
 />
 </button>

 <img
 src={prod.imageUrl}
 alt={prod.name}
 className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
 />
 </div>

 {/* Details */}
 <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mb-1">
 <Star className="w-3.5 h-3.5 fill-amber-400" />
 <span>{prod.rating || 4.8}</span>
 <span className="opacity-60 font-normal">({prod.reviewsCount || 84})</span>
 </div>

 <h3 className="font-heading font-black text-sm sm:text-base line-clamp-1 leading-tight">
 {prod.name}
 </h3>
 <p className="text-[11px] opacity-60 line-clamp-1 mt-0.5">
 {prod.category}
 </p>
 </div>

 {/* Price & Add to Cart button */}
 <div className="pt-2 border-t border-inherit/20 flex items-baseline justify-between">
 <div>
 <span className="text-base sm:text-lg font-black font-mono text-orange-500">
 {prod.price} {storeConfig.currency}
 </span>
 {prod.originalPrice && (
 <span className="text-xs opacity-50 line-through mr-1 font-mono">
 {prod.originalPrice}
 </span>
 )}
 </div>

 <button
 onClick={(e) => {
 e.stopPropagation();
 handleAddToCart(prod);
 }}
 className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-xs hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-slate-950 transition-colors shadow-xs"
 >
 <span className="hidden sm:inline">أضف للسلة</span>
 <Plus className="w-4 h-4 sm:hidden" />
 </button>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </main>

 {/* ======================================================== */}
 {/* 4. PRODUCT DETAIL MODAL (Matching User "After" Screenshot) */}
 {/* ======================================================== */}
 {activeProduct && (
 <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn">
 <div
 className={`max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-[32px] p-6 space-y-5 shadow-2xl relative border ${
 isDarkTemplate
 ? 'bg-[#111827] border-slate-700 text-white'
 : 'bg-white border-slate-200 text-slate-900'
 }`}
 >
 {/* Top Close Button */}
 <div className="flex items-center justify-between">
 <button
 onClick={() => setActiveProduct(null)}
 className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
 >
 <X className="w-5 h-5" />
 </button>

 <button
 onClick={() => {
 playClick();
 setWishlist((prev) =>
 prev.includes(activeProduct.id)
 ? prev.filter((id) => id !== activeProduct.id)
 : [...prev, activeProduct.id]
 );
 }}
 className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
 >
 <Heart
 className={`w-4 h-4 ${
 wishlist.includes(activeProduct.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'
 }`}
 />
 </button>
 </div>

 {/* Product Image Container (After Screenshot Style) */}
 <div className="rounded-[28px] bg-[#B91C1C] p-6 flex flex-col items-center justify-center relative min-h-[260px] overflow-hidden shadow-md">
 <img
 src={activeProduct.imageUrl}
 alt={activeProduct.name}
 className="w-64 h-52 object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.45)] hover:scale-105 transition-transform duration-300"
 />

 {/* Dots */}
 <div className="flex items-center gap-1.5 mt-2">
 <span className="w-4 h-1.5 rounded-full bg-slate-950"></span>
 <span className="w-1.5 h-1.5 rounded-full bg-red-300"></span>
 <span className="w-1.5 h-1.5 rounded-full bg-red-300"></span>
 </div>
 </div>

 {/* Product Meta */}
 <div className="space-y-3">
 <div>
 <h2 className="text-2xl font-black font-heading leading-tight">
 {activeProduct.name}
 </h2>
 <p className="text-xs opacity-60 font-medium">
 {activeProduct.category} • كولكشن حصري 2026
 </p>
 </div>

 {/* Price Row */}
 <div className="flex items-baseline gap-2">
 <span className="text-2xl font-black font-mono text-orange-500">
 {activeProduct.price} {storeConfig.currency}
 </span>
 {activeProduct.originalPrice && (
 <span className="text-xs opacity-50 line-through font-mono">
 {activeProduct.originalPrice} {storeConfig.currency}
 </span>
 )}
 <span className="text-[10px] font-bold bg-red-500/10 text-red-500 px-2 py-0.5 rounded-md">
 خصم 19%
 </span>
 </div>

 {/* Social Proof */}
 <div className="flex items-center gap-2 text-xs opacity-75 font-medium">
 <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
 <span className="font-bold">4.8</span>
 <span>•</span>
 <span>2,341 تقييم</span>
 <span>•</span>
 <span>1.2k قطعة مباعة</span>
 </div>

 {/* Color Swatch */}
 <div className="space-y-1.5 pt-2">
 <div className="text-xs font-bold">
 اللون: <span className="opacity-70">{selectedColor}</span>
 </div>
 <div className="flex items-center gap-2.5">
 {[
 { name: 'Crimson / Ember', hex: '#DC2626' },
 { name: 'Black', hex: '#18181B' },
 { name: 'Volt', hex: '#84CC16' },
 ].map((c) => (
 <button
 key={c.name}
 onClick={() => setSelectedColor(c.name)}
 className={`w-7 h-7 rounded-full transition-transform ${
 selectedColor === c.name
 ? 'ring-2 ring-offset-2 ring-slate-900 scale-110'
 : 'opacity-70 hover:opacity-100'
 }`}
 style={{ backgroundColor: c.hex }}
 />
 ))}
 </div>
 </div>

 {/* Size Selector */}
 <div className="space-y-1.5 pt-2">
 <div className="flex items-center justify-between text-xs font-bold">
 <span>المقاس (Size):</span>
 <span className="text-orange-500 cursor-pointer underline text-[11px]">دليل المقاسات</span>
 </div>
 <div className="flex flex-wrap items-center gap-2">
 {['38', '39', '40', '41', '42', '43', '44'].map((size) => (
 <button
 key={size}
 onClick={() => setSelectedSize(size)}
 className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-black border transition-all ${
 selectedSize === size
 ? 'bg-slate-950 text-white border-slate-950 dark:bg-white dark:text-slate-950 shadow-xs'
 : 'bg-inherit border-inherit/30 hover:border-orange-500'
 }`}
 >
 {size}
 </button>
 ))}
 </div>
 </div>

 {/* Action: Add to Bag button */}
 <div className="pt-4 border-t border-inherit/20 flex items-center gap-3">
 <button
 onClick={() => {
 handleAddToCart(activeProduct);
 setActiveProduct(null);
 setIsCartOpen(true);
 }}
 className="w-full py-4 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-slate-950 font-black text-sm shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2"
 >
 <ShoppingBag className="w-5 h-5" />
 <span>أضف إلى السلة • {activeProduct.price} {storeConfig.currency}</span>
 </button>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* ======================================================== */}
 {/* 5. SHOPPING CART DRAWER */}
 {/* ======================================================== */}
 {isCartOpen && (
 <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end animate-fadeIn">
 <div
 className={`w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl ${
 isDarkTemplate ? 'bg-[#111827] text-white' : 'bg-white text-slate-900'
 }`}
 >
 {/* Header */}
 <div className="flex items-center justify-between border-b pb-4 border-inherit/20">
 <div className="flex items-center gap-2">
 <ShoppingBag className="w-5 h-5 text-orange-500" />
 <h3 className="font-heading font-black text-lg">سلة مشترياتك ({cart.length})</h3>
 </div>
 <button
 onClick={() => setIsCartOpen(false)}
 className="p-1 rounded-full opacity-60 hover:opacity-100"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Cart Items List */}
 <div className="flex-1 overflow-y-auto py-4 space-y-3">
 {cart.length === 0 ? (
 <div className="text-center py-16 space-y-3 opacity-60">
 <ShoppingBag className="w-12 h-12 mx-auto stroke-1" />
 <p className="font-bold text-sm">سلتك فارغة حالياً</p>
 </div>
 ) : (
 cart.map((item, index) => (
 <div
 key={`${item.id}-${item.selectedSize}`}
 className="p-3 rounded-2xl border border-inherit/20 flex items-center gap-3"
 >
 <img
 src={item.imageUrl}
 alt={item.name}
 className="w-14 h-14 rounded-xl object-contain bg-slate-100 dark:bg-slate-800 p-1"
 />
 <div className="flex-1">
 <h4 className="font-bold text-xs line-clamp-1">{item.name}</h4>
 <div className="text-[11px] opacity-60 mt-0.5 font-mono">
 {item.price} {storeConfig.currency} {item.selectedSize ? `• مقاس ${item.selectedSize}` : ''}
 </div>
 <div className="flex items-center gap-2 mt-2">
 <button
 onClick={() => handleUpdateQty(index, -1)}
 className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold"
 >
 -
 </button>
 <span className="font-mono font-bold text-xs">{item.quantity}</span>
 <button
 onClick={() => handleUpdateQty(index, 1)}
 className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold"
 >
 +
 </button>
 </div>
 </div>
 </div>
 ))
 )}
 </div>

 {/* Summary & Checkout CTA */}
 {cart.length > 0 && (
 <div className="border-t pt-4 border-inherit/20 space-y-3">
 <div className="space-y-1.5 text-xs font-bold">
 <div className="flex justify-between">
 <span className="opacity-70">المجموع الفرعي:</span>
 <span className="font-mono">{cartSubtotal} {storeConfig.currency}</span>
 </div>
 <div className="flex justify-between">
 <span className="opacity-70">مصاريف الشحن:</span>
 <span className="font-mono text-emerald-500">50 {storeConfig.currency}</span>
 </div>
 <div className="flex justify-between text-base font-black pt-2 border-t border-inherit/15">
 <span>الإجمالي الكلي:</span>
 <span className="font-mono text-orange-500">{grandTotal} {storeConfig.currency}</span>
 </div>
 </div>

 <button
 onClick={() => {
 setIsCartOpen(false);
 setIsCheckoutOpen(true);
 }}
 className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-sm shadow-xl transition-transform active:scale-95"
 >
 متابعة إلى إتمام الشراء 
 </button>
 </div>
 )}
 </div>
 </div>
 )}

 {/* ======================================================== */}
 {/* 6. CHECKOUT MODAL (Customer Details) */}
 {/* ======================================================== */}
 {isCheckoutOpen && (
 <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn">
 <div
 className={`max-w-md w-full max-h-[92vh] overflow-y-auto rounded-3xl p-6 space-y-4 shadow-2xl border ${
 isDarkTemplate
 ? 'bg-[#111827] border-slate-700 text-white'
 : 'bg-white border-slate-200 text-slate-900'
 }`}
 >
 <div className="flex items-center justify-between border-b pb-3 border-inherit/20">
 <h3 className="font-heading font-black text-base">إتمام طلبك من {storeConfig.storeName}</h3>
 <button
 onClick={() => setIsCheckoutOpen(false)}
 className="p-1 rounded-full opacity-60 hover:opacity-100"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 <form onSubmit={handleCompleteOrder} className="space-y-3 text-xs">
 <div>
 <label className="block font-bold mb-1">اسمك بالكامل:</label>
 <input
 type="text"
 required
 placeholder="مثال: كريم عبد العزيز"
 value={customerName}
 onChange={(e) => setCustomerName(e.target.value)}
 className="w-full p-2.5 rounded-xl border border-inherit/30 bg-inherit font-bold"
 />
 </div>

 <div>
 <label className="block font-bold mb-1">رقم الواتساب / الهاتف للتأكيد:</label>
 <input
 type="tel"
 required
 placeholder="010XXXXXXXX"
 value={customerPhone}
 onChange={(e) => setCustomerPhone(e.target.value)}
 className="w-full p-2.5 rounded-xl border border-inherit/30 bg-inherit font-mono font-bold"
 />
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block font-bold mb-1">المحافظة:</label>
 <select
 value={customerGov}
 onChange={(e) => setCustomerGov(e.target.value)}
 className="w-full p-2.5 rounded-xl border border-inherit/30 bg-inherit font-bold"
 >
 <option value="القاهرة">القاهرة</option>
 <option value="الجيزة">الجيزة</option>
 <option value="الإسكندرية">الإسكندرية</option>
 <option value="المنصورة">المنصورة</option>
 <option value="طنطا">طنطا</option>
 <option value="الشرقية">الشرقية</option>
 <option value="أسيوط">أسيوط</option>
 </select>
 </div>

 <div>
 <label className="block font-bold mb-1">طريقة الدفع:</label>
 <select
 value={paymentMethod}
 onChange={(e) =>
 setPaymentMethod(
 e.target.value as 'cash_on_delivery' | 'instapay' | 'vodafone_cash'
 )
 }
 className="w-full p-2.5 rounded-xl border border-inherit/30 bg-inherit font-bold"
 >
 <option value="cash_on_delivery">الدفع عند الاستلام</option>
 <option value="instapay">تحويل إنستاباي</option>
 <option value="vodafone_cash">فودافون كاش</option>
 </select>
 </div>
 </div>

 <div>
 <label className="block font-bold mb-1">العنوان التفصيلي للتوصيل:</label>
 <input
 type="text"
 required
 placeholder="اسم الشارع، رقم العمارة، رقم الشقة"
 value={customerAddress}
 onChange={(e) => setCustomerAddress(e.target.value)}
 className="w-full p-2.5 rounded-xl border border-inherit/30 bg-inherit font-bold"
 />
 </div>

 <div>
 <label className="block font-bold mb-1">ملاحظات للمندوب (اختياري):</label>
 <textarea
 rows={2}
 placeholder="مثال: رن الجرس واسيب الأوردر مع الأمن"
 value={orderNotes}
 onChange={(e) => setOrderNotes(e.target.value)}
 className="w-full p-2.5 rounded-xl border border-inherit/30 bg-inherit font-bold"
 />
 </div>

 <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 font-bold flex justify-between items-center text-xs">
 <span>المبلغ المطلوب تسليمه:</span>
 <span className="text-base font-black font-mono text-orange-500">
 {grandTotal} {storeConfig.currency}
 </span>
 </div>

 <button
 type="submit"
 className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-sm shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2"
 >
 <Send className="w-4 h-4" />
 <span>تأكيد وإرسال الطلب الآن </span>
 </button>
 </form>
 </div>
 </div>
 )}

 {/* ======================================================== */}
 {/* 7. ORDER CONFIRMATION MODAL */}
 {/* ======================================================== */}
 {orderConfirmed && (
 <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 flex items-center justify-center animate-fadeIn">
 <div className="max-w-md w-full bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 text-white text-center space-y-4 shadow-2xl">
 <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
 <CheckCircle2 className="w-10 h-10" />
 </div>

 <h3 className="font-heading font-black text-2xl">تم تأكيد طلبك بنجاح! </h3>
 <div className="font-mono text-sm font-bold bg-slate-800 p-2 rounded-xl text-orange-400">
 رقم الطلب: #{orderConfirmed.id}
 </div>

 <p className="text-xs text-slate-300 leading-relaxed font-bold">
 شكراً يا {orderConfirmed.customerName}! تم استلام طلبك وجاري تجهيزه للشحن إلى {orderConfirmed.customerGovernorate}.
 المبلغ الإجمالي: {orderConfirmed.totalAmount} ج.م.
 </p>

 <div className="pt-2 space-y-2">
 <button
 onClick={() => {
 playClick();
 onBackToMerchantPortal();
 }}
 className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2"
 >
 <span>شاهد وصول هذا الأوردر فوراً في لوحة تحكم التاجر </span>
 <ArrowRight className="w-4 h-4 -scale-x-100" />
 </button>

 <button
 onClick={() => setOrderConfirmed(null)}
 className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
 >
 متابعة التسوق
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
};
