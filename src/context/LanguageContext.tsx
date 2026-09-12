import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  direction: 'ltr' | 'rtl';
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<string, { en: string; ar: string }> = {
  // Navigation
  'nav.home': { en: 'Home', ar: 'الرئيسية' },
  'nav.shop': { en: 'Collection', ar: 'المجموعة' },
  'nav.new_arrivals': { en: 'New Arrivals', ar: 'وصل حديثاً' },
  'nav.best_sellers': { en: 'Best Sellers', ar: 'الأكثر طلباً' },
  'nav.modest_edit': { en: 'Modest Edit', ar: 'المجموعة المحتشمة' },
  'nav.editorial': { en: 'Editorial', ar: 'المجلة والمقالات' },
  'nav.brand_story': { en: 'Maison Story', ar: 'قصة الدار' },
  'nav.account': { en: 'Account', ar: 'حسابي' },
  'nav.wishlist': { en: 'Wishlist', ar: 'قائمة الأمنيات' },
  'nav.cart': { en: 'Bag', ar: 'حقيبة التسوق' },
  'nav.search': { en: 'Search', ar: 'بحث' },
  'nav.login': { en: 'Sign In', ar: 'تسجيل الدخول' },
  'nav.register': { en: 'Create Account', ar: 'إنشاء حساب جديد' },
  'nav.admin': { en: 'Admin Panel', ar: 'لوحة الإدارة' },

  // Brand Slogans
  'brand.tagline': { en: 'Haute Elegance Crafted in Cairo', ar: 'أناقة راقية صُممت في القاهرة' },
  'brand.shipping_banner': { en: 'Complimentary shipping across Greater Cairo on orders over 2,500 EGP', ar: 'شحن مجاني لكافة أنحاء القاهرة الكبرى للطلبات فوق 2,500 ج.م' },

  // Auth & Login
  'auth.welcome_back': { en: 'Welcome back to LORÉA', ar: 'مرحباً بك مجدداً في لوريا' },
  'auth.signin_subtitle': { en: 'Sign in to continue your LORÉA luxury shopping experience.', ar: 'سجّلي الدخول للاستمتاع بتجربة تسوق لوريا الفاخرة.' },
  'auth.email': { en: 'Email Address', ar: 'البريد الإلكتروني' },
  'auth.password': { en: 'Password', ar: 'كلمة المرور' },
  'auth.show_password': { en: 'Show', ar: 'إظهار' },
  'auth.hide_password': { en: 'Hide', ar: 'إخفاء' },
  'auth.remember_me': { en: 'Remember me on this device', ar: 'تذكرني على هذا الجهاز' },
  'auth.forgot_password': { en: 'Forgot password?', ar: 'نسيت كلمة المرور؟' },
  'auth.signin_btn': { en: 'Sign In', ar: 'تسجيل الدخول' },
  'auth.create_account_btn': { en: 'Create an Account', ar: 'إنشاء حساب جديد' },
  'auth.continue_guest': { en: 'Continue as Guest', ar: 'المتابعة كزائر' },
  'auth.or': { en: 'or', ar: 'أو' },

  // Register
  'register.title': { en: 'Create Your LORÉA Profile', ar: 'إنشاء حسابك الخاص في لوريا' },
  'register.subtitle': { en: 'Enjoy tailored private appointments, order tracking, and bespoke curation.', ar: 'استمتعي بمتابعة فورية للطلبات، عروض حصرية، وقائمة أمنيات دائمة.' },
  'register.first_name': { en: 'First Name', ar: 'الاسم الأول' },
  'register.last_name': { en: 'Last Name', ar: 'اسم العائلة' },
  'register.phone': { en: 'Mobile Number (+20)', ar: 'رقم الهاتف (+20)' },
  'register.confirm_password': { en: 'Confirm Password', ar: 'تأكيد كلمة المرور' },
  'register.dob': { en: 'Date of Birth (Optional)', ar: 'تاريخ الميلاد (اختياري)' },
  'register.governorate': { en: 'Governorate', ar: 'المحافظة' },
  'register.city': { en: 'City / District', ar: 'المدينة / المنطقة' },
  'register.address': { en: 'Street Address (Optional)', ar: 'العنوان بالتفصيل (اختياري)' },
  'register.terms': { en: 'I agree to the Terms & Conditions and Privacy Policy', ar: 'أوافق على الشروط والأحكام وسياسة الخصوصية' },
  'register.marketing': { en: 'Receive privileged invitations to private seasonal salons & launches', ar: 'أرغب في استلام إشعارات بالمجموعات الحصرية والمناسبات الخاصة' },
  'register.submit': { en: 'Create Account', ar: 'تأكيد إنشاء الحساب' },

  // Account Dashboard
  'account.overview': { en: 'Overview', ar: 'نظرة عامة' },
  'account.profile': { en: 'Profile Details', ar: 'البيانات الشخصية' },
  'account.orders': { en: 'My Orders', ar: 'طلباتي' },
  'account.wishlist': { en: 'Saved Pieces', ar: 'القطع المفضلة' },
  'account.addresses': { en: 'Addresses', ar: 'العناوين المحفوظة' },
  'account.security': { en: 'Security & Privacy', ar: 'الأمان وكلمة المرور' },
  'account.preferences': { en: 'Preferences', ar: 'التفضيلات' },
  'account.logout': { en: 'Sign Out', ar: 'تسجيل الخروج' },

  // Common UI
  'common.save': { en: 'Save Changes', ar: 'حفظ التغييرات' },
  'common.cancel': { en: 'Cancel', ar: 'إلغاء' },
  'common.loading': { en: 'Please wait...', ar: 'جاري التحميل...' },
  'common.egp': { en: 'EGP', ar: 'ج.م' },
  'common.add_to_bag': { en: 'Add to Bag', ar: 'إضافة للحقيبة' },
  'common.view_details': { en: 'View Details', ar: 'عرض التفاصيل' },
  'common.checkout': { en: 'Proceed to Checkout', ar: 'إتمام الطلب' },
  'common.empty_orders': { en: 'No orders yet.', ar: 'لا توجد طلبات سابقة حتى الآن.' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('lorea_language');
      return (saved as Language) || 'en';
    } catch {
      return 'en';
    }
  });

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    try {
      localStorage.setItem('lorea_language', language);
    } catch {}

    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    if (language === 'ar') {
      document.body.classList.add('font-cairo');
    } else {
      document.body.classList.remove('font-cairo');
    }
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key: string): string => {
    const item = translations[key];
    if (!item) return key;
    return item[language] || item.en;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
