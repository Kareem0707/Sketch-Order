import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FullPageStoreStudio } from './components/FullPageStoreStudio';
import { TemplatesShowcasePage } from './components/TemplatesShowcasePage';
import { OwnerAdminPage } from './components/OwnerAdminPage';
import { ClientMerchantPortal } from './components/ClientMerchantPortal';
import { TenantLiveStore } from './components/TenantLiveStore';
import { SplitSimulator } from './components/SplitSimulator';
import { PricingPackages } from './components/PricingPackages';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { OrderModal } from './components/OrderModal';
import { Hammer, ArrowLeft, Grid } from 'lucide-react';
import type { CustomStoreConfig, TemplateId } from './types';
import { playClick, playPaperFlip } from './utils/soundEffects';

type ViewMode =
  | 'home'
  | 'templates'
  | 'studio'
  | 'owner_admin'
  | 'merchant_portal'
  | 'tenant_live_store';

export const App: React.FC = () => {
  // Global View Routing
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'pro' | 'custom'>('pro');
  const [preselectedFeatures, setPreselectedFeatures] = useState<string[]>([]);
  const [activeCustomStore, setActiveCustomStore] = useState<CustomStoreConfig | null>(null);
  const [activeTenantSubdomain, setActiveTenantSubdomain] = useState<string>('sportech');
  const [activeStudioTemplateId, setActiveStudioTemplateId] = useState<TemplateId>('sportech-sneakers');

  // Dark Theme Management
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('sketch_order_theme');
      return saved === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('sketch_order_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('sketch_order_theme', 'light');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleOpenOrderWithPlan = (plan: 'standard' | 'pro' | 'custom') => {
    setSelectedPlan(plan);
    setOrderModalOpen(true);
  };

  const handleBuyCustomStore = (config: CustomStoreConfig) => {
    setActiveCustomStore(config);
    setSelectedPlan('pro');
    setPreselectedFeatures(['f-core-store', 'f-core-domain', 'f-core-cart', 'f-ord-whatsapp']);
    setOrderModalOpen(true);
  };

  const openFullStudio = () => {
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setViewMode('studio');
  };

  const openTemplatesShowcase = () => {
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setViewMode('templates');
  };

  const openOwnerAdmin = () => {
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setViewMode('owner_admin');
  };

  const openMerchantPortal = (subdomain?: string) => {
    playClick();
    if (subdomain) {
      setActiveTenantSubdomain(subdomain);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setViewMode('merchant_portal');
  };

  const openTenantLiveStore = (subdomain?: string) => {
    playClick();
    if (subdomain) {
      setActiveTenantSubdomain(subdomain);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setViewMode('tenant_live_store');
  };

  // ==========================================================
  // 1. FULL-PAGE TEMPLATES SHOWCASE VIEW (صفحة كاملة كواجهة)
  // ==========================================================
  if (viewMode === 'templates') {
    return (
      <TemplatesShowcasePage
        onBackToHome={() => {
          playClick();
          setViewMode('home');
        }}
        onSelectTemplateToStudio={(tId) => {
          playPaperFlip();
          setActiveStudioTemplateId(tId);
          setActiveCustomStore(null);
          setViewMode('studio');
        }}
        onOpenLiveStore={(tId) => {
          playClick();
          setActiveTenantSubdomain(tId);
          setViewMode('tenant_live_store');
        }}
        onBuyTemplate={(_tId) => {
          setSelectedPlan('pro');
          setOrderModalOpen(true);
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  // ==========================================================
  // 2. FULL-PAGE STORE STUDIO (iPhone 13 Pro Preview & Builder)
  // ==========================================================
  if (viewMode === 'studio') {
    return (
      <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-[#D9722B] selection:text-white">
        <FullPageStoreStudio
          onBackToHome={() => {
            playClick();
            setViewMode('home');
          }}
          onBuyAndDeploy={handleBuyCustomStore}
          initialConfig={activeCustomStore}
          initialTemplateId={activeStudioTemplateId}
          onOpenTemplatesPage={openTemplatesShowcase}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        <OrderModal
          isOpen={orderModalOpen}
          onClose={() => setOrderModalOpen(false)}
          preselectedFeatures={preselectedFeatures}
          initialStoreConfig={activeCustomStore}
          initialPlan={selectedPlan}
        />
      </div>
    );
  }

  // ==========================================================
  // 3. FULL-PAGE OWNER ADMIN DASHBOARD (In Sketch Theme)
  // ==========================================================
  if (viewMode === 'owner_admin') {
    return (
      <OwnerAdminPage
        onBackToHome={() => {
          playClick();
          setViewMode('home');
        }}
        onOpenStoreLive={(sub) => openTenantLiveStore(sub)}
        onOpenMerchantPortal={(sub) => openMerchantPortal(sub)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  // ==========================================================
  // 4. CLIENT MERCHANT PORTAL (لوحة تحكم المتجر للتاجر المستقل)
  // ==========================================================
  if (viewMode === 'merchant_portal') {
    return (
      <ClientMerchantPortal
        onBackToHome={() => {
          playClick();
          setViewMode('home');
        }}
        onOpenLiveStore={(sub) => openTenantLiveStore(sub)}
        initialSubdomain={activeTenantSubdomain}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  // ==========================================================
  // 5. TENANT LIVE STOREFRONT (المتجر المستقل الفعلي للزبائن)
  // ==========================================================
  if (viewMode === 'tenant_live_store') {
    return (
      <TenantLiveStore
        subdomain={activeTenantSubdomain}
        onBackToMerchantPortal={() => openMerchantPortal(activeTenantSubdomain)}
        onBackToHome={() => {
          playClick();
          setViewMode('home');
        }}
      />
    );
  }

  // ==========================================================
  // 6. STANDARD SKETCH ORDER HOME LANDING PAGE
  // ==========================================================
  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode
          ? 'bg-[#0B0F17] text-[#F8FAFC]'
          : 'bg-white text-[#0F0F0F]'
      } font-body selection:bg-[#D9722B] selection:text-white antialiased`}
    >
      {/* Navbar with Dark Mode & Portal links */}
      <Navbar
        onOpenOrderModal={() => {
          setActiveCustomStore(null);
          setPreselectedFeatures([]);
          setSelectedPlan('pro');
          setOrderModalOpen(true);
        }}
        onOpenStudio={openFullStudio}
        onOpenTemplates={openTemplatesShowcase}
        onOpenOwnerAdmin={openOwnerAdmin}
        onOpenMerchantPortal={() => openMerchantPortal()}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Sections */}
      <main>
        {/* Section: Hero Doodle & Problem/Solution */}
        <HeroSection
          onOpenOrderModal={() => {
            setActiveCustomStore(null);
            setPreselectedFeatures([]);
            setSelectedPlan('pro');
            setOrderModalOpen(true);
          }}
          onExplorePlayground={openFullStudio}
          onOpenStudio={openFullStudio}
          onOpenTemplates={openTemplatesShowcase}
        />

        {/* Practical 3-Step Process Callout */}
        <section
          className={`py-12 border-y-2 select-none transition-colors ${
            isDarkMode
              ? 'bg-[#0F172A] border-slate-700'
              : 'bg-[#FAF9F6] border-[#0F0F0F]'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-mono font-bold bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white px-3 py-1 sketch-border-pill -rotate-1 inline-block mb-2">
                HOW IT WORKS • ببساطة وبدون تعقيد
              </span>
              <h2 className="text-2xl sm:text-4xl font-black font-heading">
                إزاي بتمتلك متجرك المستقل في 3 خطوات عملية؟
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div
                className={`p-5 border-2 rounded-2xl space-y-3 transition-transform hover:-translate-y-1 ${
                  isDarkMode
                    ? 'bg-[#111827] border-slate-700 shadow-[4px_4px_0px_#1E293B]'
                    : 'bg-white border-[#0F0F0F] shadow-[4px_4px_0px_#0F0F0F]'
                } sketch-border-2`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-full bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white flex items-center justify-center font-black font-mono text-sm">
                    1
                  </span>
                  <span className="text-xs font-bold opacity-70">الخطوة الأولى</span>
                </div>
                <h3 className="text-lg font-black font-heading">
                  ادخل الاستوديو واختار التيمبليت
                </h3>
                <p className="text-xs font-bold opacity-80 leading-relaxed">
                  اختار المظهر اللي يعجبك (متجر سبورتك الرياضي، صفحة كوتشيات نايكي تفصيلية، مطاعم دارك فاخر، أو ستايل كوميكس مرسوم). عدّل الاسم والدومين والأقسام فورياً.
                </p>
                <div className="text-[11px] font-mono font-bold text-[#D9722B] dark:text-[#E88B4D] bg-[#D9722B]/10 p-1.5 rounded-md border border-[#D9722B]/30">
                  ✓ تجربة مجانية فورية في صفحة كاملة
                </div>
              </div>

              {/* Step 2 */}
              <div
                className={`p-5 border-2 rounded-2xl space-y-3 transition-transform hover:-translate-y-1 ${
                  isDarkMode
                    ? 'bg-[#111827] border-slate-700 shadow-[4px_4px_0px_#1E293B]'
                    : 'bg-white border-[#0F0F0F] shadow-[4px_4px_0px_#0F0F0F]'
                } sketch-border-1`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-full bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white flex items-center justify-center font-black font-mono text-sm">
                    2
                  </span>
                  <span className="text-xs font-bold opacity-70">الخطوة الثانية</span>
                </div>
                <h3 className="text-lg font-black font-heading">
                  جرّب لوحة تحكم التاجر بنفسك
                </h3>
                <p className="text-xs font-bold opacity-80 leading-relaxed">
                  جرب تضيف منتجك الخاص وصورك، تتحكم في الأقسام، وتشوف سيستم تحليل المبيعات وصافي الربح الحقيقي شغال قدام عينك بالجنيه المصري.
                </p>
                <div className="text-[11px] font-mono font-bold text-[#D9722B] dark:text-[#E88B4D] bg-[#D9722B]/10 p-1.5 rounded-md border border-[#D9722B]/30">
                  ✓ لوحة تحكم متكاملة + تحليلات الأرباح
                </div>
              </div>

              {/* Step 3 */}
              <div
                className={`p-5 border-2 rounded-2xl space-y-3 transition-transform hover:-translate-y-1 ${
                  isDarkMode
                    ? 'bg-[#111827] border-slate-700 shadow-[4px_4px_0px_#1E293B]'
                    : 'bg-white border-[#0F0F0F] shadow-[4px_4px_0px_#0F0F0F]'
                } sketch-border-3`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-full bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white flex items-center justify-center font-black font-mono text-sm">
                    3
                  </span>
                  <span className="text-xs font-bold opacity-70">الخطوة الثالثة</span>
                </div>
                <h3 className="text-lg font-black font-heading">
                  اشتري واستلم متجرك في خلال دقايق
                </h3>
                <p className="text-xs font-bold opacity-80 leading-relaxed">
                  دفع مرة واحدة بإنستاباي أو فودافون كاش أو فيزا. بنسلمك متجرك المستقل بدومينك الخاص (.store أو .com) ملكك مدى الحياة بدون أي اشتراكات أو نسب مبيعات.
                </p>
                <div className="text-[11px] font-mono font-bold text-[#D9722B] dark:text-[#E88B4D] bg-[#D9722B]/10 p-1.5 rounded-md border border-[#D9722B]/30">
                  ✓ تملك كامل 100% بدون نسب مبيعات
                </div>
              </div>
            </div>

            {/* Launch Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={openTemplatesShowcase}
                className="btn-sketch btn-sketch-primary text-sm sm:text-base py-3 px-6 -rotate-1 font-heading inline-flex items-center gap-2"
              >
                <Grid className="w-5 h-5 text-zinc-400" />
                <span>قوالب المتاجر</span>
                <ArrowLeft className="w-4 h-4 mr-1" />
              </button>

              <button
                onClick={openFullStudio}
                className={`text-sm sm:text-base py-3 px-6 rounded-2xl border-2 font-heading font-black inline-flex items-center gap-2 transition-transform active:scale-95 ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800'
                    : 'bg-white border-[#0F0F0F] text-[#0F0F0F] hover:bg-slate-100'
                }`}
              >
                <Hammer className="w-5 h-5 text-[#D9722B] dark:text-[#E88B4D]" />
                <span>استوديو تخصيص المتجر (لايف)</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section: Split-Page Simulator (Before & After) */}
        <SplitSimulator />

        {/* Section: Official 3 Pricing Packages */}
        <PricingPackages onSelectPlan={handleOpenOrderWithPlan} />

        {/* Section: Live Mini Store Simulator */}
        

        {/* FAQs */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenOrderModal={() => {
          setActiveCustomStore(null);
          setPreselectedFeatures([]);
          setSelectedPlan('pro');
          setOrderModalOpen(true);
        }}
        onOpenStudio={openFullStudio}
      />

      {/* Contract & Order Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        preselectedFeatures={preselectedFeatures}
        initialStoreConfig={activeCustomStore}
        initialPlan={selectedPlan}
      />
    </div>
  );
};

export default App;
