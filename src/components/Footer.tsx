import React from 'react';
import { ArrowUp, Hammer, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import { HandDrawnDivider } from './common/HandDrawnDivider';
import { playClick } from '../utils/soundEffects';
import logoImg from '../assets/sketch-order-logo.png';
import mascotImg from '../assets/sketch-mascot.png';

interface FooterProps {
  onOpenOrderModal: () => void;
  onOpenStudio: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenOrderModal,
  onOpenStudio,
}) => {
  const scrollToTop = () => {
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-[#080C14] border-t-3 border-[#0F0F0F] dark:border-slate-800 pt-12 pb-8 paper-grid text-[#0F0F0F] dark:text-white select-none transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Brand Info & Mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-circle p-1 bg-white dark:bg-slate-900 flex items-center justify-center sketch-shadow-sm overflow-hidden">
                <img src={mascotImg} alt="سكتش مان" className="w-full h-full object-contain -translate-y-0.5 scale-125" />
              </div>
              <img src={logoImg} alt="SKETCH ORDER" className="h-8 object-contain dark:invert" />
            </div>

            <p className="text-sm font-bold text-[#0F0F0F]/80 dark:text-slate-300 max-w-sm leading-relaxed">
              بنصمم ونبرمج متجرك الإلكتروني المستقل بأسلوب مبتكر (مودرن، رياضي، دارك فاخر، أو سكتش مرسوم). تحكم كامل، داتابيز خاصة، واستقبال أوردرات أوتوماتيك بدون أي اشتراك شهري.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[#0F0F0F] dark:text-slate-300">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>دفع مرة واحدة</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ضمان مدى الحياة</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-orange-500">
                <Zap className="w-3.5 h-3.5" />
                <span>تواصل فوري مع الدعم</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-base font-black font-heading border-b-2 border-[#0F0F0F] dark:border-slate-700 pb-1 inline-block text-[#0F0F0F] dark:text-white">
              أقسام المنصة
            </h4>
            <ul className="space-y-2 text-xs font-bold text-[#0F0F0F]/80 dark:text-slate-300">
              <li>
                <a href="#story-chaos" className="hover:underline">
                  • قبل وبعد سيستم الويبسايت
                </a>
              </li>
              <li>
                <a href="#split-simulator" className="hover:underline">
                  • المقارنة الحية (Before & After)
                </a>
              </li>
              <li>
                <a href="#pricing-plans" className="hover:underline text-emerald-600 dark:text-emerald-400 font-black">
                  • الباقات الـ 3 والأسعار الرسمية
                </a>
              </li>
              <li>
                <a href="#store-playground" className="hover:underline">
                  • المتجر التجريبي الحي
                </a>
              </li>
              <li>
                <button
                  onClick={() => {
                    playClick();
                    onOpenStudio();
                  }}
                  className="hover:underline text-right font-black flex items-center gap-1.5 mt-1 text-orange-500"
                >
                  <Hammer className="w-3.5 h-3.5 text-emerald-500" />
                  <span>• استوديو بناء المتجر والتيمبليتس</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Ownership Guarantee & Callout */}
          <div className="md:col-span-4 border-2 border-[#0F0F0F] dark:border-slate-700 p-5 sketch-border-2 bg-white dark:bg-[#151D2A] text-[#0F0F0F] dark:text-white sketch-shadow-sm flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>ضمان الملكية والاستقلالية 100%</span>
              </div>
              <div className="text-sm font-black text-[#0F0F0F] dark:text-white leading-snug">
                "متجرك ملكك بالكامل بدومينك الرسمي بدون نسب مبيعات ولا أي اشتراكات دورية. التسليم في خلال دقايق."
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#0F0F0F]/20 dark:border-slate-700">
              <button
                onClick={() => {
                  playClick();
                  onOpenStudio();
                }}
                className="btn-sketch btn-sketch-primary text-xs py-2 px-3 -rotate-1"
              >
                افتح الاستوديو وجرب
              </button>

              <button
                onClick={() => {
                  playClick();
                  onOpenOrderModal();
                }}
                className="btn-sketch text-xs py-2 px-3 rotate-1 hover:bg-neutral-100 dark:hover:bg-slate-800"
              >
                امتلك موقعك الآن
              </button>
            </div>
          </div>

        </div>

        <HandDrawnDivider variant="pencil" height={4} className="my-6 opacity-30" />

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#0F0F0F]/70 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} سكتش أوردر (Sketch Order EG). جميع الحقوق محفوظة لأصحاب المتاجر المستقلة في مصر.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 p-2 border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-pill bg-white dark:bg-slate-900 text-[#0F0F0F] dark:text-white hover:bg-neutral-100 dark:hover:bg-slate-800 transition-all font-mono"
            title="الرجوع للأعلى"
          >
            <span>أعلى الصفحة</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
