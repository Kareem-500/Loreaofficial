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
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
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

  const safeColors = (product.colors && product.colors.length > 0)
    ? product.colors
    : [{ name: 'Standard', hex: '#1D1D1B' }];

  return (
    <div
      className="group relative flex flex-col cursor-pointer select-none"
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
      {/* 1. Image Container */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-[#EAE5DE] mb-3 sm:mb-4">
        <img
          src={currentImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-103"
        />

        {/* Badges (NEW, BEST SELLER, LIMITED, SALE) */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`text-[10px] tracking-[0.18em] uppercase font-medium px-2.5 py-1 ${
                product.badge === 'SALE'
                  ? 'bg-[#964036] text-white'
                  : product.badge === 'NEW'
                  ? 'bg-[#1D1D1B] text-[#F7F4EF]'
                  : product.badge === 'LIMITED'
                  ? 'bg-[#B88F88] text-white'
                  : 'bg-[#F7F4EF]/95 text-[#1D1D1B] shadow-xs'
              }`}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isWishlisted
              ? 'bg-[#B88F88] text-white shadow-md'
              : 'bg-[#F7F4EF]/80 text-[#1D1D1B] hover:bg-[#F7F4EF] hover:text-[#B88F88]'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 stroke-[1.5] ${isWishlisted ? 'fill-current' : ''}`}
          />
        </button>

        {/* AI Virtual Try-On Shortcut */}
        {onOpenTryOn && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenTryOn(product);
            }}
            className="absolute top-12 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-[#1D1D1B]/90 text-[#BA945A] hover:bg-[#BA945A] hover:text-white shadow-md transition-all duration-300 cursor-pointer"
            title="AI Virtual Try-On / جرب اللبس بالذكاء الاصطناعي"
            aria-label="AI Virtual Try-On"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        )}

        {/* QUICK ADD overlay / button on Desktop & Mobile */}
        <div className="absolute inset-x-0 bottom-0 p-3 z-20">
          {!isQuickAddOpen ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsQuickAddOpen(true);
              }}
              className="w-full py-2.5 bg-[#F7F4EF]/95 backdrop-blur-xs text-[#1D1D1B] hover:bg-[#1D1D1B] hover:text-[#F7F4EF] text-[11px] tracking-[0.2em] uppercase font-medium transition-all duration-300 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 flex items-center justify-center space-x-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>QUICK ADD</span>
            </button>
          ) : (
            <div
              className="w-full bg-[#1D1D1B] text-[#F7F4EF] p-2.5 shadow-xl transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {addedAnimation ? (
                <div className="text-center text-[11px] tracking-widest text-[#B88F88] py-1 font-medium">
                  ADDED TO BAG ✓
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-1.5 px-1 text-[9px] uppercase tracking-widest text-[#B7ADA2]">
                    <span>SELECT SIZE</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsQuickAddOpen(false);
                      }}
                      className="hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {safeSizes.map((size) => (
                      <button
                        key={size}
                        onClick={(e) => handleSizeSelect(e, size)}
                        className="py-1.5 text-center text-xs font-mono font-medium hover:bg-[#B88F88] hover:text-white bg-[#2A2928] text-[#F7F4EF] transition-colors"
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

      {/* 2. Minimal Information Underneath */}
      <div className="flex flex-col space-y-1.5">
        {/* Color swatches */}
        <div className="flex items-center space-x-1.5 mb-0.5">
          {safeColors.map((color, idx) => (
            <button
              key={color.name || idx}
              title={color.name}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedColorIndex(idx);
              }}
              className={`w-2.5 h-2.5 rounded-full border transition-all ${
                selectedColorIndex === idx
                  ? 'ring-1 ring-[#1D1D1B] ring-offset-1 border-[#1D1D1B]'
                  : 'border-[#B7ADA2]/40 hover:scale-110'
              }`}
              style={{ backgroundColor: color.hex }}
              aria-label={`Select color ${color.name}`}
            />
          ))}
          <span className="text-[10px] text-[#7C746B] font-light ml-1">
            {safeColors[selectedColorIndex]?.name || safeColors[0]?.name}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="font-sans text-sm sm:text-[15px] font-normal text-[#1D1D1B] tracking-tight group-hover:text-[#B88F88] transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Subtitle / Fabric callout */}
        <p className="text-[11px] text-[#7C746B] font-light line-clamp-1">
          {product.subtitle}
        </p>

        {/* Price with dual currency support */}
        <div className="flex items-baseline space-x-2 pt-0.5">
          <span className="text-sm font-medium text-[#1D1D1B]">
            {formatPrice(product.priceEgp, currency)}
          </span>
          {product.originalPriceEgp && (
            <span className="text-xs text-[#7C746B] line-through font-light">
              {formatPrice(product.originalPriceEgp, currency)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
