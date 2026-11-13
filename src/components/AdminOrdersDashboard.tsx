import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
  DollarSign,
  Package,
  Search,
  Check,
  ShieldCheck,
  Eye,
  RefreshCw,
} from 'lucide-react';
import type { ClientOrderRequest } from '../types';
import { playClick, playPencilScratch } from '../utils/soundEffects';
import logoImg from '../assets/sketch-order-logo.png';
import mascotImg from '../assets/sketch-mascot.png';

interface AdminOrdersDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'sketch_order_client_requests';

// Default initial demo orders for the platform owner to inspect right away
const INITIAL_DEMO_ORDERS: ClientOrderRequest[] = [
  {
    id: 'SK-9281',
    createdAt: '2026-11-13 01:15',
    clientName: 'أحمد الشناوي',
    whatsappNumber: '01012345678',
    brandName: 'كوتشيات الشناوي (Sneakers Hub)',
    subdomain: 'el-shennawy.sketchorder.com',
    selectedPlan: 'pro',
    planName: 'باقة المحترفين والنمو',
    amount: 2400,
    templateId: 'sportech-sneakers',
    templateName: 'سبورتك الرياضي (SPORTECH)',
    paymentMethod: 'instapay',
    transactionRef: 'IP-8492041284',
    receiptImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    notes: 'تم التحويل من حساب إنستاباي، محتاج أربط الدومين خلال نص ساعة لافتتاح الكوليكشن الجديد.',
    status: 'pending_review',
  },
  {
    id: 'SK-9274',
    createdAt: '2026-11-12 21:40',
    clientName: 'سارة مصطفى',
    whatsappNumber: '01198765432',
    brandName: 'فاسكو كايرو ستريت',
    subdomain: 'vasco-cairo.sketchorder.com',
    selectedPlan: 'standard',
    planName: 'الباقة الاقتصادية',
    amount: 1250,
    templateId: 'fasco-fashion',
    templateName: 'فاسكو ستريت وير (FASCO)',
    paymentMethod: 'vodafone_cash',
    transactionRef: 'VF-39201948',
    receiptImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    notes: 'تم إرسال 1250 على فودافون كاش من رقم 01198765432.',
    status: 'approved_building',
    approvedAt: '2026-11-12 21:55',
  },
];

export const AdminOrdersDashboard: React.FC<AdminOrdersDashboardProps> = ({
  isOpen,
  onClose,
}) => {
  const [orders, setOrders] = useState<ClientOrderRequest[]>([]);
  const [activeReceiptModal, setActiveReceiptModal] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load orders from localStorage or set initial demos
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setOrders(Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEMO_ORDERS);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
        setOrders(INITIAL_DEMO_ORDERS);
      }
    } catch {
      setOrders(INITIAL_DEMO_ORDERS);
    }
  }, [isOpen]);

  // Listen for live orders placed in this session
  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setOrders(JSON.parse(stored));
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('sketch_order_new_request', handleStorageUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('sketch_order_new_request', handleStorageUpdate);
    };
  }, []);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const saveOrders = (newOrders: ClientOrderRequest[]) => {
    setOrders(newOrders);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrders));
  };

  // Action: Approve Order
  const handleApproveOrder = (id: string) => {
    playClick();
    const now = new Date().toLocaleString('ar-EG');
    const updated = orders.map((o) => {
      if (o.id === id) {
        return {
          ...o,
          status: 'approved_building' as const,
          approvedAt: now,
        };
      }
      return o;
    });
    saveOrders(updated);
    showToast(`✓ تم قبول الطلب #${id} وتفعيل ساب دومين المتجر فوراً!`);
  };

  // Action: Mark as Deployed / Live
  const handleMarkLive = (id: string) => {
    playClick();
    const updated = orders.map((o) => {
      if (o.id === id) {
        return {
          ...o,
          status: 'deployed_live' as const,
        };
      }
      return o;
    });
    saveOrders(updated);
    showToast(`🚀 المتجر #${id} أصبح أونلاين ومتاح رسمياً للزبائن!`);
  };

  // Action: Delete Order
  const handleDeleteOrder = (id: string) => {
    playPencilScratch();
    if (!window.confirm(`هل أنت متأكد من حذف الطلب #${id}؟`)) return;
    const updated = orders.filter((o) => o.id !== id);
    saveOrders(updated);
    showToast(`تم حذف الطلب #${id}`);
  };

  // Reset to default
  const handleResetDemoOrders = () => {
    if (window.confirm('إعادة تعيين قائمة الطلبات للبيانات التوضيحية الافتراضية؟')) {
      saveOrders(INITIAL_DEMO_ORDERS);
      showToast('تمت إعادة تعيين الطلبات');
    }
  };

  // Computed metrics
  const totalRevenue = orders.reduce((sum, o) => {
    if (typeof o.amount === 'number' && o.status !== 'cancelled') {
      return sum + o.amount;
    }
    return sum;
  }, 0);

  const pendingCount = orders.filter((o) => o.status === 'pending_review').length;
  const activeCount = orders.filter((o) => o.status === 'approved_building' || o.status === 'deployed_live').length;

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filterStatus === 'all' || o.status === filterStatus;
    const matchesQuery =
      searchQuery === '' ||
      o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.whatsappNumber.includes(searchQuery);
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto select-none">
      <div className="relative max-w-6xl w-full my-6 bg-slate-900 border-2 border-slate-700 rounded-3xl p-5 sm:p-8 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto flex flex-col justify-between">
        
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center p-1">
                <img src={logoImg} alt="Logo" className="w-full h-full object-contain invert" />
              </div>
              <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                <img src={mascotImg} alt="Mascot" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black font-heading text-white">
                    لوحة تحكم إدارة الطلبات والمبيعات (Owner Admin)
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    SAAS LIVE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  متابعة طلبات شراء المتاجر، مراجعة سكرينات التحويل (InstaPay / فودافون كاش)، وتفعيل الساب دومين فوراً.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetDemoOrders}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 border border-slate-700"
                title="إعادة تعيين البيانات"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">إعادة ضبط</span>
              </button>

              <button
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>إجمالي الطلبات</span>
                <Package className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black font-mono text-white">{orders.length}</div>
              <span className="text-[10px] text-slate-400">طلب شراء متجر</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-1">
              <div className="flex items-center justify-between text-amber-400 text-xs font-bold">
                <span>بانتظار المراجعة</span>
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black font-mono text-amber-300">{pendingCount}</div>
              <span className="text-[10px] text-amber-300/80 font-bold">يحتاج مراجعة التحويل ⚠️</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-1">
              <div className="flex items-center justify-between text-emerald-400 text-xs font-bold">
                <span>متاجر مفعلة ونشطة</span>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black font-mono text-emerald-300">{activeCount}</div>
              <span className="text-[10px] text-emerald-300 font-bold">جاهزة أو جاري بناؤها ✓</span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/40 space-y-1">
              <div className="flex items-center justify-between text-indigo-400 text-xs font-bold">
                <span>إجمالي الإيرادات المحصلة</span>
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black font-mono text-indigo-300">{totalRevenue.toLocaleString()} ج.م</div>
              <span className="text-[10px] text-indigo-300 font-bold">دفع لمرة واحدة مدى الحياة</span>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold overflow-x-auto">
              {[
                { id: 'all', label: `الكل (${orders.length})` },
                { id: 'pending_review', label: `بانتظار المراجعة (${pendingCount})` },
                { id: 'approved_building', label: 'تمت الموافقة وجاري الإنشاء' },
                { id: 'deployed_live', label: 'موقع مباشر (Live)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                    filterStatus === f.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px] flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، البراند، الساب دومين..."
                className="w-full pr-8 pl-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 focus:border-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="border border-slate-800 rounded-2xl overflow-x-auto bg-slate-950/60">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold">
                <tr>
                  <th className="p-3.5">الطلب</th>
                  <th className="p-3.5">العميل & الواتساب</th>
                  <th className="p-3.5">البراند & الدومين</th>
                  <th className="p-3.5">الباقة والتيمبليت</th>
                  <th className="p-3.5">طريقة الدفع والمبلغ</th>
                  <th className="p-3.5 text-center">سكرين شوت التحويل</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500 font-bold">
                      لا توجد طلبات مطابقة للبحث أو الفلتر المختار
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isPending = order.status === 'pending_review';
                    const isBuilding = order.status === 'approved_building';
                    const isLive = order.status === 'deployed_live';

                    return (
                      <tr key={order.id} className="hover:bg-slate-900/50 transition-colors">
                        {/* Order ID & Time */}
                        <td className="p-3.5">
                          <span className="font-mono font-black text-indigo-400 block">{order.id}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{order.createdAt}</span>
                        </td>

                        {/* Client Info */}
                        <td className="p-3.5">
                          <span className="font-bold text-white block">{order.clientName}</span>
                          <a
                            href={`https://wa.me/2${order.whatsappNumber.replace(/^0+/, '')}?text=${encodeURIComponent(
                              `أهلاً أ/ ${order.clientName}، معاك فريق سكتش أوردر بخصوص طلب إنشاء متجرك "${order.brandName}".`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <span>{order.whatsappNumber}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </td>

                        {/* Brand & Subdomain */}
                        <td className="p-3.5">
                          <span className="font-black text-slate-200 block">{order.brandName}</span>
                          <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-800/40 inline-block mt-1">
                            {order.subdomain}
                          </span>
                        </td>

                        {/* Plan & Template */}
                        <td className="p-3.5">
                          <span className="font-bold text-white block">{order.planName}</span>
                          <span className="text-[11px] text-slate-400">{order.templateName}</span>
                        </td>

                        {/* Payment */}
                        <td className="p-3.5">
                          <span className="font-mono font-black text-emerald-400 text-sm block">
                            {typeof order.amount === 'number' ? `${order.amount} ج.م` : order.amount}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {order.paymentMethod === 'instapay'
                              ? '⚡ إنستاباي'
                              : order.paymentMethod === 'vodafone_cash'
                              ? '📱 فودافون كاش'
                              : '💳 بطاقة بنكية'}
                          </span>
                          {order.transactionRef && (
                            <span className="text-[9px] font-mono text-slate-500 block">
                              Ref: {order.transactionRef}
                            </span>
                          )}
                        </td>

                        {/* Receipt Screenshot Viewer */}
                        <td className="p-3.5 text-center">
                          {order.receiptImageUrl ? (
                            <button
                              onClick={() => setActiveReceiptModal(order.receiptImageUrl || null)}
                              className="group relative inline-block rounded-xl overflow-hidden border border-slate-700 hover:border-indigo-400 shadow-sm"
                              title="اضغط لمعاينة وتكبير الإيصال"
                            >
                              <img
                                src={order.receiptImageUrl}
                                alt="Receipt"
                                className="w-12 h-12 object-cover group-hover:scale-110 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="w-3.5 h-3.5 text-white" />
                              </div>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">بدون صورة إيصال</span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="p-3.5">
                          {isPending && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              <Clock className="w-3 h-3" />
                              <span>بانتظار المراجعة</span>
                            </span>
                          )}
                          {isBuilding && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                              <span>تمت الموافقة • جاري البناء</span>
                            </span>
                          )}
                          {isLive && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>المتجر لايف 🚀</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {isPending && (
                              <button
                                onClick={() => handleApproveOrder(order.id)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                                title="قبول الطلب وتأكيد التحويل"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>قبول وتفعيل</span>
                              </button>
                            )}

                            {isBuilding && (
                              <button
                                onClick={() => handleMarkLive(order.id)}
                                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                                title="تسليم المتجر للعميل كـ Live"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>تعيين كـ لايف</span>
                              </button>
                            )}

                            <a
                              href={`https://wa.me/2${order.whatsappNumber.replace(/^0+/, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 transition-colors border border-slate-700"
                              title="مراسلة واتساب"
                            >
                              💬
                            </a>

                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-600 hover:text-white text-slate-400 transition-colors border border-slate-700"
                              title="حذف الطلب"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>نظام Multi-Tenant متصل مع Vercel Domains API وSupabase Database</span>
          </div>

          <div className="text-[11px] font-mono">
            المتجر الرئيسي: <span className="text-white font-bold">sketchorder.com</span> • جميع العمليات مشفرة ومؤمنة
          </div>
        </div>

        {/* Modal: Full Receipt Image Viewer */}
        {activeReceiptModal && (
          <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md p-4 flex items-center justify-center animate-fadeIn">
            <div className="relative max-w-lg w-full bg-slate-900 border border-slate-700 rounded-3xl p-5 text-white space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-heading font-black text-sm">معاينة إيصال تحويل العميل</h3>
                </div>
                <button
                  onClick={() => setActiveReceiptModal(null)}
                  className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto rounded-2xl bg-black/60 p-2 border border-slate-800 flex items-center justify-center">
                <img
                  src={activeReceiptModal}
                  alt="Transfer Receipt Full View"
                  className="max-w-full max-h-[60vh] object-contain rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                <span>يرجى مراجعة رقم العملية والمبلغ قبل الضغط على "قبول وتفعيل"</span>
                <button
                  onClick={() => setActiveReceiptModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
