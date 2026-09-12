import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../data/products';

interface FeaturedCategoriesProps {
  onSelectCategory: (categoryName: string) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-20 sm:py-28 bg-[#F7F4EF] border-b border-[#EAE5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="text-[11px] tracking-[0.28em] uppercase text-[#7C746B] font-medium block mb-2">
              DISCOVER BY SILHOUETTE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#1D1D1B]">
              Featured Categories
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm sm:text-base text-[#7C746B] font-light max-w-md">
            Architectural tailoring, pure linens, and Giza cotton essentials sculpted for effortless distinction.
          </p>
        </div>

        {/* Categories Grid - 6 editorial cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="group relative aspect-4/5 overflow-hidden bg-[#EAE5DE] cursor-pointer"
            >
              {/* Image with subtle zoom */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Content Positioned at Bottom */}
              <div className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-end text-white">
                <span className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-[#D4CCC2] font-light mb-1">
                  {cat.itemCount} PIECES
                </span>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-normal tracking-wide text-white group-hover:text-[#F7F4EF] transition-colors">
                      {cat.name.toUpperCase()}
                    </h3>
                    <p className="text-xs text-[#B7ADA2] font-light mt-0.5 hidden sm:block">
                      {cat.nameAr}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center transform translate-y-2 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 group-hover:bg-white group-hover:text-[#1D1D1B] transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-3 overflow-hidden max-h-0 group-hover:max-h-12 transition-all duration-500 ease-in-out">
                  <span className="text-[11px] tracking-[0.16em] uppercase text-[#EAE5DE] underline underline-offset-4">
                    Explore Silhouettes
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
