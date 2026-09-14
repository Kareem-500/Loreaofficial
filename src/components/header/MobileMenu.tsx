import React, { useEffect } from 'react';
import { X, Heart, Globe, User, ShieldCheck } from 'lucide-react';
import { LogoLink } from './LogoLink';
import { Currency } from '../../types';
import { NavLinkItem } from './DesktopNavigation';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLinkItem[];
  onNavigate: (view: string) => void;
  onSelectCategory: (category: string) => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  wishlistCount: number;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  isAuthenticated: boolean;
  userRole?: string;
  userName?: string;
}

/**
 * MobileMenu component:
 * - Slide-in navigation drawer for mobile and tablet devices
 * - Semantic navigation with keyboard trap and ESC key closing
 * - Brand logo at top linking to root '/'
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navLinks,
  onNavigate,
  onSelectCategory,
  onOpenWishlist,
  onOpenAccount,
  wishlistCount,
  currency,
  onCurrencyChange,
  language,
  setLanguage,
  isAuthenticated,
  userRole,
  userName
}) => {
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
    <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-[#FAF8F5] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
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
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-[#1D1D1B] hover:text-[#BA945A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA945A] rounded-xs"
            aria-label="Close Navigation Menu"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Main Navigation Links */}
          <nav aria-label="Mobile Menu Links" className="space-y-3.5">
            <p className="text-[10px] tracking-[0.24em] uppercase text-[#7C746B] font-medium">Explore</p>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  link.action();
                  onClose();
                }}
                className={`block w-full text-left font-serif text-lg tracking-wide transition-colors ${
                  link.isSale ? 'text-[#964036] font-medium' : 'text-[#1D1D1B] hover:text-[#BA945A]'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Wishlist Link with Count */}
            <button
              onClick={() => {
                onOpenWishlist();
                onClose();
              }}
              className="flex items-center justify-between w-full text-left font-serif text-lg tracking-wide text-[#1D1D1B] hover:text-[#BA945A] pt-1"
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
              className="flex items-center space-x-2.5 w-full text-left font-serif text-lg tracking-wide text-[#1D1D1B] hover:text-[#BA945A] pt-1"
            >
              <User className="w-4 h-4 stroke-[1.5]" />
              <span>{isAuthenticated ? `My Account (${userName})` : 'Sign In / Register'}</span>
            </button>
          </nav>

          {/* Featured Collections / Categories */}
          <div className="pt-5 border-t border-[#EAE5DE] space-y-2.5">
            <p className="text-[10px] tracking-[0.24em] uppercase text-[#7C746B] font-medium">Atelier Categories</p>
            {['Dresses', 'Tops & Blouses', 'Coordinated Sets', 'Jackets & Outerwear', 'Pants', 'Modest Edit'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat === 'Tops & Blouses' ? 'Tops' : cat === 'Coordinated Sets' ? 'Sets' : cat === 'Jackets & Outerwear' ? 'Outerwear' : cat);
                  onClose();
                }}
                className="block text-sm text-[#1D1D1B]/80 hover:text-[#BA945A] font-light transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Currency Switcher */}
          <div className="pt-5 border-t border-[#EAE5DE]">
            <p className="text-[10px] tracking-[0.24em] uppercase text-[#7C746B] font-medium mb-2.5">Currency</p>
            <div className="grid grid-cols-4 gap-2">
              {(['EGP', 'USD', 'EUR', 'AED'] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => onCurrencyChange(c)}
                  className={`py-1.5 text-xs text-center border rounded-xs transition-colors ${
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
              className="font-medium text-[#1D1D1B] hover:text-[#BA945A] underline underline-offset-4"
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
                className="flex items-center space-x-2 text-xs font-semibold text-[#BA945A] hover:text-[#1D1D1B] uppercase tracking-wider"
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
