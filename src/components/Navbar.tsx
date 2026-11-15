import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  ShoppingBag,
  Menu,
  X,
  Grid,
  ShieldCheck,
  Store,
  Sun,
  Moon,
} from 'lucide-react';
import { HandDrawnDivider } from './common/HandDrawnDivider';
import { playClick, playPencilScratch, setSoundEnabled, getSoundEnabled } from '../utils/soundEffects';
import { isDeviceAdminAuthenticated } from './SecretAdminGateModal';
import brushLogoBlack from '../assets/sketch-brush-logo-black.png';
import brushLogoWhite from '../assets/sketch-brush-logo-white.png';

interface NavbarProps {
  onOpenOrderModal: () => void;
  onOpenStudio: () => void;
  onOpenTemplates: () => void;
  onOpenOwnerAdmin: () => void;
  onOpenMerchantPortal: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isAdminAuthenticated?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOrderModal,
  onOpenStudio: _onOpenStudio,
  onOpenTemplates,
  onOpenOwnerAdmin,
  onOpenMerchantPortal,
  isDarkMode,
  onToggleDarkMode,
  isAdminAuthenticated: propIsAdmin,
}) => {
  const [soundOn, setSoundOn] = useState(getSoundEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasActiveMerchantStore, setHasActiveMerchantStore] = useState<boolean>(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => isDeviceAdminAuthenticated());

  // Listen for admin auth updates and storage events
  useEffect(() => {
    if (typeof propIsAdmin !== 'undefined') {
      setIsAdminAuthenticated(propIsAdmin);
    }
  }, [propIsAdmin]);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdminAuthenticated(isDeviceAdminAuthenticated());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
          : 'bg-[#FAF8F5]/95 border-[#0F0F0F]/15 text-[#0F0F0F] shadow-xs'
      } backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Single-Row Clean Navigation Bar */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* 1. Official Brush Typography Logo (Character & Egypt removed as requested) */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              playClick();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group shrink-0 focus:outline-hidden"
            title="سكتش أوردر - الرئيسية"
          >
            <img
              src={isDarkMode ? brushLogoWhite : brushLogoBlack}
              alt="SKETCH ORDER"
              className="h-10 sm:h-12 md:h-13 object-contain transition-transform group-hover:scale-105"
            />
          </a>

          {/* 2. Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-bold">
            {/* Dedicated Templates Showcase Link */}
            <button
              onClick={() => {
                playClick();
                if (onOpenTemplates) onOpenTemplates();
              }}
              className="font-black px-4 py-2 border-2 border-[#D9722B] dark:border-[#D9722B]/60 sketch-border-tag bg-[#D9722B]/10 hover:bg-[#C25E1D] text-[#D9722B] dark:text-[#E88B4D] hover:text-slate-950 transition-all flex items-center gap-1.5 sketch-shadow-sm -rotate-1 active:scale-95"
              title="تصفح جميع قوالب المتاجر في صفحة كاملة"
            >
              <Grid className="w-4 h-4" />
              <span>قوالب المتاجر</span>
            </button>

            <button
              onClick={() => handleNavClick('story-chaos')}
              className="hover:underline underline-offset-4 transition-all text-slate-700 dark:text-slate-200 hover:text-[#D9722B] dark:text-[#E88B4D] dark:hover:text-zinc-400"
            >
              قبل وبعد
            </button>

            <button
              onClick={() => handleNavClick('core-features')}
              className="hover:underline underline-offset-4 transition-all text-slate-700 dark:text-slate-200 hover:text-[#D9722B] dark:text-[#E88B4D]"
            >
              المميزات
            </button>

            <button
              onClick={() => handleNavClick('blog-section')}
              className="hover:underline underline-offset-4 transition-all text-slate-700 dark:text-slate-200 hover:text-[#D9722B] dark:text-[#E88B4D]"
            >
              المدونة
            </button>

            <button
              onClick={() => handleNavClick('pricing-plans')}
              className="font-black hover:underline underline-offset-4 transition-all text-[#D9722B] dark:text-[#E88B4D]"
            >
              الباقات والأسعار
            </button>

            <button
              onClick={() => handleNavClick('store-playground')}
              className="hover:underline underline-offset-4 transition-all text-slate-700 dark:text-slate-200 hover:text-[#D9722B] dark:text-[#E88B4D] dark:hover:text-zinc-400"
            >
              المتجر التجريبي
            </button>
          </nav>

          {/* 3. Action Buttons (Clean, Sketch-Styled, No Duplicate Words) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Merchant Portal (Sketch-Styled Icon/Badge Button) */}
            <button
              onClick={() => {
                playClick();
                onOpenMerchantPortal();
              }}
              className={`relative p-2 sm:px-3 sm:py-1.5 border-2 sketch-border-2 flex items-center gap-1.5 text-xs font-black transition-all ${
                isDarkMode
                  ? 'border-slate-700 bg-slate-900 text-slate-200 hover:border-[#D9722B] dark:border-[#D9722B]/60 hover:text-zinc-400'
                  : 'border-[#0F0F0F] bg-white text-[#0F0F0F] hover:bg-neutral-50 sketch-shadow-sm'
              }`}
              title="بوابة التاجر - لوحة تحكم المتجر"
            >
              <Store className="w-4 h-4 text-[#D9722B] dark:text-[#E88B4D]" />
              <span className="hidden md:inline">بوابة التاجر</span>
              {hasActiveMerchantStore && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9722B] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D9722B]"></span>
                </span>
              )}
            </button>

            {/* Owner Admin: Hidden from public, ONLY visible on devices authenticated via the secret link */}
            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  playClick();
                  onOpenOwnerAdmin();
                }}
                className={`relative p-2 border-2 sketch-border-circle flex items-center justify-center transition-all animate-in fade-in zoom-in-90 ${
                  isDarkMode
                    ? 'border-amber-500/80 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                    : 'border-amber-600 bg-amber-50 text-amber-700 hover:bg-amber-100 sketch-shadow-sm'
                }`}
                title="لوحة تحكم المنصة والطلبات (جلسة سرية موثقة على هذا الجهاز)"
                aria-label="لوحة تحكم المنصة"
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-slate-900"></span>
              </button>
            )}

            {/* Sketch-Styled Theme Toggle Button */}
            <button
              onClick={() => {
                playClick();
                onToggleDarkMode();
              }}
              className={`p-2 border-2 sketch-border-circle flex items-center justify-center transition-all hover:rotate-12 ${
                isDarkMode
                  ? 'border-[#D9722B] dark:border-[#D9722B]/60/60 bg-slate-900 text-zinc-400 hover:bg-slate-800'
                  : 'border-[#0F0F0F] bg-white text-[#0F0F0F] hover:bg-neutral-50 sketch-shadow-sm'
              }`}
              title={isDarkMode ? 'التبديل للوضع النهاري' : 'التبديل للوضع الليلي'}
              aria-label="تبديل الثيم"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-zinc-400" /> : <Moon className="w-4 h-4 text-[#0F0F0F]" />}
            </button>

            {/* Sound FX Toggle Button */}
            <button
              onClick={toggleSound}
              title={soundOn ? 'المؤثرات الصوتية مفعلة (اضغط للكتم)' : 'المؤثرات الصوتية مكتومة (اضغط للتفعيل)'}
              className={`hidden sm:flex items-center justify-center p-2 border-2 sketch-border-circle transition-all ${
                soundOn
                  ? 'border-[#D9722B] dark:border-[#D9722B]/60/50 text-[#D9722B] dark:text-[#E88B4D] bg-[#D9722B]/10'
                  : isDarkMode
                  ? 'border-slate-700 text-slate-500 hover:text-slate-300'
                  : 'border-[#0F0F0F]/30 text-slate-400 hover:text-slate-600'
              }`}
              aria-label="المؤثرات الصوتية"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-[#D9722B] dark:text-[#E88B4D]" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Main Order CTA Button */}
            <button
              onClick={() => {
                playClick();
                onOpenOrderModal();
              }}
              className="btn-sketch btn-sketch-primary text-xs sm:text-sm py-1.5 px-2.5 sm:px-4 whitespace-nowrap -rotate-1 active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">امتلك متجرك الآن</span>
              <span className="sm:hidden">امتلك متجرك</span>
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => {
                playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className={`lg:hidden p-2 border-2 sketch-border-1 transition-all ${
                isDarkMode ? 'border-slate-700 bg-slate-900 text-white' : 'border-[#0F0F0F] bg-white text-[#0F0F0F] sketch-shadow-sm'
              }`}
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Clean, No Emojis, No Clutter) */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-2 py-3 px-3 space-y-2 sketch-border-2 my-2 sketch-shadow transition-colors ${
              isDarkMode ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-white border-[#0F0F0F] text-[#0F0F0F]'
            }`}
          >
            <button
              onClick={() => {
                playClick();
                setMobileMenuOpen(false);
                onOpenTemplates();
              }}
              className="w-full text-right p-3 text-xs font-black bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white flex items-center justify-between rounded-xl shadow-sm"
            >
              <span className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                <span>قوالب المتاجر</span>
              </span>
              <span className="text-[10px] bg-slate-950 text-white px-2 py-0.5 rounded-full font-bold">8 قوالب</span>
            </button>

            <button
              onClick={() => {
                playClick();
                setMobileMenuOpen(false);
                onOpenMerchantPortal();
              }}
              className="w-full text-right p-2.5 text-xs font-black bg-slate-800 text-slate-200 border border-slate-700 rounded-xl flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Store className="w-4 h-4 text-zinc-400" />
                <span>بوابة التاجر (لوحة تحكم المتجر)</span>
              </span>
              <span className="text-[10px] bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white px-2 py-0.5 rounded-full font-bold">نشط</span>
            </button>

            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  playClick();
                  setMobileMenuOpen(false);
                  onOpenOwnerAdmin();
                }}
                className="w-full text-right p-2.5 text-xs font-black bg-amber-500/15 text-amber-400 border border-amber-500/40 rounded-xl flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>لوحة تحكم المنصة والطلبات (مدير مسجل)</span>
                </span>
                <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  Admin
                </span>
              </button>
            )}

            <div className="pt-2 border-t border-slate-700/40 space-y-1">
              <button
                onClick={() => handleNavClick('story-chaos')}
                className="w-full text-right p-2 text-xs font-bold hover:bg-neutral-500/10 rounded-lg"
              >
                قبل وبعد سيستم الويبسايت
              </button>
              <button
                onClick={() => handleNavClick('split-simulator')}
                className="w-full text-right p-2 text-xs font-bold hover:bg-neutral-500/10 rounded-lg"
              >
                المقارنة الحية (Before & After)
              </button>
              <button
                onClick={() => handleNavClick('pricing-plans')}
                className="w-full text-right p-2 text-xs font-black text-[#D9722B] dark:text-[#E88B4D] hover:bg-neutral-500/10 rounded-lg"
              >
                الباقات والأسعار الرسمية
              </button>
              <button
                onClick={() => handleNavClick('store-playground')}
                className="w-full text-right p-2 text-xs font-bold hover:bg-neutral-500/10 rounded-lg"
              >
                المتجر التجريبي
              </button>
            </div>
          </div>
        )}
      </div>

      <HandDrawnDivider variant="squiggly" height={8} className="my-0" />
    </header>
  );
};
