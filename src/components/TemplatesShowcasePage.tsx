import React, { useState } from 'react';
import {
  ArrowRight,
  Rocket,
  Search,
  CheckCircle2,
  Heart,
  Smartphone,
  ExternalLink,
  ShoppingBag,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import type { TemplateId } from '../types';
import { STUDIO_TEMPLATES } from './FullPageStoreStudio';
import { TemplateDualDeviceMockup } from './common/TemplateDualDeviceMockup';
import { playClick, playPaperFlip } from '../utils/soundEffects';
import brushLogoWhite from '../assets/sketch-brush-logo-white.png';
import brushLogoBlack from '../assets/sketch-brush-logo-black.png';
import mascotScarfImg from '../assets/sketch-mascot-scarf.png';

interface TemplatesShowcasePageProps {
  onBackToHome: () => void;
  onSelectTemplateToStudio: (templateId: TemplateId) => void;
  onOpenLiveStore: (templateId: TemplateId) => void;
  onBuyTemplate: (templateId: TemplateId) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const TemplatesShowcasePage: React.FC<TemplatesShowcasePageProps> = ({
  onBackToHome,
  onSelectTemplateToStudio,
  onOpenLiveStore,
  onBuyTemplate,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [likedTemplateIds, setLikedTemplateIds] = useState<string[]>(['ctrl-yz', 'sportech-sneakers']);

  const categories = [
    { id: 'all', label: 'الكل (9 قوالب حصرية)' },
    { id: 'streetwear_3d', label: '🔥 أوفر سايز 3D (CTRL YZ)', matchId: 'ctrl-yz' },
    { id: 'sports', label: '👟 كوتشيات ورياضة', matchId: 'sportech-sneakers' },
    { id: 'single_product', label: '⚡ صفحة هبوط منتج متخصص', matchId: 'cloudrunner-product' },
    { id: 'food', label: '🥩 مطاعم وأكلات فاخرة', matchId: 'dinereserve-food' },
    { id: 'streetwear', label: '👕 أزياء وكاجوال (FASCO)', matchId: 'fasco-fashion' },
    { id: 'fastfood', label: '🍔 برجر وساندوتشات', matchId: 'burger-club' },
    { id: 'furniture', label: '🛋️ أثاث وديكور اسكندنافي', matchId: 'panto-minimal' },
    { id: 'jewelry', label: '✨ عطور ومجوهرات ذهب', matchId: 'velvety-jewelry' },
    { id: 'sketch', label: '✏️ سكتش وكوميكس يدوي', matchId: 'sketch-comic' },
  ];

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    if (likedTemplateIds.includes(id)) {
      setLikedTemplateIds(likedTemplateIds.filter((t) => t !== id));
    } else {
      setLikedTemplateIds([...likedTemplateIds, id]);
    }
  };

  const filteredTemplates = STUDIO_TEMPLATES.filter((tmpl) => {
    const matchesCategory =
      selectedCategoryFilter === 'all' ||
      categories.find((c) => c.id === selectedCategoryFilter)?.matchId === tmpl.id;
    const matchesSearch =
      searchQuery === '' ||
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.categoryBadge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? 'bg-[#0B0F17] text-white' : 'bg-[#FAF8F5] text-[#0F0F0F] paper-pattern'
      } font-body antialiased selection:bg-[#D9722B] selection:text-white pb-24`}
    >
      {/* ======================================================== */}
      {/* 1. TOP HEADER & BREADCRUMB BAR (Sketch Blueprint Style) */}
      {/* ======================================================== */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          isDarkMode
            ? 'bg-[#0B0F17]/90 border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
            : 'bg-[#FAF8F5]/95 border-[#0F0F0F]/20 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Right: Brand and Back to Home */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playClick();
                onBackToHome();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${
                isDarkMode
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                  : 'bg-white hover:bg-slate-100 border-[#0F0F0F] text-[#0F0F0F] shadow-[-2px_2px_0px_#0F0F0F]'
              } sketch-border-1 active:scale-95`}
            >
              <ArrowRight className="w-4 h-4 ml-0.5 -scale-x-100" />
              <span>الرئيسية</span>
            </button>

            <div className="flex items-center gap-2.5 border-r-2 border-[#0F0F0F]/15 dark:border-slate-800 pr-3">
              <img
                src={isDarkMode ? brushLogoWhite : brushLogoBlack}
                alt="سكتش أوردر"
                className="h-10 sm:h-12 object-contain"
              />
              <div>
                <span className="font-heading font-black text-base sm:text-lg tracking-tight block leading-none">
                  سكتش أوردر
                </span>
                <span className="text-[10px] text-[#D9722B] font-bold font-mono">
                  TEMPLATES SHOWCASE • 9 قوالب
                </span>
              </div>
            </div>
          </div>

          {/* Left: Dark Theme + Direct Buy CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                playClick();
                onToggleDarkMode();
              }}
              className={`p-2 rounded-xl transition-all border-2 flex items-center gap-1.5 text-xs font-bold ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                  : 'bg-white border-[#0F0F0F] text-[#0F0F0F] hover:bg-slate-100 shadow-[-2px_2px_0px_#0F0F0F]'
              } sketch-border-tag`}
              title={isDarkMode ? 'التبديل للوضع النهاري' : 'التبديل للوضع الليلي'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-[#D9722B]" />
                  <span className="hidden md:inline">الوضع الفاتح</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-800" />
                  <span className="hidden md:inline">الوضع الداكن</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                playClick();
                onBuyTemplate('ctrl-yz');
              }}
              className="px-4 py-2 rounded-xl bg-[#D9722B] hover:bg-[#C25E1D] text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-[-3px_3px_0px_#0F0F0F] dark:shadow-none transition-transform active:scale-95 border-2 border-[#0F0F0F] dark:border-[#D9722B]"
            >
              <Rocket className="w-4 h-4" />
              <span>امتلك موقعك الآن</span>
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. SKETCH HERO BANNER (Unified with Mascot & Campaign) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div
          className={`relative p-6 sm:p-8 rounded-3xl border-2 sm:border-3 ${
            isDarkMode
              ? 'bg-[#111827]/80 border-slate-700 shadow-[6px_6px_0px_#1E293B]'
              : 'bg-white border-[#0F0F0F] shadow-[-6px_6px_0px_#0F0F0F]'
          } sketch-border-2 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6`}
        >
          {/* Tape decoration */}
          <div className="absolute -top-3 left-10 w-28 h-7 bg-amber-100 dark:bg-slate-800 border border-[#0F0F0F]/30 -rotate-3 text-[9px] font-mono font-bold flex items-center justify-center opacity-85 shadow-xs">
            SKETCH ORDER • 2026
          </div>

          {/* Right Text Content */}
          <div className="space-y-3 z-10 max-w-2xl text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#D9722B]/10 text-[#D9722B] border border-[#D9722B]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>معرض القوالب الجاهزة المكتملة فرونت إند وباك إند 100%</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight leading-tight">
              كتالوج قوالب المتاجر الإلكترونية <br />
              <span className="text-[#D9722B] underline decoration-wavy decoration-[#D9722B]/50">
                الحصرية والمصممة للبيع الفوري
              </span>
            </h1>

            <p className="text-xs sm:text-sm opacity-80 leading-relaxed font-bold max-w-xl">
              كل تيمبليت هنا مش مجرد لقطة شاشة أو تصميم مبدئي؛ دا نظام ويب حقيقي متكامل جاهز بمنتجاته الحقيقية، سلة
              تسوق، ربط مع واتساب، ولوحة تحكم تاجر مستقلة تسلمه لزبونك ويبدأ يبيع خلال دقائق!
            </p>

            {/* Mascot Speech Bubble */}
            <div
              className={`inline-flex items-center gap-2.5 p-3 rounded-2xl border-2 ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-200'
                  : 'bg-[#FAF8F5] border-[#0F0F0F] text-[#0F0F0F]'
              } sketch-border-tag text-xs font-bold shadow-xs`}
            >
              <span className="text-base">💬</span>
              <span>
                "دوس على <span className="text-[#D9722B] font-black">معاينة وتعديل في الاستوديو</span> عشان تفتح لوحة
                التحكم وتغير الألوان والمنتجات وتشوف النتيجة لايف!"
              </span>
            </div>
          </div>

          {/* Left Mascot Character with Warm Scarf */}
          <div className="relative shrink-0 flex flex-col items-center justify-center">
            <div className="w-32 h-44 sm:w-44 sm:h-56 relative animate-float-subtle">
              <img
                src={mascotScarfImg}
                alt="شخصية سكتش أوردر"
                className="w-full h-full object-contain filter drop-shadow-md"
              />
            </div>
            <div className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#D9722B] text-white -mt-2 shadow-xs">
              تميمة سكتش مان 🧣
            </div>
          </div>
        </div>

        {/* Search Bar + Filter Tabs */}
        <div className="mt-8 space-y-4">
          {/* Search Box */}
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث عن تيمبليت بالاسم أو النشاط (مثلاً: أوفر سايز، كوتشيات، برجر)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pr-10 pl-4 py-2.5 border-2 text-xs font-bold transition-all ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-[#D9722B]'
                  : 'bg-white border-[#0F0F0F] text-[#0F0F0F] placeholder-slate-400 focus:border-[#D9722B] shadow-[-2px_2px_0px_#0F0F0F]'
              } sketch-border-2 outline-none`}
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 pt-1 justify-start sm:justify-center">
            {categories.map((cat, idx) => {
              const isSelected = selectedCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playPaperFlip();
                    setSelectedCategoryFilter(cat.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border-2 ${
                    isSelected
                      ? 'bg-[#0F0F0F] text-white border-[#0F0F0F] dark:bg-white dark:text-slate-950 dark:border-white shadow-[-3px_3px_0px_#D9722B]'
                      : isDarkMode
                      ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                      : 'bg-white text-slate-800 border-[#0F0F0F]/30 hover:border-[#0F0F0F] shadow-[-2px_2px_0px_#0F0F0F]'
                  } sketch-border-tag active:scale-95`}
                  style={{ transform: `rotate(${(idx % 3) - 1}deg)` }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. TEMPLATES GRID (Authentic Hand-Drawn Cards) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTemplates.map((tmpl) => {
            const isLiked = likedTemplateIds.includes(tmpl.id);
            return (
              <div
                key={tmpl.id}
                className={`rounded-3xl border-2 sm:border-3 transition-all duration-300 overflow-hidden flex flex-col justify-between group ${
                  isDarkMode
                    ? 'bg-slate-900/90 border-slate-700 hover:border-[#D9722B] shadow-[6px_6px_0px_#1E293B] hover:shadow-[6px_6px_0px_#D9722B]'
                    : 'bg-white border-[#0F0F0F] shadow-[-6px_6px_0px_#0F0F0F] hover:shadow-[-8px_8px_0px_#D9722B]'
                } sketch-border-1 relative`}
              >
                {/* Dual Device Mockup: PC + Phone View (Matches Reference) */}
                <TemplateDualDeviceMockup
                  template={tmpl}
                  onPreviewClick={() => {
                    playClick();
                    onSelectTemplateToStudio(tmpl.id);
                  }}
                />

                {/* Card Body */}
                <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5 text-center">
                    <h3 className="text-base sm:text-lg font-black font-heading leading-snug">
                      {tmpl.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-bold leading-relaxed">
                      تصميم سريع وبسيط لزيادة المبيعات • متجر متكامل
                    </p>
                    
                    {/* Category Pill Tag (As in Reference Screenshot) */}
                    <div className="pt-1 flex items-center justify-center">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-2xs">
                        {tmpl.categoryBadge}
                      </span>
                    </div>
                  </div>

                  {/* Stats Bar */}
                  <div className="pt-2 border-t border-dashed border-inherit/20 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                    <button
                      onClick={(e) => handleToggleLike(tmpl.id, e)}
                      className="flex items-center gap-1 hover:text-[#D9722B] transition-colors"
                      title="إعجاب بالقالب"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#D9722B] text-[#D9722B]' : 'text-slate-400'}`} />
                      <span>{isLiked ? '3.5k' : '3.4k'} إعجاب</span>
                    </button>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>شامل مجاناً بالباقة</span>
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 space-y-2">
                    {/* Primary Button: Preview & Edit in Studio */}
                    <button
                      onClick={() => {
                        playClick();
                        onSelectTemplateToStudio(tmpl.id);
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#0F0F0F] hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[-3px_3px_0px_#D9722B] border-2 border-inherit"
                    >
                      <Smartphone className="w-4 h-4 text-[#D9722B]" />
                      <span>معاينة وتعديل في الاستوديو 📱</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Secondary Button: Live Full Store */}
                      <button
                        onClick={() => {
                          playClick();
                          onOpenLiveStore(tmpl.id);
                        }}
                        className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors border-2 ${
                          isDarkMode
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border-[#0F0F0F]/30 shadow-xs'
                        } sketch-border-tag`}
                        title="تصفح المتجر بشاشة كاملة كأنك عميل"
                      >
                        <ExternalLink className="w-3 h-3 text-[#D9722B]" />
                        <span>متجر مباشر ↗</span>
                      </button>

                      {/* Buy Button */}
                      <button
                        onClick={() => {
                          playClick();
                          onBuyTemplate(tmpl.id);
                        }}
                        className="py-2 rounded-xl text-xs font-black bg-[#D9722B]/10 hover:bg-[#D9722B] text-[#D9722B] hover:text-white border-2 border-[#D9722B]/40 transition-all flex items-center justify-center gap-1 sketch-border-tag"
                        title="طلب حجز هذا القالب فوراً"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>طلب القالب</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
