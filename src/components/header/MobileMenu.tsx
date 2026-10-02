import React, { useEffect, useState } from 'react';
import { X, Heart, Globe, User, ShieldCheck, ChevronDown, ChevronRight, BookOpen, MessageCircle, Sparkles, HelpCircle, Truck, RotateCcw } from 'lucide-react';
import { LogoLink } from './LogoLink';
import { Currency } from '../../types';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onSelectCategory: (category: string, subcategory?: string) => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  onOpenTryOn?: () => void;
  wishlistCount: number;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  isAuthenticated: boolean;
  userRole?: string;
  userName?: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectCategory,
  onOpenWishlist,
  onOpenAccount,
  onOpenTryOn,
  wishlistCount,
  currency,
  onCurrencyChange,
  language,
  setLanguage,
  isAuthenticated,
  userRole,
  userName
}) => {
  const [isCollectionExpanded, setIsCollectionExpanded] = useState(true);
  const [isCustomerCareExpanded, setIsCustomerCareExpanded] = useState(false);

  // Close on ESC key press on all devices
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open and restore cleanly
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Curated collection items matching exact user request: Scarves, Modest, Dresses, Tops, Bottoms, Sets
  const collectionSubCategories = [
    { label: 'Dresses', target: 'Dresses' },
    { label: 'Tops & Shirts', target: 'Tops' },
    { label: 'Bottoms & Trousers', target: 'Bottoms' },
    { label: 'Sets & Coordinates', target: 'Sets' },
    { label: 'Scarves & Hijabs', target: 'Scarves' },
    { label: 'Modest Edit', target: 'Modest Edit' }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      {/* 1. Backdrop Overlay (click outside to close) */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Slide-out Drawer (available on Mobile, Tablet, Laptop, and Desktop) */}
      <div className="relative w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] bg-[#FAF8F5] h-full shadow-2xl flex flex-col z-10 transform transition-transform duration-300 ease-out border-r border-[#EAE5DE]">
        
        {/* Drawer Header: Logo & Close Button */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-[#EAE5DE] bg-white">
          <LogoLink
            onNavigate={(view) => {
              onNavigate(view);
              onClose();
            }}
            variant="light"
            ariaLabel="LORÉA Home"
          />
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center p-2 text-[#1D1D1B] hover:text-[#BA945A] hover:bg-[#FAF8F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] rounded-xs transition-all cursor-pointer active:scale-95"
            aria-label="Close Navigation Menu"
            title="Close Menu (ESC)"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-6 space-y-6 scrollbar-none">
          
          {/* Main Navigation Links */}
          <nav aria-label="Main Menu" className="flex flex-col space-y-1">
            <span className="text-[10px] tracking-[0.24em] uppercase text-[#7C746B] font-mono mb-2 block">
              CATALOG & EDITORIAL
            </span>

            {/* 1. HOME */}
            <button
              onClick={() => {
                onNavigate('home');
                onClose();
              }}
              className="flex items-center justify-between w-full text-left font-serif text-xl sm:text-2xl font-light tracking-wide text-[#1D1D1B] hover:text-[#BA945A] transition-colors py-2 cursor-pointer group"
            >
              <span>HOME</span>
              <ChevronRight className="w-4 h-4 text-[#D4CCC2] transition-transform group-hover:translate-x-1 group-hover:text-[#BA945A]" />
            </button>

            {/* 2. SHOP */}
            <button
              onClick={() => {
                onNavigate('store');
                onClose();
              }}
              className="flex items-center justify-between w-full text-left font-serif text-xl sm:text-2xl font-light tracking-wide text-[#1D1D1B] hover:text-[#BA945A] transition-colors py-2 cursor-pointer group"
            >
              <span>SHOP</span>
              <ChevronRight className="w-4 h-4 text-[#D4CCC2] transition-transform group-hover:translate-x-1 group-hover:text-[#BA945A]" />
            </button>

            {/* 3. NEW IN */}
            <button
              onClick={() => {
                onNavigate('new-in');
                onClose();
              }}
              className="flex items-center justify-between w-full text-left font-serif text-xl sm:text-2xl font-light tracking-wide text-[#1D1D1B] hover:text-[#BA945A] transition-colors py-2 cursor-pointer group"
            >
              <div className="flex items-center space-x-2.5">
                <span>NEW IN</span>
                <span className="text-[9px] font-mono uppercase tracking-widest bg-[#1D1D1B] text-white px-2 py-0.5 font-normal">
                  Drop
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#D4CCC2] transition-transform group-hover:translate-x-1 group-hover:text-[#BA945A]" />
            </button>

            {/* 4. SALE */}
            <button
              onClick={() => {
                onNavigate('sale');
                onClose();
              }}
              className="flex items-center justify-between w-full text-left font-serif text-xl sm:text-2xl font-light tracking-wide text-[#964036] hover:text-[#BA945A] transition-colors py-2 cursor-pointer group"
            >
              <div className="flex items-center space-x-2.5">
                <span>SALE</span>
                <span className="text-[9px] font-mono uppercase tracking-widest bg-[#964036]/15 text-[#964036] px-2 py-0.5 font-medium">
                  Seasonal
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#D4CCC2] transition-transform group-hover:translate-x-1 group-hover:text-[#BA945A]" />
            </button>

            {/* 5. BEST SELLERS */}
            <button
              onClick={() => {
                onNavigate('best-sellers');
                onClose();
              }}
              className="flex items-center justify-between w-full text-left font-serif text-xl sm:text-2xl font-light tracking-wide text-[#1D1D1B] hover:text-[#BA945A] transition-colors py-2 cursor-pointer group"
            >
              <div className="flex items-center space-x-2.5">
                <span>BEST SELLERS</span>
                <span className="text-[9px] font-mono uppercase tracking-widest bg-[#BA945A]/15 text-[#BA945A] px-2 py-0.5 font-medium">
                  Icons
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#D4CCC2] transition-transform group-hover:translate-x-1 group-hover:text-[#BA945A]" />
            </button>

            {/* 6. COLLECTION (Expandable Menu with subcategories: Scarves, Modest, Dresses, Tops, Bottoms, Sets) */}
            <div className="border-t border-b border-[#EAE5DE] py-2 my-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    onNavigate('collections');
                    onClose();
                  }}
                  className="font-serif text-xl sm:text-2xl font-light tracking-wide text-[#1D1D1B] hover:text-[#BA945A] transition-colors py-1 cursor-pointer"
                >
                  COLLECTION
                </button>
                <button
                  onClick={() => setIsCollectionExpanded(!isCollectionExpanded)}
                  aria-expanded={isCollectionExpanded}
                  className="w-8 h-8 flex items-center justify-center text-[#7C746B] hover:text-[#BA945A] cursor-pointer"
                  aria-label="Toggle collection subcategories"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCollectionExpanded ? 'rotate-180 text-[#BA945A]' : ''}`} />
                </button>
              </div>

              {/* Subcategories list */}
              {isCollectionExpanded && (
                <div className="flex flex-col space-y-1 pl-3 py-2 border-l border-[#BA945A]/40 my-2 animate-in fade-in duration-200">
                  {collectionSubCategories.map((cat) => (
                    <button
                      key={cat.target}
                      onClick={() => {
                        onSelectCategory(cat.target);
                        onClose();
                      }}
                      className="flex items-center justify-between py-2 text-xs uppercase tracking-[0.18em] font-medium text-[#4A453F] hover:text-[#BA945A] transition-colors w-full text-left cursor-pointer group pr-2"
                    >
                      <span>{cat.label}</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#BA945A] transition-opacity" />
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      onNavigate('collections');
                      onClose();
                    }}
                    className="flex items-center space-x-1.5 py-2 text-[11px] uppercase tracking-[0.2em] text-[#BA945A] font-semibold transition-colors w-full text-left cursor-pointer pt-2 border-t border-[#EAE5DE]/60 mt-1"
                  >
                    <span>View All Collections</span>
                    <span>→</span>
                  </button>
                </div>
              )}
            </div>

            {/* 7. STORY */}
            <button
              onClick={() => {
                onNavigate('about');
                onClose();
              }}
              className="flex items-center justify-between w-full text-left font-serif text-xl sm:text-2xl font-light tracking-wide text-[#1D1D1B] hover:text-[#BA945A] transition-colors py-2 cursor-pointer group"
            >
              <span>STORY</span>
              <ChevronRight className="w-4 h-4 text-[#D4CCC2] transition-transform group-hover:translate-x-1 group-hover:text-[#BA945A]" />
            </button>

            {/* 8. ARTICLES */}
            <button
              onClick={() => {
                onNavigate('journal');
                onClose();
              }}
              className="flex items-center justify-between w-full text-left font-serif text-xl sm:text-2xl font-light tracking-wide text-[#1D1D1B] hover:text-[#BA945A] transition-colors py-2 cursor-pointer group"
            >
              <span>ARTICLES</span>
              <ChevronRight className="w-4 h-4 text-[#D4CCC2] transition-transform group-hover:translate-x-1 group-hover:text-[#BA945A]" />
            </button>
          </nav>

          {/* Quick Client Utilities */}
          <div className="pt-4 border-t border-[#EAE5DE] space-y-3">
            <span className="text-[10px] tracking-[0.24em] uppercase text-[#7C746B] font-mono block">
              MY SELECTIONS
            </span>

            {/* Wishlist Link with Count */}
            <button
              onClick={() => {
                onOpenWishlist();
                onClose();
              }}
              className="flex items-center justify-between w-full text-left py-2 text-xs uppercase tracking-[0.18em] text-[#1D1D1B] hover:text-[#BA945A] cursor-pointer"
            >
              <span className="flex items-center space-x-2.5">
                <Heart className="w-4 h-4 stroke-[1.5]" />
                <span>Wishlist</span>
              </span>
              {wishlistCount > 0 && (
                <span className="bg-[#BA945A] text-white text-[10px] px-2 py-0.5 rounded-full font-mono font-medium">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account Link */}
            <button
              onClick={() => {
                onOpenAccount();
                onClose();
              }}
              className="flex items-center space-x-2.5 w-full text-left py-2 text-xs uppercase tracking-[0.18em] text-[#1D1D1B] hover:text-[#BA945A] cursor-pointer"
            >
              <User className="w-4 h-4 stroke-[1.5]" />
              <span>{isAuthenticated ? `My Account (${userName || 'User'})` : 'Sign In / Register'}</span>
            </button>

            {/* AI Style Assistant */}
            {onOpenTryOn && (
              <button
                onClick={() => {
                  onOpenTryOn();
                  onClose();
                }}
                className="flex items-center space-x-2.5 w-full text-left py-2 text-xs uppercase tracking-[0.18em] text-[#BA945A] hover:text-[#1D1D1B] cursor-pointer font-medium"
              >
                <Sparkles className="w-4 h-4 text-[#BA945A]" />
                <span>AI Style Assistant</span>
              </button>
            )}

            {/* Atelier Admin Portal for authorized staff */}
            {isAuthenticated && (userRole === 'admin' || userRole === 'super_admin' || userRole === 'manager') && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  onClose();
                }}
                className="flex items-center justify-between w-full text-left py-2 px-3 bg-[#151413] text-[#BA945A] text-xs uppercase tracking-[0.2em] font-mono cursor-pointer border border-[#333] hover:bg-black transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Atelier Admin</span>
                </span>
                <span className="text-[10px] bg-[#BA945A] text-black px-1.5 py-0.5 font-sans font-bold">OPS</span>
              </button>
            )}
          </div>

          {/* Customer Care Accordion */}
          <div className="pt-4 border-t border-[#EAE5DE]">
            <button
              onClick={() => setIsCustomerCareExpanded(!isCustomerCareExpanded)}
              className="flex items-center justify-between w-full text-left text-xs uppercase tracking-[0.2em] font-medium text-[#1D1D1B] hover:text-[#BA945A] py-1 cursor-pointer"
            >
              <span>CUSTOMER CARE</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCustomerCareExpanded ? 'rotate-180 text-[#BA945A]' : ''}`} />
            </button>

            {isCustomerCareExpanded && (
              <div className="flex flex-col space-y-2 pt-2.5 pl-2 text-xs text-[#7C746B] animate-in fade-in duration-200">
                <button
                  onClick={() => {
                    onNavigate('contact');
                    onClose();
                  }}
                  className="flex items-center space-x-2 py-1 hover:text-[#BA945A] text-left cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#BA945A]" />
                  <span>Contact Us</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('shipping');
                    onClose();
                  }}
                  className="flex items-center space-x-2 py-1 hover:text-[#BA945A] text-left cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-[#BA945A]" />
                  <span>Shipping & Delivery</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('returns');
                    onClose();
                  }}
                  className="flex items-center space-x-2 py-1 hover:text-[#BA945A] text-left cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#BA945A]" />
                  <span>Returns & Exchanges</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('faq');
                    onClose();
                  }}
                  className="flex items-center space-x-2 py-1 hover:text-[#BA945A] text-left cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#BA945A]" />
                  <span>FAQ & Sizing</span>
                </button>
              </div>
            )}
          </div>

          {/* Currency Switcher */}
          <div className="pt-4 border-t border-[#EAE5DE]">
            <span className="text-[10px] tracking-[0.24em] uppercase text-[#7C746B] font-mono mb-2.5 block">
              CURRENCY
            </span>
            <div className="grid grid-cols-4 gap-2">
              {(['EGP', 'USD', 'EUR', 'AED'] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => onCurrencyChange(c)}
                  className={`py-1.5 text-xs text-center border transition-colors cursor-pointer rounded-xs ${
                    currency === c
                      ? 'border-[#1D1D1B] bg-[#1D1D1B] text-[#FAF8F5] font-medium'
                      : 'border-[#D4CCC2] text-[#1D1D1B] hover:border-[#1D1D1B] bg-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Language Switcher */}
          <div className="pt-3 flex items-center justify-between text-xs text-[#7C746B]">
            <span className="flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-[#BA945A]" />
              <span>Language:</span>
            </span>
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="font-medium text-[#1D1D1B] hover:text-[#BA945A] underline underline-offset-4 cursor-pointer"
            >
              {language === 'en' ? 'العربية (AR)' : 'English (EN)'}
            </button>
          </div>

          {/* Admin shortcut if user is admin */}
          {(userRole === 'admin' || userRole === 'super_admin') && (
            <div className="pt-3 border-t border-[#EAE5DE]">
              <button
                onClick={() => {
                  onNavigate('admin');
                  onClose();
                }}
                className="flex items-center space-x-2 text-xs font-semibold text-[#BA945A] hover:text-[#1D1D1B] uppercase tracking-wider cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Operations Portal</span>
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-[#EAE5DE] text-xs text-[#7C746B] text-center">
          <p className="tracking-widest uppercase font-serif font-light text-sm text-[#1D1D1B] mb-0.5">
            LORÉA
          </p>
          <p className="text-[10px] text-[#7C746B] font-light">
            Luxury Women's Ready-to-Wear · Worldwide Express Delivery
          </p>
        </div>
      </div>
    </div>
  );
};
