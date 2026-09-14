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
    <div className={`flex items-center justify-end space-x-1 sm:space-x-2 md:space-x-3 ${className}`}>
      {/* 1. Search */}
      <button
        id="header-search-btn"
        onClick={onOpenSearch}
        aria-label="Search catalog"
        title="Search (Cmd + K)"
        className="relative min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center p-2 text-[#1D1D1B] hover:text-[#BA945A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA945A] rounded-sm"
      >
        <Search className="w-[19px] h-[19px] stroke-[1.5]" />
      </button>

      {/* 2. Customer Account (Desktop only or responsive) */}
      <button
        id="header-account-btn"
        onClick={onOpenAccount}
        aria-label={isAuthenticated ? `Account (${userName})` : 'Sign in to Account'}
        title={isAuthenticated ? `Welcome, ${userName}` : 'Account'}
        className={`relative min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center p-2 text-[#1D1D1B] hover:text-[#BA945A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA945A] rounded-sm ${
          isMobileCompact ? 'hidden sm:flex' : ''
        }`}
      >
        <User className="w-[19px] h-[19px] stroke-[1.5]" />
        {isAuthenticated && (
          <span className="hidden xl:inline-block ml-1.5 text-[11px] font-medium tracking-wider text-[#7C746B] max-w-[80px] truncate">
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
        className="relative min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center p-2 text-[#1D1D1B] hover:text-[#BA945A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA945A] rounded-sm"
      >
        <Heart className="w-[19px] h-[19px] stroke-[1.5]" />
        {wishlistCount > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-[#1D1D1B] text-[#F7F4EF] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-sans font-medium pointer-events-none transition-transform scale-100">
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
        className="relative min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center p-2 text-[#1D1D1B] hover:text-[#BA945A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA945A] rounded-sm"
      >
        <ShoppingBag className="w-[19px] h-[19px] stroke-[1.5]" />
        {cartCount > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-[#BA945A] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-sans font-semibold pointer-events-none transition-transform scale-100">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </button>
    </div>
  );
};
