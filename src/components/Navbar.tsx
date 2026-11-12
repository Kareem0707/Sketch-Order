import React, { useState } from 'react';
import { Volume2, VolumeX, ShoppingBag, Menu, X, Hammer } from 'lucide-react';
import { HandDrawnDivider } from './common/HandDrawnDivider';
import { playClick, playPencilScratch, setSoundEnabled, getSoundEnabled } from '../utils/soundEffects';
import logoImg from '../assets/sketch-order-logo.png';
import mascotImg from '../assets/sketch-mascot.png';

interface NavbarProps {
  onOpenOrderModal: () => void;
  onOpenStudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOrderModal,
  onOpenStudio,
}) => {
  const [soundOn, setSoundOn] = useState(getSoundEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playPencilScratch();
  };

  const handleNavClick = (id: string) => {
    playClick();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs select-none border-b border-[#0F0F0F]/15">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Compact Single-Row Navigation Bar */}
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo & Brand Mascot: strictly single line on mobile */}
          <a
            href="#"
            onClick={() => playClick()}
            className="flex items-center gap-2 group text-[#0F0F0F] shrink-0"
          >
            {/* Official Character Mascot Head */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-[#0F0F0F] sketch-border-circle p-0.5 bg-white flex items-center justify-center sketch-shadow-sm group-hover:rotate-3 transition-transform overflow-hidden">
              <img
                src={mascotImg}
                alt="سكتش مان"
                className="w-full h-full object-contain -translate-y-0.5 scale-125"
              />
            </div>

            {/* Official Brand Logo */}
            <div className="flex items-center gap-2">
              <img
                src={logoImg}
                alt="SKETCH ORDER"
                className="h-7 sm:h-8 object-contain"
              />
              <span className="text-[10px] font-bold text-[#0F0F0F]/70 bg-neutral-100 border border-[#0F0F0F]/30 px-1.5 py-0.5 rounded-sm hidden sm:inline">
                مصر 🇪🇬
              </span>
            </div>
          </a>

          {/* Practical Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5">
            <button
              onClick={() => {
                playClick();
                onOpenStudio();
              }}
              className="font-black text-xs sm:text-sm px-3.5 py-1.5 border-2 border-[#0F0F0F] sketch-border-tag bg-[#0F0F0F] text-white hover:bg-neutral-800 transition-all flex items-center gap-1.5 sketch-shadow-sm -rotate-1"
            >
              <Hammer className="w-3.5 h-3.5 text-emerald-400" />
              <span>استوديو بناء المتجر والتيمبليتس</span>
            </button>

            <button
              onClick={() => handleNavClick('story-chaos')}
              className="font-bold text-xs sm:text-sm hover:underline underline-offset-4 decoration-wavy transition-all"
            >
              قبل وبعد سيستم الويبسايت
            </button>

            <button
              onClick={() => handleNavClick('split-simulator')}
              className="font-bold text-xs sm:text-sm hover:underline underline-offset-4 decoration-wavy transition-all"
            >
              المقارنة الحية (Before & After)
            </button>

            <button
              onClick={() => handleNavClick('pricing-plans')}
              className="font-black text-xs sm:text-sm hover:underline underline-offset-4 decoration-wavy transition-all text-emerald-700"
            >
              الباقات والأسعار (3 باقات)
            </button>

            <button
              onClick={() => handleNavClick('store-playground')}
              className="font-bold text-xs sm:text-sm hover:underline underline-offset-4 decoration-wavy transition-all"
            >
              المتجر التجريبي
            </button>
          </nav>

          {/* Action CTAs & Mobile Toggles: Single clean line */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Studio Quick Button for Mobile */}
            <button
              onClick={() => {
                playClick();
                onOpenStudio();
              }}
              className="lg:hidden px-2.5 py-1.5 border-2 border-[#0F0F0F] sketch-border-tag bg-[#0F0F0F] text-white text-xs font-bold flex items-center gap-1"
            >
              <Hammer className="w-3.5 h-3.5 text-emerald-400" />
              <span>الاستوديو</span>
            </button>

            {/* Order CTA Button */}
            <button
              onClick={() => {
                playClick();
                onOpenOrderModal();
              }}
              className="btn-sketch btn-sketch-primary text-xs sm:text-sm py-1.5 px-3 sm:px-4 whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">امتلك متجرك الآن</span>
              <span className="sm:hidden">اطلب</span>
            </button>

            {/* Sound FX Toggle (Desktop only) */}
            <button
              onClick={toggleSound}
              title={soundOn ? 'كتم المؤثرات الصوتية' : 'تفعيل المؤثرات الصوتية'}
              className="hidden sm:flex p-1.5 border-2 border-[#0F0F0F] sketch-border-circle bg-white hover:bg-neutral-100 sketch-shadow-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-50" />}
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => {
                playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-1.5 border-2 border-[#0F0F0F] sketch-border-1 bg-white sketch-shadow-sm"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-[#0F0F0F] py-3 bg-white px-2 space-y-2 sketch-border-2 my-2 border-2 sketch-shadow">
            <button
              onClick={() => {
                playClick();
                setMobileMenuOpen(false);
                onOpenStudio();
              }}
              className="w-full text-right p-3 font-black bg-[#0F0F0F] text-white flex items-center justify-between rounded-xl"
            >
              <span className="flex items-center gap-2">
                <Hammer className="w-4 h-4 text-emerald-400" />
                <span>استوديو بناء المتجر (تيمبليتس كاملة)</span>
              </span>
              <span className="text-xs bg-emerald-500 text-slate-900 px-2 py-0.5 rounded-full font-bold">جرّب لايف</span>
            </button>

            <button
              onClick={() => handleNavClick('story-chaos')}
              className="w-full text-right p-2 text-xs font-bold hover:bg-neutral-100 border-b border-[#0F0F0F]/15"
            >
              📖 قبل وبعد سيستم الويبسايت
            </button>

            <button
              onClick={() => handleNavClick('split-simulator')}
              className="w-full text-right p-2 text-xs font-bold hover:bg-neutral-100 border-b border-[#0F0F0F]/15"
            >
              ✂️ المقارنة الحية (Before & After)
            </button>

            <button
              onClick={() => handleNavClick('pricing-plans')}
              className="w-full text-right p-2 text-xs font-black text-emerald-700 hover:bg-neutral-100 border-b border-[#0F0F0F]/15"
            >
              💰 الباقات الـ 3 والأسعار الرسمية
            </button>

            <button
              onClick={() => handleNavClick('store-playground')}
              className="w-full text-right p-2 text-xs font-bold hover:bg-neutral-100"
            >
              🛍️ المتجر التجريبي
            </button>
          </div>
        )}
      </div>

      <HandDrawnDivider variant="squiggly" height={10} className="my-0" />
    </header>
  );
};
