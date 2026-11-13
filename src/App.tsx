import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FullPageStoreStudio } from './components/FullPageStoreStudio';
import { SplitSimulator } from './components/SplitSimulator';
import { PricingPackages } from './components/PricingPackages';
import { StorePlayground } from './components/StorePlayground';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { OrderModal } from './components/OrderModal';
import { AdminOrdersDashboard } from './components/AdminOrdersDashboard';
import { Hammer, ArrowLeft } from 'lucide-react';
import type { CustomStoreConfig } from './types';
import { playClick } from './utils/soundEffects';

export const App: React.FC = () => {
  // View mode: 'home' for standard website, 'studio' for full-page standalone store builder
  const [viewMode, setViewMode] = useState<'home' | 'studio'>('home');
  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'pro' | 'custom'>('pro');
  const [preselectedFeatures, setPreselectedFeatures] = useState<string[]>([]);
  const [activeCustomStore, setActiveCustomStore] = useState<CustomStoreConfig | null>(null);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState<boolean>(false);

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

  const scrollToPlayground = () => {
    const el = document.getElementById('store-playground');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // IF STUDIO MODE IS ACTIVE: Render the Full-Page Store Studio view!
  if (viewMode === 'studio') {
    return (
      <div className="min-h-screen bg-slate-100 font-sans text-slate-900 antialiased selection:bg-orange-500 selection:text-white">
        <FullPageStoreStudio
          onBackToHome={() => {
            playClick();
            setViewMode('home');
          }}
          onBuyAndDeploy={handleBuyCustomStore}
          initialConfig={activeCustomStore}
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

  // STANDARD HOME VIEW
  return (
    <div className="min-h-screen bg-white text-[#0F0F0F] font-body selection:bg-[#0F0F0F] selection:text-white antialiased">
      {/* Compact Single-Row Navigation */}
      <Navbar
        onOpenOrderModal={() => {
          setActiveCustomStore(null);
          setPreselectedFeatures([]);
          setSelectedPlan('pro');
          setOrderModalOpen(true);
        }}
        onOpenStudio={openFullStudio}
        onOpenAdminDashboard={() => setAdminDashboardOpen(true)}
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
          onExplorePlayground={scrollToPlayground}
          onOpenStudio={openFullStudio}
        />

        {/* Practical 3-Step Process Callout (عملي وسهل الفهم لأي زائر جديد) */}
        <section className="py-12 bg-[#FAF9F6] border-y-2 border-[#0F0F0F] select-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-mono font-bold bg-[#0F0F0F] text-white px-3 py-1 sketch-border-pill -rotate-1 inline-block mb-2">
                HOW IT WORKS • ببساطة وبدون تعقيد
              </span>
              <h2 className="text-2xl sm:text-4xl font-black font-heading">
                إزاي بتمتلك متجرك المستقل في 3 خطوات عملية؟
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Step 1 */}
              <div className="p-5 border-2 border-[#0F0F0F] bg-white sketch-border-2 sketch-shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-full bg-[#0F0F0F] text-white flex items-center justify-center font-black font-mono text-sm">
                    1
                  </span>
                  <span className="text-xs font-bold text-[#0F0F0F]/70">الخطوة الأولى</span>
                </div>
                <h3 className="text-lg font-black font-heading">
                  ادخل الاستوديو واختار التيمبليت
                </h3>
                <p className="text-xs font-bold text-[#0F0F0F]/80 leading-relaxed">
                  اختار المظهر اللي يعجبك (متجر سبورتك الرياضي، صفحة كوتشيات نايكي تفصيلية، مطاعم دارك فاخر، أو ستايل كوميكس مرسوم). عدّل الاسم والدومين والأقسام فورياً.
                </p>
                <div className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 p-1.5 rounded-md border border-emerald-200">
                  ✓ تجربة مجانية فورية في صفحة كاملة
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-5 border-2 border-[#0F0F0F] bg-white sketch-border-1 sketch-shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-full bg-[#0F0F0F] text-white flex items-center justify-center font-black font-mono text-sm">
                    2
                  </span>
                  <span className="text-xs font-bold text-[#0F0F0F]/70">الخطوة الثانية</span>
                </div>
                <h3 className="text-lg font-black font-heading">
                  جرّب لوحة تحكم التاجر بنفسك
                </h3>
                <p className="text-xs font-bold text-[#0F0F0F]/80 leading-relaxed">
                  جرب تضيف منتجك الخاص وصورك، تتحكم في الأقسام، وتشوف سيستم تحليل المبيعات وصافي الربح الحقيقي شغال قدام عينك بالجنيه المصري.
                </p>
                <div className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 p-1.5 rounded-md border border-indigo-200">
                  ✓ لوحة تحكم متكاملة + تحليلات الأرباح
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-5 border-2 border-[#0F0F0F] bg-white sketch-border-3 sketch-shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-full bg-[#0F0F0F] text-white flex items-center justify-center font-black font-mono text-sm">
                    3
                  </span>
                  <span className="text-xs font-bold text-[#0F0F0F]/70">الخطوة الثالثة</span>
                </div>
                <h3 className="text-lg font-black font-heading">
                  اشتري واستلم متجرك في خلال دقايق
                </h3>
                <p className="text-xs font-bold text-[#0F0F0F]/80 leading-relaxed">
                  دفع مرة واحدة بإنستاباي أو فودافون كاش أو فيزا. بنسلمك متجرك المستقل بدومينك الخاص (.store أو .com) ملكك مدى الحياة بدون أي اشتراكات أو نسب مبيعات.
                </p>
                <div className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 p-1.5 rounded-md border border-amber-200">
                  ✓ تملك كامل 100% بدون نسب مبيعات
                </div>
              </div>

            </div>

            {/* Launch Studio Action Callout */}
            <div className="mt-8 text-center">
              <button
                onClick={openFullStudio}
                className="btn-sketch btn-sketch-primary text-base py-3.5 px-8 -rotate-1 font-heading inline-flex items-center gap-2"
              >
                <Hammer className="w-5 h-5 text-emerald-400" />
                <span>افتح استوديو بناء وتخصيص المتجر الآن (صفحة كاملة وتيمبليتس جاهزة)</span>
                <ArrowLeft className="w-4 h-4 mr-2" />
              </button>
            </div>

          </div>
        </section>

        {/* Section: Split-Page Simulator (Before & After - الورقة المقسومة) */}
        <SplitSimulator />

        {/* Section: Official 3 Pricing Packages */}
        <PricingPackages onSelectPlan={handleOpenOrderWithPlan} />

        {/* Section: Live Mini Store Simulator */}
        <StorePlayground />

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

      {/* Owner Admin Orders & Sales Dashboard */}
      <AdminOrdersDashboard
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
      />
    </div>
  );
};

export default App;
