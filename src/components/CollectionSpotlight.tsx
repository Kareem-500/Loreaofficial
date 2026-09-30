import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Eye, Pause } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';

// Editorial photography of women in women's fashion
import violetteDressImg from '../assets/images/dress_violette_mermaid_1790546911621.jpg';
import celestineDressImg from '../assets/images/dress_celestine_mermaid_1790546921019.jpg';
import azurelleDressImg from '../assets/images/dress_azurelle_highneck_1790546930763.jpg';
import coraliaDressImg from '../assets/images/dress_coralia_feather_1790546941004.jpg';
import emeraldDressImg from '../assets/images/dress_emerald_oneshoulder_1790620905060.jpg';
import catDressesImg from '../assets/images/cat_dresses_editorial_1790620925859.jpg';
import catSetsImg from '../assets/images/cat_sets_tailored_1790620974010.jpg';
import catModestImg from '../assets/images/cat_modest_abaya_1790621001019.jpg';

interface CollectionSpotlightProps {
  products?: Product[];
  currency?: Currency;
  onProductClick: (product: Product) => void;
  onExploreCollection: () => void;
  onQuickAdd?: (product: Product) => void;
}

export const CollectionSpotlight: React.FC<CollectionSpotlightProps> = ({
  products = [],
  currency = 'EGP' as Currency,
  onProductClick,
  onExploreCollection
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredCardKey, setHoveredCardKey] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Viewport intersection trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 8 standout signature women's fashion bestsellers with creative editorial photography
  const curatedItems = useMemo(() => {
    const items: Product[] = [
      {
        id: 'lorea-01',
        name: 'Sheer Balloon Sleeve Mermaid Gown',
        category: 'Dresses',
        collection: 'Best Sellers',
        priceEgp: 23378,
        priceUsd: 475,
        badge: 'BEST SELLER',
        images: [violetteDressImg],
        subtitle: 'Sculpted evening contour with sheer balloon sleeves',
        colors: [{ name: 'Violette', hex: '#4A154B' }, { name: 'Midnight Noir', hex: '#1D1D1B' }]
      } as Product,
      {
        id: 'lorea-dress-celestine',
        name: 'Crystal Ruffled Mermaid Maxi Gown',
        category: 'Dresses',
        collection: 'Best Sellers',
        priceEgp: 22894,
        priceUsd: 465,
        badge: 'BEST SELLER',
        images: [celestineDressImg],
        subtitle: 'Cascading ruffles with hand-sewn crystal drops',
        colors: [{ name: 'Pure Ivory', hex: '#FAF9F6' }, { name: 'Celestine Blue', hex: '#9BB8CD' }]
      } as Product,
      {
        id: 'lorea-dress-azurelle',
        name: 'High Neck Flared Sleeve Column Gown',
        category: 'Dresses',
        collection: 'Best Sellers',
        priceEgp: 23665,
        priceUsd: 480,
        badge: 'BEST SELLER',
        images: [azurelleDressImg],
        subtitle: 'Statuesque sapphire silhouette with flared cuffs',
        colors: [{ name: 'Azurelle Royal', hex: '#1E3A8A' }, { name: 'Nightshade', hex: '#0B132B' }]
      } as Product,
      {
        id: 'lorea-set-ivory-tailored',
        name: 'Architectural Three-Piece Suiting',
        category: 'Coordinated Sets',
        collection: 'Best Sellers',
        priceEgp: 24500,
        priceUsd: 495,
        badge: 'BEST SELLER',
        images: [catSetsImg],
        subtitle: 'Sculpted linen waistcoat, blazer and wide trousers',
        colors: [{ name: 'Ivory Flax', hex: '#EFECE6' }, { name: 'Sand Taupe', hex: '#D7CEC7' }]
      } as Product,
      {
        id: 'lorea-dress-emerald',
        name: 'One Shoulder Draped Silk Maxi Gown',
        category: 'Dresses',
        collection: 'Best Sellers',
        priceEgp: 20765,
        priceUsd: 420,
        badge: 'BEST SELLER',
        images: [emeraldDressImg],
        subtitle: 'Grecian fluid drape with floor-skimming movement',
        colors: [{ name: 'Emerald Green', hex: '#004B23' }, { name: 'Forest Noir', hex: '#1B4332' }]
      } as Product,
      {
        id: 'lorea-dress-mediterranean-white',
        name: 'Tiered Mediterranean Cotton Gown',
        category: 'Dresses',
        collection: 'Best Sellers',
        priceEgp: 18900,
        priceUsd: 385,
        badge: 'BEST SELLER',
        images: [catDressesImg],
        subtitle: 'Breezy layered silhouette with embroidered neckline',
        colors: [{ name: 'Chalk White', hex: '#FFFFFF' }, { name: 'Alabaster', hex: '#F4EFEA' }]
      } as Product,
      {
        id: 'lorea-dress-coralia',
        name: 'Feather Cuff Embellished Sheath Gown',
        category: 'Dresses',
        collection: 'Best Sellers',
        priceEgp: 29549,
        priceUsd: 595,
        badge: 'BEST SELLER',
        images: [coraliaDressImg],
        subtitle: 'Sculptural satin sheath with ethical ostrich feathers',
        colors: [{ name: 'Coralia Pink', hex: '#FA7070' }, { name: 'Blush Gold', hex: '#F6C90E' }]
      } as Product,
      {
        id: 'lorea-abaya-layered-crepe',
        name: 'Fluid Tiered Modest Column Gown',
        category: 'Modest Edit',
        collection: 'Best Sellers',
        priceEgp: 21900,
        priceUsd: 445,
        badge: 'BEST SELLER',
        images: [catModestImg],
        subtitle: 'Voluminous tiered silhouette with cinched waistline',
        colors: [{ name: 'Desert Dune', hex: '#C2B280' }, { name: 'Onyx Noir', hex: '#1D1D1B' }]
      } as Product
    ];

    // If corresponding products exist in `products`, blend details while keeping imagery
    return items.map((item) => {
      const match = (products || []).find((p) => p.id === item.id);
      return match ? { ...match, badge: 'BEST SELLER' as const, images: item.images } : item;
    });
  }, [products]);

  // Duplicate items array to achieve a seamless, infinite auto-glide loop
  const displayItems = useMemo(() => {
    if (curatedItems.length === 0) return [];
    return [...curatedItems, ...curatedItems];
  }, [curatedItems]);

  // Faster, dynamic auto-glide animation using requestAnimationFrame
  useEffect(() => {
    if (prefersReducedMotion || !isVisible) return;

    let animationFrameId: number;
    // Increased speed: 1.4px per frame (~85px/sec) for lively, graceful motion
    const speed = 1.4;

    const autoGlide = () => {
      if (!isPaused && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        container.scrollLeft += speed;

        // Reset scroll position seamlessly when reaching half of the duplicated list
        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        }
      }
      animationFrameId = requestAnimationFrame(autoGlide);
    };

    animationFrameId = requestAnimationFrame(autoGlide);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, isVisible, prefersReducedMotion]);

  // Manual arrow navigation
  const handleManualScroll = useCallback((direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.7;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  if (!curatedItems.length) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="best-sellers-spotlight"
      className="py-16 sm:py-24 lg:py-28 bg-[#FAF8F5] border-b border-[#EAE5DE] relative overflow-hidden select-none"
      aria-label="Best Sellers Showcase"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Minimalist, Elegant Header: BEST SELLERS */}
        <div className="flex items-center justify-between mb-8 sm:mb-12 pb-4 border-b border-[#EAE5DE]/80">
          <div className="flex items-center space-x-3">
            <span className="w-6 sm:w-8 h-px bg-[#BA945A]" aria-hidden="true" />
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#1D1D1B] tracking-[0.14em] uppercase">
              BEST SELLERS
            </h2>
          </div>

          {/* Controls & Shop Link */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Status indicator pill */}
            <div
              className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 border text-[10px] tracking-[0.2em] uppercase font-mono transition-colors duration-300 ${
                isPaused
                  ? 'border-[#BA945A] bg-[#BA945A]/10 text-[#BA945A]'
                  : 'border-[#EAE5DE] bg-white text-[#7C746B]'
              }`}
            >
              {isPaused ? (
                <>
                  <Pause className="w-2.5 h-2.5 text-[#BA945A]" />
                  <span>FOCUSED</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#BA945A] animate-pulse" />
                  <span>AUTO RUNWAY</span>
                </>
              )}
            </div>

            {/* Manual Chevrons */}
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => handleManualScroll('left')}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border border-[#EAE5DE] bg-white text-[#1D1D1B] hover:border-[#BA945A] hover:text-[#BA945A] transition-colors duration-200 cursor-pointer shadow-xs active:scale-95"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleManualScroll('right')}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border border-[#EAE5DE] bg-white text-[#1D1D1B] hover:border-[#BA945A] hover:text-[#BA945A] transition-colors duration-200 cursor-pointer shadow-xs active:scale-95"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Shop All Link */}
            <button
              type="button"
              onClick={onExploreCollection}
              className="group inline-flex items-center space-x-2 text-xs tracking-[0.22em] uppercase font-medium text-[#1D1D1B] hover:text-[#BA945A] transition-colors duration-300 pb-0.5 border-b border-[#1D1D1B]/30 hover:border-[#BA945A] cursor-pointer"
            >
              <span>SHOP ALL</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          Automatic Moving Showcase with Cursor Hover Pause
         ======================================================== */}
      <div
        className="w-full relative px-4 sm:px-6 lg:px-12"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setHoveredCardKey(null);
        }}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => {
          // Resume auto-glide 1.5 seconds after touch interaction ends
          setTimeout(() => setIsPaused(false), 1500);
        }}
      >
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 sm:space-x-8 lg:space-x-10 overflow-x-auto no-scrollbar scroll-smooth py-4 cursor-grab active:cursor-grabbing"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {displayItems.map((item, index) => {
            const cardKey = `${item.id}-${index}`;
            const isHovered = hoveredCardKey === cardKey;
            const originalIndex = index % curatedItems.length;

            return (
              <article
                key={cardKey}
                onMouseEnter={() => {
                  setHoveredCardKey(cardKey);
                  setIsPaused(true);
                }}
                onMouseLeave={() => {
                  setHoveredCardKey(null);
                }}
                onClick={() => onProductClick(item)}
                className={`w-[290px] sm:w-[330px] lg:w-[360px] shrink-0 group cursor-pointer flex flex-col transition-all duration-500 ease-out bg-white p-3.5 sm:p-4 border ${
                  isHovered
                    ? 'border-[#BA945A] shadow-xl scale-[1.02] -translate-y-1.5 z-20 ring-1 ring-[#BA945A]/40'
                    : 'border-[#EAE5DE] shadow-xs hover:border-[#BA945A]/60'
                }`}
              >
                {/* Visual Area: Tall Statuesque Portrait with High-Fashion Model */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EAE5DE] mb-4 sm:mb-5 border border-[#EAE5DE]/80">
                  <img
                    src={
                      item.images?.[0] ||
                      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop'
                    }
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
                      isHovered ? 'scale-105' : 'scale-100'
                    }`}
                  />

                  {/* Harmonious BEST SELLER Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="font-mono text-[9px] tracking-[0.24em] uppercase bg-[#1D1D1B] text-[#FAF8F5] px-2.5 py-1 shadow-xs">
                      BEST SELLER
                    </span>
                  </div>

                  {/* Floating Action Trigger on Focus / Hover */}
                  <div
                    className={`absolute inset-x-3.5 bottom-3.5 z-10 transition-all duration-300 pointer-events-none ${
                      isHovered
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <div className="w-full py-2.5 bg-white/95 backdrop-blur-xs border border-[#BA945A] shadow-md text-center">
                      <span className="font-sans text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-[#1D1D1B] font-medium inline-flex items-center space-x-2">
                        <Eye className="w-3.5 h-3.5 text-[#BA945A]" />
                        <span>DISCOVER PIECE</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Information Area */}
                <div className="flex flex-col flex-1">
                  {/* Category and Index */}
                  <div className="flex items-center justify-between text-[10px] tracking-[0.22em] uppercase text-[#7C746B] mb-2 font-mono">
                    <span className={isHovered ? 'text-[#BA945A] font-semibold' : ''}>
                      0{originalIndex + 1} / 0{curatedItems.length}
                    </span>
                    <span>{item.category}</span>
                  </div>

                  {/* Product Title in Cormorant Garamond */}
                  <h3
                    className={`font-serif text-lg sm:text-xl font-light leading-snug mb-1.5 line-clamp-1 transition-colors duration-300 ${
                      isHovered ? 'text-[#BA945A]' : 'text-[#1D1D1B]'
                    }`}
                  >
                    {item.name}
                  </h3>

                  {/* Subtitle / Poetic Line */}
                  <p className="font-sans text-xs text-[#7C746B] font-light line-clamp-2 leading-relaxed mb-3">
                    {item.subtitle || item.description}
                  </p>

                  {/* Color Swatch Indicator */}
                  {item.colors && item.colors.length > 0 && (
                    <div className="flex items-center space-x-1.5 mb-3.5">
                      {item.colors.slice(0, 3).map((col, cIdx) => (
                        <span
                          key={cIdx}
                          title={col.name}
                          className="w-2.5 h-2.5 rounded-full border border-[#D4CCC2]"
                          style={{ backgroundColor: col.hex }}
                        />
                      ))}
                      {item.colors.length > 3 && (
                        <span className="text-[10px] text-[#7C746B] font-mono">
                          +{item.colors.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Bottom Line: Price & Discreet Link */}
                  <div className="mt-auto pt-3 border-t border-[#EAE5DE] flex items-center justify-between">
                    <span className="font-sans text-sm font-medium text-[#1D1D1B] tracking-tight">
                      {formatPrice(item.priceEgp, currency)}
                    </span>
                    <span
                      className={`font-sans text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 font-medium inline-flex items-center space-x-1 ${
                        isHovered ? 'text-[#BA945A]' : 'text-[#7C746B]'
                      }`}
                    >
                      <span>EXPLORE</span>
                      <ArrowRight
                        className={`w-3 h-3 transition-transform duration-300 ${
                          isHovered ? 'translate-x-1' : ''
                        }`}
                      />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
