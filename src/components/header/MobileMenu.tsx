import React, { useEffect, useState } from 'react';
import { X, Heart, Globe, User, ShieldCheck, ChevronDown, BookOpen, MessageCircle, Mail, Sparkles } from 'lucide-react';
import { LogoLink } from './LogoLink';
import { Currency } from '../../types';
import { COLLECTION_CATEGORIES } from '../../data/collectionCategories';

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
  const [isCollectionExpanded, setIsCollectionExpanded] = useState(false);
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-[#F7F4EF] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
        {/* Header with LORÉA LogoLink & Close Button */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAE5DE]">
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
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-[#1D1D1B] hover:text-[#BA945A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA945A] rounded-xs cursor-pointer"
            aria-label="Close Navigation Menu"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Main Navigation Sections - Strictly Vertical Single-Column Layout */}
          <nav aria-label="Mobile Menu Navigation" className="flex flex-col space-y-1">
            <p className="text-[10px] tracking-[0.24em] uppercase text-[#7C746B] font-medium mb-1">Navigation</p>
            
            {/* 1. SHOP */}
            <button
              onClick={() => {
                onNavigate('store');
                onClose();
              }}
              className="flex items-center w-full text-left font-serif text-lg tracking-wide text-[#1D1D1B] hover:text-[#BA945A] transition-colors cursor-pointer min-h-[44px] py-1"
            >
              SHOP
            </button>

            {/* 2. NEW IN */}
            <button
              onClick={() => {
                onNavigate('new-in');
                onClose();
              }}
              className="flex items-center w-full text-left font-serif text-lg tracking-wide text-[#1D1D1B] hover:text-[#BA945A] transition-colors cursor-pointer min-h-[44px] py-1"
            >
              NEW IN
            </button>

            {/* 3. SALE */}
            <button
              onClick={() => {
                onNavigate('sale');
                onClose();
              }}
              className="flex items-center w-full text-left font-serif text-lg tracking-wide text-[#964036] font-medium transition-colors cursor-pointer min-h-[44px] py-1"
            >
              SALE
            </button>

            {/* 4. COLLECTION (Expandable Parent Item) */}
            <div className="border-t border-b border-[#EAE5DE]/70 py-1 my-1">
              <button
                onClick={() => setIsCollectionExpanded(!isCollectionExpanded)}
                aria-expanded={isCollectionExpanded}
                className="flex items-center justify-between w-full text-left font-serif text-lg tracking-wide text-[#1D1D1B] hover:text-[#BA945A] transition-colors cursor-pointer min-h-[44px] py-1"
              >
                <span>COLLECTION</span>
                <span className="text-xl font-light text-[#BA945A] w-6 h-6 flex items-center justify-center">
                  {isCollectionExpanded ? '−' : '+'}
                </span>
              </button>

              {/* Submenu: Strictly Vertical Single Column Without Images */}
              {isCollectionExpanded && (
                <div className="flex flex-col space-y-1 pl-3.5 py-2 border-l border-[#BA945A]/40 my-1 animate-in fade-in slide-in-from-top-1">
                  {COLLECTION_CATEGORIES.map((category) => (
                    <button
                      key={category.slug}
                      onClick={() => {
                        onSelectCategory(category.categoryTarget, category.subcategoryTarget);
                        onClose();
                      }}
                      className="flex items-center justify-between py-2 text-xs uppercase tracking-[0.18em] font-medium text-[#4A453F] hover:text-[#BA945A] transition-colors w-full text-left cursor-pointer min-h-[44px] group pr-2"
                    >
                      <span>{category.name}</span>
                    </button>
                  ))}

                  {/* View All Collections shortcut */}
                  <button
                    onClick={() => {
                      onNavigate('collections');
                      onClose();
                    }}
                    className="flex items-center justify-between text-[11px] tracking-[0.18em] uppercase text-[#7C746B] hover:text-[#BA945A] transition-colors pt-2 cursor-pointer min-h-[40px] pr-2"
                  >
                    <span>All Collections</span>
                    <span>→</span>
                  </button>
                </div>
              )}
            </div>

            {/* 5. STORY US (Expandable Parent Item) */}
            <div className="border-b border-[#EAE5DE]/70 py-1 my-1">
              <button
                onClick={() => setIsStoryExpanded(!isStoryExpanded)}
                aria-expanded={isStoryExpanded}
                className="flex items-center justify-between w-full text-left font-serif text-lg tracking-wide text-[#1D1D1B] hover:text-[#BA945A] transition-colors cursor-pointer min-h-[44px] py-1"
              >
                <span>STORY US</span>
                <span className="text-xl font-light text-[#BA945A] w-6 h-6 flex items-center justify-center">
                  {isStoryExpanded ? '−' : '+'}
                </span>
              </button>

              {/* Submenu: Strictly Vertical Single Column */}
              {isStoryExpanded && (
                <div className="flex flex-col space-y-1 pl-3.5 py-2 border-l border-[#BA945A]/40 my-1 animate-in fade-in slide-in-from-top-1 text-xs text-[#7C746B]">
                  <button
                    onClick={() => {
                      onNavigate('about');
                      onClose();
                    }}
                    className="flex items-center space-x-2 py-2 hover:text-[#BA945A] transition-colors cursor-pointer w-full text-left min-h-[40px]"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#BA945A]" />
                    <span>Our Story</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('contact');
                      onClose();
                    }}
                    className="flex items-center space-x-2 py-2 hover:text-[#BA945A] transition-colors cursor-pointer w-full text-left min-h-[40px]"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#BA945A]" />
                    <span>Contact Us</span>
                  </button>
                  <a
                    href="mailto:concierge@lorea.com"
                    onClick={onClose}
                    className="flex items-center space-x-2 py-2 hover:text-[#BA945A] transition-colors cursor-pointer w-full text-left min-h-[40px]"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#BA945A]" />
                    <span>Client Emails</span>
                  </a>
                </div>
              )}
            </div>

            {/* AI Virtual Try-On Link */}
            <button
              onClick={() => {
                if (onOpenTryOn) onOpenTryOn();
                onClose();
              }}
              className="flex items-center space-x-2.5 w-full text-left font-serif text-lg tracking-wide text-[#BA945A] hover:text-[#1D1D1B] min-h-[44px] py-1 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#BA945A]" />
              <span className="flex items-center space-x-2">
                <span>AI Virtual Try-On</span>
                <span className="text-[9px] uppercase tracking-widest font-mono bg-[#BA945A]/15 text-[#BA945A] px-2 py-0.5 rounded-xs">
                  AI Fit
                </span>
              </span>
            </button>

            {/* Wishlist Link with Count */}
            <button
              onClick={() => {
                onOpenWishlist();
                onClose();
              }}
              className="flex items-center justify-between w-full text-left font-serif text-lg tracking-wide text-[#1D1D1B] hover:text-[#BA945A] min-h-[44px] py-1 cursor-pointer"
            >
              <span className="flex items-center space-x-2.5">
                <Heart className="w-4 h-4 stroke-[1.5]" />
                <span>Wishlist</span>
              </span>
              {wishlistCount > 0 && (
                <span className="bg-[#BA945A] text-white text-[10px] px-2 py-0.5 rounded-full font-sans font-semibold">
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
              className="flex items-center space-x-2.5 w-full text-left font-serif text-lg tracking-wide text-[#1D1D1B] hover:text-[#BA945A] min-h-[44px] py-1 cursor-pointer"
            >
              <User className="w-4 h-4 stroke-[1.5]" />
              <span>{isAuthenticated ? `My Account (${userName})` : 'Sign In / Register'}</span>
            </button>
          </nav>

          {/* Currency Switcher */}
          <div className="pt-5 border-t border-[#EAE5DE]">
            <p className="text-[10px] tracking-[0.24em] uppercase text-[#7C746B] font-medium mb-2.5">Currency</p>
            <div className="grid grid-cols-4 gap-2">
              {(['EGP', 'USD', 'EUR', 'AED'] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => onCurrencyChange(c)}
                  className={`py-1.5 text-xs text-center border rounded-xs transition-colors cursor-pointer ${
                    currency === c
                      ? 'border-[#1D1D1B] bg-[#1D1D1B] text-[#F7F4EF] font-medium'
                      : 'border-[#D4CCC2] text-[#1D1D1B] hover:border-[#1D1D1B]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Language Switcher */}
          <div className="pt-4 border-t border-[#EAE5DE] flex items-center justify-between text-xs text-[#7C746B]">
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

          {/* Admin shortcut if applicable */}
          {(userRole === 'admin' || userRole === 'super_admin') && (
            <div className="pt-4 border-t border-[#EAE5DE]">
              <button
                onClick={() => {
                  onNavigate('admin');
                  onClose();
                }}
                className="flex items-center space-x-2 text-xs font-semibold text-[#BA945A] hover:text-[#1D1D1B] uppercase tracking-wider cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Open Admin Portal</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-5 bg-[#EFECE6] border-t border-[#EAE5DE] text-xs text-[#7C746B]">
          <p className="tracking-widest uppercase font-medium text-[10px] text-[#1D1D1B] mb-1">LORÉA ATELIER</p>
          <p className="text-[11px] font-light">Cairo · Alexandria · Worldwide Express Delivery</p>
        </div>
      </div>
    </div>
  );
};
