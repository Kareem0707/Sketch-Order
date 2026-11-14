import React, { useState } from 'react';
import {
  ShoppingCart,
  Search,
  Globe,
  PackageSearch,
  X,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Menu,
} from 'lucide-react';
import type { CustomProduct, CartItem } from '../../types';
import { playClick, playCashSound } from '../../utils/soundEffects';

// All 39 Products from CTRL YZ (Reversed #39 to #1 matching production)
export const CTRL_YZ_ALL_PRODUCTS: CustomProduct[] = Array.from({ length: 39 }).map((_, idx) => {
  const num = 39 - idx;
  const ext = num > 24 ? 'jpeg' : 'webp';
  return {
    id: `cyz-${num}`,
    name: `CTRL YZ #${num}`,
    price: 500,
    originalPrice: 650,
    costPrice: 240,
    category: num > 25 ? 'هوديز أوفر سايز 3D' : num > 12 ? 'تيشرتات ستريت وير' : 'كولكشن الشارع 2026',
    tag: num >= 37 ? 'Best Seller' : 'New Drop',
    badge: num >= 37 ? 'الأكثر مبيعاً 🔥' : undefined,
    imageUrl: `/assets/products/ctrl-yz/product-${num}.${ext}`,
    rating: 4.9,
    reviewsCount: 120 + (num * 3),
    sizes: ['M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: [
      { name: 'Vintage Black', hex: '#111827' },
      { name: 'Washed Grey', hex: '#4B5563' },
    ],
    description: 'Premium CTRL YZ Streetwear Collection • خامة قطن 100% عالية الجودة مع طباعة 3D ثلاثية الأبعاد بارزة ومقاومة للغسيل المتكرر، قصة أوفر سايز مثالية تناسب جميع الأذواق.',
  };
});

interface CtrlYzStorefrontProps {
  products?: CustomProduct[];
  onAddToCart?: (product: CustomProduct, size: string) => void;
  cartItems?: CartItem[];
  onCheckoutClick?: () => void;
  isMockup?: boolean;
}

export const CtrlYzStorefront: React.FC<CtrlYzStorefrontProps> = ({
  products = CTRL_YZ_ALL_PRODUCTS,
  onAddToCart,
  cartItems = [],
  onCheckoutClick,
  isMockup = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [selectedProduct, setSelectedProduct] = useState<CustomProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingResult, setTrackingResult] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // Local Cart State if not controlled from parent
  const [localCart, setLocalCart] = useState<CartItem[]>(cartItems);
  const activeCart = cartItems.length > 0 ? cartItems : localCart;

  const categories = ['الكل', 'هوديز أوفر سايز 3D', 'تيشرتات ستريت وير', 'كولكشن الشارع 2026'];

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === 'الكل' || p.category === selectedCategory;
    const matchSearch = searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleProductClick = (product: CustomProduct) => {
    playClick();
    setSelectedProduct(product);
    setSelectedSize(product.sizes?.[0] || 'L');
  };

  const handleAddFromModal = () => {
    if (!selectedProduct) return;
    playCashSound();
    if (onAddToCart) {
      onAddToCart(selectedProduct, selectedSize);
    } else {
      setLocalCart((prev) => {
        const existing = prev.find((item) => item.id === selectedProduct.id && item.selectedSize === selectedSize);
        if (existing) {
          return prev.map((item) =>
            item.id === selectedProduct.id && item.selectedSize === selectedSize
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...selectedProduct, quantity: 1, selectedSize }];
      });
    }

    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      setSelectedProduct(null);
    }, 1200);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;
    playClick();
    setTrackingResult(`الطلب #${trackingCode.trim()} قيد الشحن حالياً مع مندوب شركة فاست دليفري، موعد الوصول المتوقع خلال 24 ساعة 🚚`);
  };

  const cartTotal = activeCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 font-sans selection:bg-[#38BDF8] selection:text-black relative pb-28">
      {/* ======================================================== */}
      {/* 1. TOP NAVBAR (Authentic CTRL YZ Styling) */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-[#0B0E14]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedCategory('الكل');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-mono font-black text-2xl sm:text-3xl tracking-widest text-[#38BDF8] hover:text-white transition-colors uppercase shrink-0"
            >
              CTRL YZ
            </button>
            <span className="hidden lg:inline-block text-[10px] font-mono font-bold text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
              3D OVERSIZED
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-300">
            <a href="#collection" className="hover:text-[#38BDF8] transition-colors">
              OUR COLLECTION
            </a>
            <a href="#about" className="hover:text-[#38BDF8] transition-colors">
              ABOUT
            </a>
            <a href="#services" className="hover:text-[#38BDF8] transition-colors">
              SERVICES
            </a>
            <a href="#contact" className="hover:text-[#38BDF8] transition-colors">
              CONTACT
            </a>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Track Order Pill */}
            <button
              onClick={() => {
                playClick();
                setIsTrackingOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 border border-[#38BDF8]/30 text-[#38BDF8] font-bold text-xs transition-all active:scale-95"
            >
              <PackageSearch className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Track Order</span>
            </button>

            {/* Language Pill */}
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold text-slate-300">
              <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>AR</span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-2.5 text-xs font-bold text-slate-300">
            <a
              href="#collection"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-[#38BDF8]"
            >
              OUR COLLECTION
            </a>
            <a
              href="#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-[#38BDF8]"
            >
              ABOUT
            </a>
            <a
              href="#services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-[#38BDF8]"
            >
              SERVICES
            </a>
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-[#38BDF8]"
            >
              CONTACT
            </a>
          </div>
        )}
      </header>

      {/* ======================================================== */}
      {/* 2. HERO SHOWCASE (WEAR YOUR IDEA) */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-[#0B0E14] via-[#0E131E] to-[#0B0E14] border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12">
          <div className="max-w-2xl space-y-4 text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8] text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DROP 2026 • 3D OVERSIZED APPAREL</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-sans uppercase tracking-tight text-white leading-tight">
              WEAR YOUR IDEA
            </h1>
            <p className="text-sm sm:text-lg text-slate-300 font-medium leading-relaxed max-w-xl">
              ملابس أوفر سايز ستريت وير بريميوم مصنعة من أثقل قطن مصري 100% مع أحدث تقنيات الطباعة ثلاثية الأبعاد 3D البارزة والمقاومة للغسيل المتكرر.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href="#collection"
                className="px-6 py-3 rounded-2xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-black font-black text-sm transition-all shadow-lg shadow-[#38BDF8]/20 flex items-center gap-2 active:scale-95"
              >
                <span>استكشف الكولكشن الكامل (39 منتج)</span>
                <ArrowRight className="w-4 h-4 -scale-x-100" />
              </a>
              <button
                onClick={() => setIsTrackingOpen(true)}
                className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm transition-all"
              >
                تتبع شحنتك
              </button>
            </div>
          </div>

          {/* Hero Tilted Showcase Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0 max-w-sm sm:max-w-md w-full">
            {[39, 38].map((num) => (
              <div
                key={num}
                onClick={() => {
                  const p = products.find((x) => x.id === `cyz-${num}`);
                  if (p) handleProductClick(p);
                }}
                className="rounded-3xl overflow-hidden border border-white/10 bg-[#12161F] p-2.5 shadow-2xl hover:border-[#38BDF8]/60 transition-all cursor-pointer group"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900/60 mb-2">
                  <img
                    src={`/assets/products/ctrl-yz/product-${num}.${num > 24 ? 'jpeg' : 'webp'}`}
                    alt={`CTRL YZ #${num}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 right-2 text-[9px] font-black bg-[#38BDF8] text-black px-2 py-0.5 rounded-full font-mono">
                    NEW 2026
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold px-1">
                  <span className="text-white">CTRL YZ #{num}</span>
                  <span className="text-[#38BDF8] font-mono">500 EGP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. OUR COLLECTION (Identical to User Image 2) */}
      {/* ======================================================== */}
      <section id="collection" className="py-14 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Giant Centered Title as seen in Screenshot 2 */}
        <div className="text-center space-y-3 mb-10 sm:mb-14">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-sans uppercase tracking-wider text-white">
            OUR COLLECTION
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            تصفح كولكشن ستريت وير CTRL YZ الأصلي • طباعة 3D مجسمة متطورة وخامات فاخرة
          </p>
        </div>

        {/* Categories Strip & Search Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#38BDF8] text-black shadow-lg shadow-[#38BDF8]/20 font-black'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم أو الرقم (#39)..."
              className="w-full pr-9 pl-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-[#38BDF8] transition-colors"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* PRODUCT GRID: 4 COLUMNS ON DESKTOP - NO SQUASHING! */}
        {/* ======================================================== */}
        <div className={`grid gap-5 sm:gap-6 lg:gap-8 ${
          isMockup
            ? 'grid-cols-2'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}>
          {filtered.map((product) => {
            return (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="bg-[#12161F] border border-white/10 rounded-3xl overflow-hidden hover:border-[#38BDF8]/60 transition-all duration-300 flex flex-col group cursor-pointer shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#38BDF8]/10"
              >
                {/* Image Container: TALL ASPECT RATIO WITHOUT ANY CROPPING / SQUASHING */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black/40">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {product.badge && (
                    <div className="absolute top-3 right-3 bg-[#38BDF8] text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping"></span>
                      <span>{product.badge}</span>
                    </div>
                  )}
                </div>

                {/* Card Content identical to Image 2 */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 group-hover:text-[#38BDF8] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4 line-clamp-1">
                      {product.description}
                    </p>
                  </div>

                  {/* Bottom Row: Price on left, Cart button on right */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
                    <span className="text-xl sm:text-2xl font-mono font-black text-[#38BDF8]">
                      {product.price} EGP
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product);
                      }}
                      className="p-3 bg-white/5 hover:bg-[#38BDF8] hover:text-black text-white rounded-full transition-colors active:scale-90"
                      title="معاينة واختيار المقاس"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. PRODUCT DETAILS MODAL (Exact from CTRL YZ) */}
      {/* ======================================================== */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#0F141F] border border-white/15 rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 bg-black/60 text-white p-2 rounded-full hover:bg-[#38BDF8] hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Image Section */}
            <div className="w-full md:w-1/2 h-64 sm:h-80 md:h-auto relative overflow-hidden bg-black/50 shrink-0">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              {selectedProduct.badge && (
                <span className="absolute top-4 left-4 bg-[#38BDF8] text-black px-3.5 py-1 rounded-full text-xs font-black">
                  {selectedProduct.badge}
                </span>
              )}
            </div>

            {/* Right Details Section */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
                    {selectedProduct.name}
                  </h2>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-[#38BDF8] mt-1">
                    {selectedProduct.price} EGP
                  </div>
                </div>

                {/* Size Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                    اختر المقاس (SELECT SIZE):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['M', 'L', 'XL', 'XXL', 'XXXL'].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => {
                          playClick();
                          setSelectedSize(sz);
                        }}
                        className={`w-12 h-12 rounded-xl font-mono font-black text-sm flex items-center justify-center border transition-all ${
                          selectedSize === sz
                            ? 'border-[#38BDF8] bg-[#38BDF8] text-black shadow-md shadow-[#38BDF8]/30 scale-105'
                            : 'border-white/10 hover:border-white/30 text-white bg-white/5'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features Quality Checklist */}
                <div className="space-y-2 border-t border-white/10 pt-4 text-xs font-bold text-slate-200">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>خامة قطن مصري 100% ثقيل معالج ضد الانكماش.</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>طباعة 3D ثلاثية الأبعاد بارزة ومقاومة للغسيل المتكرر.</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>قصة أوفر سايز عصرية مريحة جداً للجسم.</span>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="pt-6 border-t border-white/10 mt-6">
                <button
                  onClick={handleAddFromModal}
                  className="w-full py-3.5 rounded-2xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-black font-black text-sm transition-all shadow-lg shadow-[#38BDF8]/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>إضافة إلى حقيبة التسوق ({selectedSize})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. ORDER TRACKING MODAL */}
      {/* ======================================================== */}
      {isTrackingOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsTrackingOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#0F141F] border border-white/15 rounded-3xl p-6 text-white space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <PackageSearch className="w-5 h-5 text-[#38BDF8]" />
                <h3 className="font-heading font-black text-lg">تتبع شحنتك المباشرة</h3>
              </div>
              <button
                onClick={() => setIsTrackingOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTrackSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-bold">
                  أدخل رقم الأوردر أو رقم هاتفك المسجل:
                </label>
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="مثال: #1042 أو 01012345678"
                  className="w-full p-3 rounded-2xl bg-white/5 border border-white/15 text-sm text-white font-mono outline-none focus:border-[#38BDF8]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-black font-black text-xs transition-transform active:scale-95 shadow-md shadow-[#38BDF8]/20"
              >
                استعلام عن حالة الشحن
              </button>
            </form>

            {trackingResult && (
              <div className="p-3.5 rounded-2xl bg-white/5 border border-[#38BDF8]/30 text-xs text-slate-200 leading-relaxed font-bold animate-fadeIn">
                {trackingResult}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. ABOUT & BRAND STORY */}
      {/* ======================================================== */}
      <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-wider block">
              THE STORY • براند الشارع 2026
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase">
              انطلقنا لنغير مفهوم الملابس الأوفر سايز في مصر
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              بدأت رحلة CTRL YZ بهدف واضح: تقديم خامات قطنية مصرية 100% غير مسبوقة بوزن ثقيل، مع طباعة ثلاثية الأبعاد فائقة الدقة لا تتأثر بالحرارة أو الغسيل، لتمنحك الستايل العصري الأنيق مع أقصى درجات الراحة.
            </p>
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="font-mono font-black text-xl text-[#38BDF8] block">+24,500</span>
                <span className="text-[10px] text-slate-400 font-bold">أوردر تم تنفيذه</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="font-mono font-black text-xl text-[#38BDF8] block">100%</span>
                <span className="text-[10px] text-slate-400 font-bold">قطن مصري أصلي</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="font-mono font-black text-xl text-[#38BDF8] block">48 ساعة</span>
                <span className="text-[10px] text-slate-400 font-bold">شحن فوري</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative h-80 sm:h-96">
            <img
              src="/assets/products/ctrl-yz/product-39.jpeg"
              alt="About CTRL YZ"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
              <span className="font-mono text-xs font-bold text-[#38BDF8] tracking-widest uppercase">
                CTRL YZ • WEAR YOUR IDEA
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. SERVICES & GUARANTEES */}
      {/* ======================================================== */}
      <section id="services" className="py-14 px-4 sm:px-6 bg-[#0E131E] border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2">
            <Truck className="w-6 h-6 text-[#38BDF8]" />
            <h4 className="font-bold text-base text-white">شحن سريع 24-48 ساعة</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              توصيل لجميع محافظات جمهورية مصر العربية مع إمكانية التتبع المباشر لخط سير المندوب.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#38BDF8]" />
            <h4 className="font-bold text-base text-white">معاينة قبل الاستلام والدفع</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              افتح أوردرك وعاين جودة الخامة والمقاس قبل دفع مليم واحد للمندوب، مع الدفع عند الاستلام أو إنستاباي.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2">
            <RotateCcw className="w-6 h-6 text-[#38BDF8]" />
            <h4 className="font-bold text-base text-white">استبدال واسترجاع سهل</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              لو المقاس مش مظبوط بنستبدلهولك في نفس اليوم بدون أي تعقيدات وبأسرع وقت.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. CONTACT & FOOTER */}
      {/* ======================================================== */}
      <footer id="contact" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10 text-center space-y-4">
        <div className="font-mono font-black text-2xl tracking-widest text-white uppercase">
          CTRL YZ
        </div>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          المتجر الرائد في مصر للملابس الأوفر سايز والستريت وير • القاهرة، مصر.
        </p>
        <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400">
          <span>خدمة العملاء: 01012345678</span>
          <span>•</span>
          <span>دعم فوري على مدار 24 ساعة عبر واتساب</span>
        </div>
        <div className="text-[11px] font-mono text-slate-600 pt-4">
          © 2026 CTRL YZ. POWERED BY SKETCH ORDER MULTI-TENANT ARCHITECTURE.
        </div>
      </footer>

      {/* ======================================================== */}
      {/* 9. FLOATING BOTTOM CART BAR (Exact match to CTRL YZ) */}
      {/* ======================================================== */}
      {activeCart.length > 0 && (
        <div className="fixed bottom-6 inset-x-4 z-40 max-w-lg mx-auto animate-bounceIn">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-3 sm:p-4 flex items-center justify-between gap-3">
            {/* Thumbnails */}
            <div className="flex items-center -space-x-3 overflow-x-auto pr-2 scrollbar-none">
              {activeCart.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="w-11 h-11 rounded-full border-2 border-slate-900 overflow-hidden relative shrink-0 shadow-md"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <span className="text-xs font-mono font-bold text-slate-300 pr-3">
                ({activeCart.reduce((sum, x) => sum + x.quantity, 0)} قطع)
              </span>
            </div>

            {/* Total and Checkout Action */}
            <button
              onClick={() => {
                playClick();
                if (onCheckoutClick) {
                  onCheckoutClick();
                } else {
                  alert(`جاري توجيهك لصفحة الدفع بإجمالي: ${cartTotal} ج.م`);
                }
              }}
              className="px-5 sm:px-6 py-3 rounded-2xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-black font-black text-xs uppercase tracking-wider transition-transform active:scale-95 shadow-lg shadow-[#38BDF8]/20 shrink-0 flex items-center gap-2"
            >
              <span>إتمام الطلب • {cartTotal} EGP</span>
              <ArrowRight className="w-3.5 h-3.5 -scale-x-100" />
            </button>
          </div>
        </div>
      )}

      {/* Cart Added Toast */}
      {addedToast && (
        <div className="fixed top-20 inset-x-4 max-w-sm mx-auto z-50 bg-[#38BDF8] text-black font-black text-xs py-3 px-4 rounded-2xl shadow-2xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>تمت إضافة المنتج بنجاح لحقيبة التسوق!</span>
          </div>
        </div>
      )}
    </div>
  );
};
