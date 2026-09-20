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

      {/* 2. Main Sticky Header (Both bars share the exact same luxury ivory background as the body) */}
      <header
        className={`sticky top-0 z-40 bg-[#F7F4EF] transition-[border-color,box-shadow] duration-200 ${
          isScrolled
            ? 'border-b border-[#EAE5DE] shadow-[0_2px_8px_rgba(29,29,27,0.03)]'
            : 'border-b border-transparent shadow-none'
        }`}
      >
        {/* FIRST HEADER BAR */}
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-3.5 pb-2.5 sm:pt-4 sm:pb-3 md:pt-4.5 md:pb-3.5 lg:pt-5 lg:pb-4 relative flex items-center justify-between min-h-[52px] sm:min-h-[58px] md:min-h-[64px]">
          {/* Left: Mobile hamburger menu trigger */}
          <div className="flex items-center justify-start z-10 flex-1 sm:flex-initial sm:w-28 md:w-32 lg:w-44">
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex items-center justify-center p-1.5 -ml-1 text-[#1D1D1B] hover:text-[#BA945A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA945A] rounded-sm transition-colors cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
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

          {/* Right: Search, Account, Wishlist, Shopping Bag */}
          <div className="flex items-center justify-end z-10 flex-1 sm:flex-initial sm:w-28 md:w-32 lg:w-44">
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

        {/* SECOND NAVIGATION BAR: SHOP | NEW IN | SALE | COLLECTION | STORY US */}
        <CategoryNavBar
          currentView={currentView}
          activeCategory={activeCategoryFilter}
          onSelectCategory={onSelectCategory}
          onNavigate={onNavigate}
          onOpenTryOn={onOpenTryOn}
        />
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
