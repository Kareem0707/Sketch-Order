import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Check, Printer } from 'lucide-react';
import type { StoreProduct, CartItem } from '../types';
import { HandDrawnDivider } from './common/HandDrawnDivider';
import { playClick, playPencilScratch, playPaperFlip } from '../utils/soundEffects';

const SAMPLE_PRODUCTS: StoreProduct[] = [
  {
    id: 'prod-notebook',
    name: 'كشكول أفكار سكتش كرافت A5',
    category: 'أدوات مكتبية',
    description: 'ورق خشن 120 جرام مناسب للرسم بالقلم الجاف والرصاص بدون تسريب الحبر.',
    price: 85,
    tag: 'الأكثر طلباً ⭐',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    sketchSvg: 'notebook',
  },
  {
    id: 'prod-pen',
    name: 'قلم حبر جاف أسود 0.7mm للمخططات',
    category: 'أقلام ورسم',
    description: 'ريشة دقيقة للخطوط الحادة والرسوم الكرتونية الثابتة المقاومة للماء.',
    price: 45,
    tag: 'حبر مقاوم للماء',
    imageUrl: 'https://images.unsplash.com/photo-1585336261026-c7bc6e088711?w=600&auto=format&fit=crop&q=80',
    sketchSvg: 'pen',
  },
  {
    id: 'prod-tshirt',
    name: 'تيشرت ستيك مان قطن مصري 100%',
    category: 'ملابس كاجوال',
    description: 'قطن طبيعي مصري فاخر مع طباعة شاشة يدوية لشخصية سكتش أوردر.',
    price: 390,
    tag: 'إصدار محدود 🔥',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    sketchSvg: 'tshirt',
  },
  {
    id: 'prod-mug',
    name: 'مج فخار يدوي من قرية تونس بالفيوم',
    category: 'أكواب وفخار',
    description: 'مج 350ml مع رسمة كرتونية لستيك مان يرتشف القهوة بهدوء في وسط البلد.',
    price: 150,
    tag: 'صناعة يدوية',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    sketchSvg: 'mug',
  },
];

export const StorePlayground: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([
    { ...SAMPLE_PRODUCTS[0], quantity: 1 },
  ]);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [customerPhone, setCustomerPhone] = useState<string>('01012345678');
  const [customerName, setCustomerName] = useState<string>('كريم الدسوقي');

  const addToCart = (product: StoreProduct) => {
    playPencilScratch();
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    playClick();
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    playClick();
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    playPaperFlip();
    setShowReceiptModal(true);
  };

  return (
    <section id="store-playground" className="py-16 paper-pattern relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-block border-2 border-[#0F0F0F] bg-white px-3 py-1 sketch-border-tag text-xs font-black -rotate-1 mb-3 sketch-shadow-sm">
            🛍️ محاكي المتجر الحي • جرب الشراء دلوقتي
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight mb-4 text-[#0F0F0F]">
            متجرك المستقل هيكون بالشياكة والسرعة دي
          </h2>

          <p className="text-base sm:text-lg font-bold text-[#0F0F0F]/80">
            ضيف منتجات للسلة، جرب سلاسة الحسابات التلقائية، ودوس "إتمام الطلب" عشان تشوف إزاي بيوصلك إيصال ورقي مفصص على الواتساب فورياً!
          </p>
        </div>

        {/* Device Frame */}
        <div className="max-w-5xl mx-auto border-3 md:border-4 border-[#0F0F0F] sketch-border-1 bg-white sketch-shadow-xl overflow-hidden">
          
          {/* Device Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b-2 sm:border-b-3 border-[#0F0F0F] bg-neutral-50">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[#0F0F0F] bg-[#0F0F0F]"></span>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[#0F0F0F] bg-white"></span>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[#0F0F0F] bg-white"></span>
            </div>

            <div className="border-2 border-[#0F0F0F] px-4 py-1 sketch-border-pill bg-white text-xs font-mono font-bold">
              https://demo.sketch-order.store/shop
            </div>

            <div className="flex items-center gap-2 font-mono text-xs font-bold">
              <span className="hidden sm:inline">LIVE SIMULATION • مصر</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F0F0F] animate-pulse"></span>
            </div>
          </div>

          {/* Store Interactive Body */}
          <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Products Grid */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-[#0F0F0F] pb-2">
                <h3 className="text-xl font-black font-heading">
                  📦 قائمة المنتجات الجاهزة
                </h3>
                <span className="text-xs font-bold text-[#0F0F0F]/70 font-mono">
                  4 منتجات متوفرة للشحن
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SAMPLE_PRODUCTS.map((prod) => (
                  <div
                    key={prod.id}
                    className="border-2 border-[#0F0F0F] p-4 sketch-border-2 bg-white sketch-shadow-sm hover:sketch-shadow transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Product Thumbnail Doodle */}
                      <div className="h-32 border-2 border-dashed border-[#0F0F0F] sketch-border-3 bg-[#FAF9F6] flex items-center justify-center mb-3">
                        {prod.sketchSvg === 'notebook' && (
                          <svg viewBox="0 0 100 80" className="w-20 h-20" fill="none">
                            <rect x="20" y="10" width="55" height="60" stroke="#0F0F0F" strokeWidth="2.5" fill="#FFFFFF" rx="2" />
                            <line x1="28" y1="10" x2="28" y2="70" stroke="#0F0F0F" strokeWidth="2.5" />
                            <line x1="38" y1="25" x2="65" y2="25" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" />
                            <line x1="38" y1="35" x2="65" y2="35" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" />
                            <line x1="38" y1="45" x2="55" y2="45" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        )}

                        {prod.sketchSvg === 'pen' && (
                          <svg viewBox="0 0 100 80" className="w-20 h-20" fill="none">
                            <g transform="rotate(45 50 40)">
                              <rect x="25" y="34" width="50" height="10" stroke="#0F0F0F" strokeWidth="2.2" fill="#FFFFFF" />
                              <polygon points="75,34 90,39 75,44" stroke="#0F0F0F" strokeWidth="2.2" fill="#0F0F0F" />
                              <rect x="20" y="34" width="5" height="10" stroke="#0F0F0F" strokeWidth="2" fill="#0F0F0F" />
                            </g>
                          </svg>
                        )}

                        {prod.sketchSvg === 'tshirt' && (
                          <svg viewBox="0 0 100 80" className="w-20 h-20" fill="none">
                            <path
                              d="M30 20 L 40 28 Q 50 32 60 28 L 70 20 L 85 32 L 75 42 L 72 38 L 72 70 L 28 70 L 28 38 L 25 42 L 15 32 Z"
                              stroke="#0F0F0F"
                              strokeWidth="2.5"
                              fill="#FFFFFF"
                              strokeLinejoin="round"
                            />
                            <circle cx="50" cy="46" r="4" stroke="#0F0F0F" strokeWidth="1.5" />
                            <line x1="50" y1="50" x2="50" y2="60" stroke="#0F0F0F" strokeWidth="1.5" />
                            <line x1="50" y1="54" x2="44" y2="52" stroke="#0F0F0F" strokeWidth="1.5" />
                            <line x1="50" y1="54" x2="56" y2="52" stroke="#0F0F0F" strokeWidth="1.5" />
                          </svg>
                        )}

                        {prod.sketchSvg === 'mug' && (
                          <svg viewBox="0 0 100 80" className="w-20 h-20" fill="none">
                            <rect x="30" y="25" width="40" height="42" rx="4" stroke="#0F0F0F" strokeWidth="2.5" fill="#FFFFFF" />
                            <path d="M70 34 Q 86 40 70 54" stroke="#0F0F0F" strokeWidth="2.5" fill="none" />
                            <path d="M42 16 Q 44 12 42 8" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" />
                            <path d="M50 16 Q 52 12 50 8" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" />
                            <path d="M58 16 Q 60 12 58 8" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>

                      {/* Tag & Title */}
                      <span className="inline-block text-[10px] font-bold border border-[#0F0F0F] px-2 py-0.5 sketch-border-pill mb-1">
                        {prod.tag}
                      </span>

                      <h4 className="text-base font-black font-heading leading-tight mb-1">
                        {prod.name}
                      </h4>

                      <p className="text-xs font-bold text-[#0F0F0F]/70 mb-3">
                        {prod.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#0F0F0F] pt-3">
                      <span className="text-lg font-black font-mono">
                        {prod.price} <span className="text-xs">ج.م</span>
                      </span>

                      <button
                        onClick={() => addToCart(prod)}
                        className="btn-sketch text-xs py-1.5 px-3 -rotate-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>أضف للسلة</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Right Mini Cart & Direct Order Flow */}
            <div className="lg:col-span-4 border-2 border-[#0F0F0F] p-5 sketch-border-1 bg-[#FAF9F6] sketch-shadow-sm flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between border-b-2 border-[#0F0F0F] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    <h3 className="text-lg font-black font-heading">
                      سلة التسوق ({totalItemsCount})
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold bg-[#0F0F0F] text-white px-2 py-0.5 sketch-border-pill">
                    INSTANT CART
                  </span>
                </div>

                {cart.length === 0 ? (
                  <div className="py-12 text-center text-sm font-bold text-[#0F0F0F]/60">
                    السلة فاضية حالياً ✏️<br />
                    ضيف منتجات عشان تجرب الأوردر!
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="border border-[#0F0F0F] p-2.5 sketch-border-tag bg-white flex items-center justify-between gap-2"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-black truncate">{item.name}</div>
                          <div className="text-xs font-mono font-bold text-[#0F0F0F]/75">
                            {item.price * item.quantity} ج.م
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 border border-[#0F0F0F] sketch-border-circle flex items-center justify-center hover:bg-neutral-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-black w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 border border-[#0F0F0F] sketch-border-circle flex items-center justify-center hover:bg-neutral-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 hover:text-red-700 ml-1"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Summary & Checkout */}
              <div className="border-t-2 border-[#0F0F0F] pt-4 mt-4 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span>المجموع الفرعي:</span>
                  <span className="font-mono font-black">{cartTotal} ج.م</span>
                </div>

                <div className="flex justify-between items-center text-sm font-bold">
                  <span>الشحن (القاهرة والجيزة):</span>
                  <span className="font-mono font-black text-xs bg-white border border-[#0F0F0F] px-1.5 py-0.5 sketch-border-pill">
                    مجاني (عرض تجريبي)
                  </span>
                </div>

                <div className="flex justify-between items-baseline text-lg font-black font-heading border-t border-dashed border-[#0F0F0F] pt-2">
                  <span>الإجمالي:</span>
                  <span className="font-mono text-2xl">{cartTotal} ج.م</span>
                </div>

                <button
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                  className="btn-sketch btn-sketch-primary w-full py-3 -rotate-1 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>إتمام الأوردر السكتش</span>
                </button>

                <div className="text-[11px] font-mono text-center text-[#0F0F0F]/70">
                  * هيتولد إيصال استلام ورقي فوري جاهز للطباعة
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* RECEIPT / INVOICE MODAL */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
          <div className="relative max-w-md w-full bg-white border-3 border-[#0F0F0F] sketch-border-1 p-6 sm:p-8 sketch-shadow-xl animate-wobble-slow">
            
            <div className="text-center border-b-2 border-dashed border-[#0F0F0F] pb-4 mb-4">
              <div className="w-10 h-10 border-2 border-[#0F0F0F] sketch-border-circle mx-auto mb-2 flex items-center justify-center font-bold text-lg">
                ✓
              </div>
              <h3 className="text-2xl font-black font-heading">
                إيصال استلام أوردر ورقي
              </h3>
              <p className="text-xs font-mono font-bold text-[#0F0F0F]/70">
                RECEIPT #EG-9042 • {new Date().toLocaleDateString('ar-EG')}
              </p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm font-bold">
              <div className="flex items-center justify-between">
                <span className="text-[#0F0F0F]/70">اسم العميل:</span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="border-b border-dashed border-[#0F0F0F] text-right font-bold text-xs p-1 focus:outline-hidden"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#0F0F0F]/70">رقم الموبايل:</span>
                <input
                  type="text"
                  dir="ltr"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="border-b border-dashed border-[#0F0F0F] text-right font-mono font-bold text-xs p-1 focus:outline-hidden"
                />
              </div>
              <div className="flex justify-between">
                <span className="text-[#0F0F0F]/70">طريقة التحويل:</span>
                <span>إنستاباي فوري + كاش عند الاستلام</span>
              </div>

              <div className="border-t border-b border-[#0F0F0F] py-2 my-2 space-y-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between font-mono text-xs">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{item.price * item.quantity} ج.م</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-base font-black font-heading pt-1">
                <span>المبلغ الإجمالي:</span>
                <span className="font-mono text-xl">{cartTotal} ج.م</span>
              </div>
            </div>

            <div className="my-5 text-center">
              <div className="flex items-center justify-center gap-1 h-10 text-[#0F0F0F] overflow-hidden">
                {[4, 1, 3, 2, 5, 1, 4, 2, 6, 1, 3, 2, 4, 1, 5, 2, 3, 4, 1, 2, 6, 2].map(
                  (w, idx) => (
                    <div
                      key={idx}
                      className="h-full bg-[#0F0F0F]"
                      style={{ width: `${w}px` }}
                    ></div>
                  )
                )}
              </div>
              <span className="font-mono text-[10px] tracking-widest text-[#0F0F0F]/75">
                *SKETCH-EG-VERIFIED*
              </span>
            </div>

            <div className="border-2 border-[#0F0F0F] p-2 sketch-border-2 text-center text-xs font-black -rotate-3 bg-neutral-100">
              STAMP: معتمد لدى إدارة الشحن والمبيعات بمصر ✓
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  playClick();
                  window.print();
                }}
                className="btn-sketch text-xs py-2 px-3 flex-1"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الإيصال</span>
              </button>

              <button
                onClick={() => {
                  playClick();
                  setShowReceiptModal(false);
                }}
                className="btn-sketch btn-sketch-primary text-xs py-2 px-4"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

      <HandDrawnDivider variant="torn" height={16} className="mt-14 mb-2" />
    </section>
  );
};
