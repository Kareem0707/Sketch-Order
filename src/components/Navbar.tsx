import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  ShoppingBag,
  Menu,
  X,
  Hammer,
  ShieldCheck,
  Store,
  Grid,
  Sun,
  Moon,
} from 'lucide-react';
import { HandDrawnDivider } from './common/HandDrawnDivider';
import { playClick, playPencilScratch, setSoundEnabled, getSoundEnabled } from '../utils/soundEffects';
import logoImg from '../assets/sketch-order-logo.png';
import mascotImg from '../assets/sketch-mascot.png';

interface NavbarProps {
  onOpenOrderModal: () => void;
  onOpenStudio: () => void;
  onOpenTemplates: () => void;
  onOpenOwnerAdmin: () => void;
  onOpenMerchantPortal: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOrderModal,
  onOpenStudio,
  onOpenTemplates,
  onOpenOwnerAdmin,
  onOpenMerchantPortal,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [soundOn, setSoundOn] = useState(getSoundEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasActiveMerchantStore, setHasActiveMerchantStore] = useState<boolean>(true);

  // Check if any tenant store is activated
  useEffect(() => {
    try {
      const raw = localStorage.getItem('sketch_tenant_stores');
      if (raw) {
        const parsed = JSON.parse(raw);
        setHasActiveMerchantStore(Object.keys(parsed).length > 0);
      }
    } catch {
      setHasActiveMerchantStore(true);
    }
  }, []);

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
    <header
      className={`sticky top-0 z-40 select-none border-b transition-colors duration-200 ${
        isDarkMode
          ? 'bg-[#0B0F17]/95 border-slate-800 text-white shadow-md'
          : 'bg-white/95 border-[#0F0F0F]/15 text-[#0F0F0F] shadow-xs'
      } backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Single-Row Navigation Bar */}
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo & Brand Mascot */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              playClick();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group shrink-0"
          >
            {/* Mascot Head */}
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 border-2 sketch-border-circle p-0.5 flex items-center justify-center sketch-shadow-sm group-hover:rotate-3 transition-transform overflow-hidden ${
                isDarkMode ? 'border-slate-600 bg-slate-900' : 'border-[#0F0F0F] bg-white'
              }`}
            >
              <img
                src={mascotImg}
                alt="سكتش مان"
                className="w-full h-full object-contain -translate-y-0.5 scale-125"
              />
            </div>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <img
                src={logoImg}
                alt="SKETCH ORDER"
                className={`h-7 sm:h-8 object-contain ${isDarkMode ? 'invert' : ''}`}
              />
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm hidden sm:inline border ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300'
                    : 'bg-neutral-100 border-[#0F0F0F]/30 text-[#0F0F0F]/70'
                }`}
              >
                مصر 🇪🇬
              </span>
            </div>
          </a>

          {/* Practical Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-4 text-xs font-bold">
            {/* Full Templates Showcase */}
            <button
              onClick={() => {
                playClick();
                onOpenTemplates();
              }}
              className="px-3 py-1.5 rounded-xl border border-inherit/30 hover:border-orange-500 hover:text-orange-500 transition-colors flex items-center gap-1.5"
            >
              <Grid className="w-3.5 h-3.5 text-orange-500" />
              <span>كتالوج القوالب (8 تيمبليتس)</span>
            </button>

            {/* Studio Button */}
            <button
              onClick={() => {
                playClick();
                onOpenStudio();
              }}
              className="font-black px-3 py-1.5 border-2 border-[#0F0F0F] sketch-border-tag bg-[#0F0F0F] text-white hover:bg-neutral-800 transition-all flex items-center gap-1.5 sketch-shadow-sm -rotate-1"
            >
              <Hammer className="w-3.5 h-3.5 text-emerald-400" />
              <span>استوديو الآيفون</span>
            </button>

            <button
              onClick={() => handleNavClick('story-chaos')}
              className="hover:underline underline-offset-4 transition-all opacity-80 hover:opacity-100"
            >
              قبل وبعد سيستم الويبسايت
            </button>

            <button
              onClick={() => handleNavClick('split-simulator')}
              className="hover:underline underline-offset-4 transition-all opacity-80 hover:opacity-100"
            >
              المقارنة الحية (Before & After)
            </button>

            <button
              onClick={() => handleNavClick('pricing-plans')}
              className="font-black hover:underline underline-offset-4 transition-all text-emerald-600 dark:text-emerald-400"
            >
              الباقات والأسعار (3 باقات)
            </button>

            <button
              onClick={() => handleNavClick('store-playground')}
              className="hover:underline underline-offset-4 transition-all opacity-80 hover:opacity-100"
            >
              المتجر التجريبي
            </button>
          </nav>

          {/* Action CTAs & Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* 1. Client Merchant Portal Icon (with live notification badge) */}
            <button
              onClick={() => {
                playClick();
                onOpenMerchantPortal();
              }}
              className={`relative px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all ${
                isDarkMode
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 hover:bg-indigo-600/30'
                  : 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100'
              }`}
              title="دخول لوحة تحكم المتجر للتاجر"
            >
              <Store className="w-4 h-4 text-indigo-500" />
              <span className="hidden sm:inline">بوابة التاجر</span>
              {hasActiveMerchantStore && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </button>

            {/* 2. Platform Owner Admin Dashboard Button */}
            <button
              onClick={() => {
                playClick();
                onOpenOwnerAdmin();
              }}
              className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 border rounded-xl text-xs font-black transition-all ${
                isDarkMode
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
              title="لوحة تحكم إدارة الطلبات وقبول التحويلات"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>لوحة الإدارة</span>
            </button>

            {/* 3. Dark Mode Toggle Button */}
            <button
              onClick={() => {
                playClick();
                onToggleDarkMode();
              }}
              className={`p-2 rounded-xl border transition-all ${
                isDarkMode
                  ? 'bg-amber-500/10 border-amber-400/50 text-amber-400 hover:bg-amber-500/20'
                  : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
              }`}
              title={isDarkMode ? 'التبديل للوضع النهاري (Light)' : 'التبديل للوضع الليلي (Dark)'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* 4. Order CTA Button */}
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
              className="hidden lg:flex p-1.5 border-2 border-inherit/40 sketch-border-circle hover:bg-neutral-500/10 active:scale-95 transition-all"
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-50" />}
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => {
                playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="xl:hidden p-1.5 border-2 border-inherit/40 sketch-border-1 bg-inherit"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            className={`xl:hidden border-t-2 py-3 px-2 space-y-2 sketch-border-2 my-2 border-2 sketch-shadow transition-colors ${
              isDarkMode ? 'bg-[#111827] border-slate-700 text-white' : 'bg-white border-[#0F0F0F] text-[#0F0F0F]'
            }`}
          >
            <button
              onClick={() => {
                playClick();
                setMobileMenuOpen(false);
                onOpenTemplates();
              }}
              className="w-full text-right p-2.5 text-xs font-black bg-orange-500 text-slate-950 flex items-center justify-between rounded-xl"
            >
              <span className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                <span>كتالوج التيمبليتس الكامل (8 قوالب جاهزة)</span>
              </span>
              <span className="text-[10px] bg-slate-950 text-white px-2 py-0.5 rounded-full font-bold">صفحة كاملة</span>
            </button>

            <button
              onClick={() => {
                playClick();
                setMobileMenuOpen(false);
                onOpenStudio();
              }}
              className="w-full text-right p-2.5 text-xs font-black bg-slate-900 text-white flex items-center justify-between rounded-xl"
            >
              <span className="flex items-center gap-2">
                <Hammer className="w-4 h-4 text-emerald-400" />
                <span>استوديو الآيفون 13 برو التفاعلي</span>
              </span>
              <span className="text-[10px] bg-emerald-500 text-slate-900 px-2 py-0.5 rounded-full font-bold">جرّب لايف</span>
            </button>

            <button
              onClick={() => {
                playClick();
                setMobileMenuOpen(false);
                onOpenMerchantPortal();
              }}
              className="w-full text-right p-2.5 text-xs font-black bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 rounded-xl flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                <span>بوابة التاجر (لوحة تحكم متجرك المستقل)</span>
              </span>
              <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">نشط 🟢</span>
            </button>

            <button
              onClick={() => {
                playClick();
                setMobileMenuOpen(false);
                onOpenOwnerAdmin();
              }}
              className="w-full text-right p-2.5 text-xs font-black bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>لوحة إدارة المنصة والطلبات (Owner Admin)</span>
              </span>
            </button>

            <div className="pt-2 border-t border-inherit/20 space-y-1">
              <button
                onClick={() => handleNavClick('story-chaos')}
                className="w-full text-right p-2 text-xs font-bold hover:bg-neutral-500/10 rounded-lg"
              >
                📖 قبل وبعد سيستم الويبسايت
              </button>
              <button
                onClick={() => handleNavClick('split-simulator')}
                className="w-full text-right p-2 text-xs font-bold hover:bg-neutral-500/10 rounded-lg"
              >
                ✂️ المقارنة الحية (Before & After)
              </button>
              <button
                onClick={() => handleNavClick('pricing-plans')}
                className="w-full text-right p-2 text-xs font-black text-emerald-500 hover:bg-neutral-500/10 rounded-lg"
              >
                💰 الباقات الـ 3 والأسعار الرسمية
              </button>
              <button
                onClick={() => handleNavClick('store-playground')}
                className="w-full text-right p-2 text-xs font-bold hover:bg-neutral-500/10 rounded-lg"
              >
                🛍️ المتجر التجريبي
              </button>
            </div>
          </div>
        )}
      </div>

      <HandDrawnDivider variant="squiggly" height={10} className="my-0" />
    </header>
  );
};
