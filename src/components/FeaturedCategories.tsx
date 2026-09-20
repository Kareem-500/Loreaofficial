import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../data/products';

interface FeaturedCategoriesProps {
  categories?: typeof CATEGORIES;
  onSelectCategory: (categoryName: string) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  categories = CATEGORIES,
  onSelectCategory
}) => {
  const safeCategories = Array.isArray(categories) ? categories : [];

  const categoryTarget = (id: string, name: string) => {
    if (id === 'pants') return 'Bottoms';
    if (id === 'modest-edit') return 'Modest Edit';
    return name;
  };

  return (
    <section className="py-20 sm:py-28 bg-[#F7F4EF] border-b border-[#EAE5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="text-[11px] tracking-[0.28em] uppercase text-[#7C746B] font-medium block mb-2">SHOP THE WOMEN&apos;S EDIT</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#1D1D1B]">Find Your Silhouette</h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm sm:text-base text-[#7C746B] font-light max-w-md">From fluid dresses to considered layers, discover the shapes that define your everyday wardrobe.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {safeCategories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => onSelectCategory(categoryTarget(cat.id, cat.name))}
              className="group relative aspect-4/5 overflow-hidden bg-[#EAE5DE] cursor-pointer text-left"
              aria-label={`Shop ${cat.name}`}
            >
              <img src={cat.image} alt={cat.name} loading="lazy" decoding="async" className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-end text-white">
                <span className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-[#D4CCC2] font-light mb-1">{cat.itemCount} PIECES</span>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-normal tracking-wide text-white">{cat.name.toUpperCase()}</h3>
                    <p className="text-xs text-[#B7ADA2] font-light mt-0.5 hidden sm:block">{cat.nameAr}</p>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center transform translate-y-2 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all"><ArrowUpRight className="w-4 h-4" /></span>
                </div>
                <span className="mt-3 text-[11px] tracking-[0.16em] uppercase text-[#EAE5DE] underline underline-offset-4">Shop This Edit</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
