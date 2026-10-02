import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { LogoLink } from './header/LogoLink';
import { HeaderActions } from './header/HeaderActions';
import { MobileMenu } from './header/MobileMenu';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  return (
    <>
      {/* 1. Global Minimal Luxury Announcement Bar */}
      <TopAnnouncementBar
        language={language}
        onLanguageChange={setLanguage}
        currency={currency}
        onCurrencyChange={onCurrencyChange}
        isAuthenticated={isAuthenticated}
        userName={user?.firstName || 'Account'}
        onOpenAccount={onOpenAccount}
      />

      {/* 2. Main Sticky Minimal Header — Works seamlessly on all viewports without third bars */}
      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b transition-shadow duration-300 ${
          isScrolled ? 'border-[#EAE5DE] shadow-xs' : 'border-[#EAE5DE]/80 shadow-none'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-14 min-[390px]:h-[60px] sm:h-16 lg:h-[68px] flex items-center justify-between">
          
          {/* Left: Universal Hamburger Menu Button (Accessible on Mobile, Tablet, Laptop, and Desktop) */}
          <div className="flex-1 flex items-center justify-start min-w-0">
            <button
              id="header-hamburger-menu-btn"
              onClick={() => setMenuOpen(true)}
              className="group flex items-center space-x-2 p-2 -ml-2 text-[#1D1D1B] hover:text-[#BA945A] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] rounded-sm transition-colors cursor-pointer select-none active:scale-95"
              aria-label="Open Navigation Menu"
              title="Menu (Navigation)"
            >
              <Menu className="w-5 h-5 stroke-[1.4] transition-transform duration-200 group-hover:scale-105" />
              <span className="hidden sm:inline-block font-sans text-[11px] tracking-[0.22em] uppercase font-medium text-[#1D1D1B] group-hover:text-[#BA945A] transition-colors">
                MENU
              </span>
            </button>
          </div>

          {/* Center: LORÉA Logo perfectly centered with pristine typography */}
          <div className="shrink-0 flex items-center justify-center text-center px-2 sm:px-4">
            <LogoLink
              onNavigate={onNavigate}
              isScrolled={false}
              ariaLabel="LORÉA Home"
            />
          </div>

          {/* Right: Account, Search, Wishlist, Shopping Bag */}
          <div className="flex-1 flex items-center justify-end min-w-0">
            <HeaderActions
              onOpenSearch={onOpenSearch}
              onOpenAccount={onOpenAccount}
              onOpenWishlist={onOpenWishlist}
              onOpenCart={onOpenCart}
              wishlistCount={wishlistCount}
              cartCount={cartCount}
              isAuthenticated={isAuthenticated}
              userName={user?.firstName || 'Account'}
              isAdmin={user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'manager'}
              onOpenAdmin={() => onNavigate('admin')}
            />
          </div>
        </div>
      </header>

      {/* 3. Universal Navigation Drawer (Mobile, Tablet, Laptop, Desktop) */}
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
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
