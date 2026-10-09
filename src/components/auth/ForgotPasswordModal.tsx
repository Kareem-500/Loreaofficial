import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, CheckCircle2, ArrowRight, KeyRound, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onNavigateToLogin,
}) => {
  const { forgotPassword, resetPassword } = useAuth();
  const { language } = useLanguage();

  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-detect reset token or 6-digit code from URL if client opened via email link
  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('reset_token') || params.get('token') || params.get('code');
      if (urlToken && urlToken.trim()) {
        setResetToken(urlToken.trim());
        setStep('reset');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!email.trim()) {
      setErrorMessage(language === 'ar' ? 'يرجى إدخال البريد الإلكتروني.' : 'Please enter your email address.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await forgotPassword(email.trim());
      setStatusMessage(
        res.message ||
        (language === 'ar'
          ? 'تم إرسال رمز الاستعادة ورابط التعيين إلى بريدك الإلكتروني بنجاح. يرجى مراجعة صندوق الوارد (أو مجلد الرسائل غير المرغوبة Spam).'
          : 'A recovery code and reset link have been dispatched to your email. Please check your inbox and Spam folder.')
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to request password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePerformReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    const cleanToken = resetToken.trim();

    if (!cleanToken) {
      setErrorMessage(language === 'ar' ? 'رمز الاستعادة مطلوب.' : 'Recovery code is required.');
      return;
    }

    // Direct guard: Prevent users from entering their email address instead of the recovery code
    if (cleanToken.includes('@')) {
      setErrorMessage(
        language === 'ar'
          ? 'تنبيه: لقد أدخلت بريداً إلكترونياً. يرجى إدخال رمز الاستعادة المكون من 6 أرقام المستلم في بريدك الإلكتروني.'
          : 'Notice: You entered an email address. Please enter the 6-digit recovery code sent to your email.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(language === 'ar' ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage(language === 'ar' ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.' : 'Password must be at least 8 characters.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await resetPassword(cleanToken, newPassword, confirmPassword, email.trim() || undefined);
      setStatusMessage(res.message || (language === 'ar' ? 'تم تحديث كلمة المرور بنجاح.' : 'Password updated successfully.'));
      setTimeout(() => {
        onClose();
        onNavigateToLogin();
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#F7F4EF] border border-[#EAE5DE] shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#1D1D1B] hover:text-[#B88F88] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-white border border-[#EAE5DE] flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6 text-[#1D1D1B]" />
          </div>
          <h3 className="font-serif text-2xl text-[#1D1D1B]">
            {step === 'request'
              ? language === 'ar'
                ? 'استعادة كلمة المرور'
                : 'Reset Password'
              : language === 'ar'
              ? 'تعيين كلمة المرور الجديدة'
              : 'Set New Password'}
          </h3>
          <p className="text-xs text-[#7C746B] mt-1">
            {step === 'request'
              ? language === 'ar'
                ? 'أدخلي بريدكِ الإلكتروني وسنرسل لكِ رمز الاستعادة ورابط التعيين فوراً.'
                : 'Enter your registered email to receive your 6-digit recovery code and reset link.'
              : language === 'ar'
              ? 'أدخلي رمز الاستعادة المكون من 6 أرقام مع كلمة المرور الجديدة.'
              : 'Enter your 6-digit recovery code along with your secure new password.'}
          </p>
        </div>

        {statusMessage && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <p>{statusMessage}</p>
              {step === 'request' && (
                <div className="mt-2.5 pt-2 border-t border-emerald-200">
                  <button
                    type="button"
                    onClick={() => setStep('reset')}
                    className="text-xs underline font-semibold text-emerald-950 hover:text-emerald-700 cursor-pointer block"
                  >
                    {language === 'ar' ? 'أدخل الرمز المكون من 6 أرقام الآن ←' : 'Enter 6-digit recovery code now →'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-[#964036]/10 border border-[#964036]/30 text-[#964036] text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-[#964036] shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {step === 'request' ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7C746B] absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kareemzohrey200@gmail.com"
                  required
                  className="w-full bg-white border border-[#EAE5DE] text-xs py-3 pl-9 pr-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1D1D1B] hover:bg-[#333] text-[#F7F4EF] text-xs uppercase tracking-[0.2em] py-3.5 font-medium transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? (language === 'ar' ? 'جارٍ الإرسال...' : 'Sending...') : language === 'ar' ? 'إرسال رمز ورابط الاستعادة' : 'Send Reset Link'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>

            <div className="flex justify-between items-center pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToLogin();
                }}
                className="text-[#7C746B] hover:text-[#1D1D1B] underline cursor-pointer"
              >
                {language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Sign In'}
              </button>
              <button
                type="button"
                onClick={() => setStep('reset')}
                className="text-[#1D1D1B] hover:underline font-medium cursor-pointer"
              >
                {language === 'ar' ? 'لدي رمز استعادة بالفعل' : 'I have a recovery code'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePerformReset} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
                {language === 'ar' ? 'البريد الإلكتروني المسجل' : 'Registered Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7C746B] absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-white border border-[#EAE5DE] text-xs py-2.5 pl-9 pr-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium">
                  {language === 'ar' ? 'رمز الاستعادة (6 أرقام أو الرابط)' : 'Recovery Code (6-digit code or link token)'}
                </label>
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="text-[10px] text-[#7C746B] hover:text-[#1D1D1B] underline cursor-pointer flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{language === 'ar' ? 'طلب رمز جديد' : 'Request new code'}</span>
                </button>
              </div>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => {
                  setResetToken(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder={language === 'ar' ? 'أدخلي الرمز المكون من 6 أرقام (مثال: 742918)' : 'Enter 6-digit code, e.g. 742918'}
                required
                className={`w-full bg-white border ${resetToken.includes('@') ? 'border-red-500' : 'border-[#EAE5DE]'} text-xs py-2.5 px-3 font-mono text-[#1D1D1B] focus:border-[#1D1D1B] focus:outline-none`}
              />
              <p className="text-[10px] text-[#7C746B] mt-1">
                {language === 'ar'
                  ? 'تم إرسال الرمز المكون من 6 أرقام إلى بريدك الإلكتروني (تفقدي مجلد الـ Spam أيضاً).'
                  : 'Check your inbox or Spam folder for the 6-digit recovery code from LORÉA.'}
              </p>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
                {language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7C746B] absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 chars"
                  required
                  className="w-full bg-white border border-[#EAE5DE] text-xs py-3 pl-9 pr-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
                {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm New Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7C746B] absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  className="w-full bg-white border border-[#EAE5DE] text-xs py-3 pl-9 pr-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1D1D1B] hover:bg-[#333] text-[#F7F4EF] text-xs uppercase tracking-[0.2em] py-3.5 font-medium transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (language === 'ar' ? 'جارٍ التحديث والتحقق...' : 'Verifying & Updating...') : language === 'ar' ? 'تأكيد وحفظ كلمة المرور الجديدة' : 'Set New Password'}
            </button>

            <button
              type="button"
              onClick={() => setStep('request')}
              className="w-full text-center text-xs text-[#7C746B] hover:text-[#1D1D1B] underline pt-1 cursor-pointer"
            >
              {language === 'ar' ? 'الرجوع لطلب رمز جديد' : 'Back to request a new link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
