import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, Phone, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LoreaLogo } from '../LoreaLogo';

interface RegisterViewProps {
  onSuccess?: () => void;
  onNavigateToLogin: () => void;
}

const EGYPT_GOVERNORATES = [
  'Cairo',
  'Giza',
  'Alexandria',
  'Dakahlia',
  'Red Sea (El Gouna / Hurghada)',
  'South Sinai (Sharm El Sheikh)',
  'Qalyubia',
  'Gharbia',
  'Monufia',
  'Sharqia',
  'Damietta',
  'Port Said',
  'Suez',
  'Ismailia',
  'Kafr El Sheikh',
  'Fayoum',
  'Beni Suef',
  'Minya',
  'Asyut',
  'Sohag',
  'Qena',
  'Luxor',
  'Aswan',
  'Matrouh (North Coast)',
];

export const RegisterView: React.FC<RegisterViewProps> = ({ onSuccess, onNavigateToLogin }) => {
  const { register } = useAuth();
  const { t, language } = useLanguage();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+20 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [governorate, setGovernorate] = useState('Cairo');
  const [city, setCity] = useState('New Cairo');
  const [address, setAddress] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verificationBanner, setVerificationBanner] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: 'bg-gray-200' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

    if (score <= 2) return { score: 25, label: language === 'ar' ? 'ضعيفة' : 'Weak', color: 'bg-[#964036]' };
    if (score <= 3) return { score: 50, label: language === 'ar' ? 'متوسطة' : 'Fair', color: 'bg-amber-500' };
    if (score === 4) return { score: 75, label: language === 'ar' ? 'جيدة' : 'Good', color: 'bg-emerald-600' };
    return { score: 100, label: language === 'ar' ? 'قوية جداً ومحمية' : 'Strong & Secure', color: 'bg-emerald-700' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agreeTerms) {
      setErrorMessage(
        language === 'ar'
          ? 'يجب الموافقة على الشروط والأحكام وسياسة الخصوصية للاستمرار.'
          : 'You must accept the Terms & Conditions and Privacy Policy.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        language === 'ar' ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.'
      );
      return;
    }

    if (strength.score < 50) {
      setErrorMessage(
        language === 'ar'
          ? 'يرجى اختيار كلمة مرور أقوى (8 أحرف على الأقل تشمل حرفاً كبيراً، صغيراً، رقماً ورمزاً).'
          : 'Please choose a stronger password (at least 8 chars with uppercase, lowercase, digit, and symbol).'
      );
      return;
    }

    try {
      setIsLoading(true);
      const res = await register({
        firstName,
        lastName,
        email,
        phone,
        password,
        confirmPassword,
        dateOfBirth,
        governorate,
        city,
        address,
        agreeTerms,
        marketingConsent,
      });

      if (res.verificationToken) {
        setVerificationBanner(res.verificationToken);
      }

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create account. Please check your information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto bg-white border border-[#EAE5DE] shadow-xl p-8 sm:p-12 transition-all">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <LoreaLogo variant="dark" className="mx-auto mb-4" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#7C746B] font-medium block">
          {language === 'ar' ? 'عضوية الدار الراقية' : 'HAUTE ATELIER MEMBERSHIP'}
        </span>
        <h2 className="font-serif text-3xl font-light text-[#1D1D1B] mt-2">
          {t('register.title')}
        </h2>
        <p className="text-xs text-[#7C746B] font-light mt-1.5 max-w-md mx-auto leading-relaxed">
          {t('register.subtitle')}
        </p>
      </div>

      {/* Verification notice if created */}
      {verificationBanner && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{language === 'ar' ? 'تم إنشاء الحساب بنجاح!' : 'Account Created Successfully!'}</p>
            <p className="mt-1 text-emerald-700">
              {language === 'ar'
                ? 'تم إرسال رابط تأكيد الحساب إلى بريدك الإلكتروني.'
                : 'A confirmation link has been issued for your security.'}
            </p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-3.5 bg-[#964036]/10 border border-[#964036]/30 text-[#964036] text-xs leading-relaxed">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
              {t('register.first_name')} *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#7C746B] absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
              <input
                id="register-firstname-input"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Farida"
                required
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-3 pl-9 pr-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
              {t('register.last_name')} *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#7C746B] absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
              <input
                id="register-lastname-input"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Mansour"
                required
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-3 pl-9 pr-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
              {t('auth.email')} *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7C746B] absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
              <input
                id="register-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farida.mansour@gmail.com"
                required
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-3 pl-9 pr-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
              {t('register.phone')}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#7C746B] absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
              <input
                id="register-phone-input"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 100 123 4567"
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-3 pl-9 pr-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Password & Confirm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium">
                {t('auth.password')} *
              </label>
              {password && (
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#7C746B]">
                  {strength.label}
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7C746B] absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
              <input
                id="register-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                required
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-3 pl-9 pr-10 text-[#1D1D1B] focus:border-[#1D1D1B] focus:bg-white focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-[#7C746B] hover:text-[#1D1D1B]"
                aria-label="Toggle password"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password meter */}
            {password && (
              <div className="w-full bg-gray-200 h-1 mt-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strength.color}`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
              {t('register.confirm_password')} *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7C746B] absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
              <input
                id="register-confirm-password-input"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                required
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-3 pl-9 pr-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Location & Optional Shipping details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
              {t('register.governorate')}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#7C746B] absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-3 pl-9 pr-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:bg-white focus:outline-none transition-all cursor-pointer"
              >
                {EGYPT_GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
              {t('register.city')}
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. New Cairo / Zamalek / Maadi"
              className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-3 px-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Consent Checkboxes */}
        <div className="space-y-3 pt-3 border-t border-[#EAE5DE]">
          <label className="flex items-start space-x-3 text-xs text-[#7C746B] cursor-pointer select-none">
            <input
              id="register-terms-checkbox"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required
              className="w-4 h-4 mt-0.5 accent-[#1D1D1B] cursor-pointer shrink-0"
            />
            <span className="leading-snug">
              {t('register.terms')}
            </span>
          </label>

          <label className="flex items-start space-x-3 text-xs text-[#7C746B] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="w-4 h-4 mt-0.5 accent-[#1D1D1B] cursor-pointer shrink-0"
            />
            <span className="leading-snug">
              {t('register.marketing')}
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          id="register-submit-btn"
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1D1D1B] hover:bg-[#333] text-[#F7F4EF] text-xs uppercase tracking-[0.2em] py-3.5 font-medium transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
        >
          <span>{isLoading ? t('common.loading') : t('register.submit')}</span>
          {!isLoading && <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-8 pt-6 border-t border-[#EAE5DE] text-center">
        <p className="text-xs text-[#7C746B]">
          {language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an atelier profile?'}
        </p>
        <button
          id="goto-login-btn"
          type="button"
          onClick={onNavigateToLogin}
          className="mt-2 text-xs uppercase tracking-widest font-semibold text-[#1D1D1B] underline hover:text-[#B88F88] transition-colors"
        >
          {t('auth.signin_btn')}
        </button>
      </div>
    </div>
  );
};
