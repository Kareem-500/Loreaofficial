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
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  title, subtitle, categoryTag, products = [], currency = 'EGP', wishlistIds = [],
  onToggleWishlist, onQuickAdd, onProductClick, onViewAll, noWrapper = false
}) => {
  const safeProducts = Array.isArray(products) ? products.filter(Boolean) : [];
  const safeWishlistIds = Array.isArray(wishlistIds) ? wishlistIds : [];
  const gridContent = (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14">
      {safeProducts.map((product) => (
        <ProductCard key={product.id} product={product} currency={currency} isWishlisted={safeWishlistIds.includes(product.id)} onToggleWishlist={onToggleWishlist} onQuickAdd={onQuickAdd} onClick={onProductClick} />
      ))}
    </div>
  );
  if (noWrapper) return gridContent;
  return (
    <section className="py-16 sm:py-24 bg-[#F7F4EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || categoryTag) && (
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14">
            <div>
              {categoryTag && <span className="text-[11px] tracking-[0.28em] uppercase text-[#7C746B] font-medium block mb-2">{categoryTag}</span>}
              {title && <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#1D1D1B]">{title}</h2>}
              {subtitle && <p className="mt-2 text-sm sm:text-base text-[#7C746B] font-light max-w-lg">{subtitle}</p>}
            </div>
            {onViewAll && <button type="button" onClick={onViewAll} className="mt-4 sm:mt-0 text-xs tracking-[0.2em] uppercase font-medium text-[#1D1D1B] hover:text-[#B88F88] pb-1 border-b border-[#1D1D1B] hover:border-[#B88F88] transition-all self-start sm:self-auto">VIEW ALL PIECES ({safeProducts.length})</button>}
          </div>
        )}
        {gridContent}
      </div>
    </section>
  );
};
