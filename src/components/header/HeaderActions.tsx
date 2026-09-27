import React from 'react';
import { Search, User, ShoppingBag } from 'lucide-react';

export interface HeaderActionsProps {
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onOpenWishlist?: () => void;
  onOpenCart: () => void;
  wishlistCount?: number;
  cartCount: number;
  isAuthenticated?: boolean;
  userName?: string;
  isMobileCompact?: boolean;
  className?: string;
}

/**
 * HeaderActions component:
 * - Positioned on the RIGHT of the Header
 * - Exact order from reference screenshot: Account icon, Search icon, Shopping bag icon
 * - Subtle hover transitions and active cart count indicator
 */
export const HeaderActions: React.FC<HeaderActionsProps> = ({
  onOpenSearch,
  onOpenAccount,
  onOpenCart,
  cartCount,
  isAuthenticated = false,
  userName = '',
  className = ''
}) => {
  return (
    <div
      className={`flex items-center justify-end gap-1 sm:gap-2.5 md:gap-3 ${className}`}
      role="toolbar"
      aria-label="Account and shopping utilities"
    >
      {/* 1. Account Icon */}
      <button
        id="header-account-btn"
        onClick={onOpenAccount}
        aria-label={isAuthenticated ? `Account (${userName})` : 'Sign in to Account'}
        title={isAuthenticated ? `Welcome, ${userName}` : 'Account'}
        className="flex items-center justify-center p-1.5 sm:p-2 text-[#1D1D1B] hover:text-[#BA945A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] rounded-sm cursor-pointer"
      >
        <User className="w-[19px] h-[19px] sm:w-5 sm:h-5 stroke-[1.4]" />
      </button>

      {/* 2. Search Icon */}
      <button
        id="header-search-btn"
        onClick={onOpenSearch}
        aria-label="Search catalog"
        title="Search catalog"
        className="flex items-center justify-center p-1.5 sm:p-2 text-[#1D1D1B] hover:text-[#BA945A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] rounded-sm cursor-pointer"
      >
        <Search className="w-[19px] h-[19px] sm:w-5 sm:h-5 stroke-[1.4]" />
      </button>

      {/* 3. Shopping Bag / Cart with Badge */}
      <button
        id="header-cart-btn"
        onClick={onOpenCart}
        aria-label={`Shopping Bag, ${cartCount} items in cart`}
        title="Shopping Bag"
        className="relative flex items-center justify-center p-1.5 sm:p-2 text-[#1D1D1B] hover:text-[#BA945A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] rounded-sm cursor-pointer"
      >
        <ShoppingBag className="w-[19px] h-[19px] sm:w-5 sm:h-5 stroke-[1.4]" />
        {cartCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-[#1D1D1B] text-white text-[8px] sm:text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-sans font-medium pointer-events-none transition-transform scale-100 shadow-xs">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </button>
    </div>
  );
};
