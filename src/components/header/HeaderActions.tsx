import React from 'react';
import { Search, User, ShoppingBag, Heart } from 'lucide-react';

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

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  onOpenSearch,
  onOpenAccount,
  onOpenWishlist,
  onOpenCart,
  wishlistCount = 0,
  cartCount = 0,
  isAuthenticated = false,
  userName = '',
  className = ''
}) => {
  return (
    <div
      className={`flex items-center justify-end gap-0.5 sm:gap-1.5 md:gap-2 ${className}`}
      role="toolbar"
      aria-label="Account and shopping utilities"
    >
      {/* 1. Account Icon */}
      <button
        id="header-account-btn"
        onClick={onOpenAccount}
        aria-label={isAuthenticated ? `Account (${userName})` : 'Sign in to Account'}
        title={isAuthenticated ? `Welcome, ${userName}` : 'Account'}
        className="flex items-center justify-center p-2 text-[#1D1D1B] hover:text-[#BA945A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] rounded-sm cursor-pointer active:scale-95"
      >
        <User className="w-[18px] h-[18px] sm:w-5 sm:h-5 stroke-[1.4]" />
      </button>

      {/* 2. Search Icon */}
      <button
        id="header-search-btn"
        onClick={onOpenSearch}
        aria-label="Search catalog"
        title="Search catalog"
        className="flex items-center justify-center p-2 text-[#1D1D1B] hover:text-[#BA945A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] rounded-sm cursor-pointer active:scale-95"
      >
        <Search className="w-[18px] h-[18px] sm:w-5 sm:h-5 stroke-[1.4]" />
      </button>

      {/* 3. Wishlist Heart Icon with Count Badge */}
      <button
        id="header-wishlist-btn"
        onClick={onOpenWishlist}
        aria-label={`Wishlist, ${wishlistCount} items saved`}
        title="Saved to Wishlist"
        className="relative flex items-center justify-center p-2 text-[#1D1D1B] hover:text-[#BA945A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] rounded-sm cursor-pointer active:scale-95"
      >
        <Heart className="w-[18px] h-[18px] sm:w-5 sm:h-5 stroke-[1.4]" />
        {wishlistCount > 0 && (
          <span className="absolute top-1 right-1 bg-[#BA945A] text-white text-[8px] sm:text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-mono font-medium pointer-events-none transition-transform scale-100 shadow-xs">
            {wishlistCount > 99 ? '99+' : wishlistCount}
          </span>
        )}
      </button>

      {/* 4. Shopping Bag / Cart with Count Badge */}
      <button
        id="header-cart-btn"
        onClick={onOpenCart}
        aria-label={`Shopping Bag, ${cartCount} items in cart`}
        title="Shopping Bag"
        className="relative flex items-center justify-center p-2 text-[#1D1D1B] hover:text-[#BA945A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] rounded-sm cursor-pointer active:scale-95"
      >
        <ShoppingBag className="w-[18px] h-[18px] sm:w-5 sm:h-5 stroke-[1.4]" />
        {cartCount > 0 && (
          <span className="absolute top-1 right-1 bg-[#1D1D1B] text-white text-[8px] sm:text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-mono font-medium pointer-events-none transition-transform scale-100 shadow-xs">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </button>
    </div>
  );
};
