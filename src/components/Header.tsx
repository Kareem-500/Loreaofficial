import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { LogoLink } from './header/LogoLink';
import { HeaderActions } from './header/HeaderActions';
import { MobileMenu } from './header/MobileMenu';
import { CategoryNavBar } from './header/CategoryNavBar';
import { TopAnnouncementBar } from './header/TopAnnouncementBar';
import { Currency } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  isScrolled: boolean;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onSelectCategory: (category: string, subcategory?: string) => void;
  onNavigate: (view: string) => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  currentView?: string;
  activeCategoryFilter?: string;
  onOpenTryOn?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isScrolled,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAccount,
  onSelectCategory,
  onNavigate,
  currency,
  onCurrencyChange,
  currentView = 'home',
  activeCategoryFilter = 'All',
  onOpenTryOn
}) => {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  return (
    <>
      {/* 1. Global Animated Luxury Fashion Announcement Topbar */}
      <TopAnnouncementBar
        language={language}
        onLanguageChange={setLanguage}
        currency={currency}
        onCurrencyChange={onCurrencyChange}
        isAuthenticated={isAuthenticated}
        userName={user?.firstName || 'Account'}
        onOpenAccount={onOpenAccount}
      />

      {/* 2. Main Sticky Minimal Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#EAE5DE] shadow-none">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 relative flex items-center justify-between">
          {/* Left: Hamburger menu trigger (visible on desktop and mobile) */}
          <div className="flex items-center justify-start z-10 w-28 sm:w-36 md:w-44">
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center justify-center p-2 -ml-2 text-[#1D1D1B] hover:text-[#BA945A] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] rounded-sm transition-colors cursor-pointer"
              aria-label="Open Menu"
              title="Menu"
            >
              <Menu className="w-5 h-5 stroke-[1.4]" />
            </button>
          </div>

          {/* Center: LORÉA Logo horizontally centered on page */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center text-center z-10 pointer-events-auto px-2">
            <LogoLink
              onNavigate={onNavigate}
              isScrolled={false}
              ariaLabel="LORÉA Home"
            />
          </div>

          {/* Right: Account, Search, Shopping Bag */}
          <div className="flex items-center justify-end z-10 w-28 sm:w-36 md:w-44">
            <HeaderActions
              onOpenSearch={onOpenSearch}
              onOpenAccount={onOpenAccount}
              onOpenWishlist={onOpenWishlist}
              onOpenCart={onOpenCart}
              wishlistCount={wishlistCount}
              cartCount={cartCount}
              isAuthenticated={isAuthenticated}
              userName={user?.firstName || 'Account'}
              isMobileCompact={false}
            />
          </div>
        </div>
      </header>

      {/* 3. Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNavigate={onNavigate}
        onSelectCategory={onSelectCategory}
        onOpenWishlist={onOpenWishlist}
        onOpenAccount={onOpenAccount}
        onOpenTryOn={onOpenTryOn}
        wishlistCount={wishlistCount}
        currency={currency}
        onCurrencyChange={onCurrencyChange}
        language={language}
        setLanguage={setLanguage}
        isAuthenticated={isAuthenticated}
        userRole={user?.role}
        userName={user?.firstName}
      />
    </>
  );
};
