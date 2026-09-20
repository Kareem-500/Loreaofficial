import React from 'react';
import { Search, User, Heart, ShoppingBag } from 'lucide-react';

export interface HeaderActionsProps {
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
  wishlistCount: number;
  cartCount: number;
  isAuthenticated?: boolean;
  userName?: string;
  isMobileCompact?: boolean;
  className?: string;
}

/**
 * HeaderActions component:
 * - Positioned on the RIGHT of the Header
 * - Contains: Search, Account, Wishlist, Shopping Bag / Cart
 * - Touch-friendly hit areas (min 44px) and visible focus rings
 * - Real-time badge indicators for Wishlist and Cart
 */
export const HeaderActions: React.FC<HeaderActionsProps> = ({
  onOpenSearch,
  onOpenAccount,
  onOpenWishlist,
  onOpenCart,
  wishlistCount,
  cartCount,
  isAuthenticated = false,
  userName = '',
  isMobileCompact = false,
  className = ''
}) => {
  return (
    <div
      className={`flex items-center justify-end gap-0.5 min-[360px]:gap-1 sm:gap-1.5 md:gap-1.5 lg:gap-2 ${className}`}
      role="toolbar"
      aria-label="Account and shopping utilities"
    >
      {/* 1. Search */}
      <button
        id="header-search-btn"
        onClick={onOpenSearch}
        aria-label="Search catalog"
        title="Search (Cmd + K)"
        className="relative flex items-center justify-center p-1.5 sm:p-2 text-[#1D1D1B] hover:text-[#BA945A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] rounded-sm cursor-pointer"
      >
        <Search className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px] md:w-5 md:h-5 stroke-[1.4]" />
      </button>

      {/* 2. Customer Account - Hidden on mobile (<sm) to prevent crowding the centered logo; easily accessible in the mobile drawer menu */}
      <button
        id="header-account-btn"
        onClick={onOpenAccount}
        aria-label={isAuthenticated ? `Account (${userName})` : 'Sign in to Account'}
        title={isAuthenticated ? `Welcome, ${userName}` : 'Account'}
        className="hidden sm:flex relative items-center justify-center p-1.5 sm:p-2 text-[#1D1D1B] hover:text-[#BA945A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] rounded-sm cursor-pointer"
      >
        <User className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px] md:w-5 md:h-5 stroke-[1.4]" />
        {isAuthenticated && (
          <span className="hidden xl:inline-block ml-1 text-[11px] font-medium tracking-wider text-[#7C746B] max-w-[70px] truncate">
            {userName}
          </span>
        )}
      </button>

      {/* 3. Wishlist with Badge */}
      <button
        id="header-wishlist-btn"
        onClick={onOpenWishlist}
        aria-label={`Wishlist, ${wishlistCount} saved items`}
        title="Saved Wishlist"
        className="relative flex items-center justify-center p-1.5 sm:p-2 text-[#1D1D1B] hover:text-[#BA945A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] rounded-sm cursor-pointer"
      >
        <Heart className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px] md:w-5 md:h-5 stroke-[1.4]" />
        {wishlistCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-[#1D1D1B] text-[#F7F4EF] text-[8px] sm:text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-sans font-medium pointer-events-none transition-transform scale-100 shadow-xs">
            {wishlistCount > 99 ? '99+' : wishlistCount}
          </span>
        )}
      </button>

      {/* 4. Shopping Bag / Cart with Badge */}
      <button
        id="header-cart-btn"
        onClick={onOpenCart}
        aria-label={`Shopping Bag, ${cartCount} items in cart`}
        title="Shopping Bag"
        className="relative flex items-center justify-center p-1.5 sm:p-2 text-[#1D1D1B] hover:text-[#BA945A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] rounded-sm cursor-pointer"
      >
        <ShoppingBag className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px] md:w-5 md:h-5 stroke-[1.4]" />
        {cartCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-[#BA945A] text-white text-[8px] sm:text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-sans font-semibold pointer-events-none transition-transform scale-100 shadow-xs">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </button>
    </div>
  );
};
