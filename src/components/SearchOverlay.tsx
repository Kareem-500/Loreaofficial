import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Product, Article, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { useOverlayAccessibility } from '../hooks/useOverlayAccessibility';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  products?: Product[];
  articles?: Article[];
  currency?: Currency;
  onSelectProduct: (product: Product) => void;
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (category: string) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  products = [],
  articles = [],
  currency = 'EGP' as Currency,
  onSelectProduct,
  onSelectArticle,
  onSelectCategory
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // ESC and body scroll lock
  useOverlayAccessibility({
    isOpen,
    onClose
  });

  // Autofocus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const popularSearches = [
    'Linen Column Dress',
    'Tailored Suiting',
    'Modest Edit',
    'Silk Bias Skirt',
    'Tops & Blouses',
    'Evening Gown'
  ];

  const suggestedCategories = [
    'Dresses',
    'Tops',
    'Bottoms',
    'Sets',
    'Modest Edit',
    'Scarves'
  ];

  // Predictive search query filter
  const searchResults = useMemo(() => {
    if (!query.trim()) return { products: [], articles: [] };

    const q = query.toLowerCase().trim();

    const matchedProducts = (products || []).filter((p) => {
      if (!p) return false;
      return (
        (p.name || '').toLowerCase().includes(q) ||
        (p.nameAr || '').includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.subcategory || '').toLowerCase().includes(q) ||
        (p.fabric || '').toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q) ||
        (p.tags || []).some((t) => (t || '').toLowerCase().includes(q))
      );
    });

    const matchedArticles = (articles || []).filter((a) => {
      if (!a) return false;
      return (
        (a.title || '').toLowerCase().includes(q) ||
        (a.titleAr || '').includes(q) ||
        (a.category || '').toLowerCase().includes(q) ||
        (a.excerpt || '').toLowerCase().includes(q)
      );
    });

    return { products: matchedProducts, articles: matchedArticles };
  }, [query, products, articles]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Search Catalog"
    >
      {/* 1. Backdrop (Click outside closes search) */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Top-down Elegant Search Modal / Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#FAF8F5] shadow-2xl border-b border-x border-[#EAE5DE] max-h-[90vh] flex flex-col z-10 animate-in slide-in-from-top-6 duration-200"
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-[#EAE5DE] bg-white flex items-center gap-3">
          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#1D1D1B] stroke-[1.4] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by silhouette, style, category, or occasion..."
            className="flex-1 bg-transparent font-serif text-xl sm:text-2xl text-[#1D1D1B] placeholder-[#9E968D] focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[#7C746B] hover:text-[#1D1D1B] transition-colors cursor-pointer"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center p-1.5 text-[#1D1D1B] hover:text-[#BA945A] hover:bg-[#FAF8F5] rounded-xs transition-colors cursor-pointer ml-1"
            aria-label="Close search (ESC)"
            title="Close (ESC)"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Scrollable Results / Suggestions Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          {!query.trim() ? (
            /* Suggestions & Quick Links */
            <div className="space-y-8">
              {/* Popular Searches */}
              <div>
                <span className="text-[10px] tracking-[0.24em] uppercase text-[#7C746B] font-mono block mb-3">
                  POPULAR SEARCHES
                </span>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="px-3.5 py-1.5 bg-white border border-[#D4CCC2] hover:border-[#1D1D1B] text-xs text-[#1D1D1B] transition-colors cursor-pointer rounded-xs"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse Categories */}
              <div>
                <span className="text-[10px] tracking-[0.24em] uppercase text-[#7C746B] font-mono block mb-3">
                  EXPLORE CATEGORIES
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {suggestedCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectCategory(cat);
                      }}
                      className="p-3 bg-white border border-[#EAE5DE] hover:border-[#BA945A] text-left text-xs uppercase tracking-wider text-[#1D1D1B] flex items-center justify-between transition-colors group cursor-pointer"
                    >
                      <span>{cat}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#7C746B] group-hover:text-[#BA945A] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : searchResults.products.length === 0 && searchResults.articles.length === 0 ? (
            /* No Results State */
            <div className="text-center py-12">
              <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-[#7C746B] block mb-2">
                0 RESULTS
              </span>
              <h4 className="font-serif text-2xl text-[#1D1D1B] font-light mb-2">
                No matching silhouettes found
              </h4>
              <p className="text-xs text-[#7C746B] font-light max-w-sm mx-auto mb-6">
                We couldn't find anything matching "{query}". Try checking your spelling or explore our popular categories.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestedCategories.slice(0, 4).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectCategory(cat);
                    }}
                    className="px-4 py-2 bg-white border border-[#D4CCC2] hover:border-[#1D1D1B] text-xs uppercase tracking-wider text-[#1D1D1B] transition-colors cursor-pointer"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Matching Products & Articles */
            <div className="space-y-6">
              {searchResults.products.length > 0 && (
                <div>
                  <span className="text-[10px] tracking-[0.24em] uppercase text-[#7C746B] font-mono block mb-3">
                    MATCHING PIECES ({searchResults.products.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {searchResults.products.map((product) => {
                      const img = product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop';

                      return (
                        <div
                          key={product.id}
                          onClick={() => {
                            onClose();
                            onSelectProduct(product);
                          }}
                          className="flex items-center space-x-3 p-2.5 bg-white border border-[#EAE5DE] hover:border-[#BA945A] transition-all cursor-pointer group"
                        >
                          <img
                            src={img}
                            alt={product.name}
                            className="w-14 h-18 object-cover bg-[#EAE5DE] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-[#7C746B] block">
                              {product.category}
                            </span>
                            <h5 className="font-serif text-sm text-[#1D1D1B] group-hover:text-[#BA945A] transition-colors line-clamp-1">
                              {product.name}
                            </h5>
                            <span className="font-serif text-xs text-[#1D1D1B] block mt-0.5">
                              {formatPrice(product.priceEgp, currency)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {searchResults.articles.length > 0 && (
                <div className="pt-4 border-t border-[#EAE5DE]">
                  <span className="text-[10px] tracking-[0.24em] uppercase text-[#7C746B] font-mono block mb-3">
                    EDITORIAL STORIES ({searchResults.articles.length})
                  </span>
                  <div className="space-y-2">
                    {searchResults.articles.map((article) => (
                      <div
                        key={article.id}
                        onClick={() => {
                          onClose();
                          onSelectArticle(article);
                        }}
                        className="p-3 bg-white border border-[#EAE5DE] hover:border-[#BA945A] transition-colors cursor-pointer group flex items-center justify-between"
                      >
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#BA945A] block mb-0.5">
                            {article.category}
                          </span>
                          <h5 className="font-serif text-sm text-[#1D1D1B] group-hover:text-[#BA945A] transition-colors">
                            {article.title}
                          </h5>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#7C746B] group-hover:text-[#BA945A] group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
