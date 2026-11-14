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
  ArrowRight,
  Menu,
} from 'lucide-react';
import type { CustomProduct, CartItem } from '../../types';
import { playClick, playCashSound } from '../../utils/soundEffects';

// All 39 Products from CTRL YZ
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
    tag: num >= 37 || num <= 3 ? 'Best Seller' : 'New Drop',
    badge: num >= 37 || num <= 3 ? 'الأكثر مبيعاً 🔵' : undefined,
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
    <div className={`min-h-screen bg-[#0B0E14] text-slate-100 font-sans selection:bg-[#38BDF8] selection:text-black relative ${isMockup ? 'pb-24' : 'pb-32'}`}>
      
      {/* ======================================================== */}
      {/* 1. TOP NAVBAR (Identical to User Screenshot 2) */}
      {/* ======================================================== */}
      <header className={`sticky top-0 z-40 bg-[#0B0E14]/95 backdrop-blur-md border-b border-white/10 ${isMockup ? 'px-3 py-2.5' : 'px-4 sm:px-8 py-4'} transition-all`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Brand Logo on Left */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory('الكل');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`font-mono font-black ${isMockup ? 'text-xl tracking-wider' : 'text-2xl sm:text-3xl tracking-widest'} text-[#38BDF8] hover:text-white transition-colors uppercase shrink-0`}
            >
              CTRL YZ
            </button>
            {!isMockup && (
              <span className="hidden lg:inline-block text-[10px] font-mono font-bold text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                3D OVERSIZED
              </span>
            )}
          </div>

          {/* Desktop Nav Links (Hidden in Phone Mode / Mockup) */}
          {!isMockup && (
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
          )}

          {/* Right Action Icons (Identical to Screenshot 2) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Pill (Globe) AR */}
            <div className={`flex items-center gap-1 ${isMockup ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-xs'} rounded-full bg-white/5 border border-white/10 font-mono font-bold text-slate-300`}>
              <Globe className="w-3 h-3 text-[#38BDF8]" />
              <span>AR</span>
            </div>

            {/* Track Order Pill */}
            <button
              onClick={() => {
                playClick();
                setIsTrackingOpen(true);
              }}
              className={`flex items-center gap-1 ${isMockup ? 'p-1.5 rounded-full' : 'px-3 py-1.5 rounded-full'} bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 border border-[#38BDF8]/30 text-[#38BDF8] font-bold text-xs transition-all active:scale-95`}
              title="تتبع الشحنة"
            >
              <PackageSearch className="w-3.5 h-3.5" />
              {!isMockup && <span className="hidden sm:inline">Track Order</span>}
            </button>

            {/* Mobile / Mockup Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-1.5 rounded-lg text-slate-300 hover:text-white ${!isMockup ? 'md:hidden' : ''}`}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="mt-2.5 pt-2.5 border-t border-white/10 flex flex-col gap-2 text-xs font-bold text-slate-300 animate-fadeIn">
            <a
              href="#collection"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-[#38BDF8] flex items-center justify-between"
            >
              <span>OUR COLLECTION</span>
              <span className="text-[10px] text-[#38BDF8]">39 منتج</span>
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
      {/* 2. HERO SHOWCASE (Exact Match to User Screenshot 2) */}
      {/* ======================================================== */}
      <section className={`relative overflow-hidden ${isMockup ? 'py-10 px-4' : 'py-16 sm:py-24 px-4 sm:px-6'} bg-gradient-to-b from-[#0B0E14] via-[#0D121D] to-[#0B0E14] border-b border-white/5`}>
        {/* Subtle Watermark Apparel Texture */}
        <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
          <img
            src="/assets/products/ctrl-yz/product-2.webp"
            alt=""
            className="w-full h-full object-cover scale-125 filter grayscale blur-xs"
          />
        </div>

        {/* Centered Glass Hero Box (Identical to Screenshot 2) */}
        <div className={`relative z-10 flex flex-col items-center justify-center text-center ${isMockup ? 'px-4 py-8 rounded-[2rem]' : 'px-8 sm:px-16 py-12 sm:py-16 rounded-[3rem]'} bg-white/[0.04] backdrop-blur-md border border-white/10 shadow-2xl max-w-xl mx-auto space-y-4`}>
          <div className="space-y-1">
            <h1 className={`${isMockup ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-7xl md:text-8xl'} font-display font-black leading-tight uppercase tracking-tight text-white`}>
              WEAR YOUR<br />IDEA
            </h1>
          </div>

          <p className={`${isMockup ? 'text-xs leading-relaxed max-w-xs' : 'text-sm sm:text-lg max-w-md'} text-slate-300 font-light mx-auto`}>
            Premium oversized apparel with ultra-luxury 3D printing. We don't just sell t-shirts, we craft identity.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs sm:max-w-md mx-auto">
            <a
              href="#collection"
              className="w-full py-3.5 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-black font-black text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 shadow-lg shadow-[#38BDF8]/20 text-center"
            >
              EXPLORE COLLECTION
            </a>
            <button
              onClick={() => {
                playClick();
                setIsTrackingOpen(true);
              }}
              className="w-full py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 text-center"
            >
              START DESIGNING
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. OUR COLLECTION (1-Column on Phone as in Screenshot 3) */}
      {/* ======================================================== */}
      <section id="collection" className={`${isMockup ? 'py-8 px-3' : 'py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto'}`}>
        {/* Giant Centered Title */}
        <div className={`text-center space-y-1.5 ${isMockup ? 'mb-6' : 'mb-12'}`}>
          <h2 className={`${isMockup ? 'text-3xl font-black' : 'text-5xl sm:text-7xl font-black'} font-sans uppercase tracking-wider text-white`}>
            OUR COLLECTION
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            تصفح كولكشن ستريت وير CTRL YZ الأصلي • طباعة 3D مجسمة متطورة
          </p>
        </div>

        {/* Categories Filter Strip */}
        <div className={`flex ${isMockup ? 'flex-col gap-2.5 mb-5' : 'flex-col sm:flex-row items-center justify-between gap-4 mb-8'}`}>
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#38BDF8] text-black shadow-md shadow-[#38BDF8]/20 font-black'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={`relative ${isMockup ? 'w-full' : 'w-full sm:w-64'}`}>
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم أو الرقم (#39)..."
              className="w-full pr-8 pl-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-[#38BDF8] transition-colors"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* PRODUCT GRID: 1 COLUMN ON PHONE (Screenshot 3) / 4 ON DESKTOP */}
        {/* ======================================================== */}
        <div className={`grid ${
          isMockup
            ? 'grid-cols-1 gap-6 max-w-sm mx-auto'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8'
        }`}>
          {filtered.map((product) => {
            return (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className={`bg-[#12161F] border border-white/10 ${isMockup ? 'rounded-3xl p-4' : 'rounded-3xl p-5'} overflow-hidden hover:border-[#38BDF8]/60 transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-2xl hover:-translate-y-1 hover:shadow-cyan-500/10`}
              >
                {/* Large Product Image (Exact match to Screenshot 3) */}
                <div className={`relative ${isMockup ? 'h-72 sm:h-80 rounded-2xl mb-3' : 'h-64 sm:h-72 rounded-2xl mb-4'} w-full overflow-hidden bg-black/50`}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Watermark Script Logo on Top-Left */}
                  <span className="absolute top-3 left-3 text-xs font-mono font-bold text-white/90 italic bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                    Ctrl yz
                  </span>

                  {/* Best Seller Blue Badge on Top-Right */}
                  {product.badge && (
                    <div className="absolute top-3 right-3 bg-[#38BDF8] text-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping"></span>
                      <span>{product.badge}</span>
                    </div>
                  )}

                  {/* Bottom Brand Tag on Image */}
                  <div className="absolute bottom-2.5 inset-x-0 mx-auto w-fit text-[10px] font-mono font-black text-white/80 bg-black/50 backdrop-blur-xs px-2.5 py-0.5 rounded-md border border-white/10">
                    CTRL | Z
                  </div>
                </div>

                {/* Card Content identical to Screenshot 3 */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-[#38BDF8] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mb-4 line-clamp-1">
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
      {/* 4. THE NUMBERS SPEAK (Exact Match to User Screenshot 4) */}
      {/* ======================================================== */}
      <section className={`${isMockup ? 'py-10 px-4' : 'py-20 px-6 max-w-5xl mx-auto'} border-t border-white/5 text-center relative overflow-hidden`}>
        {/* Curved blue background line */}
        <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 800 200" fill="none">
            <path
              d="M 50 150 C 250 150, 400 50, 750 20"
              stroke="#38BDF8"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="relative z-10 space-y-6 max-w-md sm:max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-display font-black uppercase text-white tracking-widest">
            THE NUMBERS SPEAK
          </h2>

          <div className="space-y-4">
            {/* Number Card 1 (Screenshot 4) */}
            <div className="p-8 rounded-3xl bg-white/[0.04] backdrop-blur-md border border-white/10 shadow-2xl space-y-1">
              <div className="text-5xl sm:text-7xl font-mono font-black text-[#38BDF8] drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                +146
              </div>
              <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300">
                CLIENTS NATIONWIDE
              </div>
            </div>

            {/* Number Card 2 (Screenshot 4) */}
            <div className="p-8 rounded-3xl bg-white/[0.04] backdrop-blur-md border border-white/10 shadow-2xl space-y-1">
              <div className="text-5xl sm:text-7xl font-mono font-black text-[#38BDF8] drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                94.7%
              </div>
              <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300">
                PRINT SUCCESS RATE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. PRODUCT DETAILS MODAL */}
      {/* ======================================================== */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#0F141F] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 z-20 bg-black/60 text-white p-2 rounded-full hover:bg-[#38BDF8] hover:text-black transition-colors"
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
                <span className="absolute top-3 left-3 bg-[#38BDF8] text-black px-3 py-0.5 rounded-full text-xs font-black">
                  {selectedProduct.badge}
                </span>
              )}
            </div>

            {/* Right Details Section */}
            <div className="w-full md:w-1/2 p-5 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-white tracking-wide">
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
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl font-mono font-black text-xs sm:text-sm flex items-center justify-center border transition-all ${
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
                <div className="space-y-2 border-t border-white/10 pt-3 text-xs font-bold text-slate-200">
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
              <div className="pt-4 border-t border-white/10 mt-4 sm:mt-6">
                <button
                  onClick={handleAddFromModal}
                  className="w-full py-3.5 rounded-2xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-black font-black text-xs sm:text-sm transition-all shadow-lg shadow-[#38BDF8]/20 flex items-center justify-center gap-2 active:scale-95"
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
      {/* 6. ORDER TRACKING MODAL */}
      {/* ======================================================== */}
      {isTrackingOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsTrackingOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#0F141F] border border-white/15 rounded-3xl p-5 sm:p-6 text-white space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <PackageSearch className="w-5 h-5 text-[#38BDF8]" />
                <h3 className="font-heading font-black text-base sm:text-lg">تتبع شحنتك المباشرة</h3>
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
                  className="w-full p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/15 text-xs sm:text-sm text-white font-mono outline-none focus:border-[#38BDF8]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 sm:py-3 rounded-2xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-black font-black text-xs transition-transform active:scale-95 shadow-md shadow-[#38BDF8]/20"
              >
                استعلام عن حالة الشحن
              </button>
            </form>

            {trackingResult && (
              <div className="p-3 rounded-2xl bg-white/5 border border-[#38BDF8]/30 text-xs text-slate-200 leading-relaxed font-bold animate-fadeIn">
                {trackingResult}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. SERVICES & GUARANTEES */}
      {/* ======================================================== */}
      <section id="services" className={`${isMockup ? 'py-8 px-4' : 'py-14 px-6'} bg-[#0E131E] border-y border-white/5`}>
        <div className={`max-w-7xl mx-auto grid ${isMockup ? 'grid-cols-1 gap-3' : 'grid-cols-1 sm:grid-cols-3 gap-6'}`}>
          <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <Truck className="w-5 h-5 text-[#38BDF8]" />
            <h4 className="font-bold text-sm sm:text-base text-white">شحن سريع 24-48 ساعة</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              توصيل لجميع محافظات جمهورية مصر العربية مع إمكانية التتبع المباشر لخط سير المندوب.
            </p>
          </div>
          <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <ShieldCheck className="w-5 h-5 text-[#38BDF8]" />
            <h4 className="font-bold text-sm sm:text-base text-white">معاينة قبل الاستلام والدفع</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              افتح أوردرك وعاين جودة الخامة والمقاس قبل دفع مليم واحد للمندوب، مع الدفع عند الاستلام أو إنستاباي.
            </p>
          </div>
          <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <RotateCcw className="w-5 h-5 text-[#38BDF8]" />
            <h4 className="font-bold text-sm sm:text-base text-white">استبدال واسترجاع سهل</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              لو المقاس مش مظبوط بنستبدلهولك في نفس اليوم بدون أي تعقيدات وبأسرع وقت.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. FOOTER */}
      {/* ======================================================== */}
      <footer id="contact" className={`${isMockup ? 'py-8 px-4' : 'py-12 px-6 max-w-7xl mx-auto'} border-t border-white/10 text-center space-y-3`}>
        <div className="font-mono font-black text-xl sm:text-2xl tracking-widest text-white uppercase">
          CTRL YZ
        </div>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          المتجر الرائد في مصر للملابس الأوفر سايز والستريت وير • القاهرة، مصر.
        </p>
        <div className="flex items-center justify-center gap-3 text-xs font-bold text-slate-400 flex-wrap">
          <span>خدمة العملاء: 01012345678</span>
          <span>•</span>
          <span>دعم فوري 24 ساعة عبر واتساب</span>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* 9. FLOATING BOTTOM CART BAR */}
      {/* ======================================================== */}
      {activeCart.length > 0 && (
        <div className={`fixed ${isMockup ? 'bottom-2 inset-x-2 max-w-sm' : 'bottom-6 inset-x-4 max-w-lg'} z-40 mx-auto animate-bounceIn`}>
          <div className={`bg-slate-900/95 backdrop-blur-xl border border-white/20 ${isMockup ? 'rounded-2xl p-2.5' : 'rounded-3xl p-4'} shadow-2xl flex items-center justify-between gap-2.5`}>
            {/* Thumbnails */}
            <div className="flex items-center -space-x-2.5 overflow-x-auto pr-1 scrollbar-none">
              {activeCart.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className={`${isMockup ? 'w-8 h-8' : 'w-11 h-11'} rounded-full border-2 border-slate-900 overflow-hidden relative shrink-0 shadow-md`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <span className="text-[11px] font-mono font-bold text-slate-300 pr-2 whitespace-nowrap">
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
              className={`${isMockup ? 'px-3.5 py-2 text-[11px]' : 'px-6 py-3 text-xs'} rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-black font-black uppercase tracking-wider transition-transform active:scale-95 shadow-md shadow-[#38BDF8]/20 shrink-0 flex items-center gap-1.5`}
            >
              <span>إتمام الطلب • {cartTotal} EGP</span>
              <ArrowRight className="w-3 h-3 -scale-x-100" />
            </button>
          </div>
        </div>
      )}

      {/* Cart Added Toast */}
      {addedToast && (
        <div className="fixed top-16 inset-x-4 max-w-xs mx-auto z-50 bg-[#38BDF8] text-black font-black text-xs py-2.5 px-3.5 rounded-xl shadow-2xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>تمت الإضافة لحقيبة التسوق!</span>
          </div>
        </div>
      )}
    </div>
  );
};
