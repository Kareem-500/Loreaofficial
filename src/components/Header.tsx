import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown, Globe, ShieldCheck } from 'lucide-react';
import { LoreaLogo } from './LoreaLogo';
import { Currency } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
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
  const { language, setLanguage, t } = useLanguage();

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  // Close mega menu on scroll or outside interaction
  useEffect(() => {
    const handleScroll = () => {
      if (isMegaMenuOpen) setIsMegaMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMegaMenuOpen]);

  const navLinks = [
    { label: 'NEW IN', action: () => onNavigate('new-in') },
    {
      label: 'SHOP',
      isMega: true,
      action: () => onNavigate('shop')
    },
    { label: 'COLLECTIONS', action: () => onNavigate('collections') },
    { label: 'CLOTHING', action: () => onNavigate('clothing') },
    { label: 'MODEST EDIT', action: () => onSelectCategory('Modest Edit') },
    { label: 'ABOUT', action: () => onNavigate('about') },
    { label: 'JOURNAL', action: () => onNavigate('journal') },
    { label: 'SALE', action: () => onNavigate('sale'), isSale: true }
  ];

  return (
    <>
      {/* 1. Announcement Bar */}
      <div className="bg-[#151413] text-[#F7F4EF] text-[11px] sm:text-xs tracking-wider uppercase py-2 px-4 border-b border-[#2A2826] transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center space-x-4 text-[#B7ADA2]">
            <span>Cairo Atelier</span>
            <span>·</span>
            <span>Handcrafted in Egypt</span>
          </div>

          <div className="w-full md:w-auto text-center font-light tracking-widest text-[#F7F4EF]/90">
            Complimentary Cairo & Alexandria Delivery on Orders Over 2,500 EGP · Worldwide Express Shipping
          </div>

          <div className="hidden md:flex items-center space-x-4 text-[#B7ADA2]">
            {/* Language Switcher */}
            <button
              id="language-toggle-btn"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="text-[11px] font-medium tracking-wider text-[#F7F4EF] hover:text-[#B88F88] transition-colors flex items-center space-x-1"
            >
              <Globe className="w-3 h-3 text-[#B88F88]" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>

            <span>·</span>

            {/* Admin Portal Shortcut if Admin */}
            {(user?.role === 'admin' || user?.role === 'super_admin') && (
              <>
                <button
                  id="header-admin-portal-link"
                  onClick={() => onNavigate('admin')}
                  className="flex items-center space-x-1 text-[11px] font-semibold text-[#B88F88] hover:text-white uppercase tracking-wider"
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
                <div className="absolute right-0 mt-2 py-1.5 w-24 bg-[#1D1D1B] border border-[#333] shadow-2xl rounded-sm z-50 text-[11px]">
                  {(['EGP', 'USD', 'EUR', 'AED'] as Currency[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        onCurrencyChange(c);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-1 hover:bg-[#2A2928] ${
                        currency === c ? 'text-[#B88F88] font-bold' : 'text-[#F7F4EF]'
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
              className="text-[11px] uppercase tracking-wider text-[#F7F4EF] hover:text-[#B88F88] transition-colors"
            >
              {isAuthenticated ? `${user?.firstName}` : language === 'ar' ? 'دخول' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F7F4EF]/95 backdrop-blur-md shadow-xs border-b border-[#EAE5DE] py-3'
            : 'bg-[#F7F4EF] border-b border-[#EAE5DE]/60 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* LEFT: Navigation (Desktop) / Hamburger (Mobile) */}
            <div className="flex items-center lg:w-1/3">
              {/* Mobile menu trigger */}
              <button
                id="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-[#1D1D1B] hover:text-[#B88F88] transition-colors"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 stroke-[1.5]" />
              </button>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center space-x-6 text-[12px] tracking-[0.18em] font-medium text-[#1D1D1B]">
                {navLinks.slice(0, 4).map((link) => (
                  <div
                    key={link.label}
                    className="relative group"
                    onMouseEnter={() => link.isMega && setIsMegaMenuOpen(true)}
                  >
                    <button
                      onClick={() => {
                        link.action();
                        setIsMegaMenuOpen(false);
                      }}
                      className={`py-2 transition-colors relative hover:text-[#B88F88] flex items-center ${
                        link.isSale ? 'text-[#964036] font-semibold' : ''
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.isMega && <ChevronDown className="w-3 h-3 ml-1 opacity-50 transition-transform group-hover:rotate-180" />}
                    </button>
                  </div>
                ))}
              </nav>
            </div>

            {/* CENTER: LORÉA Logo */}
            <div className="lg:w-1/3 flex justify-center cursor-pointer" onClick={() => onNavigate('home')}>
              <LoreaLogo variant={isScrolled ? 'compact' : 'light'} />
            </div>

            {/* RIGHT: Utilities (Search, Account, Wishlist, Cart) */}
            <div className="flex items-center justify-end space-x-4 sm:space-x-5 lg:w-1/3">
              {/* Secondary links on desktop */}
              <div className="hidden xl:flex items-center space-x-6 text-[12px] tracking-[0.18em] font-medium text-[#1D1D1B] mr-4">
                {navLinks.slice(4).map((link) => (
                  <button
                    key={link.label}
                    onClick={link.action}
                    className={`hover:text-[#B88F88] transition-colors ${
                      link.isSale ? 'text-[#964036] font-semibold' : ''
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Search Icon */}
              <button
                id="header-search-btn"
                onClick={onOpenSearch}
                className="p-1.5 text-[#1D1D1B] hover:text-[#B88F88] transition-colors"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px] stroke-[1.5]" />
              </button>

              {/* Account Icon */}
              <button
                id="header-account-btn"
                onClick={onOpenAccount}
                className="hidden sm:block p-1.5 text-[#1D1D1B] hover:text-[#B88F88] transition-colors"
                aria-label="Customer Account"
              >
                <User className="w-[18px] h-[18px] stroke-[1.5]" />
              </button>

              {/* Wishlist Icon with count */}
              <button
                id="header-wishlist-btn"
                onClick={onOpenWishlist}
                className="relative p-1.5 text-[#1D1D1B] hover:text-[#B88F88] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-[18px] h-[18px] stroke-[1.5]" />
                {wishlistCount > 0 ? (
                  <span className="absolute -top-1 -right-1 bg-[#1D1D1B] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium pointer-events-none">
                    {wishlistCount}
                  </span>
                ) : null}
              </button>

              {/* Cart Icon with count */}
              <button
                id="header-cart-btn"
                onClick={onOpenCart}
                className="relative p-1.5 text-[#1D1D1B] hover:text-[#B88F88] transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-[18px] h-[18px] stroke-[1.5]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#1D1D1B] text-[#F7F4EF] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Mega Menu for SHOP */}
        {isMegaMenuOpen && (
          <div
            id="mega-menu"
            onMouseLeave={() => setIsMegaMenuOpen(false)}
            className="hidden lg:block absolute top-full left-0 w-full bg-[#F7F4EF] border-b border-[#EAE5DE] shadow-xl transition-all duration-300 z-50 py-8"
          >
            <div className="max-w-7xl mx-auto px-8 grid grid-cols-4 gap-8">
              {/* Column 1: Clothing */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-[#7C746B] mb-4 pb-2 border-b border-[#EAE5DE]">
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
                        className="hover:text-[#B88F88] hover:translate-x-1 transition-all inline-block font-light"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Collections */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-[#7C746B] mb-4 pb-2 border-b border-[#EAE5DE]">
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
                        className="hover:text-[#B88F88] hover:translate-x-1 transition-all inline-flex items-center font-light"
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
                <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-[#7C746B] mb-4 pb-2 border-b border-[#EAE5DE]">
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
                        className="hover:text-[#B88F88] hover:translate-x-1 transition-all inline-block font-light"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: Campaign Spotlight Feature */}
              <div className="relative group overflow-hidden bg-[#EAE5DE] aspect-3/4 flex flex-col justify-end p-6 cursor-pointer" onClick={() => { onNavigate('shop'); setIsMegaMenuOpen(false); }}>
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

      {/* 4. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-sm bg-[#F7F4EF] h-full shadow-2xl flex flex-col z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#EAE5DE]">
              <LoreaLogo variant="compact" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-[#1D1D1B] hover:text-[#B88F88]"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div className="space-y-4">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#7C746B] font-medium">Navigation</p>
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => {
                      link.action();
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left text-lg font-serif tracking-wider ${
                      link.isSale ? 'text-[#964036] font-semibold' : 'text-[#1D1D1B]'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}

                <button
                  onClick={() => {
                    onOpenWishlist();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between w-full text-left text-lg font-serif tracking-wider text-[#1D1D1B] pt-1"
                >
                  <span className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 stroke-[1.5]" />
                    <span>Wishlist</span>
                  </span>
                  {wishlistCount > 0 ? (
                    <span className="bg-[#1D1D1B] text-white text-[10px] px-2 py-0.5 rounded-full font-sans font-medium">
                      {wishlistCount}
                    </span>
                  ) : null}
                </button>
              </div>

              <div className="pt-4 border-t border-[#EAE5DE] space-y-3">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#7C746B] font-medium">Featured Categories</p>
                {['Dresses', 'Tops', 'Sets', 'Outerwear', 'Pants', 'Modest Edit'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      onSelectCategory(cat);
                      setMobileMenuOpen(false);
                    }}
                    className="block text-sm text-[#1D1D1B]/80 hover:text-[#B88F88] font-light"
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Currency Selector Mobile */}
              <div className="pt-4 border-t border-[#EAE5DE]">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#7C746B] font-medium mb-2">Currency</p>
                <div className="grid grid-cols-4 gap-2">
                  {(['EGP', 'USD', 'EUR', 'AED'] as Currency[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => onCurrencyChange(c)}
                      className={`py-1.5 text-xs text-center border ${
                        currency === c
                          ? 'border-[#1D1D1B] bg-[#1D1D1B] text-[#F7F4EF] font-medium'
                          : 'border-[#D4CCC2] text-[#1D1D1B]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="p-6 bg-[#EFECE6] border-t border-[#EAE5DE] text-xs text-[#7C746B]">
              <p className="tracking-widest uppercase font-medium text-[10px] text-[#1D1D1B] mb-1">LORÉA ATELIER</p>
              <p>Cairo · Alexandria · Worldwide Delivery</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
