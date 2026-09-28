import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Product, Currency } from '../../types';
import { ProductCard } from '../ProductCard';

export interface CategoryProductCarouselProps {
  id?: string;
  title: string;
  subtitle: string;
  products: Product[];
  currency: Currency;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onQuickAdd: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL') => void;
  onProductClick: (product: Product) => void;
  onViewAll: () => void;
  moreText?: string;
  onOpenTryOn?: (product: Product) => void;
}

export const CategoryProductCarousel: React.FC<CategoryProductCarouselProps> = ({
  id,
  title,
  subtitle,
  products,
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onProductClick,
  onViewAll,
  moreText = 'MORE',
  onOpenTryOn
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <section id={id} className="pt-10 sm:pt-14 pb-12 sm:pb-16 bg-white select-none">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Title and Subtitle with elegant flanking divider lines */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] text-[#1D1D1B] tracking-[0.22em] uppercase font-light">
            {title}
          </h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="w-8 sm:w-12 h-px bg-[#D4CCC2]" aria-hidden="true" />
            <span className="font-sans text-[11px] sm:text-xs text-[#7C746B] tracking-[0.3em] uppercase font-light">
              {subtitle}
            </span>
            <span className="w-8 sm:w-12 h-px bg-[#D4CCC2]" aria-hidden="true" />
          </div>
        </div>

        {/* Horizontal Carousel with Minimal Left and Right Arrows */}
        <div className="relative flex items-center group/carousel">
          {/* Left Minimal Arrow */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label={`Previous items in ${title}`}
            className={`absolute -left-2 sm:-left-4 lg:-left-6 z-20 w-9 h-14 sm:w-11 sm:h-16 flex items-center justify-center text-[#1D1D1B] hover:text-[#BA945A] bg-white/90 backdrop-blur-xs transition-all duration-300 cursor-pointer ${
              canScrollLeft ? 'opacity-90 hover:opacity-100 hover:scale-110' : 'opacity-20 pointer-events-none'
            }`}
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.2]" />
          </button>

          {/* Carousel Scroll Track — strictly ONE horizontal row */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="w-full flex overflow-x-auto scroll-smooth scrollbar-none gap-3 sm:gap-4 lg:gap-5 pb-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="snap-start shrink-0 w-[calc(50%-6px)] min-[430px]:w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-15px)] xl:w-[calc(20%-16px)]"
              >
                <ProductCard
                  product={product}
                  currency={currency}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onQuickAdd={onQuickAdd}
                  onClick={onProductClick}
                  onOpenTryOn={onOpenTryOn}
                />
              </div>
            ))}
          </div>

          {/* Right Minimal Arrow */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label={`Next items in ${title}`}
            className={`absolute -right-2 sm:-right-4 lg:-right-6 z-20 w-9 h-14 sm:w-11 sm:h-16 flex items-center justify-center text-[#1D1D1B] hover:text-[#BA945A] bg-white/90 backdrop-blur-xs transition-all duration-300 cursor-pointer ${
              canScrollRight ? 'opacity-90 hover:opacity-100 hover:scale-110' : 'opacity-20 pointer-events-none'
            }`}
          >
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.2]" />
          </button>
        </div>

        {/* Centered Minimal MORE Button matching reference */}
        <div className="flex justify-center mt-10 sm:mt-12">
          <button
            type="button"
            onClick={onViewAll}
            className="group px-10 sm:px-14 py-3 sm:py-3.5 bg-white text-[#1D1D1B] border border-[#1D1D1B] hover:bg-[#1D1D1B] hover:text-white transition-all duration-300 font-sans text-xs sm:text-[13px] tracking-[0.24em] uppercase font-light inline-flex items-center space-x-2.5 cursor-pointer rounded-none active:scale-[0.99]"
          >
            <span>{moreText}</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300 text-sm font-normal">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};
