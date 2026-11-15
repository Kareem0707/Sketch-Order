import React from 'react';
import type { StudioTemplateMeta } from '../FullPageStoreStudio';

interface TemplateDualDeviceMockupProps {
  template: StudioTemplateMeta;
  className?: string;
  onPreviewClick?: () => void;
}

export const TemplateDualDeviceMockup: React.FC<TemplateDualDeviceMockupProps> = ({
  template,
  className = '',
  onPreviewClick,
}) => {
  return (
    <div
      onClick={onPreviewClick}
      className={`relative w-full aspect-[16/11] rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-100 via-slate-100 to-zinc-200 dark:from-slate-900 dark:via-slate-850 dark:to-slate-950 p-2 sm:p-3 flex items-center justify-center select-none group cursor-pointer border-b-2 border-inherit ${className}`}
    >
      {/* Subtle Pattern Grid Background */}
      <div className="absolute inset-0 opacity-25 dark:opacity-10 pointer-events-none bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:12px_12px]"></div>

      {/* ======================================================== */}
      {/* 1. PC / DESKTOP SCREEN MOCKUP (In the Background)        */}
      {/* ======================================================== */}
      <div className="w-[84%] h-[82%] rounded-xl overflow-hidden border-2 border-slate-700/80 bg-white dark:bg-slate-950 shadow-md transform -translate-x-2 -translate-y-1 transition-all duration-300 group-hover:scale-[1.02] relative z-10">
        {/* Desktop Browser Chrome Bar */}
        <div className="h-4 sm:h-5 bg-slate-200 dark:bg-slate-800 px-2 flex items-center justify-between border-b border-slate-300 dark:border-slate-700">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-[7px] sm:text-[8px] font-mono font-bold text-zinc-500 dark:text-zinc-400 truncate max-w-[130px]">
            https://{template.id}.store
          </div>
          <span className="text-[7px] font-mono text-emerald-600 dark:text-emerald-400 font-bold hidden sm:inline">
            ● Live PC
          </span>
        </div>

        {/* Desktop Website Homepage Content */}
        <div className="relative w-full h-[calc(100%-16px)] sm:h-[calc(100%-20px)] overflow-hidden bg-slate-900">
          <img
            src={template.previewImage}
            alt={`${template.name} - PC View`}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Simulated Desktop UI Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50 p-2 flex flex-col justify-between text-white pointer-events-none">
            {/* Desktop Navbar */}
            <div className="flex items-center justify-between text-[7px] sm:text-[8px] font-bold pb-1 border-b border-white/20">
              <span className="font-heading font-black truncate max-w-[100px] sm:max-w-[140px]">
                {template.name}
              </span>
              <div className="hidden sm:flex items-center gap-2 text-[6px] sm:text-[7px] opacity-80">
                <span>الرئيسية</span>
                <span>المنتجات</span>
                <span>تواصل معنا</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-[#D9722B] text-[6px] sm:text-[7px] font-black shrink-0">
                شراء سريع
              </span>
            </div>

            {/* Desktop Badge Indicator */}
            <div className="flex items-center justify-between">
              <span className="px-1.5 py-0.5 rounded-md bg-black/70 border border-white/20 text-[7px] sm:text-[8px] font-mono font-bold backdrop-blur-xs">
                💻 وضع الكمبيوتر (Desktop)
              </span>
              <span className="text-[7px] font-mono text-amber-300 font-bold">
                ✓ متجاوب 100%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MOBILE / SMARTPHONE MOCKUP (In Foreground Overlapping)*/}
      {/* ======================================================== */}
      <div className="absolute left-2.5 sm:left-4 bottom-1.5 sm:bottom-2.5 w-[33%] sm:w-[35%] h-[86%] rounded-[18px] sm:rounded-[22px] border-[2.5px] sm:border-3 border-slate-900 dark:border-slate-700 bg-slate-950 shadow-2xl overflow-hidden z-20 transform hover:scale-105 transition-all duration-300">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-7 sm:w-9 h-1.5 sm:h-2 rounded-full bg-black z-30 flex items-center justify-center">
          <span className="w-1 h-1 rounded-full bg-slate-800"></span>
        </div>

        {/* Mobile Screen Website Content */}
        <div className="w-full h-full pt-3.5 pb-1 px-1 flex flex-col justify-between bg-slate-900 relative">
          <img
            src={template.previewImage}
            alt={`${template.name} - Mobile View`}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />

          {/* Mobile Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/60 pointer-events-none"></div>

          {/* Mobile Header Bar */}
          <div className="relative z-10 flex items-center justify-between text-white text-[6px] sm:text-[7px] font-bold px-0.5 pt-0.5">
            <span className="truncate max-w-[55px] font-black">{template.name.split(' ')[0]}</span>
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#D9722B] flex items-center justify-center text-[5px] sm:text-[6px] font-black shrink-0">
              🛒
            </span>
          </div>

          {/* Mobile Bottom Badge */}
          <div className="relative z-10 text-white space-y-0.5 p-0.5">
            <div className="text-[6px] sm:text-[7px] font-black font-heading truncate leading-tight">
              {template.name}
            </div>
            <div className="px-1 py-0.5 rounded bg-[#D9722B] text-[5px] sm:text-[6px] font-black text-center shadow-xs">
              📱 وضع الفون (Mobile)
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CORNER BADGES (Matches User's Reference Screenshot)    */}
      {/* ======================================================== */}
      {/* Top Right: Green Badge "مجاني بالباقة" */}
      <div className="absolute top-2.5 right-2.5 z-30">
        <span className="px-2 sm:px-2.5 py-0.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] sm:text-[10px] font-black font-mono shadow-md flex items-center gap-1 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          <span>مجاني بالباقة</span>
        </span>
      </div>

      {/* Top Left: Circular Arrow Action Button ↗ */}
      <div className="absolute top-2.5 left-2.5 z-30 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white flex items-center justify-center shadow-md border border-slate-300 dark:border-slate-700 group-hover:bg-[#D9722B] group-hover:text-white group-hover:border-[#D9722B] transition-all duration-300 group-hover:scale-110">
        <span className="text-[11px] sm:text-xs font-black">↗</span>
      </div>

      {/* Bottom Corner Tag: Dual View Label */}
      <div className="absolute bottom-1.5 right-2.5 z-10 text-[8px] sm:text-[9px] font-mono font-bold text-zinc-600 dark:text-zinc-300 bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 rounded-md backdrop-blur-xs border border-zinc-200 dark:border-slate-700 shadow-2xs">
        📱 Phone + 💻 PC
      </div>
    </div>
  );
};
