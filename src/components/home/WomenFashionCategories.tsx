import React from 'react';
import dressesImg from '../../assets/images/cat_dresses_editorial_1790620925859.jpg';
import topsImg from '../../assets/images/cat_tops_blouse_1790620941579.jpg';
import bottomsImg from '../../assets/images/cat_bottoms_trousers_1790620960075.jpg';
import setsImg from '../../assets/images/cat_sets_tailored_1790620974010.jpg';
import scarvesImg from '../../assets/images/cat_scarves_silk_1790620987905.jpg';
import modestImg from '../../assets/images/cat_modest_abaya_1790621001019.jpg';

interface WomenFashionCategoriesProps {
  onSelectCategory: (categoryName: string) => void;
}

const CATEGORY_ITEMS = [
  {
    id: 'dresses',
    name: 'DRESSES',
    target: 'Dresses',
    image: dressesImg
  },
  {
    id: 'tops',
    name: 'TOPS',
    target: 'Tops',
    image: topsImg
  },
  {
    id: 'bottoms',
    name: 'BOTTOMS',
    target: 'Bottoms',
    image: bottomsImg
  },
  {
    id: 'sets',
    name: 'SETS',
    target: 'Sets',
    image: setsImg
  },
  {
    id: 'scarves',
    name: 'SCARVES',
    target: 'Scarves',
    image: scarvesImg
  },
  {
    id: 'modest',
    name: 'MODEST',
    target: 'Modest Edit',
    image: modestImg
  }
];

export const WomenFashionCategories: React.FC<WomenFashionCategoriesProps> = ({
  onSelectCategory
}) => {
  return (
    <section id="women-fashion" className="pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 lg:pb-20 bg-white select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header: — WOMEN FASHION — matching reference */}
        <div className="flex items-center justify-center mb-8 sm:mb-12 max-w-3xl mx-auto px-2">
          <span className="flex-1 h-px bg-[#D4CCC2]" aria-hidden="true" />
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] text-[#1D1D1B] tracking-[0.24em] uppercase font-light px-5 sm:px-8 text-center whitespace-nowrap">
            WOMEN FASHION
          </h2>
          <span className="flex-1 h-px bg-[#D4CCC2]" aria-hidden="true" />
        </div>

        {/* 6 Category Cards Grid matching reference layout and proportions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {CATEGORY_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectCategory(item.target)}
              className="group relative aspect-[3/4] w-full overflow-hidden bg-[#F6F6F6] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A]"
              aria-label={`Browse ${item.name} Collection`}
            >
              {/* Category Fashion Image */}
              <img
                src={item.image}
                alt={`LORÉA ${item.name} Collection`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Elegant Subtle Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10 opacity-75 group-hover:opacity-85 transition-opacity duration-300" />

              {/* Bottom Centered Label and Minimal Arrow matching reference */}
              <div className="absolute inset-x-0 bottom-6 sm:bottom-8 flex flex-col items-center justify-center text-center px-2 z-10">
                <span className="font-sans text-xs sm:text-[13px] tracking-[0.24em] uppercase text-white font-medium drop-shadow-xs transition-colors">
                  {item.name}
                </span>
                <span className="text-white/90 text-sm font-light mt-1.5 transform group-hover:translate-x-1.5 transition-transform duration-300">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
