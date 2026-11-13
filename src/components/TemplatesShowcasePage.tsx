import React, { useState } from 'react';
import {
  ArrowRight,
  Rocket,
  Search,
  CheckCircle2,
  Heart,
  SlidersHorizontal,
  Smartphone,
  ExternalLink,
  ShoppingBag,
  Sparkles,
  Sun,
  Moon,
  Home,
} from 'lucide-react';
import type { TemplateId } from '../types';
import { STUDIO_TEMPLATES } from './FullPageStoreStudio';
import { playClick, playPaperFlip } from '../utils/soundEffects';
import logoSquareImg from '../assets/sketch-order-logo-square.png';
import mascotPng from '../assets/sketch-mascot.png';

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
  const [likedTemplateIds, setLikedTemplateIds] = useState<string[]>(['sportech-sneakers']);

  const categories = [
    { id: 'all', label: 'الكل (8 تيمبليتس)' },
    { id: 'sports', label: '👟 كوتشيات ورياضة', matchId: 'sportech-sneakers' },
    { id: 'single_product', label: '🔥 صفحة هبوط منتج متخصص', matchId: 'cloudrunner-product' },
    { id: 'food', label: '🥩 مطاعم وأكلات فاخرة', matchId: 'dinereserve-food' },
    { id: 'streetwear', label: '👕 أزياء وستريت وير', matchId: 'fasco-fashion' },
    { id: 'fastfood', label: '🍔 برجر وساندوتشات', matchId: 'burger-club' },
    { id: 'furniture', label: '🛋️ أثاث وديكور', matchId: 'panto-minimal' },
    { id: 'jewelry', label: '💎 عطور ومجوهرات', matchId: 'velvety-jewelry' },
    { id: 'sketch', label: '✏️ سكتش وكوميكس', matchId: 'sketch-comic' },
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
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-[#0B0F17] text-white' : 'bg-[#F8FAFC] text-slate-900'} font-body antialiased selection:bg-orange-500 selection:text-white`}>
      
      {/* ======================================================== */}
      {/* 1. TOP HEADER & BREADCRUMB BAR */}
      {/* ======================================================== */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
        isDarkMode ? 'bg-[#0B0F17]/90 border-slate-800' : 'bg-white/95 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          
          {/* Right: Brand and Back to Home */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playClick();
                onBackToHome();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isDarkMode
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
              }`}
            >
              <ArrowRight className="w-4 h-4 ml-0.5" />
              <span>الرئيسية</span>
            </button>

            <div className="flex items-center gap-2 border-r border-slate-300 dark:border-slate-800 pr-3">
              <img src={logoSquareImg} alt="Sketch Order" className={`h-8 w-8 object-contain ${isDarkMode ? 'invert' : ''}`} />
              <img src={mascotPng} alt="Mascot" className="w-7 h-7 object-contain hidden sm:block" />
              <div>
                <span className="font-heading font-black text-base sm:text-lg tracking-tight block leading-none">
                  سكتش أوردر
                </span>
                <span className="text-[10px] text-orange-500 font-bold font-mono">
                  TEMPLATES STUDIO
                </span>
              </div>
            </div>
          </div>

          {/* Left: Search + Dark Theme + CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Dark Theme Toggle Button */}
            <button
              onClick={() => {
                playClick();
                onToggleDarkMode();
              }}
              className={`p-2 rounded-xl transition-all border flex items-center gap-1.5 text-xs font-bold ${
                isDarkMode
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 shadow-xs'
                  : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200 shadow-xs'
              }`}
              title={isDarkMode ? 'التبديل للوضع النهاري (Light)' : 'التبديل للوضع الليلي (Dark)'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline">وضع نهاري</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span className="hidden md:inline">وضع ليلي</span>
                </>
              )}
            </button>

            {/* Direct Buy Button */}
            <button
              onClick={() => {
                playClick();
                onBuyTemplate('sportech-sneakers');
              }}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
            >
              <Rocket className="w-4 h-4" />
              <span>امتلك متجرك الآن</span>
            </button>
          </div>

        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. HERO SHOWCASE INTRO (Figma Community Inspiration) */}
      {/* ======================================================== */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        
        {/* Breadcrumb & Title */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span onClick={onBackToHome} className="cursor-pointer hover:underline flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              الرئيسية
            </span>
            <span>/</span>
            <span className="text-orange-600 dark:text-orange-400 font-bold">واجهات وقوالب المتاجر الجاهزة</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-800/80 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>8 تيمبليتس متكاملة وحصرية لعام 2026</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black font-heading tracking-tight leading-tight">
                كتالوج تيمبليتس المتاجر الإلكترونية الجاهزة
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl mt-1.5 leading-relaxed">
                كل تيمبليت مبني بهندسة UI/UX مخصصة لمجال معين (كوتشيات، أزياء أوفر سايز، مطاعم فاخرة، أثاث، مجوهرات) بمنتجاته الحقيقية وتقسيمته العملية.
                يمكنك تجربة وتعديل أي قالب مباشرة على شاشة الآيفون 📱، أو فتحه في صفحة كاملة كأنك عميل يتسوق أونلاين 🌐.
              </p>
            </div>

            {/* Live Search Bar */}
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن تيمبليت بالاسم أو النشاط..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pr-10 pl-4 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-orange-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-orange-500 shadow-xs'
                }`}
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="pt-4 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {categories.map((cat) => {
              const isSelected = selectedCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playPaperFlip();
                    setSelectedCategoryFilter(cat.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white shadow-xs'
                      : isDarkMode
                      ? 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* ======================================================== */}
        {/* 3. TEMPLATES GRID (Figma Community Inspired Cards) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((tmpl) => {
            const isLiked = likedTemplateIds.includes(tmpl.id);
            return (
              <div
                key={tmpl.id}
                className={`rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between group ${
                  isDarkMode
                    ? 'bg-slate-900/70 border-slate-800 hover:border-orange-500 hover:shadow-[0_10px_30px_rgba(249,115,22,0.15)]'
                    : 'bg-white border-slate-200 hover:border-slate-400 hover:shadow-xl'
                }`}
              >
                {/* 16:10 Mockup Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-inherit">
                  <img
                    src={tmpl.previewImage}
                    alt={tmpl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category Badge */}
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/95 dark:bg-slate-950/90 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700 backdrop-blur-xs">
                    {tmpl.categoryBadge}
                  </span>

                  {/* Accent Color Pip */}
                  <div
                    className="absolute bottom-3 right-3 w-4 h-4 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: tmpl.accentColor }}
                    title="اللون الأساسي للقالب"
                  />

                  {/* Like Button */}
                  <button
                    onClick={(e) => handleToggleLike(tmpl.id, e)}
                    className="absolute top-3 left-3 p-1.5 rounded-full bg-white/90 dark:bg-slate-950/80 shadow-xs transition-transform active:scale-125"
                    title="إضافة للمفضلة"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400'
                      }`}
                    />
                  </button>

                  {/* Tag Pill */}
                  {tmpl.tag && (
                    <span className="absolute bottom-3 left-3 text-[9px] font-black px-2 py-0.5 rounded-md bg-orange-600 text-white shadow-xs">
                      {tmpl.tag}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wide">
                      {tmpl.nameEn}
                    </div>
                    <h3 className="text-base font-black font-heading mt-0.5 leading-snug">
                      {tmpl.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>

                  {/* Stats Bar */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-red-500" />
                      <span>{isLiked ? '3.5k' : '3.4k'} إعجاب</span>
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>شامل مجاناً بالباقة</span>
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 space-y-2">
                    
                    {/* Primary Button: Preview in iPhone Studio */}
                    <button
                      onClick={() => {
                        playClick();
                        onSelectTemplateToStudio(tmpl.id);
                      }}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-xs"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>معاينة وتخصيص في الآيفون 📱</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Secondary Button: Live Full Store */}
                      <button
                        onClick={() => {
                          playClick();
                          onOpenLiveStore(tmpl.id);
                        }}
                        className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors border ${
                          isDarkMode
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                        }`}
                        title="تصفح المتجر بشاشة كاملة كأنك عميل"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>متجر مباشر 🌐</span>
                      </button>

                      {/* Buy Button */}
                      <button
                        onClick={() => {
                          playClick();
                          onBuyTemplate(tmpl.id);
                        }}
                        className="py-2 rounded-xl text-xs font-bold bg-orange-600/10 hover:bg-orange-600 text-orange-600 hover:text-white border border-orange-500/30 transition-all flex items-center justify-center gap-1"
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

        {/* Empty Search Fallback */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <SlidersHorizontal className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-base font-black">لم يتم العثور على تيمبليت يطابق بحثك</h4>
            <p className="text-xs text-slate-500">جرب كتابة اسم مختلف أو اختر "الكل" لعرض كافة الواجهات</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs"
            >
              عرض جميع التيمبليتس (8)
            </button>
          </div>
        )}

      </section>

      {/* ======================================================== */}
      {/* 4. FOOTER NOTE */}
      {/* ======================================================== */}
      <footer className={`border-t py-6 text-center text-xs text-slate-500 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <p>منصة سكتش أوردر (Sketch Order) • جميع التيمبليتس تعمل بنظام Multi-Tenant Vercel مع ساب دومين مستقل وضمان مدى الحياة.</p>
      </footer>

    </div>
  );
};
