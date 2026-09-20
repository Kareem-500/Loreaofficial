import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products?: Product[];
  currency: Currency;
  onRemoveFromWishlist: (productId: string) => void;
  onClearWishlist?: () => void;
  onSelectProduct?: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  products = [],
  currency,
  onRemoveFromWishlist,
  onClearWishlist,
  onSelectProduct,
  onMoveToCart
}) => {
  if (!isOpen) return null;

  const safeProducts = (products || []).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F7F4EF] shadow-2xl flex flex-col h-full z-10 border-l border-[#EAE5DE]">
          {/* Header */}
          <div className="p-6 border-b border-[#EAE5DE] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Heart className="w-5 h-5 text-[#1D1D1B] stroke-[1.5]" />
              <h3 className="font-serif text-2xl font-light text-[#1D1D1B]">
                Your Wishlist
              </h3>
              {safeProducts.length > 0 && (
                <span className="text-[11px] bg-[#1D1D1B] text-white px-2 py-0.5 rounded-full font-sans font-medium">
                  {safeProducts.length}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {safeProducts.length > 0 && onClearWishlist && (
                <button
                  onClick={onClearWishlist}
                  className="text-[11px] text-[#7C746B] hover:text-[#964036] tracking-[0.14em] uppercase font-medium transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-[#1D1D1B] hover:text-[#B88F88] transition-colors"
                aria-label="Close Wishlist"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#EAE5DE]">
            {safeProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#EFECE6] flex items-center justify-center mb-4 text-[#7C746B]">
                  <Heart className="w-7 h-7 stroke-[1]" />
                </div>
                <h4 className="font-serif text-xl font-light text-[#1D1D1B] mb-2">
                  No saved pieces yet
                </h4>
                <p className="text-xs text-[#7C746B] font-light max-w-xs mb-6">
                  Save your favorite silhouettes to review, compare, or purchase later.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-[#1D1D1B] text-[#F7F4EF] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#333] transition-colors"
                >
                  DISCOVER COLLECTION
                </button>
              </div>
            ) : (
              safeProducts.map((product) => (
                <div key={product.id} className="py-5 flex gap-4">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop'}
                    alt={product.name || 'Saved Piece'}
                    onClick={() => onSelectProduct?.(product)}
                    className="w-20 h-26 object-cover bg-[#EAE5DE] shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4
                          onClick={() => onSelectProduct?.(product)}
                          className="font-sans text-sm font-normal text-[#1D1D1B] line-clamp-1 cursor-pointer hover:text-[#B88F88] transition-colors"
                        >
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveFromWishlist(product.id)}
                          className="p-1 text-[#A0988E] hover:text-[#964036] hover:bg-[#964036]/10 rounded-full transition-colors shrink-0"
                          aria-label="Remove item"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#7C746B] font-light mt-0.5">
                        {product.fabric}
                      </p>
                      <p className="text-sm font-medium text-[#1D1D1B] mt-1">
                        {formatPrice(product.priceEgp, currency)}
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => onMoveToCart(product)}
                        className="w-full py-2 bg-[#1D1D1B] text-[#F7F4EF] hover:bg-[#333] text-[11px] tracking-[0.16em] uppercase font-medium flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>MOVE TO BAG</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
