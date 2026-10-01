import React, { useState } from 'react';
import { Heart, Plus, Sparkles } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickAdd: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL') => void;
  onClick: (product: Product) => void;
  onOpenTryOn?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onQuickAdd,
  onClick,
  onOpenTryOn
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleSizeSelect = (e: React.MouseEvent, size: 'XS' | 'S' | 'M' | 'L' | 'XL') => {
    e.stopPropagation();
    onQuickAdd(product, size);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setIsQuickAddOpen(false);
    }, 900);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(product);
    }
  };

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop'];

  const currentImage =
    isHovered && images.length > 1
      ? images[1]
      : images[0];

  const safeSizes = (product.sizes && product.sizes.length > 0)
    ? product.sizes
    : (['XS', 'S', 'M', 'L', 'XL'] as ('XS' | 'S' | 'M' | 'L' | 'XL')[]);

  // Show "Trending" badge if product is trending or marked as best seller/new
  const isTrending = Boolean(product.isTrending || product.badge === 'BEST SELLER' || product.badge === 'NEW');

  return (
    <div
      className="group relative flex flex-col cursor-pointer select-none bg-white transition-opacity"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsQuickAddOpen(false);
      }}
      onClick={() => onClick(product)}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View ${product.name}`}
    >
      {/* 1. Image Container — Perfectly uniform 3:4 portrait aspect ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F6F6F6] mb-3.5 sm:mb-4">
        <img
          src={currentImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />

        {/* Small black "Trending" badge in upper-right corner matching reference */}
        {isTrending && (
          <div className="absolute top-0 right-0 z-10 bg-black text-white text-[11px] sm:text-[12px] font-normal px-2.5 sm:px-3 py-1 tracking-normal select-none">
            Trending
          </div>
        )}

        {/* Wishlist Heart Icon (subtle, in top-left) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 left-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isWishlisted
              ? 'bg-[#1D1D1B] text-white shadow-sm opacity-100'
              : 'bg-white/90 hover:bg-white text-[#1D1D1B] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-105 shadow-xs'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 stroke-[1.5] ${isWishlisted ? 'fill-current text-white' : 'text-[#1D1D1B]'}`}
          />
        </button>

        {/* AI Style Assistant Shortcut if available */}
        {onOpenTryOn && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenTryOn(product);
            }}
            className="absolute top-12 left-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-white/80 hover:bg-white text-[#BA945A] shadow-xs opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
            title="LORÉA AI Style Assistant"
            aria-label="LORÉA AI Style Assistant"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        )}

        {/* QUICK ADD Drawer overlay on hover */}
        <div className="absolute inset-x-0 bottom-0 p-2 sm:p-2.5 z-20">
          {!isQuickAddOpen ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsQuickAddOpen(true);
              }}
              className="w-full py-2 bg-white/95 backdrop-blur-xs text-[#1D1D1B] hover:bg-[#1D1D1B] hover:text-white text-[11px] tracking-[0.18em] uppercase font-medium transition-all duration-300 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>QUICK ADD</span>
            </button>
          ) : (
            <div
              className="w-full bg-[#1D1D1B] text-white p-2.5 shadow-lg transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {addedAnimation ? (
                <div className="text-center text-[11px] tracking-widest text-[#BA945A] py-1 font-medium">
                  ADDED TO BAG ✓
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-1.5 px-0.5 text-[9px] uppercase tracking-widest text-[#A8A29E]">
                    <span>SELECT SIZE</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsQuickAddOpen(false);
                      }}
                      className="hover:text-white cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {safeSizes.map((size) => (
                      <button
                        key={size}
                        onClick={(e) => handleSizeSelect(e, size)}
                        className="py-1 text-center text-xs font-mono font-medium hover:bg-[#BA945A] hover:text-white bg-[#2A2928] text-white transition-colors cursor-pointer"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Text Content Directly Below Image — Centered uppercase typography and dual prices */}
      <div className="flex flex-col items-center justify-start text-center px-1">
        {/* Product Title — Uppercase, elegant letter spacing, centered */}
        <h3 className="font-sans text-[11px] min-[390px]:text-[12px] sm:text-[13px] font-normal uppercase tracking-[0.14em] text-[#1D1D1B] text-center leading-relaxed line-clamp-2 group-hover:text-[#BA945A] transition-colors">
          {product.name}
        </h3>

        {/* Pricing: Old strikethrough price + Current selling price */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 mt-1 sm:mt-1.5 text-center flex-wrap">
          {product.originalPriceEgp ? (
            <>
              <span className="text-[11px] min-[390px]:text-[12px] sm:text-[13px] text-[#7C746B] line-through font-light tracking-wide">
                {formatPrice(product.originalPriceEgp, currency)}
              </span>
              <span className="text-[11px] min-[390px]:text-[12px] sm:text-[13px] font-medium text-[#1D1D1B] tracking-wide">
                {formatPrice(product.priceEgp, currency)}
              </span>
            </>
          ) : (
            <span className="text-[11px] min-[390px]:text-[12px] sm:text-[13px] font-medium text-[#1D1D1B] tracking-wide">
              {formatPrice(product.priceEgp, currency)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
