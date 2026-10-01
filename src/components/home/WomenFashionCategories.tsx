import React, { useRef, useState, useEffect } from 'react';
import dressesImg from '../../assets/images/cat_dresses_editorial_1790620925859.jpg';
import topsImg from '../../assets/images/cat_tops_blouse_1790620941579.jpg';
import bottomsImg from '../../assets/images/cat_bottoms_trousers_1790620960075.jpg';
import setsImg from '../../assets/images/cat_sets_tailored_1790620974010.jpg';
import scarvesImg from '../../assets/images/cat_scarves_silk_1790620987905.jpg';
import modestImg from '../../assets/images/cat_modest_abaya_1790621001019.jpg';
import { ProgressiveFashionImage } from '../ui/ProgressiveFashionImage';

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
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="women-fashion"
      className="pt-14 sm:pt-20 pb-14 sm:pb-20 bg-white select-none overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header: Animated expanding hairlines */}
        <div className="flex items-center justify-center mb-10 sm:mb-14 max-w-2xl mx-auto px-2">
          <span
            className="flex-1 h-px bg-[#D4CCC2] transition-all duration-1000 ease-out origin-right"
            style={{
              transform: isInView ? 'scaleX(1)' : 'scaleX(0.2)',
              opacity: isInView ? 1 : 0.3
            }}
            aria-hidden="true"
          />
          <h2
            className="font-serif text-2xl sm:text-3xl lg:text-[34px] text-[#1D1D1B] tracking-[0.24em] uppercase font-light px-5 sm:px-8 text-center whitespace-nowrap transition-all duration-700 ease-out"
            style={{
              transform: isInView ? 'translateY(0)' : 'translateY(12px)',
              opacity: isInView ? 1 : 0
            }}
          >
            WOMEN FASHION
          </h2>
          <span
            className="flex-1 h-px bg-[#D4CCC2] transition-all duration-1000 ease-out origin-left"
            style={{
              transform: isInView ? 'scaleX(1)' : 'scaleX(0.2)',
              opacity: isInView ? 1 : 0.3
            }}
            aria-hidden="true"
          />
        </div>

        {/* 6 Category Cards: Staggered entrance */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
          {CATEGORY_ITEMS.map((item, index) => {
            const delay = index * 80;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectCategory(item.target)}
                className="group relative aspect-[3/4] w-full overflow-hidden bg-[#F6F6F6] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] transition-all duration-700 ease-out active:scale-[0.98]"
                style={{
                  transform: isInView ? 'translate3d(0, 0, 0)' : 'translate3d(0, 24px, 0)',
                  opacity: isInView ? 1 : 0,
                  transitionDelay: `${delay}ms`
                }}
                aria-label={`Browse ${item.name} Collection`}
              >
                {/* Progressive Blur-to-Sharp Image */}
                <ProgressiveFashionImage
                  src={item.image}
                  alt={`LORÉA ${item.name} Collection`}
                  aspectRatioClass="aspect-[3/4]"
                  hoverZoom={true}
                />

                {/* Elegant Subtle Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 opacity-75 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none" />

                {/* Bottom Centered Label and Minimal Arrow */}
                <div className="absolute inset-x-0 bottom-6 sm:bottom-8 flex flex-col items-center justify-center text-center px-2 z-10 pointer-events-none">
                  <span className="font-sans text-xs sm:text-[13px] tracking-[0.24em] uppercase text-white font-medium drop-shadow-xs transition-colors">
                    {item.name}
                  </span>
                  <span className="text-white/90 text-sm font-light mt-1.5 transform group-hover:translate-x-1.5 transition-transform duration-300">
                    →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
