import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product, Article, Currency } from '../types';
import { formatPrice } from '../utils/currency';

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

  const popularSearches = [
    'Linen Column Dress',
    'Giza 45 Cotton Shirt',
    'Modest Edit',
    'Silk Bias Skirt',
    'Sand Trench Coat',
    'كتان',
    'قطن مصري'
  ];

  const suggestedCategories = [
    'Dresses',
    'Tops',
    'Sets',
    'Outerwear',
    'Modest Edit'
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F7F4EF] animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header with Search Input & Close */}
        <div className="flex items-center justify-between border-b border-[#1D1D1B] pb-4 mb-10">
          <div className="flex items-center flex-1 mr-4">
            <Search className="w-6 h-6 text-[#1D1D1B] stroke-[1.5] mr-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by silhouette, Giza cotton, linen, SKU, or في العربية..."
              autoFocus
              className="w-full bg-transparent font-serif text-xl sm:text-3xl lg:text-4xl text-[#1D1D1B] placeholder-[#A0988E] focus:outline-hidden"
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#1D1D1B] hover:text-[#B88F88] transition-colors"
            aria-label="Close search"
          >
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>

        {/* Predictive Results or Default Discovery state */}
        {query.trim().length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16">
            {/* Popular Searches */}
            <div>
              <p className="text-[11px] tracking-[0.24em] uppercase text-[#7C746B] font-medium mb-4">
                POPULAR SEARCHES
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3.5 py-2 bg-[#EFECE6] hover:bg-[#EAE5DE] text-[#1D1D1B] text-xs font-light transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Categories */}
            <div>
              <p className="text-[11px] tracking-[0.24em] uppercase text-[#7C746B] font-medium mb-4">
                SUGGESTED SILHOUETTES
              </p>
              <ul className="space-y-2 text-sm text-[#1D1D1B]">
                {suggestedCategories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => {
                        onSelectCategory(cat);
                        onClose();
                      }}
                      className="hover:text-[#B88F88] hover:translate-x-1 transition-all inline-flex items-center space-x-2"
                    >
                      <span>{cat}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div>
            {/* Matching Products */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#EAE5DE]">
                <h3 className="text-xs uppercase tracking-[0.24em] text-[#7C746B] font-medium">
                  MATCHING PRODUCTS ({searchResults.products.length})
                </h3>
              </div>

              {searchResults.products.length === 0 ? (
                <p className="text-sm text-[#7C746B] font-light py-4">
                  No silhouettes found matching &quot;{query}&quot;. Try searching for &quot;Linen&quot;, &quot;Shirt&quot;, &quot;Dress&quot;, or &quot;Giza Cotton&quot;.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  {searchResults.products.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-3/4 overflow-hidden bg-[#EAE5DE] mb-2.5">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop'}
                          alt={p.name || 'Garment'}
                          className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500"
                        />
                      </div>
                      <h4 className="text-xs sm:text-sm text-[#1D1D1B] font-medium group-hover:text-[#B88F88] transition-colors line-clamp-1">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-[#7C746B] font-light mt-0.5">
                        {p.category} · {formatPrice(p.priceEgp, currency)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Matching Journal Articles */}
            {searchResults.articles.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#EAE5DE]">
                  <h3 className="text-xs uppercase tracking-[0.24em] text-[#7C746B] font-medium">
                    JOURNAL ARTICLES & STORIES ({searchResults.articles.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.articles.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        onSelectArticle(a);
                        onClose();
                      }}
                      className="p-4 bg-[#EFECE6]/60 border border-[#EAE5DE] flex gap-4 cursor-pointer hover:bg-[#EAE5DE]/80 transition-colors"
                    >
                      <img
                        src={a.image}
                        alt={a.title}
                        className="w-20 h-20 object-cover bg-[#D4CCC2] shrink-0"
                      />
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[#B88F88] font-medium">
                          {a.category}
                        </span>
                        <h4 className="font-serif text-sm font-normal text-[#1D1D1B] line-clamp-1 mt-0.5">
                          {a.title}
                        </h4>
                        <p className="text-xs text-[#7C746B] line-clamp-2 mt-1 font-light">
                          {a.excerpt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
