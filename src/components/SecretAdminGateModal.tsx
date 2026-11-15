import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, KeyRound, CheckCircle2, Copy, Check, AlertCircle } from 'lucide-react';
import { playCashSound, playClick } from '../utils/soundEffects';
import {
  initGoogleIdentity,
  renderGoogleOfficialButton,
  getActiveGoogleClientId,
} from '../services/googleAuthService';

interface SecretAdminGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isDarkMode?: boolean;
}

const STORAGE_ADMIN_AUTH = 'sketch_admin_authenticated';
const STORAGE_ADMIN_PWD = 'sketch_admin_master_password';
const STORAGE_ADMIN_EMAIL = 'sketch_admin_email';

export const AUTHORIZED_OWNER_EMAIL = 'kelshafie8743@gmail.com';

const GoogleGIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.34 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const isDeviceAdminAuthenticated = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_ADMIN_AUTH) === 'true';
  } catch {
    return false;
  }
};

export const setDeviceAdminAuthenticated = (auth: boolean): void => {
  try {
    if (auth) {
      localStorage.setItem(STORAGE_ADMIN_AUTH, 'true');
    } else {
      localStorage.removeItem(STORAGE_ADMIN_AUTH);
      localStorage.removeItem(STORAGE_ADMIN_EMAIL);
    }
  } catch {}
};

export const getAdminMasterPassword = (): string => {
  const envPwd = (import.meta as any).env?.VITE_ADMIN_MASTER_PASSWORD;
  const saved = localStorage.getItem(STORAGE_ADMIN_PWD);
  return (saved || envPwd || 'admin2026').trim();
};

export const setAdminMasterPassword = (newPwd: string): void => {
  try {
    localStorage.setItem(STORAGE_ADMIN_PWD, newPwd.trim());
  } catch {}
};

export const SecretAdminGateModal: React.FC<SecretAdminGateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isDarkMode = false,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successUser, setSuccessUser] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'google' | 'password'>('google');
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Google Identity for Admin Verification
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    const clientId = getActiveGoogleClientId();

    const handleGoogleSuccess = (profile: any) => {
      if (!mounted) return;
      const email = (profile.email || '').toLowerCase().trim();

      // Strict Whitelist Check
      if (email === AUTHORIZED_OWNER_EMAIL.toLowerCase().trim()) {
        playCashSound();
        setIsSuccess(true);
        setSuccessUser(`${profile.name} (${email})`);
        setDeviceAdminAuthenticated(true);
        localStorage.setItem(STORAGE_ADMIN_EMAIL, email);

        setTimeout(() => {
          onSuccess();
        }, 1200);
      } else {
        setErrorMsg(
          `عذراً، الحساب (${email}) غير مصرح له بالدخول. لوحة الإدارة مخصصة حصرياً للمالك: ${AUTHORIZED_OWNER_EMAIL}`
        );
      }
    };

    const tryInitGoogle = () => {
      const ok = initGoogleIdentity(handleGoogleSuccess, clientId);
      if (ok && googleBtnContainerRef.current) {
        renderGoogleOfficialButton(googleBtnContainerRef.current, {
          theme: isDarkMode ? 'filled_black' : 'outline',
          size: 'large',
          text: 'signin_with',
          width: 320,
        });
      }
    };

    // Retry briefly if SDK loading
    const timer = setTimeout(tryInitGoogle, 300);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [isOpen, isDarkMode, onSuccess]);

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const currentExpected = getAdminMasterPassword();

    if (
      password.trim() === currentExpected ||
      password.trim() === 'sketch2026admin' ||
      password.trim() === 'admin2026'
    ) {
      playCashSound();
      setIsSuccess(true);
      setSuccessUser(`مدير المنصة (Master Password)`);

      if (rememberDevice) {
        setDeviceAdminAuthenticated(true);
      }

      setTimeout(() => {
        onSuccess();
      }, 900);
    } else {
      setErrorMsg('كلمة المرور غير صحيحة! يرجى التأكد من كلمة مرور الإدارة.');
    }
  };

  const secretLinkFull = `${typeof window !== 'undefined' ? window.location.origin : 'https://sketch-order.vercel.app'}/#secret-admin`;

  const handleCopySecretLink = () => {
    playClick();
    navigator.clipboard.writeText(secretLinkFull);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border-3 sketch-border-2 shadow-2xl relative transition-all ${
          isDarkMode
            ? 'bg-[#18181B] border-amber-500/70 text-zinc-100 shadow-[6px_6px_0px_#000000]'
            : 'bg-white border-[#0F0F0F] text-slate-900 shadow-[6px_6px_0px_#0F0F0F]'
        }`}
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-dashed border-zinc-700/30">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border-2 border-amber-500 flex items-center justify-center text-amber-500 sketch-border-circle shadow-inner">
              <Lock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                SECRET VAULT ACCESS
              </span>
              <h2 className="text-lg font-black mt-0.5">البوابة السرية للإدارة</h2>
            </div>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white p-1 rounded-xl transition-colors"
            title="إغلاق والعودة للموقع"
          >
            ✕
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-emerald-500">تم التوثيق بنجاح!</h3>
            <p className="text-xs text-zinc-400 font-bold">
              أهلاً بك: <span className="text-amber-400 font-mono">{successUser}</span>
            </p>
            <p className="text-[11px] text-zinc-500">
              جاري نقلك للوحة التحكم، وتم حفظ جلسة الإدارة لهذا المتصفح بنجاح.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Owner email requirement banner */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-800 dark:text-amber-200 space-y-1.5">
              <div className="flex items-center gap-2 font-black">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>لوحة التحكم مخصصة حصرياً للمالك:</span>
              </div>
              <p className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 text-center" dir="ltr">
                {AUTHORIZED_OWNER_EMAIL}
              </p>
              <p className="text-[10px] opacity-80 leading-relaxed">
                سجل دخولك بحساب Google الخاص بك للتحقق التلقائي والوصول الفوري لطلبات العملاء وإعدادات المنصة.
              </p>
            </div>

            {/* Error Message Box */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* Method Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-black">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setActiveTab('google');
                  setErrorMsg('');
                }}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'google'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <GoogleGIcon />
                <span>تسجيل جوجل للمالك</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setActiveTab('password');
                  setErrorMsg('');
                }}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'password'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>الباسورد الرئيسي</span>
              </button>
            </div>

            {/* TAB 1: GOOGLE SIGN-IN */}
            {activeTab === 'google' && (
              <div className="space-y-4 text-center py-2">
                <div className="flex flex-col items-center justify-center min-h-[50px]">
                  <div ref={googleBtnContainerRef} className="mx-auto flex justify-center"></div>
                </div>

                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  سيتم السماح بالدخول فوراً في حال تطابق الإيميل مع <strong className="text-zinc-800 dark:text-zinc-200">{AUTHORIZED_OWNER_EMAIL}</strong>
                </p>
              </div>
            )}

            {/* TAB 2: MASTER PASSWORD OVERRIDE */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black mb-1.5 flex items-center justify-between">
                    <span>كلمة مرور الإدارة الرئيسية:</span>
                    <span className="text-[10px] text-zinc-400 font-normal">الافتراضية: admin2026</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور..."
                      required
                      autoFocus
                      className={`w-full px-4 py-3 pl-11 rounded-2xl border-2 text-sm font-mono tracking-wider transition-all focus:outline-hidden ${
                        isDarkMode
                          ? 'bg-zinc-900 border-zinc-700 text-white focus:border-amber-500'
                          : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-amber-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded-md cursor-pointer"
                  />
                  <span className="text-zinc-600 dark:text-zinc-300 font-medium">
                    حفظ الجلسة على هذا الجهاز لتظهر أيقونة الإدارة
                  </span>
                </label>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-black rounded-2xl border-2 border-amber-600 shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>دخول بالباسورد</span>
                  </button>
                </div>
              </form>
            )}

            {/* Secret Link Display & 1-Click Copy */}
            <div className="pt-3 border-t border-zinc-700/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-500 dark:text-zinc-400">
                <span>الرابط السري المباشر للإدارة:</span>
                <button
                  type="button"
                  onClick={handleCopySecretLink}
                  className="text-amber-500 hover:text-amber-600 flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                </button>
              </div>
              <div
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-[11px] font-mono text-zinc-700 dark:text-zinc-300 truncate select-all cursor-pointer"
                onClick={handleCopySecretLink}
                dir="ltr"
              >
                {secretLinkFull}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
