import React, { useState, useMemo, useEffect } from 'react';
import {
  Filter,
  X,
  ChevronDown,
  Check,
  SlidersHorizontal,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
  Palette,
  Tag
} from 'lucide-react';
import { Product, Currency } from '../types';
import { ProductCard } from './ProductCard';
import { Breadcrumbs } from './common/Breadcrumbs';
import { WOMEN_CATEGORIES } from '../config/categories';
import { buildCategoryUrl } from '../config/routes';
import { formatPrice } from '../utils/currency';

interface ShopCatalogViewProps {
  products?: Product[];
  initialCategory?: string;
  initialSubcategory?: string;
  isNewInOnly?: boolean;
  currency?: Currency;
  wishlistIds?: string[];
  onToggleWishlist: (product: Product) => void;
  onQuickAdd: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL') => void;
  onProductClick: (product: Product) => void;
  onNavigateHome: () => void;
  onNavigateCollections: () => void;
  onSelectCategory?: (category: string, subcategory?: string) => void;
  onOpenTryOn?: (product?: Product) => void;
}

// Universal Fashion Color Palette definitions
const FILTER_COLORS = [
  { id: 'noir', name: 'Noir / Black', hex: '#1D1D1B', keyword: 'black' },
  { id: 'ivoire', name: 'Ivoire / White', hex: '#F7F4EF', keyword: 'white' },
  { id: 'dune', name: 'Dune / Sand & Beige', hex: '#D4CCC2', keyword: 'sand' },
  { id: 'terracotta', name: 'Terracotta & Rust', hex: '#964036', keyword: 'terracotta' },
  { id: 'olive', name: 'Sage & Olive Green', hex: '#8A9A86', keyword: 'olive' },
  { id: 'navy', name: 'Midnight Navy', hex: '#243042', keyword: 'navy' },
  { id: 'camel', name: 'Warm Camel & Caramel', hex: '#B8976C', keyword: 'camel' }
];

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under-4000', label: 'Under 4,000 EGP', min: 0, max: 4000 },
  { id: '4000-7000', label: '4,000 – 7,000 EGP', min: 4000, max: 7000 },
  { id: '7000-10000', label: '7,000 – 10,000 EGP', min: 7000, max: 10000 },
  { id: 'above-10000', label: 'Above 10,000 EGP', min: 10000, max: Infinity }
];

export const ShopCatalogView: React.FC<ShopCatalogViewProps> = ({
  products = [],
  initialCategory = 'All',
  initialSubcategory = 'All',
  isNewInOnly = false,
  currency = 'EGP' as Currency,
  wishlistIds = [],
  onToggleWishlist,
  onQuickAdd,
  onProductClick,
  onNavigateHome,
  onNavigateCollections,
  onSelectCategory,
  onOpenTryOn
}) => {
  // Standard E-commerce Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSubcategory);
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [isModestOnly, setIsModestOnly] = useState<boolean>(initialCategory === 'Modest Edit');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Sync with props
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      if (initialCategory === 'Modest Edit') {
        setIsModestOnly(true);
      }
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialSubcategory) {
      setSelectedSubcategory(initialSubcategory);
    }
  }, [initialSubcategory]);

  const primaryCategories = [
    'All',
    'Dresses',
    'Tops',
    'Bottoms',
    'Sets',
    'Outerwear',
    'Modest Edit',
    'Loungewear & Sleepwear',
    'Scarves'
  ];

  const standardSizes = ['XS', 'S', 'M', 'L', 'XL'];

  // Current category subcategories
  const currentCategoryData = useMemo(() => {
    const catQuery = selectedCategory.toLowerCase();
    return WOMEN_CATEGORIES.find(
      (c) => c.name.toLowerCase() === catQuery || c.slug === catQuery || (catQuery === 'modest edit' && c.slug === 'modest')
    );
  }, [selectedCategory]);

  // Comprehensive Product Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    const activeRange = PRICE_RANGES.find((r) => r.id === selectedPriceRange) || PRICE_RANGES[0];

    return (products || [])
      .filter((p) => {
        if (!p) return false;

        // 1. New In filter
        if (isNewInOnly && !p.isNew && p.badge !== 'NEW') {
          return false;
        }

        // 2. Category filter
        if (selectedCategory === 'Modest Edit') {
          if (!p.isModestEdit && !(p.category || '').toLowerCase().includes('modest')) return false;
        } else if (selectedCategory === 'Bottoms') {
          if (p.category !== 'Bottoms' && p.category !== 'Pants') return false;
        } else if (selectedCategory !== 'All') {
          if ((p.category || '').toLowerCase() !== selectedCategory.toLowerCase()) return false;
        }

        // 3. Subcategory filter
        if (selectedSubcategory !== 'All') {
          const subLower = selectedSubcategory.toLowerCase();
          const pSubLower = (p.subcategory || '').toLowerCase();
          if (!pSubLower.includes(subLower) && !subLower.includes(pSubLower)) {
            return false;
          }
        }

        // 4. Modest Only toggle
        if (isModestOnly && !p.isModestEdit) {
          return false;
        }

        // 5. Standard Size filter
        if (selectedSize !== 'All' && !(p.sizes || []).includes(selectedSize as any)) {
          return false;
        }

        // 6. Standard Color filter
        if (selectedColor !== 'All') {
          const colorObj = FILTER_COLORS.find((c) => c.id === selectedColor);
          if (colorObj) {
            const hasColorMatch = (p.colors || []).some((c) => {
              const cName = c.name.toLowerCase();
              return cName.includes(colorObj.keyword) || colorObj.keyword.includes(cName);
            });
            const pDesc = (p.description || '').toLowerCase();
            const pName = (p.name || '').toLowerCase();
            const inText = pDesc.includes(colorObj.keyword) || pName.includes(colorObj.keyword);
            if (!hasColorMatch && !inText) return false;
          }
        }

        // 7. Standard Price Range filter
        const price = p.priceEgp || 0;
        if (price < activeRange.min || price > activeRange.max) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0);
        if (sortBy === 'price-low') return (a.priceEgp || 0) - (b.priceEgp || 0);
        if (sortBy === 'price-high') return (b.priceEgp || 0) - (a.priceEgp || 0);
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0; // featured default
      });
  }, [
    products,
    selectedCategory,
    selectedSubcategory,
    selectedSize,
    selectedColor,
    selectedPriceRange,
    isModestOnly,
    isNewInOnly,
    sortBy
  ]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSelectedSize('All');
    setSelectedColor('All');
    setSelectedPriceRange('all');
    setIsModestOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters =
    (selectedCategory !== 'All' && !isNewInOnly) ||
    selectedSubcategory !== 'All' ||
    selectedSize !== 'All' ||
    selectedColor !== 'All' ||
    selectedPriceRange !== 'all' ||
    (isModestOnly && selectedCategory !== 'Modest Edit');

  // Count active filters for badge
  const activeFiltersCount = [
    selectedCategory !== 'All' && !isNewInOnly,
    selectedSubcategory !== 'All',
    selectedSize !== 'All',
    selectedColor !== 'All',
    selectedPriceRange !== 'all',
    isModestOnly && selectedCategory !== 'Modest Edit'
  ].filter(Boolean).length;

  return (
    <div className="py-6 sm:py-10 bg-[#F7F4EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'Home', onClick: onNavigateHome },
              { label: isNewInOnly ? 'New In' : 'Shop', onClick: isNewInOnly ? undefined : () => setSelectedCategory('All') },
              ...(selectedCategory !== 'All' ? [{ label: selectedCategory }] : []),
              ...(selectedSubcategory !== 'All' ? [{ label: selectedSubcategory }] : [])
            ]}
          />
        </div>

        {/* AI Virtual Fitting Room Banner / Feature Strip */}
        {onOpenTryOn && (
          <div className="mb-8 p-4 sm:p-5 bg-gradient-to-r from-[#1D1D1B] via-[#2D2A26] to-[#1D1D1B] text-white border border-[#BA945A]/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5 text-center sm:text-left">
              <span className="w-9 h-9 rounded-full bg-[#BA945A] text-[#1D1D1B] flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <h3 className="text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold text-white">
                    AI Virtual Fitting Room
                  </h3>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-[#D4CCC2] bg-white/10 px-2 py-0.5 border border-white/20">
                    جرب بالذكاء الاصطناعي
                  </span>
                </div>
                <p className="text-[11px] text-[#D4CCC2] font-light mt-0.5">
                  Upload your photo or choose a silhouette model to visualize any LORÉA piece tailored to your frame.
                </p>
              </div>
            </div>

            <button
              id="open-ai-fitting-room-banner-btn"
              onClick={() => onOpenTryOn()}
              className="px-5 py-2.5 bg-[#BA945A] hover:bg-[#C9A56B] text-[#1D1D1B] text-xs tracking-[0.22em] uppercase font-semibold transition-all inline-flex items-center space-x-2 shrink-0 cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open AI Try-On</span>
            </button>
          </div>
        )}

        {/* Page Title Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <span className="text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-[#BA945A] font-medium block mb-2 font-mono">
            {isNewInOnly ? 'SUMMER 2026 DROP' : 'LORÉA ATELIER CATALOGUE'}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-[#1D1D1B]">
            {isNewInOnly ? 'New Arrivals' : selectedCategory === 'All' ? 'Ready-to-Wear Collection' : selectedCategory}
          </h1>
          <p className="mt-2.5 text-xs sm:text-sm text-[#7C746B] font-light">
            {filteredProducts.length} silhouettes crafted with Egyptian long-staple cotton, French linen, and mulberry silk.
          </p>
        </div>

        {/* Category Quick Tabs (Desktop & Tablet) */}
        <div className="mb-6 flex items-center justify-start lg:justify-center overflow-x-auto py-2 border-b border-[#EAE5DE] scrollbar-none gap-2">
          {primaryCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSubcategory('All');
              }}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-[0.16em] transition-all whitespace-nowrap cursor-pointer rounded-xs ${
                selectedCategory === cat
                  ? 'bg-[#1D1D1B] text-[#F7F4EF] font-medium shadow-xs'
                  : 'text-[#7C746B] hover:text-[#1D1D1B] hover:bg-white/60 bg-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Subcategory Pills (if category selected and has subcategories) */}
        {currentCategoryData && currentCategoryData.subcategories.length > 0 && (
          <div className="mb-6 flex items-center justify-center flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedSubcategory('All')}
              className={`px-3 py-1 text-[11px] uppercase tracking-wider transition-colors border cursor-pointer ${
                selectedSubcategory === 'All'
                  ? 'bg-[#1D1D1B] text-[#F7F4EF] border-[#1D1D1B]'
                  : 'bg-white text-[#7C746B] border-[#EAE5DE] hover:border-[#1D1D1B]'
              }`}
            >
              All {currentCategoryData.name}
            </button>
            {currentCategoryData.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(sub.name)}
                className={`px-3 py-1 text-[11px] uppercase tracking-wider transition-colors border cursor-pointer ${
                  selectedSubcategory.toLowerCase() === sub.name.toLowerCase()
                    ? 'bg-[#1D1D1B] text-[#F7F4EF] border-[#1D1D1B]'
                    : 'bg-white text-[#7C746B] border-[#EAE5DE] hover:border-[#1D1D1B]'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Standard Creative Filter Bar (Desktop & Mobile) */}
        <div className="flex items-center justify-between py-3.5 px-4 bg-white border border-[#EAE5DE] mb-6 text-xs text-[#1D1D1B] shadow-xs">
          {/* Left: Filter Drawer Trigger Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-[#FAF8F5] border border-[#D4CCC2] hover:border-[#1D1D1B] text-xs font-medium uppercase tracking-wider transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#1D1D1B]" />
              <span>Filter & Refine</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#1D1D1B] text-[#F7F4EF] text-[10px] font-mono flex items-center justify-center ml-1">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Quick Size Pills directly on bar (Desktop) */}
            <div className="hidden xl:flex items-center space-x-1.5 pl-3 border-l border-[#EAE5DE]">
              <span className="text-[10px] uppercase tracking-wider text-[#7C746B] mr-1 font-mono">Size:</span>
              <button
                onClick={() => setSelectedSize('All')}
                className={`px-2 py-0.5 text-[10px] font-mono border transition-colors cursor-pointer ${
                  selectedSize === 'All'
                    ? 'bg-[#1D1D1B] text-white border-[#1D1D1B]'
                    : 'bg-[#FAF8F5] text-[#7C746B] border-[#EAE5DE]'
                }`}
              >
                All
              </button>
              {standardSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(selectedSize === s ? 'All' : s)}
                  className={`px-2 py-0.5 text-[10px] font-mono border transition-colors cursor-pointer ${
                    selectedSize === s
                      ? 'bg-[#1D1D1B] text-white border-[#1D1D1B]'
                      : 'bg-[#FAF8F5] text-[#1D1D1B] border-[#EAE5DE] hover:border-[#1D1D1B]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Results Count & Sort Dropdown */}
          <div className="flex items-center space-x-4">
            <span className="text-[11px] text-[#7C746B] hidden sm:inline font-mono">
              {filteredProducts.length} Silhouettes
            </span>

            <div className="flex items-center space-x-1.5">
              <span className="text-[#7C746B] text-[11px] uppercase tracking-wider hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border border-[#D4CCC2] px-2.5 py-1 text-xs text-[#1D1D1B] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured (المختار)</option>
                <option value="newest">New Arrivals (الأحدث)</option>
                <option value="price-low">Price: Low to High (الأقل سعراً)</option>
                <option value="price-high">Price: High to Low (الأعلى سعراً)</option>
                <option value="rating">Customer Rating (الأعلى تقييماً)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white/70 border border-[#EAE5DE] rounded-xs">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#7C746B] font-mono mr-1">
              Active Filters:
            </span>

            {selectedCategory !== 'All' && !isNewInOnly && (
              <span className="inline-flex items-center px-2.5 py-1 bg-white text-xs text-[#1D1D1B] border border-[#D4CCC2]">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="ml-1.5 hover:text-[#964036] cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedSubcategory !== 'All' && (
              <span className="inline-flex items-center px-2.5 py-1 bg-white text-xs text-[#1D1D1B] border border-[#D4CCC2]">
                {selectedSubcategory}
                <button
                  onClick={() => setSelectedSubcategory('All')}
                  className="ml-1.5 hover:text-[#964036] cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedColor !== 'All' && (
              <span className="inline-flex items-center px-2.5 py-1 bg-white text-xs text-[#1D1D1B] border border-[#D4CCC2]">
                Color: {FILTER_COLORS.find((c) => c.id === selectedColor)?.name.split('/')[0] || selectedColor}
                <button
                  onClick={() => setSelectedColor('All')}
                  className="ml-1.5 hover:text-[#964036] cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedSize !== 'All' && (
              <span className="inline-flex items-center px-2.5 py-1 bg-white text-xs text-[#1D1D1B] border border-[#D4CCC2]">
                Size: {selectedSize}
                <button
                  onClick={() => setSelectedSize('All')}
                  className="ml-1.5 hover:text-[#964036] cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedPriceRange !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-1 bg-white text-xs text-[#1D1D1B] border border-[#D4CCC2]">
                Price: {PRICE_RANGES.find((r) => r.id === selectedPriceRange)?.label}
                <button
                  onClick={() => setSelectedPriceRange('all')}
                  className="ml-1.5 hover:text-[#964036] cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}

            {isModestOnly && selectedCategory !== 'Modest Edit' && (
              <span className="inline-flex items-center px-2.5 py-1 bg-white text-xs text-[#1D1D1B] border border-[#D4CCC2]">
                Modest Edit Only
                <button
                  onClick={() => setIsModestOnly(false)}
                  className="ml-1.5 hover:text-[#964036] cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}

            <button
              onClick={clearFilters}
              className="text-xs uppercase tracking-wider underline text-[#7C746B] hover:text-[#1D1D1B] ml-2 cursor-pointer font-medium"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Product Grid or Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#EAE5DE] px-4 max-w-md mx-auto my-8">
            <span className="text-[10px] tracking-[0.24em] uppercase text-[#7C746B] font-mono block mb-2">
              0 SILHOUETTES FOUND
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1D1D1B] mb-2 font-light">
              No matching pieces found
            </h2>
            <p className="text-xs text-[#7C746B] font-light max-w-sm mx-auto mb-6">
              There are currently no garments matching these exact filter criteria. Try selecting another color, size, or price range.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 bg-[#1D1D1B] text-[#F7F4EF] text-xs uppercase tracking-widest font-medium hover:bg-[#333] transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
              {onOpenTryOn && (
                <button
                  onClick={() => onOpenTryOn()}
                  className="px-5 py-2.5 bg-[#FAF8F5] border border-[#BA945A] text-[#1D1D1B] text-xs uppercase tracking-widest font-medium hover:bg-[#1D1D1B] hover:text-white transition-colors cursor-pointer flex items-center justify-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#BA945A]" />
                  <span>Try-On With AI</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickAdd={onQuickAdd}
                onClick={onProductClick}
                onOpenTryOn={onOpenTryOn ? () => onOpenTryOn(product) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* Standard Universal Filter & Refine Drawer (Creative Side-Drawer) */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setFilterDrawerOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col z-10 p-6 overflow-y-auto border-l border-[#EAE5DE]">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DE] mb-6">
              <div>
                <h3 className="font-serif text-xl text-[#1D1D1B] font-light">Refine & Filter</h3>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#7C746B] font-mono">
                  {filteredProducts.length} Silhouettes Available
                </span>
              </div>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7C746B] hover:text-[#1D1D1B] hover:bg-[#EAE5DE] transition-colors cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5 text-[#1D1D1B]" />
              </button>
            </div>

            <div className="space-y-7 flex-1">
              {/* 1. Category Filter */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-[0.18em] text-[#1D1D1B] font-semibold">
                    Category
                  </span>
                  {selectedCategory !== 'All' && (
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className="text-[10px] uppercase text-[#BA945A] hover:underline cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {primaryCategories.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setSelectedCategory(c);
                        setSelectedSubcategory('All');
                      }}
                      className={`px-3 py-2 text-left text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                        selectedCategory === c
                          ? 'bg-[#1D1D1B] text-[#F7F4EF] border-[#1D1D1B] font-medium'
                          : 'bg-white text-[#7C746B] border-[#EAE5DE] hover:border-[#1D1D1B]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Color Palette Filter */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-[0.18em] text-[#1D1D1B] font-semibold flex items-center">
                    <Palette className="w-3.5 h-3.5 mr-1 text-[#BA945A]" />
                    Color Palette
                  </span>
                  {selectedColor !== 'All' && (
                    <button
                      onClick={() => setSelectedColor('All')}
                      className="text-[10px] uppercase text-[#BA945A] hover:underline cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedColor('All')}
                    className={`w-full flex items-center justify-between p-2 text-xs border transition-colors cursor-pointer ${
                      selectedColor === 'All'
                        ? 'bg-[#1D1D1B] text-white border-[#1D1D1B]'
                        : 'bg-white text-[#1D1D1B] border-[#EAE5DE] hover:border-[#1D1D1B]'
                    }`}
                  >
                    <span>All Palette Colors</span>
                    {selectedColor === 'All' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  {FILTER_COLORS.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => setSelectedColor(selectedColor === col.id ? 'All' : col.id)}
                      className={`w-full flex items-center justify-between p-2 text-xs border transition-colors cursor-pointer ${
                        selectedColor === col.id
                          ? 'bg-[#1D1D1B] text-white border-[#1D1D1B]'
                          : 'bg-white text-[#1D1D1B] border-[#EAE5DE] hover:border-[#1D1D1B]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                      </div>
                      {selectedColor === col.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Size Filter */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-[0.18em] text-[#1D1D1B] font-semibold">
                    Size
                  </span>
                  {selectedSize !== 'All' && (
                    <button
                      onClick={() => setSelectedSize('All')}
                      className="text-[10px] uppercase text-[#BA945A] hover:underline cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {standardSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(selectedSize === s ? 'All' : s)}
                      className={`py-2.5 text-xs text-center border font-mono transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'border-[#1D1D1B] bg-[#1D1D1B] text-[#F7F4EF] font-bold'
                          : 'border-[#D4CCC2] bg-white text-[#1D1D1B] hover:border-[#1D1D1B]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Price Range Filter */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-[0.18em] text-[#1D1D1B] font-semibold">
                    Price Range
                  </span>
                  {selectedPriceRange !== 'all' && (
                    <button
                      onClick={() => setSelectedPriceRange('all')}
                      className="text-[10px] uppercase text-[#BA945A] hover:underline cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="space-y-1.5">
                  {PRICE_RANGES.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setSelectedPriceRange(range.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs border transition-colors cursor-pointer ${
                        selectedPriceRange === range.id
                          ? 'bg-[#1D1D1B] text-white border-[#1D1D1B] font-medium'
                          : 'bg-white text-[#4A453F] border-[#EAE5DE] hover:border-[#1D1D1B]'
                      }`}
                    >
                      <span>{range.label}</span>
                      {selectedPriceRange === range.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Special Toggles */}
              <div className="pt-2 border-t border-[#EAE5DE] space-y-3">
                <label className="flex items-center justify-between cursor-pointer p-2 bg-white border border-[#EAE5DE]">
                  <span className="text-xs uppercase tracking-wider text-[#1D1D1B]">
                    Modest Edit Silhouettes Only
                  </span>
                  <input
                    type="checkbox"
                    checked={isModestOnly}
                    onChange={(e) => setIsModestOnly(e.target.checked)}
                    className="w-4 h-4 accent-[#1D1D1B] cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="mt-8 pt-4 border-t border-[#EAE5DE] space-y-2">
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="w-full py-3.5 bg-[#1D1D1B] text-[#F7F4EF] hover:bg-[#333] text-xs uppercase tracking-widest font-medium transition-colors shadow-md cursor-pointer"
              >
                Apply Filters ({filteredProducts.length})
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2 text-xs uppercase tracking-wider text-[#7C746B] hover:text-[#1D1D1B] cursor-pointer text-center"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
