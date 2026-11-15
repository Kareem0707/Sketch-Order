import React, { useState, useEffect } from 'react';
import {
 ArrowRight,
 CheckCircle2,
 Clock,
 DollarSign,
 Store,
 ExternalLink,
 MessageCircle,
 Trash2,
 RefreshCw,
 Sparkles,
 X,
 Plus,
 Search,
 Check,
 Sun,
 Moon,
 KeyRound,
  Globe,
  Power,
  Mail,
  LogOut,
  Copy,
  Server,
  Cloud,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';
import type { ClientOrderRequest, TenantStoreAccount, VercelDomainRecord, LiveDnsCheckResult } from '../types';
import {
  getActiveVercelConfig,
  saveVercelConfig,
  testVercelConnection,
  listVercelProjectDomains,
  addDomainToVercel,
  checkDomainLiveDns,
} from '../services/vercelDomainService';
import {
  getActiveGoogleClientId,
  saveGoogleClientId,
  isGoogleSdkReady,
} from '../services/googleAuthService';
import {
  getAdminMasterPassword,
  setAdminMasterPassword,
  setDeviceAdminAuthenticated,
} from './SecretAdminGateModal';
import { playClick, playCashSound } from '../utils/soundEffects';
import logoSquareImg from '../assets/sketch-order-logo-square.png';
import mascotPng from '../assets/sketch-mascot.png';
import { STUDIO_TEMPLATES, DEFAULT_PRODUCTS_MAP, DEFAULT_CATEGORIES_MAP } from './FullPageStoreStudio';

interface OwnerAdminPageProps {
  onBackToHome: () => void;
  onLogoutAdmin?: () => void;
  onOpenStoreLive: (subdomain: string) => void;
  onOpenMerchantPortal: (subdomain: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const DEFAULT_ORDERS_MOCK: ClientOrderRequest[] = [
 {
 id: 'SK-7352',
 createdAt: '2026-11-13 10:15',
 clientName: 'كريم محمود',
 whatsappNumber: '01012345678',
 brandName: 'سبورتك إيجيبت (SPORTECH)',
 subdomain: 'sportech',
 selectedPlan: 'pro',
 planName: 'باقة المحترفين والنمو',
 amount: 2400,
 templateId: 'sportech-sneakers',
 templateName: 'سبورتك الرياضي (SPORTECH)',
 paymentMethod: 'instapay',
 transactionRef: 'IP-998241284',
 receiptImageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
 notes: 'عايز أربط الدومين باسم sportech-eg.store فوراً واستلم المتجر النهاردة.',
 status: 'pending_review',
 },
 {
 id: 'SK-9281',
 createdAt: '2026-11-12 18:30',
 clientName: 'أحمد الشناوي',
 whatsappNumber: '01123456789',
 brandName: 'كوتشيات الشناوي (Sneakers Hub)',
 subdomain: 'alshinnawy',
 selectedPlan: 'standard',
 planName: 'الباقة الاقتصادية',
 amount: 1250,
 templateId: 'cloudrunner-product',
 templateName: 'صفحة منتج نايكي (Cloud Runner 2)',
 paymentMethod: 'instapay',
 transactionRef: 'IP-6452041284',
 receiptImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
 status: 'pending_review',
 },
 {
 id: 'SK-4274',
 createdAt: '2026-11-11 14:05',
 clientName: 'سارة مصطفى',
 whatsappNumber: '01208765432',
 brandName: 'فاسكو كايرو ستريت',
 subdomain: 'fasco-cairo',
 selectedPlan: 'pro',
 planName: 'باقة المحترفين والنمو',
 amount: 2400,
 templateId: 'fasco-fashion',
 templateName: 'فاسكو ستريت وير (FASCO)',
 paymentMethod: 'vodafone_cash',
 transactionRef: 'VF-19283749',
 receiptImageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80',
 status: 'deployed_live',
 approvedAt: '2026-11-11 14:30',
 },
];

export const OwnerAdminPage: React.FC<OwnerAdminPageProps> = ({
  onBackToHome,
  onLogoutAdmin,
  onOpenStoreLive,
  onOpenMerchantPortal,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [orders, setOrders] = useState<ClientOrderRequest[]>([]);
  const [tenantStores, setTenantStores] = useState<Record<string, TenantStoreAccount>>({});
  const [adminViewTab, setAdminViewTab] = useState<'orders' | 'tenants' | 'vercel_hub' | 'google_cloud'>('orders');
  const [tenantSearchQuery, setTenantSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Vercel config & live state
  const [vercelToken, setVercelToken] = useState(getActiveVercelConfig().token);
  const [vercelProjectId, setVercelProjectId] = useState(getActiveVercelConfig().projectId);
  const [vercelTeamId, setVercelTeamId] = useState(getActiveVercelConfig().teamId || '');
  const [vercelConnStatus, setVercelConnStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');
  const [vercelConnMessage, setVercelConnMessage] = useState('');
  const [vercelDomains, setVercelDomains] = useState<VercelDomainRecord[]>([]);
  const [isLoadingDomains, setIsLoadingDomains] = useState(false);
  const [newDomainInput, setNewDomainInput] = useState('');
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [dnsCheckResult, setDnsCheckResult] = useState<LiveDnsCheckResult | null>(null);
  const [dnsCheckingDomain, setDnsCheckingDomain] = useState<string | null>(null);

  // Google OAuth config state
  const [googleClientId, setGoogleClientId] = useState(getActiveGoogleClientId());
  const [googleSavedMsg, setGoogleSavedMsg] = useState('');

  // Admin Master Password state & Secret link
  const [isChangePwdOpen, setIsChangePwdOpen] = useState(false);
  const [newAdminPwd, setNewAdminPwd] = useState('');
  const [copiedSecretUrl, setCopiedSecretUrl] = useState(false);

  const handleCopySecretUrl = () => {
    playClick();
    const url = `${window.location.origin}${window.location.pathname}#secret-admin`;
    navigator.clipboard.writeText(url);
    setCopiedSecretUrl(true);
    setTimeout(() => setCopiedSecretUrl(false), 3000);
  };

  const handleLogoutAndHide = () => {
    playClick();
    setDeviceAdminAuthenticated(false);
    if (onLogoutAdmin) {
      onLogoutAdmin();
    } else {
      onBackToHome();
    }
  };

  const handleSaveAndTestVercel = async () => {
    playClick();
    saveVercelConfig({
      token: vercelToken,
      projectId: vercelProjectId,
      teamId: vercelTeamId || undefined,
    });
    setVercelConnStatus('testing');
    setVercelConnMessage('جاري اختبار الاتصال بسيرفرات Vercel...');

    const res = await testVercelConnection();
    if (res.success) {
      setVercelConnStatus('connected');
      setVercelConnMessage(
        `✓ تم الاتصال بـ Vercel بنجاح! اسم المشروع: ${res.project?.name || vercelProjectId} (Framework: ${res.project?.framework || 'Vite'})`
      );
      handleFetchVercelDomains();
    } else {
      setVercelConnStatus('error');
      setVercelConnMessage(`فشل الاتصال: ${res.error}`);
    }
  };

  const handleFetchVercelDomains = async () => {
    setIsLoadingDomains(true);
    const res = await listVercelProjectDomains();
    setIsLoadingDomains(false);
    if (res.success && res.domains) {
      setVercelDomains(res.domains);
    }
  };

  const handleAddDomainDirectlyToVercel = async () => {
    if (!newDomainInput.trim()) return;
    playClick();
    setIsAddingDomain(true);
    const res = await addDomainToVercel(newDomainInput.trim());
    setIsAddingDomain(false);
    if (res.success) {
      setActionSuccessMessage(`تمت إضافة الدومين (${newDomainInput}) إلى مشروع Vercel بنجاح!`);
      setNewDomainInput('');
      handleFetchVercelDomains();
    } else {
      alert(`خطأ: ${res.error}`);
    }
  };

  const handleAdminDnsCheck = async (domain: string) => {
    setDnsCheckingDomain(domain);
    const res = await checkDomainLiveDns(domain);
    setDnsCheckingDomain(null);
    setDnsCheckResult(res);
  };

  // Load tenant stores from localStorage
  const loadTenantStores = () => {
    try {
      const raw = localStorage.getItem('sketch_tenant_stores');
      if (raw) {
        setTenantStores(JSON.parse(raw));
      } else {
        const initialSeed: Record<string, TenantStoreAccount> = {
          sportech: {
            tenantId: 'tenant_sportech',
            subdomain: 'sportech',
            brandName: 'سبورتك إيجيبت (SPORTECH)',
            ownerName: 'كريم الأحمدي',
            ownerPhone: '01012345678',
            planTier: 'pro',
            status: 'active',
            templateId: 'sportech-sneakers',
            createdAt: '2026-03-01T10:00:00.000Z',
            salesTotal: 48900,
            ordersCount: 42,
            storeConfig: {
              storeName: 'سبورتك إيجيبت (SPORTECH)',
              tagline: 'تسوق أفضل كوتشيات سنيكرز أصلية وضمان استبدال فوري',
              niche: 'sneakers',
              templateId: 'sportech-sneakers',
              accentColor: '#52525B',
              customDomain: 'sportech.sketchorder.com',
              currency: 'ج.م',
              whatsappNumber: '01012345678',
              governorate: 'القاهرة',
              sections: {
                heroBanner: true,
                categoriesBar: true,
                sizeGuide: true,
                bestSellers: true,
                flashSale: true,
                reviewsSection: true,
                instantWhatsappCart: true,
                analyticsDashboard: true,
              },
              categories: ['الكل', 'كوتشيات جري', 'سنيكرز خروج', 'كاجوال سلايدز', 'شرابات واكسسوارات'],
              products: [],
            },
          },
          fasco: {
            tenantId: 'tenant_fasco',
            subdomain: 'fasco',
            brandName: 'فاسكو ستريت وير (FASCO)',
            ownerName: 'ياسين البدري',
            ownerPhone: '01122334455',
            planTier: 'pro',
            status: 'active',
            templateId: 'fasco-fashion',
            createdAt: '2026-03-02T12:00:00.000Z',
            salesTotal: 32400,
            ordersCount: 28,
            storeConfig: {
              storeName: 'فاسكو ستريت وير (FASCO)',
              tagline: 'ملابس أوفر سايز وتصميمات ستريت وير حصرية',
              niche: 'streetwear',
              templateId: 'fasco-fashion',
              accentColor: '#52525B',
              customDomain: 'fasco.sketchorder.com',
              currency: 'ج.م',
              whatsappNumber: '01122334455',
              governorate: 'الجيزة',
              sections: {
                heroBanner: true,
                categoriesBar: true,
                sizeGuide: true,
                bestSellers: true,
                flashSale: true,
                reviewsSection: true,
                instantWhatsappCart: true,
                analyticsDashboard: true,
              },
              categories: ['الكل', 'هوديز قطن', 'تيشيرتات بوكسي', 'بناطيل كارجو'],
              products: [],
            },
          },
        };
        localStorage.setItem('sketch_tenant_stores', JSON.stringify(initialSeed));
        setTenantStores(initialSeed);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadTenantStores();
  }, []);

  // Toggle store active / suspended
  const handleToggleTenantStatus = (subdomain: string) => {
    playClick();
    const current = tenantStores[subdomain];
    if (!current) return;
    const newStatus: 'active' | 'suspended' = current.status === 'active' ? 'suspended' : 'active';
    const updated: Record<string, TenantStoreAccount> = {
      ...tenantStores,
      [subdomain]: {
        ...current,
        status: newStatus,
      },
    };
    setTenantStores(updated);
    localStorage.setItem('sketch_tenant_stores', JSON.stringify(updated));
    setActionSuccessMessage(
      newStatus === 'active'
        ? `تم تفعيل وتشغيل متجر "${current.brandName}" لايف بنجاح!`
        : `تم تعطيل متجر "${current.brandName}" مؤقتاً!`
    );
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  // Permanently delete store & subdomain
  const handleDeleteTenantStore = (subdomain: string) => {
    playClick();
    const current = tenantStores[subdomain];
    const name = current ? current.brandName : subdomain;
    if (
      confirm(
        `هل أنت متأكد تماماً من حذف متجر "${name}" والدومين (${subdomain}.sketchorder.com) نهائياً؟\nلن يتمكن العميل أو زبائنه من الدخول إليه مجدداً.`
      )
    ) {
      const updated = { ...tenantStores };
      delete updated[subdomain];
      setTenantStores(updated);
      localStorage.setItem('sketch_tenant_stores', JSON.stringify(updated));
      setActionSuccessMessage(`تم حذف متجر "${name}" والدومين الفرعي نهائياً.`);
      setTimeout(() => setActionSuccessMessage(null), 4000);
    }
  };

 // Load orders from localStorage or defaults
 useEffect(() => {
 try {
 const savedOrders = localStorage.getItem('sketch_order_client_requests');
 if (savedOrders) {
 setOrders(JSON.parse(savedOrders));
 } else {
 localStorage.setItem('sketch_order_client_requests', JSON.stringify(DEFAULT_ORDERS_MOCK));
 setOrders(DEFAULT_ORDERS_MOCK);
 }
 } catch {
 setOrders(DEFAULT_ORDERS_MOCK);
 }
 }, []);

 const saveOrders = (newOrders: ClientOrderRequest[]) => {
 setOrders(newOrders);
 try {
 localStorage.setItem('sketch_order_client_requests', JSON.stringify(newOrders));
 } catch (e) {
 console.error(e);
 }
 };

 // 1-Click Store Approval & Automatic Tenant Provisioning
 const handleApproveAndDeploy = (order: ClientOrderRequest) => {
 playCashSound();
 
 // 1. Update order status
 const updated = orders.map((o) =>
 o.id === order.id
 ? {
 ...o,
 status: 'deployed_live' as const,
 approvedAt: new Date().toLocaleString('ar-EG'),
 }
 : o
 );
 saveOrders(updated);

 // 2. Automatically provision Tenant Store into `sketch_tenant_stores`
 try {
 const existingStoresRaw = localStorage.getItem('sketch_tenant_stores');
 const stores: Record<string, TenantStoreAccount> = existingStoresRaw
 ? JSON.parse(existingStoresRaw)
 : {};

 const templateMeta =
 STUDIO_TEMPLATES.find((t) => t.id === order.templateId) || STUDIO_TEMPLATES[0];
 const prods =
 DEFAULT_PRODUCTS_MAP[order.templateId] || DEFAULT_PRODUCTS_MAP['sportech-sneakers'];
 const cats =
 DEFAULT_CATEGORIES_MAP[order.templateId] || ['الكل', 'منتجات مميزة'];

 const newTenant: TenantStoreAccount = {
 tenantId: `tenant_${order.subdomain}`,
 subdomain: order.subdomain,
 brandName: order.brandName,
 ownerName: order.clientName,
 ownerPhone: order.whatsappNumber,
 planTier: order.selectedPlan,
 status: 'active',
 templateId: order.templateId,
 createdAt: new Date().toISOString(),
 salesTotal: 0,
 ordersCount: 0,
 storeConfig: {
 storeName: order.brandName,
 tagline: templateMeta.description || 'أفضل المنتجات بأعلى جودة وضمان حقيقي',
 niche: 'sneakers',
 templateId: order.templateId,
 accentColor: templateMeta.accentColor,
 customDomain: `${order.subdomain}.sketchorder.com`,
 currency: 'ج.م',
 whatsappNumber: order.whatsappNumber,
 governorate: 'القاهرة',
 sections: {
 heroBanner: true,
 categoriesBar: true,
 sizeGuide: true,
 bestSellers: true,
 flashSale: true,
 reviewsSection: true,
 instantWhatsappCart: true,
 analyticsDashboard: true,
 },
 categories: cats,
 products: prods,
 },
 };

 stores[order.subdomain] = newTenant;
 localStorage.setItem('sketch_tenant_stores', JSON.stringify(stores));
      setTenantStores(stores);

 // Dispatch storage event to alert other tabs/components
 window.dispatchEvent(
 new CustomEvent('sketch_tenant_store_activated', {
 detail: { subdomain: order.subdomain, brandName: order.brandName },
 })
 );
 } catch (err) {
 console.error('Failed to provision tenant store:', err);
 }

 setActionSuccessMessage(`تمت الموافقة وتفعيل متجر "${order.brandName}" بنجاح! `);
 setTimeout(() => setActionSuccessMessage(null), 4000);
 };

 const handleDeleteOrder = (id: string) => {
 playClick();
 if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
 const updated = orders.filter((o) => o.id !== id);
 saveOrders(updated);
 }
 };

 const handleResetDefaults = () => {
 playClick();
 if (confirm('هل تريد إعادة تعيين الطلبات التجريبية للوضع الافتراضي؟')) {
 saveOrders(DEFAULT_ORDERS_MOCK);
 }
 };

 const handleAddNewDemoOrder = () => {
 playCashSound();
 const demoId = `SK-${Math.floor(1000 + Math.random() * 9000)}`;
 const randomSub = `store-${Math.floor(100 + Math.random() * 900)}`;
 const newDemo: ClientOrderRequest = {
 id: demoId,
 createdAt: new Date().toLocaleString('ar-EG'),
 clientName: 'طارق الزيات',
 whatsappNumber: '01099887766',
 brandName: 'برجر فاكتوري إيجيبت',
 subdomain: randomSub,
 selectedPlan: 'pro',
 planName: 'باقة المحترفين والنمو',
 amount: 2400,
 templateId: 'burger-club',
 templateName: 'برجر كلوب (Burger Club & Fries)',
 paymentMethod: 'instapay',
 transactionRef: `IP-${Math.floor(100000000 + Math.random() * 900000000)}`,
 receiptImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
 notes: 'تم التحويل عبر إنستاباي، في انتظار التفعيل فوراً.',
 status: 'pending_review',
 };
 const updated = [newDemo, ...orders];
 saveOrders(updated);
 setActionSuccessMessage(`تمت إضافة طلب جديد تجريبي (#${demoId}) بنجاح! `);
 setTimeout(() => setActionSuccessMessage(null), 3500);
 };

 // KPIs
 const totalRevenue = orders
 .filter((o) => o.status === 'deployed_live')
 .reduce((sum, o) => sum + (typeof o.amount === 'number' ? o.amount : 0), 0);
 const pendingCount = orders.filter((o) => o.status === 'pending_review').length;
 const liveCount = orders.filter((o) => o.status === 'deployed_live').length;

 const filteredOrders = orders.filter((o) => {
 const matchesStatus =
 filterStatus === 'all' ||
 (filterStatus === 'pending' && o.status === 'pending_review') ||
 (filterStatus === 'approved' && o.status === 'deployed_live');
 const matchesSearch =
 searchQuery === '' ||
 o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
 o.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
 o.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
 o.whatsappNumber.includes(searchQuery) ||
 o.id.toLowerCase().includes(searchQuery.toLowerCase());
 return matchesStatus && matchesSearch;
 });

 return (
 <div
 className={`min-h-screen transition-colors duration-200 ${
 isDarkMode ? 'bg-[#0B0F17] text-[#F8FAFC]' : 'bg-[#FAF8F5] text-[#0F0F0F]'
 } font-body antialiased selection:bg-[#D9722B] selection:text-white pb-20`}
 >
 {/* ======================================================== */}
 {/* 1. TOP HEADER IN STRICT SKETCH THEME */}
 {/* ======================================================== */}
 <header
 className={`sticky top-0 z-40 border-b-2 transition-colors ${
 isDarkMode
 ? 'bg-[#0B0F17]/95 border-slate-700 shadow-md'
 : 'bg-[#FFFDF9]/95 border-[#0F0F0F] shadow-xs'
 } backdrop-blur-md`}
 >
 <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
 {/* Back & Logo */}
 <div className="flex items-center gap-3">
 <button
 onClick={() => {
 playClick();
 onBackToHome();
 }}
 className={`flex items-center gap-2 px-3.5 py-2 text-xs font-black transition-transform active:scale-95 ${
 isDarkMode
 ? 'btn-sketch-dark bg-slate-900 border-2 border-slate-700 text-white'
 : 'btn-sketch btn-sketch-secondary border-2 border-[#0F0F0F]'
 }`}
 >
 <ArrowRight className="w-4 h-4 ml-0.5" />
 <span>العودة للرئيسية</span>
 </button>

 <div className="flex items-center gap-2.5 border-r-2 border-inherit pr-3">
 <img
 src={logoSquareImg}
 alt="Sketch Order"
 className={`w-9 h-9 object-contain ${isDarkMode ? 'invert' : ''}`}
 />
 <img src={mascotPng} alt="Mascot" className="w-8 h-8 object-contain hidden sm:block -rotate-6" />
 <div>
 <div className="flex items-center gap-2">
 <h1 className="font-heading font-black text-lg sm:text-xl leading-none">
 لوحة تحكم إدارة المنصة (Owner Admin)
 </h1>
 <span className="text-[10px] font-mono font-black bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white px-2 py-0.5 rounded-full border border-[#D9722B] shadow-xs">
 LIVE SAAS
 </span>
 </div>
 <p className="text-[11px] font-bold opacity-70">
 مراجعة طلبات الشراء، فحص سكرينات التحويل وتفعيل المتاجر المستقلة فوراً
 </p>
 </div>
 </div>
 </div>

 {/* Actions & Dark Theme Toggle */}
 <div className="flex items-center gap-2 sm:gap-3">
 <button
 onClick={handleAddNewDemoOrder}
 className="px-3.5 py-2 rounded-xl bg-[#D9722B] hover:bg-[#C25E1D] text-white dark:bg-[#D9722B] dark:hover:bg-[#C25E1D] dark:text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 -rotate-1"
 >
 <Plus className="w-4 h-4" />
 <span className="hidden sm:inline">طلب تجريبي جديد</span>
 </button>

            {/* Logout and hide admin icon button */}
            <button
              onClick={handleLogoutAndHide}
              className="px-3 py-2 rounded-xl border-2 border-red-500/60 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-black flex items-center gap-1.5 transition-all shadow-xs"
              title="تسجيل الخروج وإلغاء تذكر هذا الجهاز وإخفاء الأيقونة"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">خروج وإخفاء الأيقونة</span>
            </button>

            {/* Dark Mode Button */}
            <button
              onClick={() => {
                playClick();
                onToggleDarkMode();
              }}
              className={`p-2.5 rounded-xl border-2 font-bold text-xs flex items-center gap-1.5 transition-all ${
                isDarkMode
                  ? 'bg-[#D9722B]/10 border-[#D9722B] dark:border-[#D9722B]/60 text-zinc-400 hover:bg-[#C25E1D]/20'
                  : 'bg-white border-[#0F0F0F] text-[#0F0F0F] hover:bg-slate-100'
              }`}
              title={isDarkMode ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي (Dark)'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-zinc-400" /> : <Moon className="w-4 h-4 text-slate-800" />}
            </button>
          </div>
        </div>
      </header>

      {/* Success Banner Alert */}
      {actionSuccessMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 animate-fadeIn">
          <div className="p-3.5 rounded-2xl bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white font-black text-sm flex items-center justify-between border-2 border-[#D9722B] shadow-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{actionSuccessMessage}</span>
            </div>
            <button onClick={() => setActionSuccessMessage(null)} className="p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Secret Admin Vault Banner & Secret URL Card */}
        <section
          className={`p-4 sm:p-5 rounded-2xl border-2 sketch-border-2 transition-all ${
            isDarkMode
              ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
              : 'bg-amber-50 border-amber-600/40 text-amber-950'
          }`}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-500 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-sm sm:text-base">
                    جلسة إدارة سرية موثقة على هذا الجهاز (Secret Admin Session)
                  </h3>
                  <span className="text-[10px] font-mono bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                    مخفية عن الزوار
                  </span>
                </div>
                <p className="text-xs opacity-80 mt-0.5 leading-relaxed">
                  أيقونة الإدارة تظهر الآن على هذا المتصفح فقط ومخفية تماماً عن الزوار العاديين على الويب. استخدم الرابط السري أدناه للوصول إليها من أي جهاز آخر.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <button
                onClick={handleCopySecretUrl}
                className="btn-sketch text-xs py-2 px-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black flex items-center gap-1.5 shadow-sm"
              >
                {copiedSecretUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSecretUrl ? 'تم نسخ الرابط السري!' : 'نسخ الرابط السري (#secret-admin)'}</span>
              </button>

              <button
                onClick={() => setIsChangePwdOpen(true)}
                className="px-3.5 py-2 rounded-xl border border-inherit/40 bg-neutral-100 dark:bg-slate-800 text-xs font-bold hover:border-amber-500 flex items-center gap-1.5"
              >
                <KeyRound className="w-4 h-4 text-amber-500" />
                <span>تغيير كلمة المرور</span>
              </button>
            </div>
          </div>
        </section>
 {/* ======================================================== */}
 {/* 2. SKETCH KPI CARDS (Doodle Style) */}
 {/* ======================================================== */}
 <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {/* KPI 1: Revenue */}
 <div
 className={`p-5 rounded-2xl border-2 transition-transform hover:-translate-y-1 ${
 isDarkMode
 ? 'bg-[#111827] border-slate-700 shadow-[4px_4px_0px_#1F2937]'
 : 'bg-white border-[#0F0F0F] shadow-[4px_4px_0px_#0F0F0F]'
 } sketch-border-1 relative overflow-hidden`}
 >
 <div className="flex items-center justify-between mb-2">
 <span className="text-xs font-mono font-black opacity-75">إجمالي الإيرادات المحصلة</span>
 <div className="w-8 h-8 rounded-full bg-[#D9722B]/20 text-[#D9722B] dark:text-[#E88B4D] flex items-center justify-center font-bold">
 <DollarSign className="w-4 h-4" />
 </div>
 </div>
 <div className="text-3xl font-black font-mono tracking-tight text-[#D9722B] dark:text-[#E88B4D]">
 {totalRevenue.toLocaleString()} <span className="text-sm font-heading">ج.م</span>
 </div>
 <p className="text-[11px] font-bold opacity-60 mt-1">دفع لمرة واحدة • أرباح المنصة صافية 100%</p>
 </div>

 {/* KPI 2: Live Stores */}
 <div
 className={`p-5 rounded-2xl border-2 transition-transform hover:-translate-y-1 ${
 isDarkMode
 ? 'bg-[#111827] border-slate-700 shadow-[4px_4px_0px_#1F2937]'
 : 'bg-white border-[#0F0F0F] shadow-[4px_4px_0px_#0F0F0F]'
 } sketch-border-2 relative overflow-hidden`}
 >
 <div className="flex items-center justify-between mb-2">
 <span className="text-xs font-mono font-black opacity-75">متاجر مفعلة ونشطة (Live)</span>
 <div className="w-8 h-8 rounded-full bg-[#D9722B]/20 text-[#D9722B] dark:text-[#E88B4D] flex items-center justify-center font-bold">
 <Store className="w-4 h-4" />
 </div>
 </div>
 <div className="text-3xl font-black font-mono tracking-tight text-[#D9722B] dark:text-[#E88B4D]">
 {liveCount} <span className="text-sm font-heading">متجر</span>
 </div>
 <p className="text-[11px] font-bold opacity-60 mt-1">شغالة بدومينات ساب مستقلة وقابلة للبيع</p>
 </div>

 {/* KPI 3: Pending Review */}
 <div
 className={`p-5 rounded-2xl border-2 transition-transform hover:-translate-y-1 ${
 isDarkMode
 ? 'bg-[#111827] border-slate-700 shadow-[4px_4px_0px_#1F2937]'
 : 'bg-white border-[#0F0F0F] shadow-[4px_4px_0px_#0F0F0F]'
 } sketch-border-3 relative overflow-hidden`}
 >
 <div className="flex items-center justify-between mb-2">
 <span className="text-xs font-mono font-black opacity-75">بانتظار المراجعة والتفعيل</span>
 <div className="w-8 h-8 rounded-full bg-[#D9722B]/20 text-[#D9722B] dark:text-[#E88B4D] flex items-center justify-center font-bold animate-pulse">
 <Clock className="w-4 h-4" />
 </div>
 </div>
 <div className="text-3xl font-black font-mono tracking-tight text-[#D9722B] dark:text-[#E88B4D]">
 {pendingCount} <span className="text-sm font-heading">طلب جديد</span>
 </div>
 <p className="text-[11px] font-bold opacity-60 mt-1">يحتاج فحص سكرين التحويل والضغط تفعيل</p>
 </div>

 {/* KPI 4: Total Orders */}
 <div
 className={`p-5 rounded-2xl border-2 transition-transform hover:-translate-y-1 ${
 isDarkMode
 ? 'bg-[#111827] border-slate-700 shadow-[4px_4px_0px_#1F2937]'
 : 'bg-white border-[#0F0F0F] shadow-[4px_4px_0px_#0F0F0F]'
 } sketch-border-1 relative overflow-hidden`}
 >
 <div className="flex items-center justify-between mb-2">
 <span className="text-xs font-mono font-black opacity-75">إجمالي الطلبات المسجلة</span>
 <div className="w-8 h-8 rounded-full bg-[#D9722B]/20 text-[#D9722B] dark:text-[#E88B4D] flex items-center justify-center font-bold">
 <Sparkles className="w-4 h-4" />
 </div>
 </div>
 <div className="text-3xl font-black font-mono tracking-tight text-[#D9722B] dark:text-[#E88B4D]">
 {orders.length} <span className="text-sm font-heading">طلب</span>
 </div>
 <p className="text-[11px] font-bold opacity-60 mt-1">نسبة التحويل والإغلاق 94%</p>
 </div>
 </section>

 {/* ======================================================== */}
 {/* 3. CONTROLS, SEARCH & FILTERS */}
 {/* ======================================================== */}
 <section
 className={`p-4 sm:p-5 rounded-2xl border-2 ${
 isDarkMode ? 'bg-[#111827] border-slate-700' : 'bg-white border-[#0F0F0F]'
 } sketch-border-2 flex flex-col md:flex-row items-center justify-between gap-4`}
 >
 {/* Filters */}
 <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto scrollbar-none">
 <button
 onClick={() => {
 playClick();
 setFilterStatus('all');
 }}
 className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${
 filterStatus === 'all'
 ? 'bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white border-[#D9722B] shadow-xs'
 : 'bg-transparent border-inherit opacity-70 hover:opacity-100'
 }`}
 >
 الكل ({orders.length})
 </button>
 <button
 onClick={() => {
 playClick();
 setFilterStatus('pending');
 }}
 className={`px-4 py-2 rounded-xl text-xs font-black transition-all border flex items-center gap-1.5 ${
 filterStatus === 'pending'
 ? 'bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white border-[#D9722B] shadow-xs'
 : 'bg-transparent border-inherit opacity-70 hover:opacity-100'
 }`}
 >
 <Clock className="w-3.5 h-3.5" />
 <span>بانتظار المراجعة ({pendingCount})</span>
 </button>
 <button
 onClick={() => {
 playClick();
 setFilterStatus('approved');
 }}
 className={`px-4 py-2 rounded-xl text-xs font-black transition-all border flex items-center gap-1.5 ${
 filterStatus === 'approved'
 ? 'bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white border-[#D9722B] shadow-xs'
 : 'bg-transparent border-inherit opacity-70 hover:opacity-100'
 }`}
 >
 <CheckCircle2 className="w-3.5 h-3.5" />
 <span>متاجر مفعلة ومباشرة ({liveCount})</span>
 </button>
 </div>

 {/* Search Bar + Reset */}
 <div className="flex items-center gap-3 w-full md:w-auto">
 <div className="relative flex-1 sm:w-72">
 <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
 <input
 type="text"
 placeholder="ابحث بالاسم، البراند، الدومين، أو الهاتف..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className={`w-full pr-10 pl-3 py-2 rounded-xl text-xs font-bold border-2 transition-all outline-none ${
 isDarkMode
 ? 'bg-slate-900 border-slate-700 text-white focus:border-[#D9722B] dark:border-[#D9722B]/60'
 : 'bg-[#FAF8F5] border-[#0F0F0F] text-[#0F0F0F] focus:border-[#D9722B] dark:border-[#D9722B]/60'
 }`}
 />
 </div>

 <button
 onClick={handleResetDefaults}
 className={`p-2 rounded-xl border-2 transition-colors opacity-70 hover:opacity-100 ${
 isDarkMode ? 'border-slate-700 text-slate-300' : 'border-[#0F0F0F] text-[#0F0F0F]'
 }`}
 title="إعادة تعيين البيانات الافتراضية"
 >
 <RefreshCw className="w-4 h-4" />
 </button>
 </div>
 </section>


      {/* ======================================================== */}
      {/* 4. MAIN VIEW TABS: ORDERS vs TENANT SUBDOMAINS */}
      {/* ======================================================== */}
      <div className="flex flex-wrap items-center gap-3 border-b-2 border-inherit pb-3">
        <button
          onClick={() => {
            playClick();
            setAdminViewTab('orders');
          }}
          className={`px-5 py-2.5 rounded-xl font-heading font-black text-xs sm:text-sm transition-all border-2 flex items-center gap-2 ${
            adminViewTab === 'orders'
              ? 'bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white border-[#D9722B] shadow-sm -rotate-1'
              : 'bg-transparent border-inherit opacity-75 hover:opacity-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>طلبات الشراء وفحص التحويلات ({orders.length})</span>
        </button>

        <button
          onClick={() => {
            playClick();
            setAdminViewTab('tenants');
          }}
          className={`px-5 py-2.5 rounded-xl font-heading font-black text-xs sm:text-sm transition-all border-2 flex items-center gap-2 ${
            adminViewTab === 'tenants'
              ? 'bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white border-[#D9722B] shadow-sm rotate-1'
              : 'bg-transparent border-inherit opacity-75 hover:opacity-100'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>إدارة المتاجر والدومينات الفرعية ({Object.keys(tenantStores).length})</span>
        </button>

        <button
          onClick={() => {
            playClick();
            setAdminViewTab('vercel_hub');
          }}
          className={`px-5 py-2.5 rounded-xl font-heading font-black text-xs sm:text-sm transition-all border-2 flex items-center gap-2 ${
            adminViewTab === 'vercel_hub'
              ? 'bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white border-[#D9722B] shadow-sm -rotate-1'
              : 'bg-transparent border-inherit opacity-75 hover:opacity-100'
          }`}
        >
          <Cloud className="w-4 h-4" />
          <span>ربط Vercel API والدومينات الحقيقية</span>
        </button>

        <button
          onClick={() => {
            playClick();
            setAdminViewTab('google_cloud');
          }}
          className={`px-5 py-2.5 rounded-xl font-heading font-black text-xs sm:text-sm transition-all border-2 flex items-center gap-2 ${
            adminViewTab === 'google_cloud'
              ? 'bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white border-[#D9722B] shadow-sm rotate-1'
              : 'bg-transparent border-inherit opacity-75 hover:opacity-100'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>إعدادات Google Cloud OAuth</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ORDERS & STORES TABLE / CARDS */}
      {/* ======================================================== */}
      {adminViewTab === 'orders' && (
      <section className="space-y-4">
 <div className="flex items-center justify-between">
 <h2 className="font-heading font-black text-xl">
 طلبات المتاجر وعمليات الدفع ({filteredOrders.length})
 </h2>
 <span className="text-xs font-bold opacity-60">
 يتم حفظ أي تحديث فورياً في التخزين المحلي للمنصة
 </span>
 </div>

 {filteredOrders.length === 0 ? (
 <div
 className={`p-12 text-center rounded-3xl border-2 border-dashed ${
 isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-300 bg-white'
 } space-y-3`}
 >
 <Store className="w-10 h-10 mx-auto opacity-30" />
 <p className="font-heading font-black text-lg">لا توجد طلبات تطابق بحثك حالياً</p>
 <button
 onClick={() => {
 setSearchQuery('');
 setFilterStatus('all');
 }}
 className="text-xs font-bold text-[#D9722B] dark:text-[#E88B4D] underline"
 >
 إلغاء الفلاتر وعرض كل الطلبات
 </button>
 </div>
 ) : (
 <div className="grid grid-cols-1 gap-4">
 {filteredOrders.map((order) => {
 const isLive = order.status === 'deployed_live';
 return (
 <div
 key={order.id}
 className={`p-5 rounded-2xl border-2 transition-all ${
 isDarkMode
 ? 'bg-[#111827] border-slate-700 hover:border-slate-500 shadow-[4px_4px_0px_#1E293B]'
 : 'bg-white border-[#0F0F0F] hover:border-[#D9722B] dark:border-[#D9722B]/60 shadow-[4px_4px_0px_#0F0F0F]'
 } sketch-border-1 space-y-4`}
 >
 {/* Header Row: ID, Status, Date */}
 <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 border-inherit/20">
 <div className="flex items-center gap-3">
 <span className="font-mono font-black text-sm px-2.5 py-1 rounded-lg bg-[#D9722B]/10 text-[#D9722B] dark:text-[#E88B4D] border border-[#D9722B]/30">
 #{order.id}
 </span>
 <h3 className="font-heading font-black text-base sm:text-lg">
 {order.brandName}
 </h3>
 <span className="text-xs font-mono font-bold text-slate-400">
 ({order.subdomain}.sketchorder.com)
 </span>
 </div>

 <div className="flex items-center gap-2">
 {isLive ? (
 <span className="px-3 py-1 rounded-full text-xs font-black bg-[#D9722B]/15 text-[#D9722B] dark:text-[#E88B4D] border border-[#D9722B]/30 flex items-center gap-1.5">
 <span className="w-2 h-2 rounded-full bg-[#D9722B] animate-ping"></span>
 <span>متجر مباشر وشغال </span>
 </span>
 ) : (
 <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-200 dark:bg-slate-800 text-zinc-400 border border-slate-700 flex items-center gap-1.5">
 <Clock className="w-3.5 h-3.5 animate-spin" />
 <span>بانتظار الموافقة والتفعيل </span>
 </span>
 )}
 <span className="text-xs font-mono opacity-50">{order.createdAt}</span>
 </div>
 </div>

 {/* Middle Info Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
 {/* Client info */}
 <div>
 <span className="text-slate-400 block mb-1">صاحب المتجر والواتساب:</span>
 <div className="font-black text-sm">{order.clientName}</div>
 <a
 href={`https://wa.me/20${order.whatsappNumber.replace(/^0/, '')}?text=${encodeURIComponent(
 `أهلاً يا ${order.clientName}، بخصوص طلب متجرك "${order.brandName}" على سكتش أوردر:`
 )}`}
 target="_blank"
 rel="noreferrer"
 className="text-[#D9722B] dark:text-[#E88B4D] font-bold flex items-center gap-1 mt-1 hover:underline"
 >
 <MessageCircle className="w-3.5 h-3.5" />
 <span className="font-mono">{order.whatsappNumber}</span>
 </a>
 {order.customerEmail && (
   <a
     href={`mailto:${order.customerEmail}?subject=${encodeURIComponent(`تفعيل متجر ${order.brandName} - سكتش أوردر`)}`}
     className="text-emerald-500 font-mono text-[11px] font-bold flex items-center gap-1 mt-1 hover:underline"
     title="مراسلة العميل عبر البريد الإلكتروني"
   >
     <Mail className="w-3.5 h-3.5" />
     <span className="truncate">{order.customerEmail}</span>
     {order.isGoogleVerified && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 rounded">Google ✓</span>}
   </a>
 )}
 </div>

 {/* Package & Template */}
 <div>
 <span className="text-slate-400 block mb-1">الباقة والقالب المختار:</span>
 <div className="font-black text-sm">{order.planName}</div>
 <div className="text-[#D9722B] dark:text-[#E88B4D] font-bold mt-1">{order.templateName}</div>
 </div>

 {/* Payment & Amount */}
 <div>
 <span className="text-slate-400 block mb-1">طريقة الدفع والقيمة:</span>
 <div className="font-black text-base text-[#D9722B] dark:text-[#E88B4D] font-mono">
 {typeof order.amount === 'number' ? order.amount.toLocaleString() : order.amount} ج.م
 </div>
 <div className="font-bold opacity-80 mt-0.5">
 {order.paymentMethod === 'instapay'
 ? 'إنستاباي (InstaPay)'
 : order.paymentMethod === 'vodafone_cash'
 ? 'فودافون كاش'
 : 'فيزا كارت'}
 {order.transactionRef && (
 <span className="block text-[11px] font-mono text-slate-400">
 Ref: {order.transactionRef}
 </span>
 )}
 </div>
 </div>

 {/* Receipt Preview */}
 <div>
 <span className="text-slate-400 block mb-1">سكرين شوت التحويل:</span>
 {order.receiptImageUrl ? (
 <button
 onClick={() => setSelectedReceiptUrl(order.receiptImageUrl || null)}
 className="flex items-center gap-2 p-1.5 rounded-xl border border-inherit/30 hover:border-[#D9722B] dark:border-[#D9722B]/60 transition-all bg-inherit group text-right"
 >
 <img
 src={order.receiptImageUrl}
 alt="Receipt"
 className="w-10 h-10 rounded-lg object-cover border"
 />
 <div>
 <span className="text-[11px] font-bold block group-hover:text-[#D9722B] dark:text-[#E88B4D]">
 معاينة السكرين
 </span>
 <span className="text-[10px] opacity-60">اضغط للتكبير </span>
 </div>
 </button>
 ) : (
 <span className="text-slate-400 text-[11px]">بدون سكرين مرفق</span>
 )}
 </div>
 </div>

 {order.notes && (
 <div className="p-3 rounded-xl bg-[#D9722B]/10 border border-slate-700 text-xs text-slate-300">
 <span className="font-bold">ملاحظات العميل: </span>
 {order.notes}
 </div>
 )}

 {/* Bottom Action Buttons */}
 <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-inherit/15">
 <div className="flex items-center gap-2">
 {/* 1-Click Approve Button */}
 {!isLive ? (
 <button
 onClick={() => handleApproveAndDeploy(order)}
 className="px-5 py-2.5 rounded-xl bg-[#D9722B] hover:bg-[#C25E1D] text-white dark:bg-[#D9722B] dark:hover:bg-[#C25E1D] dark:text-white font-black text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
 >
 <Check className="w-4 h-4 stroke-[3]" />
 <span>الموافقة وتفعيل المتجر فوراً </span>
 </button>
 ) : (
 <div className="flex items-center gap-2">
 {/* Open Live Store button */}
 <button
 onClick={() => {
 playClick();
 onOpenStoreLive(order.subdomain);
 }}
 className="px-4 py-2 rounded-xl bg-[#D9722B] hover:bg-[#C25E1D] text-white dark:bg-[#D9722B] dark:hover:bg-[#C25E1D] dark:text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
 >
 <ExternalLink className="w-3.5 h-3.5" />
 <span>زيارة المتجر المباشر ({order.subdomain}.sketchorder.com)</span>
 </button>

 {/* Open Merchant Portal button */}
 <button
 onClick={() => {
 playClick();
 onOpenMerchantPortal(order.subdomain);
 }}
 className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all ${
 isDarkMode
 ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600'
 : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
 }`}
 >
 <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
 <span>دخول لوحة التاجر كصاحب المتجر</span>
 </button>
 </div>
 )}
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={() => handleDeleteOrder(order.id)}
 className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
 title="حذف الطلب"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 )}
      </section>
      )}

      {/* ======================================================== */}
      {/* TAB 2: TENANT SUBDOMAINS MANAGEMENT (تفعيل ومسح المتاجر) */}
      {/* ======================================================== */}
      {adminViewTab === 'tenants' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-black text-xl flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#D9722B] dark:text-[#E88B4D]" />
                <span>المتاجر المستقلة والدومينات الفرعية المنشأة ({Object.keys(tenantStores).length})</span>
              </h2>
              <p className="text-xs opacity-70 mt-1">
                تحكم كامل في تفعيل أو إيقاف مؤقت أو حذف أي موقع فرعي تم شراؤه بواسطة عميل
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                placeholder="ابحث بالدومين أو اسم المتجر..."
                value={tenantSearchQuery}
                onChange={(e) => setTenantSearchQuery(e.target.value)}
                className={`w-full pr-10 pl-3 py-2 rounded-xl text-xs font-bold border-2 transition-all outline-none ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-[#D9722B] dark:border-[#D9722B]/60'
                    : 'bg-[#FAF8F5] border-[#0F0F0F] text-[#0F0F0F] focus:border-[#D9722B] dark:border-[#D9722B]/60'
                }`}
              />
            </div>
          </div>

          <div className="space-y-4">
            {(Object.entries(tenantStores) as [string, TenantStoreAccount][])
              .filter(([sub, st]) => {
                if (!tenantSearchQuery) return true;
                const q = tenantSearchQuery.toLowerCase();
                return (
                  sub.toLowerCase().includes(q) ||
                  st.brandName.toLowerCase().includes(q) ||
                  st.ownerName.toLowerCase().includes(q)
                );
              })
              .map(([subdomain, store]) => {
                const isActive = store.status === 'active';
                return (
                  <div
                    key={subdomain}
                    className={`p-5 rounded-2xl border-2 transition-all ${
                      isDarkMode
                        ? 'bg-[#111827] border-slate-700 shadow-[4px_4px_0px_#1F2937]'
                        : 'bg-white border-[#0F0F0F] shadow-[4px_4px_0px_#0F0F0F]'
                    } sketch-border-1 space-y-4`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-inherit pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#D9722B]/10 text-[#D9722B] dark:text-[#E88B4D] border border-[#D9722B]/30 flex items-center justify-center font-heading font-black text-sm">
                          <Store className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading font-black text-base">{store.brandName}</h3>
                            <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-slate-800 text-[#D9722B] dark:text-[#E88B4D] font-bold">
                              {subdomain}.sketchorder.com
                            </span>
                          </div>
                          <div className="text-xs opacity-60 mt-0.5">
                            صاحب المتجر: {store.ownerName} • {store.ownerPhone}
                          </div>
                        </div>
                      </div>

                      <div>
                        {isActive ? (
                          <span className="px-3 py-1 sketch-border-tag border-2 border-dashed border-[#0F0F0F] dark:border-white text-xs font-black bg-neutral-100 dark:bg-slate-800 text-[#0F0F0F] dark:text-white flex items-center gap-1.5 -rotate-1">
                            <span className="w-2 h-2 rounded-full bg-[#D9722B] animate-ping"></span>
                            <span>شغال لايف ومفعل ✓</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 sketch-border-tag border-2 border-dashed border-red-500 text-xs font-black bg-red-500/10 text-red-500 flex items-center gap-1.5 rotate-1">
                            <Power className="w-3.5 h-3.5" />
                            <span>معطل مؤقتاً من الإدارة</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-slate-900 border border-inherit">
                        <span className="opacity-60 block">قالب المتجر:</span>
                        <span className="font-black mt-0.5 block">{store.templateId}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-slate-900 border border-inherit">
                        <span className="opacity-60 block">تاريخ الإنشاء:</span>
                        <span className="font-bold mt-0.5 block font-mono">
                          {new Date(store.createdAt).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-slate-900 border border-inherit">
                        <span className="opacity-60 block">إجمالي المبيعات:</span>
                        <span className="font-mono font-black text-[#D9722B] dark:text-[#E88B4D] mt-0.5 block">
                          {(store.salesTotal || 0).toLocaleString()} ج.م
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-slate-900 border border-inherit">
                        <span className="opacity-60 block">عدد الأوردرات:</span>
                        <span className="font-mono font-black mt-0.5 block">
                          {store.ordersCount || 0} أوردر
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            playClick();
                            onOpenStoreLive(subdomain);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#D9722B] hover:bg-[#C25E1D] text-white dark:bg-[#D9722B] dark:hover:bg-[#C25E1D] dark:text-white font-black text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-2xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>معاينة المتجر المباشر</span>
                        </button>

                        <button
                          onClick={() => {
                            playClick();
                            onOpenMerchantPortal(subdomain);
                          }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all ${
                            isDarkMode
                              ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                          }`}
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>دخول لوحة التاجر</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleTenantStatus(subdomain)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all ${
                            isActive
                              ? 'bg-[#D9722B]/10 hover:bg-[#C25E1D]/20 text-[#D9722B] dark:text-[#E88B4D] border-[#D9722B]/30'
                              : 'bg-slate-800 text-white border-slate-600'
                          }`}
                          title={isActive ? 'تعطيل المتجر مؤقتاً' : 'إعادة تفعيل المتجر'}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{isActive ? 'تعطيل المتجر مؤقتاً' : 'إعادة التفعيل لايف'}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteTenantStore(subdomain)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 transition-all"
                          title="حذف المتجر والدومين نهائياً"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف نهائي</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

            {Object.keys(tenantStores).length === 0 && (
              <div
                className={`p-12 text-center rounded-3xl border-2 border-dashed ${
                  isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-300 bg-white'
                } space-y-3`}
              >
                <Globe className="w-10 h-10 mx-auto opacity-30 text-[#D9722B] dark:text-[#E88B4D]" />
                <p className="font-heading font-black text-lg">لا توجد متاجر فرعية منشأة حالياً</p>
                <p className="text-xs opacity-60 max-w-md mx-auto">
                  عندما يقوم أي عميل بشراء متجر وتوافق على طلبه، سيظهر موقعه الفرعي ودومينه المستقل هنا فوراً لإدارته.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* TAB 3: VERCEL API & REAL CUSTOM DOMAINS HUB              */}
      {/* ======================================================== */}
      {adminViewTab === 'vercel_hub' && (
        <section className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl border-2 border-[#0F0F0F] dark:border-slate-700 bg-white dark:bg-[#111827] space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Cloud className="w-6 h-6 text-[#D9722B]" />
                  <h2 className="text-xl font-heading font-black">
                    بوابة الربط المباشر مع Vercel API والدومينات الحقيقية
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  ربط المنصة بحسابك على Vercel لإنشاء وتفعيل الدومينات الحقيقية للعملاء تلقائياً مع شهادات SSL و DNS عالمي.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {vercelConnStatus === 'connected' ? (
                  <span className="px-3 py-1 bg-emerald-500/15 border border-emerald-500 text-emerald-500 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>متصل بـ Vercel API بنجاح</span>
                  </span>
                ) : vercelConnStatus === 'error' ? (
                  <span className="px-3 py-1 bg-red-500/15 border border-red-500 text-red-500 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>خطأ في الاتصال</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-neutral-100 dark:bg-slate-800 border text-slate-500 rounded-full text-xs font-bold">
                    جاهز للاختبار
                  </span>
                )}
              </div>
            </div>

            {/* Inputs Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Vercel Personal Token *</label>
                <input
                  type="password"
                  placeholder="احصل عليه من vercel.com/account/tokens"
                  value={vercelToken}
                  onChange={(e) => setVercelToken(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border bg-neutral-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Vercel Project ID / Slug *</label>
                <input
                  type="text"
                  placeholder="مثال: sketch-order أو prj_xxxx"
                  value={vercelProjectId}
                  onChange={(e) => setVercelProjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border bg-neutral-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Vercel Team ID (اختياري)</label>
                <input
                  type="text"
                  placeholder="team_xxxx (اتركه فارغاً للحساب الشخصي)"
                  value={vercelTeamId}
                  onChange={(e) => setVercelTeamId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border bg-neutral-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSaveAndTestVercel}
                className="btn-sketch btn-sketch-primary text-xs py-2.5 px-4 flex items-center gap-2"
              >
                <Server className="w-4 h-4" />
                <span>حفظ واختبار الاتصال المباشر بـ Vercel</span>
              </button>
              <button
                onClick={handleFetchVercelDomains}
                className="btn-sketch text-xs py-2.5 px-4 border border-slate-300 dark:border-slate-700 flex items-center gap-2 bg-neutral-100 dark:bg-slate-800"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingDomains ? 'animate-spin' : ''}`} />
                <span>جلب قائمة دومينات المشروع الحالية من Vercel</span>
              </button>
            </div>

            {vercelConnMessage && (
              <p
                className={`text-xs font-bold p-3 rounded-xl border ${
                  vercelConnStatus === 'connected'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-500/10 border-red-500 text-red-500'
                }`}
              >
                {vercelConnMessage}
              </p>
            )}

            {/* Add New Custom Domain Directly to Vercel */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="font-heading font-black text-sm">إضافة دومين حقيقي جديد لـ Vercel الآن:</h3>
              <div className="flex gap-2 max-w-lg">
                <input
                  type="text"
                  placeholder="مثال: store.mybrand.com أو mybrand.store"
                  value={newDomainInput}
                  onChange={(e) => setNewDomainInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border bg-neutral-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                  dir="ltr"
                />
                <button
                  onClick={handleAddDomainDirectlyToVercel}
                  disabled={isAddingDomain}
                  className="btn-sketch btn-sketch-primary text-xs py-2 px-4 whitespace-nowrap"
                >
                  {isAddingDomain ? 'جاري الإضافة...' : 'إضافة إلى Vercel'}
                </button>
              </div>
            </div>

            {/* Live Google DNS Inspector */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="font-heading font-black text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#D9722B]" />
                <span>فاحص الـ DNS الحي عبر Google Public DNS:</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                استعلام حقيقي وفوري عبر بروتوكول DNS-over-HTTPS للتأكد أن دومين العميل موجه لسيرفرات Vercel (76.76.21.21).
              </p>
              <div className="flex gap-2 max-w-lg">
                <input
                  type="text"
                  placeholder="اكتب أي دومين لفحصه (مثال: sportech.store)"
                  id="admin-dns-test-input"
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border bg-neutral-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                  dir="ltr"
                />
                <button
                  onClick={() => {
                    const el = document.getElementById('admin-dns-test-input') as HTMLInputElement;
                    if (el && el.value) handleAdminDnsCheck(el.value);
                  }}
                  className="btn-sketch text-xs py-2 px-4 bg-[#D9722B] text-white"
                >
                  {dnsCheckingDomain ? 'جاري الفحص...' : 'فحص DNS لايف'}
                </button>
              </div>
              {dnsCheckResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs font-mono ${
                    dnsCheckResult.isVercelIp
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500 text-amber-300'
                  }`}
                >
                  <div className="font-bold mb-1">{dnsCheckResult.message}</div>
                  <div className="text-[11px] opacity-80">
                    IPs المسترجعة: {dnsCheckResult.resolvedIps.join(', ') || 'لا يوجد'}
                  </div>
                  <div className="text-[10px] opacity-60">وقت الفحص: {dnsCheckResult.checkedAt}</div>
                </div>
              )}
            </div>

            {/* Vercel Project Domains List */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="font-heading font-black text-sm">الدومينات المضافة في مشروع Vercel ({vercelDomains.length}):</h3>
              {vercelDomains.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  اضغط زر "جلب قائمة دومينات المشروع الحالية" لعرض الدومينات الحية المسجلة على فيرسل.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vercelDomains.map((dom) => (
                    <div
                      key={dom.name}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-neutral-50 dark:bg-slate-900/60 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-mono font-bold text-xs" dir="ltr">
                          {dom.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">Apex: {dom.apexName}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {dom.verified ? (
                          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            ✓ موثق
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            بانتظار الـ DNS
                          </span>
                        )}
                        <button
                          onClick={() => handleAdminDnsCheck(dom.name)}
                          className="p-1 rounded bg-neutral-200 dark:bg-slate-800 text-[10px] font-bold hover:bg-[#D9722B] hover:text-white"
                          title="فحص DNS"
                        >
                          فحص
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* TAB 4: GOOGLE CLOUD CONSOLE OAUTH CONFIG                 */}
      {/* ======================================================== */}
      {adminViewTab === 'google_cloud' && (
        <section className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl border-2 border-[#0F0F0F] dark:border-slate-700 bg-white dark:bg-[#111827] space-y-6">
            <div className="flex items-center gap-3 border-b pb-4 border-slate-200 dark:border-slate-800">
              <KeyRound className="w-6 h-6 text-[#4285F4]" />
              <div>
                <h2 className="text-xl font-heading font-black">
                  إعدادات Google Cloud Console Credentials (Real OAuth)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  تفعيل تسجيل الدخول الحقيقي بحسابات جوجل لربط العملاء واستلام بياناتهم وتوثيق عقودهم.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-900 dark:text-blue-200 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <span>خطوات الحصول على الـ Client ID من Google Cloud Console:</span>
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-bold text-[#4285F4] hover:text-blue-600 inline-flex items-center gap-1 mr-2"
                >
                  <span>فتح صفحة Credentials مباشرة</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <ol className="list-decimal list-inside space-y-1 pr-2 opacity-90 leading-relaxed">
                <li>اضغط على <strong>+ CREATE CREDENTIALS</strong> ثم اختر <strong>OAuth client ID</strong>.</li>
                <li>في نوع التطبيق (Application type) اختر <strong>Web application</strong>.</li>
                <li>
                  في قسم <strong>Authorized JavaScript origins</strong> أضف:
                  <code className="mx-1 px-1.5 py-0.5 rounded bg-black/10 dark:bg-black/30 font-mono text-[11px]" dir="ltr">
                    http://localhost:5173
                  </code>
                  و
                  <code className="mx-1 px-1.5 py-0.5 rounded bg-black/10 dark:bg-black/30 font-mono text-[11px]" dir="ltr">
                    https://{window.location.host}
                  </code>
                </li>
                <li>اضغط <strong>CREATE</strong> وانسخ الـ <strong>Client ID</strong> والصقه في الحقل أدناه.</li>
              </ol>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-black">Google OAuth Client ID:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  dir="ltr"
                  placeholder="مثال: 123456789-xxxxxxxx.apps.googleusercontent.com"
                  value={googleClientId}
                  onChange={(e) => setGoogleClientId(e.target.value)}
                  className="flex-1 px-3 py-2.5 text-xs font-mono rounded-xl border bg-neutral-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:border-[#4285F4]"
                />
                <button
                  onClick={() => {
                    saveGoogleClientId(googleClientId);
                    setGoogleSavedMsg('تم حفظ وتفعيل الـ Google Client ID بنجاح! زر جوجل الحقيقي مفعل الآن في شاشة الشراء.');
                    setTimeout(() => setGoogleSavedMsg(''), 5000);
                  }}
                  className="btn-sketch bg-[#4285F4] text-white text-xs py-2 px-5 font-black hover:bg-blue-600 shadow-md"
                >
                  حفظ وتفعيل فوري
                </button>
              </div>
              {googleSavedMsg && (
                <p className="text-xs font-bold text-emerald-500 animate-fadeIn">
                  {googleSavedMsg}
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-neutral-50 dark:bg-slate-900 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold block">حالة Google Identity Services SDK:</span>
                <span className="text-[11px] text-slate-400">
                  {isGoogleSdkReady() ? '✓ مكتبة accounts.google.com محملة وجاهزة في المتصفح' : 'جاري تحميل مكتبة جوجل...'}
                </span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  getActiveGoogleClientId()
                    ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                }`}
              >
                {getActiveGoogleClientId() ? 'المعرف مهيأ' : 'بانتظار إدخال المعرف'}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Modal: Change Admin Master Password */}
      {isChangePwdOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="max-w-sm w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border-3 border-amber-500 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-700/30">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-500" />
                <h3 className="font-heading font-black text-base">تغيير كلمة المرور السرية</h3>
              </div>
              <button onClick={() => setIsChangePwdOpen(false)} className="text-slate-400 p-1">
                ✕
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">كلمة المرور الجديدة:</label>
              <input
                type="text"
                value={newAdminPwd}
                onChange={(e) => setNewAdminPwd(e.target.value)}
                placeholder="اكتب كلمة مرور جديدة قوية..."
                className="w-full px-3 py-2 text-sm font-mono rounded-xl border bg-neutral-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              />
              <span className="text-[10px] text-slate-400 block mt-1">الكلمة الحالية: {getAdminMasterPassword()}</span>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setIsChangePwdOpen(false)}
                className="px-3 py-2 rounded-xl border text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (newAdminPwd.trim()) {
                    setAdminMasterPassword(newAdminPwd.trim());
                    setActionSuccessMessage('تم تحديث كلمة مرور الإدارة السرية بنجاح!');
                    setIsChangePwdOpen(false);
                    setNewAdminPwd('');
                  }
                }}
                className="btn-sketch bg-amber-500 text-slate-950 text-xs font-black py-2 px-4"
              >
                حفظ كلمة المرور
              </button>
            </div>
          </div>
        </div>
      )}
 </main>

 {/* Lightbox for Receipt Screenshot */}
 {selectedReceiptUrl && (
 <div
 onClick={() => setSelectedReceiptUrl(null)}
 className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 flex items-center justify-center animate-fadeIn"
 >
 <div
 onClick={(e) => e.stopPropagation()}
 className="max-w-xl w-full bg-slate-900 border-2 border-slate-700 rounded-3xl p-5 space-y-4 shadow-2xl relative"
 >
 <div className="flex items-center justify-between border-b border-slate-800 pb-3">
 <h3 className="font-heading font-black text-base text-white">
 فحص سكرين التحويل البنكي / المحفظة
 </h3>
 <button
 onClick={() => setSelectedReceiptUrl(null)}
 className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 <div className="rounded-2xl overflow-hidden max-h-[70vh] flex items-center justify-center bg-black/40">
 <img
 src={selectedReceiptUrl}
 alt="Receipt Full"
 className="max-h-[68vh] w-auto object-contain rounded-xl"
 />
 </div>

 <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
 <span>تأكد من مطابقة المبلغ ورقم العملية قبل الضغط على تفعيل</span>
 <button
 onClick={() => setSelectedReceiptUrl(null)}
 className="px-4 py-2 rounded-xl bg-[#D9722B] text-white dark:bg-[#D9722B] dark:text-white font-bold hover:bg-[#D9722B]"
 >
 إغلاق
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
};
