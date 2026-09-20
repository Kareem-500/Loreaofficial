import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface CollectionSpotlightProps {
  products?: Product[];
  currency?: Currency;
  onProductClick: (product: Product) => void;
  onExploreCollection: () => void;
}

export const CollectionSpotlight: React.FC<CollectionSpotlightProps> = ({
  products = [],
  currency = 'EGP' as Currency,
  onProductClick,
  onExploreCollection
}) => {
  // Spotlight 3 standout pieces safely
  const spotlightItems = (products || []).slice(0, 3);

  return (
    <section className="py-20 sm:py-28 bg-[#EFECE6] border-b border-[#EAE5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#7C746B] font-medium block mb-2">
              THE LOREA FABRIC STORY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#1D1D1B]">
              Giza 45, Made Modern
            </h2>
          </div>
          <button
            onClick={onExploreCollection}
            className="mt-4 md:mt-0 text-xs tracking-[0.2em] uppercase font-medium text-[#1D1D1B] hover:text-[#B88F88] pb-1 border-b border-[#1D1D1B] hover:border-[#B88F88] transition-all flex items-center space-x-2"
          >
            <span>SHOP THE FULL EDIT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3-card spotlight with larger editorial presence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {spotlightItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onProductClick(item)}
              className="group cursor-pointer bg-[#F7F4EF] p-4 sm:p-5 flex flex-col justify-between transition-all duration-500 hover:shadow-lg"
            >
              <div className="relative aspect-3/4 overflow-hidden bg-[#EAE5DE] mb-5">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop'}
                  alt={item.name || 'Atelier Garment'}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
                />
                {item.badge && (
                  <span className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.2em] bg-[#1D1D1B] text-[#F7F4EF] px-2 py-0.5">
                    {item.badge}
                  </span>
                )}
              </div>

              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#7C746B] mb-1 font-medium">
                  {item.category} · {item.collection}
                </p>
                <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1D1D1B] group-hover:text-[#B88F88] transition-colors mb-2">
                  {item.name}
                </h3>
                <p className="text-xs text-[#7C746B] font-light line-clamp-2 mb-3">
                  {item.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-[#EAE5DE]">
                  <span className="text-sm font-medium text-[#1D1D1B]">
                    {formatPrice(item.priceEgp, currency)}
                  </span>
                  <span className="text-[11px] tracking-[0.16em] uppercase text-[#B88F88] font-medium group-hover:underline">
                    Discover Piece →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
