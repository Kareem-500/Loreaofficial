import React from 'react';
import { WOMEN_CATEGORIES } from '../config/categories';
import { buildCategoryUrl } from '../config/routes';
import { Breadcrumbs } from './common/Breadcrumbs';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product, Currency } from '../types';
import { ProductCard } from './ProductCard';

interface CollectionsViewProps {
  products?: Product[];
  currency?: Currency;
  wishlistIds?: string[];
  onToggleWishlist?: (product: Product) => void;
  onQuickAdd?: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL') => void;
  onProductClick?: (product: Product) => void;
  onNavigateToCategory?: (categorySlug: string, subcategorySlug?: string) => void;
  onSelectCategory?: (categorySlug: string, subcategorySlug?: string) => void;
  onNavigateHome: () => void;
  onNavigateStore: () => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  products = [],
  currency = 'EGP',
  wishlistIds = [],
  onToggleWishlist,
  onQuickAdd,
  onProductClick,
  onNavigateToCategory,
  onSelectCategory,
  onNavigateHome,
  onNavigateStore
}) => {
  const handleCategoryNav = (catSlug: string, subSlug?: string) => {
    if (onSelectCategory) {
      onSelectCategory(catSlug, subSlug);
    } else if (onNavigateToCategory) {
      onNavigateToCategory(catSlug, subSlug);
    }
  };
  return (
    <div className="bg-[#F7F4EF] min-h-screen pb-24">
      {/* Header & Breadcrumb Bar */}
      <div className="border-b border-[#EAE5DE] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs
            items={[
              { label: 'Home', onClick: onNavigateHome },
              { label: 'Collections' }
            ]}
          />
        </div>
      </div>

      {/* Editorial Title Banner */}
      <section className="py-14 sm:py-20 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-[#BA945A] font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Women's Ready-to-Wear Architecture</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#1D1D1B] tracking-tight">
          The Collections
        </h1>
        <p className="mt-4 text-xs sm:text-sm text-[#7C746B] font-light max-w-2xl mx-auto leading-relaxed">
          Explore eight curated silhouettes rooted in Cairo craftsmanship, Egyptian extra-long staple cotton, and pure European linen.
        </p>
      </section>

      {/* Grid of 8 Comprehensive Fashion Categories (Text-Based Editorial Directory Without Images) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {WOMEN_CATEGORIES.map((category, index) => {
            // Find products belonging to this category safely
            const categoryProducts = (products || []).filter((p) => {
              const catLower = p.category.toLowerCase();
              if (category.slug === 'modest') return p.isModestEdit || catLower.includes('modest');
              if (category.slug === 'bottoms') return catLower === 'bottoms' || catLower === 'pants';
              if (category.slug === 'loungewear') return catLower.includes('lounge');
              return catLower.includes(category.slug);
            });

            const indexFormatted = String(index + 1).padStart(2, '0');

            return (
              <article
                key={category.id}
                id={`collection-item-${category.slug}`}
                className="group bg-white border border-[#EAE5DE] hover:border-[#BA945A] transition-all duration-300 flex flex-col justify-between p-6 sm:p-8 shadow-xs hover:shadow-md"
              >
                <div>
                  {/* Top Category Header with Index */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE4] mb-5">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-[11px] tracking-[0.24em] text-[#BA945A] font-semibold">
                        {indexFormatted}
                      </span>
                      <span className="text-[#D4CCC2]">/</span>
                      <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#7C746B]">
                        08
                      </span>
                    </div>

                    <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#7C746B]">
                      Atelier
                    </span>
                  </div>

                  {/* Category Title & Subtitle */}
                  <div className="mb-4">
                    <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-wide text-[#1D1D1B] group-hover:text-[#BA945A] transition-colors">
                      {category.name}
                    </h2>
                    {category.subtitle && (
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#BA945A] font-medium mt-1">
                        {category.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Editorial Description */}
                  <p className="text-xs sm:text-sm text-[#7C746B] font-light leading-relaxed mb-6">
                    {category.description}
                  </p>

                  {/* Subcategories (Silhouettes) */}
                  <div className="pt-4 border-t border-[#F2ECE4]">
                    <span className="block text-[10px] tracking-[0.2em] uppercase text-[#7C746B] font-medium mb-3">
                      Silhouettes & Styles:
                    </span>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {category.subcategories.map((sub) => (
                        <a
                          key={sub.id}
                          href={buildCategoryUrl(category.slug, sub.slug)}
                          onClick={(e) => {
                            e.preventDefault();
                            handleCategoryNav(category.slug, sub.slug);
                          }}
                          className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#1D1D1B] hover:text-[#F7F4EF] text-[#1D1D1B] border border-[#EAE5DE] text-[10px] tracking-wider uppercase transition-colors rounded-xs whitespace-nowrap cursor-pointer"
                        >
                          {sub.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-8 pt-4 border-t border-[#EAE5DE] flex items-center justify-between">
                  <span className="text-[11px] text-[#7C746B] font-light">
                    {categoryProducts.length > 0
                      ? `${categoryProducts.length} Silhouettes Available`
                      : 'Seasonal Collection'}
                  </span>

                  <a
                    href={buildCategoryUrl(category.slug)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategoryNav(category.slug);
                    }}
                    className="inline-flex items-center space-x-1.5 text-xs tracking-[0.2em] uppercase font-semibold text-[#1D1D1B] group-hover:text-[#BA945A] transition-colors cursor-pointer py-1"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Global Shop CTA */}
        <div className="mt-16 text-center bg-white border border-[#EAE5DE] p-8 sm:p-12">
          <h3 className="font-serif text-2xl sm:text-3xl text-[#1D1D1B] font-light">
            Looking for All Garments?
          </h3>
          <p className="text-xs sm:text-sm text-[#7C746B] mt-2 max-w-md mx-auto">
            Browse our entire ready-to-wear catalog with real-time inventory and color swatches.
          </p>
          <button
            onClick={onNavigateStore}
            className="mt-6 px-8 py-3 bg-[#1D1D1B] text-[#F7F4EF] text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#BA945A] transition-colors"
          >
            Enter Full Store
          </button>
        </div>
      </div>
    </div>
  );
};
