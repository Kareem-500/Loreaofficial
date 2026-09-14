import React, { useState, useEffect } from 'react';
import { Menu, Globe, ShieldCheck, ChevronDown } from 'lucide-react';
import { LogoLink } from './header/LogoLink';
import { DesktopNavigation, NavLinkItem } from './header/DesktopNavigation';
import { HeaderActions } from './header/HeaderActions';
import { MobileMenu } from './header/MobileMenu';
import { Currency } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export interface HeaderProps {
  isScrolled: boolean;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onSelectCategory: (category: string) => void;
  onNavigate: (view: string) => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
}

/**
 * LORÉA Header Component:
 * - Clean, luxury women's fashion editorial layout
 * - LEFT: LORÉA exact brand logo link
 * - CENTER: Main navigation links
 * - RIGHT: Search, Account, Wishlist, Shopping Bag / Cart
 * - ON MOBILE: Hamburger button, LORÉA logo, Cart & essential icons
 * - Fully responsive across 320px, 480px, 768px, 1024px, 1200px, 1440px+
 * - Smooth sticky header with aspect-ratio preserving transitions
 */
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
  onCurrencyChange
}) => {
  const { user, isAuthenticated } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  // Close mega menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isMegaMenuOpen) setIsMegaMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMegaMenuOpen]);

  // Navigation links split for centered brand logo layout
  const leftNavLinks: NavLinkItem[] = [
    { label: 'NEW IN', action: () => onNavigate('new-in') },
    {
      label: 'SHOP',
      isMega: true,
      action: () => onNavigate('shop')
    },
    { label: 'COLLECTIONS', action: () => onNavigate('collections') },
    { label: 'CLOTHING', action: () => onNavigate('clothing') }
  ];

  const rightNavLinks: NavLinkItem[] = [
    { label: 'MODEST EDIT', action: () => onSelectCategory('Modest Edit') },
    { label: 'ABOUT', action: () => onNavigate('about') },
    { label: 'JOURNAL', action: () => onNavigate('journal') },
    { label: 'SALE', action: () => onNavigate('sale'), isSale: true }
  ];

  const navLinks: NavLinkItem[] = [...leftNavLinks, ...rightNavLinks];

  return (
    <>
      {/* 1. Global Announcement Topbar */}
      <div className="bg-[#151413] text-[#F7F4EF] text-[11px] sm:text-xs tracking-wider uppercase py-2 px-4 border-b border-[#2A2826] transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center space-x-4 text-[#B7ADA2]">
            <span>Cairo Atelier</span>
            <span>·</span>
            <span>Handcrafted in Egypt</span>
          </div>

          <div className="w-full md:w-auto text-center font-light tracking-widest text-[#F7F4EF]/90 text-[10px] sm:text-[11px]">
            Complimentary Cairo & Alexandria Delivery on Orders Over 2,500 EGP · Worldwide Express Shipping
          </div>

          <div className="hidden md:flex items-center space-x-4 text-[#B7ADA2]">
            {/* Language Switcher */}
            <button
              id="language-toggle-btn"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="text-[11px] font-medium tracking-wider text-[#F7F4EF] hover:text-[#BA945A] transition-colors flex items-center space-x-1"
            >
              <Globe className="w-3 h-3 text-[#BA945A]" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>

            <span>·</span>

            {/* Admin Portal Shortcut if Admin */}
            {(user?.role === 'admin' || user?.role === 'super_admin') && (
              <>
                <button
                  id="header-admin-portal-link"
                  onClick={() => onNavigate('admin')}
                  className="flex items-center space-x-1 text-[11px] font-semibold text-[#BA945A] hover:text-white uppercase tracking-wider"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin Portal</span>
                </button>
                <span>·</span>
              </>
            )}

            {/* Currency Selector */}
            <div className="relative">
              <button
                id="currency-selector-btn"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center space-x-1 hover:text-white transition-colors uppercase text-[11px] font-medium"
              >
                <span>{currency}</span>
                <ChevronDown className="w-2.5 h-2.5 opacity-60" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 py-1.5 w-24 bg-[#1D1D1B] border border-[#333] shadow-2xl rounded-xs z-50 text-[11px]">
                  {(['EGP', 'USD', 'EUR', 'AED'] as Currency[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        onCurrencyChange(c);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-1 hover:bg-[#2A2928] ${
                        currency === c ? 'text-[#BA945A] font-bold' : 'text-[#F7F4EF]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span>·</span>

            {/* User Session Quick status */}
            <button
              id="header-topbar-account-btn"
              onClick={onOpenAccount}
              className="text-[11px] uppercase tracking-wider text-[#F7F4EF] hover:text-[#BA945A] transition-colors"
            >
              {isAuthenticated ? `${user?.firstName}` : language === 'ar' ? 'دخول' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Sticky Header with Centered Luxury Brand Logo */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-xs border-b border-[#EAE5DE] py-2.5 sm:py-3'
            : 'bg-[#FAF8F5] border-b border-[#EAE5DE]/70 py-3.5 sm:py-4.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* LEFT: Desktop Left Navigation / Mobile Hamburger Menu */}
            <div className="flex items-center justify-start w-1/4 lg:w-[35%] xl:w-[36%]">
              {/* Mobile Hamburger Button */}
              <button
                id="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden min-w-[44px] min-h-[44px] -ml-2 flex items-center justify-center p-2 text-[#1D1D1B] hover:text-[#BA945A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA945A] rounded-xs transition-colors"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 stroke-[1.5]" />
              </button>

              {/* Desktop Left Navigation */}
              <DesktopNavigation
                navLinks={leftNavLinks}
                isMegaMenuOpen={isMegaMenuOpen}
                setIsMegaMenuOpen={setIsMegaMenuOpen}
                align="left"
              />
            </div>

            {/* CENTER: LORÉA Logo (Centered on both Desktop and Mobile) */}
            <div className="flex-1 lg:w-[30%] xl:w-[28%] flex items-center justify-center text-center px-2">
              <LogoLink
                onNavigate={onNavigate}
                isScrolled={isScrolled}
                ariaLabel="LORÉA Home"
              />
            </div>

            {/* RIGHT: Desktop Right Navigation + Header Actions */}
            <div className="flex items-center justify-end w-1/4 lg:w-[35%] xl:w-[36%] space-x-2 sm:space-x-4">
              {/* Desktop Right Navigation */}
              <DesktopNavigation
                navLinks={rightNavLinks}
                isMegaMenuOpen={false}
                setIsMegaMenuOpen={() => {}}
                align="right"
                className="mr-2 xl:mr-4 hidden xl:flex"
              />

              <HeaderActions
                onOpenSearch={onOpenSearch}
                onOpenAccount={onOpenAccount}
                onOpenWishlist={onOpenWishlist}
                onOpenCart={onOpenCart}
                wishlistCount={wishlistCount}
                cartCount={cartCount}
                isAuthenticated={isAuthenticated}
                userName={user?.firstName || 'Account'}
                isMobileCompact={true}
              />
            </div>
          </div>
        </div>

        {/* 3. Mega Menu for SHOP (Interactive dropdown on hover or click) */}
        {isMegaMenuOpen && (
          <div
            id="mega-menu"
            onMouseLeave={() => setIsMegaMenuOpen(false)}
            className="hidden lg:block absolute top-full left-0 w-full bg-[#FAF8F5] border-b border-[#EAE5DE] shadow-xl transition-all duration-300 z-50 py-8"
          >
            <div className="max-w-7xl mx-auto px-8 grid grid-cols-4 gap-8">
              {/* Column 1: Clothing */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.24em] font-medium text-[#7C746B] mb-4 pb-2 border-b border-[#EAE5DE]">
                  Clothing
                </h3>
                <ul className="space-y-2.5 text-[13px] text-[#1D1D1B]">
                  {[
                    'Dresses',
                    'Tops & Blouses',
                    'Shirts',
                    'Cardigans & Sweaters',
                    'Jackets & Outerwear',
                    'Trousers & Pants',
                    'Midi & Maxi Skirts',
                    'Coordinated Sets',
                    'Modest Edit'
                  ].map((item) => (
                    <li key={item}>
                      <button
                        onClick={() => {
                          const catMap: Record<string, string> = {
                            'Dresses': 'Dresses',
                            'Tops & Blouses': 'Tops',
                            'Shirts': 'Tops',
                            'Cardigans & Sweaters': 'Outerwear',
                            'Jackets & Outerwear': 'Outerwear',
                            'Trousers & Pants': 'Pants',
                            'Midi & Maxi Skirts': 'Pants',
                            'Coordinated Sets': 'Sets',
                            'Modest Edit': 'Modest Edit'
                          };
                          onSelectCategory(catMap[item] || 'Dresses');
                          setIsMegaMenuOpen(false);
                        }}
                        className="hover:text-[#BA945A] hover:translate-x-1 transition-all inline-block font-light"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Collections */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.24em] font-medium text-[#7C746B] mb-4 pb-2 border-b border-[#EAE5DE]">
                  Collections
                </h3>
                <ul className="space-y-2.5 text-[13px] text-[#1D1D1B]">
                  {[
                    { label: 'New Collection 2026', tag: 'NEW' },
                    { label: 'The Giza 45 Cotton Edit', tag: 'HERITAGE' },
                    { label: 'Architectural Linen', tag: null },
                    { label: 'Minimalist Modest Edit', tag: 'POPULAR' },
                    { label: 'The Permanent Essentials', tag: null },
                    { label: 'Limited Atelier Series', tag: 'LIMITED' },
                    { label: 'Best Sellers', tag: null }
                  ].map((c) => (
                    <li key={c.label}>
                      <button
                        onClick={() => {
                          onNavigate('collections');
                          setIsMegaMenuOpen(false);
                        }}
                        className="hover:text-[#BA945A] hover:translate-x-1 transition-all inline-flex items-center font-light"
                      >
                        <span>{c.label}</span>
                        {c.tag && (
                          <span className="ml-2 text-[9px] uppercase tracking-wider bg-[#EFECE6] text-[#7C746B] px-1.5 py-0.5 rounded-xs">
                            {c.tag}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Editorial & Guides */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.24em] font-medium text-[#7C746B] mb-4 pb-2 border-b border-[#EAE5DE]">
                  Editorial & Guides
                </h3>
                <ul className="space-y-2.5 text-[13px] text-[#1D1D1B]">
                  {[
                    { label: 'The LORÉA Story', action: () => onNavigate('about') },
                    { label: 'Giza Cotton Fabric Guide', action: () => onNavigate('journal') },
                    { label: 'Style Journal & How To Wear', action: () => onNavigate('journal') },
                    { label: 'Interactive Size Guide', action: () => onNavigate('size-guide') },
                    { label: 'Atelier Sustainability & Linen', action: () => onNavigate('about') }
                  ].map((item) => (
                    <li key={item.label}>
                      <button
                        onClick={() => {
                          item.action();
                          setIsMegaMenuOpen(false);
                        }}
                        className="hover:text-[#BA945A] hover:translate-x-1 transition-all inline-block font-light"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: Campaign Spotlight Feature */}
              <div
                className="relative group overflow-hidden bg-[#EAE5DE] aspect-3/4 flex flex-col justify-end p-6 cursor-pointer"
                onClick={() => {
                  onNavigate('shop');
                  setIsMegaMenuOpen(false);
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop"
                  alt="LORÉA New Season Campaign"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative z-10 text-white">
                  <p className="text-[10px] tracking-[0.24em] uppercase text-[#B7ADA2] mb-1 font-medium">CAMPAIGN 2026</p>
                  <h4 className="font-serif text-xl tracking-wide font-normal mb-2">The Architecture of Summer</h4>
                  <span className="inline-block text-[11px] tracking-[0.16em] uppercase underline underline-offset-4 text-white/90">
                    Explore Edit
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 4. Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
        onNavigate={onNavigate}
        onSelectCategory={onSelectCategory}
        onOpenWishlist={onOpenWishlist}
        onOpenAccount={onOpenAccount}
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
