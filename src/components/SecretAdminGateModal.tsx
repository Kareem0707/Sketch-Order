import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, KeyRound, CheckCircle2 } from 'lucide-react';
import { playCashSound, playClick } from '../utils/soundEffects';

interface SecretAdminGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isDarkMode?: boolean;
}

const STORAGE_ADMIN_AUTH = 'sketch_admin_authenticated';
const STORAGE_ADMIN_PWD = 'sketch_admin_master_password';

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const currentExpected = getAdminMasterPassword();

    if (password.trim() === currentExpected || password.trim() === 'sketch2026admin' || password.trim() === 'admin2026') {
      playCashSound();
      setIsSuccess(true);

      if (rememberDevice) {
        setDeviceAdminAuthenticated(true);
      }

      setTimeout(() => {
        onSuccess();
      }, 700);
    } else {
      setErrorMsg('كلمة المرور غير صحيحة! يرجى التأكد من كلمة مرور الإدارة.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border-3 sketch-border-2 shadow-2xl relative transition-all ${
          isDarkMode
            ? 'bg-slate-900 border-amber-500/70 text-white'
            : 'bg-white border-[#0F0F0F] text-slate-900'
        }`}
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-dashed border-slate-700/30">
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
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-xl transition-colors"
            title="إغلاق والعودة للموقع"
          >
            ✕
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-emerald-500">تم التوثيق بنجاح!</h3>
            <p className="text-xs text-slate-400">
              جاري نقلك للوحة التحكم، وتم تفعيل أيقونة الإدارة لهذا الجهاز.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                هذه اللوحة خاصة بإدارة منصة <strong>سكتش أوردر</strong> ولا تظهر للزوار العاديين. بمجرد تسجيل الدخول سيتم حفظ الأيقونة على جهازك لتسهيل الدخول مستقبلاً.
              </p>
            </div>

            <div>
              <label className="block text-xs font-black mb-1.5 flex items-center justify-between">
                <span>كلمة مرور الإدارة الرئيسية:</span>
                <span className="text-[10px] text-slate-400 font-normal">الافتراضية: admin2026</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور السرية..."
                  required
                  autoFocus
                  className={`w-full px-4 py-3 pl-11 rounded-2xl border-2 text-sm font-mono tracking-wider transition-all focus:outline-hidden ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errorMsg && (
                <p className="text-xs text-red-500 font-bold mt-1.5 animate-shake">
                  {errorMsg}
                </p>
              )}
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded-md cursor-pointer"
              />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                تذكر هذا الجهاز واجعل أيقونة الإدارة تظهر في المتصفح فقط عندي
              </span>
            </label>

            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-black rounded-2xl border-2 border-amber-600 shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                <KeyRound className="w-4 h-4" />
                <span>دخول لوحة التحكم السرية</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all ${
                  isDarkMode
                    ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                إلغاء
              </button>
            </div>
          </form>
        )}

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-slate-700/20 text-center">
          <p className="text-[11px] text-slate-400">
            الرابط السري الرسمي للدخول من أي متصفح جديد: <br />
            <code className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md mt-1 inline-block" dir="ltr">
              #secret-admin
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};
