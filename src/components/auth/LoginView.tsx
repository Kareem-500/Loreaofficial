import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LoreaLogo } from '../LoreaLogo';

interface LoginViewProps {
  onSuccess?: () => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  onContinueAsGuest?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onSuccess,
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onContinueAsGuest,
}) => {
  const { login } = useAuth();
  const { t, language } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage(language === 'ar' ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور.' : 'Please enter both your email address and password.');
      return;
    }

    try {
      setIsLoading(true);
      await login(email.trim(), password, rememberMe);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || (language === 'ar' ? 'تعذر تسجيل الدخول. تحقق من بياناتك.' : 'Failed to sign in. Please verify your credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  // Demo 1-click test fill helper
  const handleQuickFill = (role: 'client' | 'admin') => {
    if (role === 'client') {
      setEmail('nourhan@lorea.eg');
      setPassword('Lorea@Cairo2025');
    } else {
      setEmail('admin@lorea.com');
      setPassword('Admin@Lorea2025!');
    }
    setErrorMessage(null);
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white border border-[#EAE5DE] shadow-xl p-8 sm:p-10 transition-all">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <LoreaLogo variant="dark" className="mx-auto mb-4" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#7C746B] font-medium block">
          {language === 'ar' ? 'بوابة عملاء الدار' : 'MAISON CLIENT PORTAL'}
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1D1D1B] mt-2">
          {t('auth.welcome_back')}
        </h2>
        <p className="text-xs text-[#7C746B] font-light mt-1.5">
          {t('auth.signin_subtitle')}
        </p>
      </div>

      {/* Demo Credentials Quick Fill Pills */}
      <div className="mb-6 p-3.5 bg-[#FAF8F5] border border-[#EAE5DE]/80 text-xs">
        <span className="text-[10px] tracking-wider uppercase font-semibold text-[#7C746B] block mb-2">
          {language === 'ar' ? 'بيانات تجريبية سريعة' : 'QUICK DEMO CREDENTIALS'}
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('client')}
            className="flex items-center justify-center space-x-1.5 px-2.5 py-1.5 bg-white border border-[#EAE5DE] hover:border-[#1D1D1B] text-[11px] text-[#1D1D1B] transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#B88F88]" />
            <span>{language === 'ar' ? 'عميلة (نورهان)' : 'Client Account'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('admin')}
            className="flex items-center justify-center space-x-1.5 px-2.5 py-1.5 bg-white border border-[#EAE5DE] hover:border-[#1D1D1B] text-[11px] text-[#1D1D1B] transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#964036]" />
            <span>{language === 'ar' ? 'إدارة (Admin)' : 'Admin Portal'}</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-3.5 bg-[#964036]/10 border border-[#964036]/30 text-[#964036] text-xs leading-relaxed">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
            {t('auth.email')}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#7C746B] absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
            <input
              id="login-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nourhan@lorea.eg"
              required
              autoComplete="email"
              className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-3 pl-9 pr-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium">
              {t('auth.password')}
            </label>
            <button
              type="button"
              onClick={onNavigateToForgotPassword}
              className="text-[11px] text-[#7C746B] hover:text-[#1D1D1B] underline transition-colors"
            >
              {t('auth.forgot_password')}
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#7C746B] absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
            <input
              id="login-password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
              className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-3 pl-9 pr-10 text-[#1D1D1B] focus:border-[#1D1D1B] focus:bg-white focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 -translate-y-1/2 right-3 text-[#7C746B] hover:text-[#1D1D1B]"
              aria-label={showPassword ? t('auth.hide_password') : t('auth.show_password')}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center space-x-2 text-xs text-[#7C746B] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 accent-[#1D1D1B] cursor-pointer"
            />
            <span>{t('auth.remember_me')}</span>
          </label>
        </div>

        <button
          id="login-submit-btn"
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1D1D1B] hover:bg-[#333] text-[#F7F4EF] text-xs uppercase tracking-[0.2em] py-3.5 font-medium transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
        >
          <span>{isLoading ? t('common.loading') : t('auth.signin_btn')}</span>
          {!isLoading && <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-8 pt-6 border-t border-[#EAE5DE] text-center space-y-4">
        <p className="text-xs text-[#7C746B]">
          {language === 'ar' ? 'ليس لديك حساب في لوريا؟' : 'Do not have an atelier account yet?'}
        </p>
        <button
          id="goto-register-btn"
          type="button"
          onClick={onNavigateToRegister}
          className="w-full bg-white hover:bg-[#FAF8F5] text-[#1D1D1B] border border-[#1D1D1B] text-xs uppercase tracking-[0.18em] py-3 font-medium transition-colors"
        >
          {t('auth.create_account_btn')}
        </button>

        {onContinueAsGuest && (
          <button
            type="button"
            onClick={onContinueAsGuest}
            className="text-xs text-[#7C746B] hover:text-[#1D1D1B] underline tracking-wider pt-2 block mx-auto"
          >
            {t('auth.continue_guest')}
          </button>
        )}
      </div>
    </div>
  );
};
