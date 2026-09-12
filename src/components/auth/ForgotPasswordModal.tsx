import React, { useState } from 'react';
import { X, Mail, Lock, CheckCircle2, ArrowRight, KeyRound } from 'lucide-react';
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
  const [previewToken, setPreviewToken] = useState<string | null>(null);

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
      setStatusMessage(res.message);

      if (res.previewResetToken) {
        setPreviewToken(res.previewResetToken);
        setResetToken(res.previewResetToken);
      }
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

    if (!resetToken.trim()) {
      setErrorMessage(language === 'ar' ? 'رمز الاستعادة مطلوب.' : 'Reset token is required.');
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
      const res = await resetPassword(resetToken.trim(), newPassword, confirmPassword);
      setStatusMessage(res.message);
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
          className="absolute top-4 right-4 p-1.5 text-[#1D1D1B] hover:text-[#B88F88] transition-colors"
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
                ? 'أدخلي بريدك الإلكتروني وسنرسل لكِ تعليمات استعادة الدخول.'
                : 'Enter your registered email to receive secure recovery instructions.'
              : language === 'ar'
              ? 'أدخلي كلمة المرور الجديدة لحسابك.'
              : 'Enter your secure new password.'}
          </p>
        </div>

        {statusMessage && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <p>{statusMessage}</p>
              {previewToken && step === 'request' && (
                <div className="mt-2 pt-2 border-t border-emerald-200">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-emerald-800 block">
                    {language === 'ar' ? 'رمز المعاينة الفوري:' : 'Instant Demo Token Ready:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep('reset')}
                    className="mt-1 text-xs underline font-semibold text-emerald-950 hover:text-emerald-700"
                  >
                    {language === 'ar' ? 'المتابعة لتعيين كلمة المرور الآن ←' : 'Proceed to set new password now →'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-[#964036]/10 border border-[#964036]/30 text-[#964036] text-xs">
            {errorMessage}
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
                  placeholder="nourhan@lorea.eg"
                  required
                  className="w-full bg-white border border-[#EAE5DE] text-xs py-3 pl-9 pr-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1D1D1B] hover:bg-[#333] text-[#F7F4EF] text-xs uppercase tracking-[0.2em] py-3.5 font-medium transition-all flex items-center justify-center space-x-2"
            >
              <span>{isLoading ? 'Processing...' : language === 'ar' ? 'إرسال رابط الاستعادة' : 'Send Reset Link'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>

            <div className="flex justify-between items-center pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToLogin();
                }}
                className="text-[#7C746B] hover:text-[#1D1D1B] underline"
              >
                {language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Sign In'}
              </button>
              <button
                type="button"
                onClick={() => setStep('reset')}
                className="text-[#1D1D1B] hover:underline font-medium"
              >
                {language === 'ar' ? 'لدي رمز استعادة بالفعل' : 'I have a token'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePerformReset} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
                {language === 'ar' ? 'رمز الاستعادة (Token)' : 'Recovery Token'}
              </label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Paste token"
                required
                className="w-full bg-white border border-[#EAE5DE] text-xs py-2.5 px-3 font-mono text-[#1D1D1B] focus:border-[#1D1D1B] focus:outline-none"
              />
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
              className="w-full bg-[#1D1D1B] hover:bg-[#333] text-[#F7F4EF] text-xs uppercase tracking-[0.2em] py-3.5 font-medium transition-all"
            >
              {isLoading ? 'Updating...' : language === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Set New Password'}
            </button>

            <button
              type="button"
              onClick={() => setStep('request')}
              className="w-full text-center text-xs text-[#7C746B] hover:text-[#1D1D1B] underline pt-1"
            >
              {language === 'ar' ? 'الرجوع لطلب رمز جديد' : 'Back to request a new link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
