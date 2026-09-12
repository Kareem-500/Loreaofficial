import React, { useState, useMemo } from 'react';
import { Filter, X, ChevronDown, Check, SlidersHorizontal } from 'lucide-react';
import { Product, Currency } from '../types';
import { ProductCard } from './ProductCard';
import { formatPrice } from '../utils/currency';

interface ShopCatalogViewProps {
  products: Product[];
  initialCategory?: string;
  currency: Currency;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onQuickAdd: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL') => void;
  onProductClick: (product: Product) => void;
}

export const ShopCatalogView: React.FC<ShopCatalogViewProps> = ({
  products,
  initialCategory = 'All',
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onProductClick
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedFabric, setSelectedFabric] = useState<string>('All');
  const [isModestOnly, setIsModestOnly] = useState<boolean>(initialCategory === 'Modest Edit');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync if initial category prop changes
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      if (initialCategory === 'Modest Edit') {
        setIsModestOnly(true);
      }
    }
  }, [initialCategory]);

  const categories = ['All', 'Dresses', 'Tops', 'Sets', 'Outerwear', 'Pants', 'Modest Edit'];
  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL'];
  const fabrics = ['All', 'Linen', 'Giza Cotton', 'Silk', 'Wool / Cashmere'];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory === 'Modest Edit') {
          if (!p.isModestEdit) return false;
        } else if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }

        // Modest only toggle
        if (isModestOnly && !p.isModestEdit) {
          return false;
        }

        // Size filter
        if (selectedSize !== 'All' && !p.sizes.includes(selectedSize as any)) {
          return false;
        }

        // Fabric filter
        if (selectedFabric !== 'All') {
          if (selectedFabric === 'Linen' && !p.fabric.toLowerCase().includes('linen')) return false;
          if (selectedFabric === 'Giza Cotton' && !p.fabric.toLowerCase().includes('cotton')) return false;
          if (selectedFabric === 'Silk' && !p.fabric.toLowerCase().includes('silk')) return false;
          if (selectedFabric === 'Wool / Cashmere' && !p.fabric.toLowerCase().includes('wool') && !p.fabric.toLowerCase().includes('alpaca')) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0);
        if (sortBy === 'price-low') return a.priceEgp - b.priceEgp;
        if (sortBy === 'price-high') return b.priceEgp - a.priceEgp;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default order
      });
  }, [products, selectedCategory, selectedSize, selectedFabric, isModestOnly, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedSize('All');
    setSelectedFabric('All');
    setIsModestOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedSize !== 'All' ||
    selectedFabric !== 'All' ||
    isModestOnly;

  return (
    <div className="py-12 sm:py-16 bg-[#F7F4EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <span className="text-[11px] tracking-[0.32em] uppercase text-[#7C746B] font-medium block mb-2">
            LORÉA CATALOGUE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-wide text-[#1D1D1B]">
            {selectedCategory === 'All' ? 'The Complete Collection' : selectedCategory}
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#7C746B] font-light">
            {filteredProducts.length} silhouettes crafted with Egyptian long-staple cotton, French linen, and pure silks.
          </p>
        </div>

        {/* Filter Bar (Desktop) & Mobile Filter Button */}
        <div className="flex items-center justify-between py-4 border-y border-[#EAE5DE] mb-10 text-xs text-[#1D1D1B]">
          {/* Category Chips (Desktop) */}
          <div className="hidden lg:flex items-center space-x-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 transition-all text-xs tracking-wider uppercase ${
                  selectedCategory === cat
                    ? 'bg-[#1D1D1B] text-[#F7F4EF] font-medium'
                    : 'text-[#7C746B] hover:text-[#1D1D1B] bg-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center space-x-2 px-3.5 py-2 bg-[#EFECE6] border border-[#D4CCC2] text-xs font-medium uppercase tracking-wider"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters ({hasActiveFilters ? 'Active' : 'All'})</span>
          </button>

          {/* Desktop Secondary Filters & Sort Dropdown */}
          <div className="flex items-center space-x-4">
            {/* Fabric Selector */}
            <div className="hidden md:flex items-center space-x-1.5">
              <span className="text-[#7C746B] text-[11px] uppercase tracking-wider">Fabric:</span>
              <select
                value={selectedFabric}
                onChange={(e) => setSelectedFabric(e.target.value)}
                className="bg-transparent border border-[#D4CCC2] px-2.5 py-1 text-xs text-[#1D1D1B] focus:outline-hidden"
              >
                {fabrics.map((f) => (
                  <option key={f} value={f} className="bg-[#F7F4EF]">
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Selector */}
            <div className="hidden md:flex items-center space-x-1.5">
              <span className="text-[#7C746B] text-[11px] uppercase tracking-wider">Size:</span>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="bg-transparent border border-[#D4CCC2] px-2.5 py-1 text-xs text-[#1D1D1B] focus:outline-hidden"
              >
                {sizes.map((s) => (
                  <option key={s} value={s} className="bg-[#F7F4EF]">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[#7C746B] text-[11px] uppercase tracking-wider hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border border-[#D4CCC2] px-2.5 py-1 text-xs text-[#1D1D1B] focus:outline-hidden"
              >
                <option value="featured" className="bg-[#F7F4EF]">Featured</option>
                <option value="newest" className="bg-[#F7F4EF]">Newest In</option>
                <option value="price-low" className="bg-[#F7F4EF]">Price: Low to High</option>
                <option value="price-high" className="bg-[#F7F4EF]">Price: High to Low</option>
                <option value="rating" className="bg-[#F7F4EF]">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips with Clear option */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-[11px] uppercase tracking-wider text-[#7C746B] mr-2">Active filters:</span>
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center px-2.5 py-1 bg-[#EFECE6] text-xs text-[#1D1D1B] border border-[#D4CCC2]">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('All')} className="ml-1.5 hover:text-[#964036]">✕</button>
              </span>
            )}
            {selectedFabric !== 'All' && (
              <span className="inline-flex items-center px-2.5 py-1 bg-[#EFECE6] text-xs text-[#1D1D1B] border border-[#D4CCC2]">
                {selectedFabric}
                <button onClick={() => setSelectedFabric('All')} className="ml-1.5 hover:text-[#964036]">✕</button>
              </span>
            )}
            {selectedSize !== 'All' && (
              <span className="inline-flex items-center px-2.5 py-1 bg-[#EFECE6] text-xs text-[#1D1D1B] border border-[#D4CCC2]">
                Size: {selectedSize}
                <button onClick={() => setSelectedSize('All')} className="ml-1.5 hover:text-[#964036]">✕</button>
              </span>
            )}
            {isModestOnly && selectedCategory !== 'Modest Edit' && (
              <span className="inline-flex items-center px-2.5 py-1 bg-[#EFECE6] text-xs text-[#1D1D1B] border border-[#D4CCC2]">
                Modest Edit
                <button onClick={() => setIsModestOnly(false)} className="ml-1.5 hover:text-[#964036]">✕</button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-[#964036] underline ml-2 hover:opacity-80"
            >
              Reset all
            </button>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="font-serif text-2xl font-light text-[#1D1D1B] mb-2">
              No silhouettes match your current filters
            </h3>
            <p className="text-sm text-[#7C746B] font-light max-w-sm mx-auto mb-6">
              Try resetting your category or fabric selections to view all LORÉA pieces.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-[#1D1D1B] text-[#F7F4EF] text-xs tracking-widest uppercase font-medium hover:bg-[#333]"
            >
              SHOW ALL PIECES
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                currency={currency}
                isWishlisted={wishlistIds.includes(p.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickAdd={onQuickAdd}
                onClick={onProductClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-[#F7F4EF] h-full shadow-2xl flex flex-col z-10 ml-auto p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DE] mb-6">
              <h3 className="font-serif text-xl text-[#1D1D1B]">Refine Collection</h3>
              <button onClick={() => setMobileFilterOpen(false)} aria-label="Close filters">
                <X className="w-5 h-5 text-[#1D1D1B]" />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-[#7C746B] font-medium mb-3">Category</p>
              <div className="space-y-2 text-sm">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`block w-full text-left py-1 ${
                      selectedCategory === c ? 'font-bold text-[#1D1D1B]' : 'text-[#7C746B]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabrics */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-[#7C746B] font-medium mb-3">Fabric</p>
              <div className="space-y-2 text-sm">
                {fabrics.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFabric(f)}
                    className={`block w-full text-left py-1 ${
                      selectedFabric === f ? 'font-bold text-[#1D1D1B]' : 'text-[#7C746B]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-[#7C746B] font-medium mb-3">Size</p>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 text-xs text-center border ${
                      selectedSize === s
                        ? 'border-[#1D1D1B] bg-[#1D1D1B] text-[#F7F4EF]'
                        : 'border-[#D4CCC2] text-[#1D1D1B]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-[#EAE5DE] space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#1D1D1B] text-[#F7F4EF] text-xs uppercase tracking-widest font-medium"
              >
                APPLY FILTERS ({filteredProducts.length})
              </button>
              <button
                onClick={clearFilters}
                className="w-full py-2 text-xs text-[#7C746B] underline"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
