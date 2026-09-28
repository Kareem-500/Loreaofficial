import React from 'react';
import { Product, Currency } from '../../types';
import { CategoryProductCarousel } from './CategoryProductCarousel';

interface ShopAllTrendingCarouselProps {
  products: Product[];
  currency: Currency;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onQuickAdd: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL') => void;
  onProductClick: (product: Product) => void;
  onViewAll: () => void;
  onOpenTryOn?: (product: Product) => void;
}

export const ShopAllTrendingCarousel: React.FC<ShopAllTrendingCarouselProps> = ({
  products,
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onProductClick,
  onViewAll,
  onOpenTryOn
}) => {
  // Filter trending products
  const trendingProducts = products.filter(
    (p) => Boolean(p.isTrending || p.badge === 'BEST SELLER' || p.badge === 'NEW')
  );

  return (
    <CategoryProductCarousel
      id="shop-all"
      title="SHOP ALL"
      subtitle="TRENDING"
      products={trendingProducts}
      currency={currency}
      wishlistIds={wishlistIds}
      onToggleWishlist={onToggleWishlist}
      onQuickAdd={onQuickAdd}
      onProductClick={onProductClick}
      onViewAll={onViewAll}
      moreText="MORE"
      onOpenTryOn={onOpenTryOn}
    />
  );
};
