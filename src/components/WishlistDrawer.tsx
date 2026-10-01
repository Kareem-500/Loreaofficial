import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { useOverlayAccessibility } from '../hooks/useOverlayAccessibility';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products?: Product[];
  currency: Currency;
  onRemoveFromWishlist: (productId: string) => void;
  onClearWishlist?: () => void;
  onSelectProduct?: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
  onDiscoverCollection?: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  products = [],
  currency,
  onRemoveFromWishlist,
  onClearWishlist,
  onSelectProduct,
  onMoveToCart,
  onDiscoverCollection
}) => {
  // ESC and body scroll lock
  useOverlayAccessibility({
    isOpen,
    onClose
  });

  if (!isOpen) return null;

  const safeProducts = (products || []).filter(Boolean);

  const handleDiscover = () => {
    onClose();
    if (onDiscoverCollection) {
      onDiscoverCollection();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Wishlist"
    >
      {/* 1. Backdrop (Click outside closes) */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Slide-out Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-screen max-w-[360px] min-[400px]:max-w-[400px] sm:max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col h-full z-10 border-l border-[#EAE5DE] animate-in slide-in-from-right duration-300 ease-out"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#EAE5DE] flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2.5">
              <Heart className="w-5 h-5 text-[#1D1D1B] stroke-[1.4]" />
              <h3 className="font-serif text-xl sm:text-2xl font-light text-[#1D1D1B]">
                Your Wishlist
              </h3>
              {safeProducts.length > 0 && (
                <span className="text-[10px] bg-[#BA945A] text-white px-2 py-0.5 rounded-full font-mono">
                  {safeProducts.length}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {safeProducts.length > 0 && onClearWishlist && (
                <button
                  type="button"
                  onClick={onClearWishlist}
                  className="text-[10px] text-[#7C746B] hover:text-[#964036] tracking-[0.16em] uppercase font-medium transition-colors mr-2 cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center p-1.5 text-[#1D1D1B] hover:text-[#BA945A] hover:bg-[#FAF8F5] rounded-xs transition-colors cursor-pointer active:scale-95"
                aria-label="Close Wishlist (ESC)"
                title="Close (ESC)"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-[#EAE5DE]">
            {safeProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-[#EFECE6] flex items-center justify-center mb-4 text-[#7C746B]">
                  <Heart className="w-7 h-7 stroke-[1]" />
                </div>
                <h4 className="font-serif text-xl sm:text-2xl font-light text-[#1D1D1B] mb-2">
                  No saved pieces yet
                </h4>
                <p className="text-xs text-[#7C746B] font-light max-w-xs mb-6 leading-relaxed">
                  Save your favorite silhouettes to review, compare, or purchase when you are ready.
                </p>
                <button
                  type="button"
                  onClick={handleDiscover}
                  className="px-8 py-3 bg-[#1D1D1B] text-[#FAF8F5] hover:bg-[#BA945A] text-xs uppercase tracking-[0.22em] font-medium transition-colors cursor-pointer shadow-xs active:scale-98"
                >
                  DISCOVER COLLECTION
                </button>
              </div>
            ) : (
              safeProducts.map((product) => {
                const img = product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop';

                return (
                  <div key={product.id} className="py-4 flex gap-3.5 sm:gap-4">
                    {/* Thumbnail */}
                    <div
                      onClick={() => onSelectProduct?.(product)}
                      className="w-20 h-26 bg-[#EAE5DE] overflow-hidden shrink-0 cursor-pointer border border-[#EAE5DE] group"
                    >
                      <img
                        src={img}
                        alt={product.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Information & Actions */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            onClick={() => onSelectProduct?.(product)}
                            className="font-serif text-base sm:text-lg text-[#1D1D1B] font-normal leading-snug line-clamp-1 cursor-pointer hover:text-[#BA945A] transition-colors"
                          >
                            {product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => onRemoveFromWishlist(product.id)}
                            className="p-1 text-[#7C746B] hover:text-[#964036] transition-colors cursor-pointer"
                            aria-label={`Remove ${product.name} from wishlist`}
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="font-mono text-[10px] tracking-wider uppercase text-[#7C746B] mt-0.5">
                          {product.category}
                        </p>

                        <p className="font-serif text-sm sm:text-base font-normal text-[#1D1D1B] mt-1">
                          {formatPrice(product.priceEgp, currency)}
                        </p>
                      </div>

                      {/* Move to Bag Action Button */}
                      <div className="pt-2 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => onMoveToCart(product)}
                          className="flex-1 py-2 px-3 bg-[#1D1D1B] text-white hover:bg-[#BA945A] text-[10px] tracking-[0.2em] uppercase font-medium transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs active:scale-98"
                        >
                          <ShoppingBag className="w-3 h-3 stroke-[1.5]" />
                          <span>MOVE TO BAG</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
