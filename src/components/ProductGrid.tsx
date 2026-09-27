import React from 'react';
import { Product, Currency } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  categoryTag?: string;
  products?: Product[];
  currency?: Currency;
  wishlistIds?: string[];
  onToggleWishlist: (product: Product) => void;
  onQuickAdd: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL') => void;
  onProductClick: (product: Product) => void;
  onViewAll?: () => void;
  noWrapper?: boolean;
  centeredTitle?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  title,
  subtitle,
  categoryTag,
  products = [],
  currency = 'EGP',
  wishlistIds = [],
  onToggleWishlist,
  onQuickAdd,
  onProductClick,
  onViewAll,
  noWrapper = false,
  centeredTitle = true
}) => {
  const safeProducts = Array.isArray(products) ? products.filter(Boolean) : [];
  const safeWishlistIds = Array.isArray(wishlistIds) ? wishlistIds : [];

  const gridContent = (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3.5 sm:gap-x-6 lg:gap-x-8 gap-y-10 sm:gap-y-14 w-full">
      {safeProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          currency={currency}
          isWishlisted={safeWishlistIds.includes(product.id)}
          onToggleWishlist={onToggleWishlist}
          onQuickAdd={onQuickAdd}
          onClick={onProductClick}
        />
      ))}
    </div>
  );

  if (noWrapper) return gridContent;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {(title || categoryTag) && (
          <div className={`mb-8 sm:mb-12 ${centeredTitle ? 'text-center' : 'flex flex-col sm:flex-row sm:items-end justify-between'}`}>
            {categoryTag && (
              <span className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#7C746B] font-medium block mb-2">
                {categoryTag}
              </span>
            )}
            {title && (
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1D1D1B] tracking-[0.2em] uppercase font-light">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-2 text-xs sm:text-sm text-[#7C746B] font-light max-w-lg mx-auto">
                {subtitle}
              </p>
            )}
            {onViewAll && !centeredTitle && (
              <button
                type="button"
                onClick={onViewAll}
                className="mt-4 sm:mt-0 text-xs tracking-[0.2em] uppercase font-medium text-[#1D1D1B] hover:text-[#BA945A] pb-1 border-b border-[#1D1D1B] transition-colors self-start sm:self-auto cursor-pointer"
              >
                VIEW ALL PIECES ({safeProducts.length})
              </button>
            )}
          </div>
        )}
        {gridContent}
      </div>
    </section>
  );
};
