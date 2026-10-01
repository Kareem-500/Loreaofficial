import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Clock, BookOpen } from 'lucide-react';
import { Article } from '../types';
import { ARTICLES } from '../data/journal';

interface JournalSectionProps {
  onSelectArticle: (article: Article) => void;
  onViewAllArticles: () => void;
}

export const JournalSection: React.FC<JournalSectionProps> = ({
  onSelectArticle,
  onViewAllArticles
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  // Cleanup pause timers
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
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

  // Duplicate articles array for seamless infinite auto-glide loop
  const displayArticles = useMemo(() => {
    if (!ARTICLES || ARTICLES.length === 0) return [];
    return [...ARTICLES, ...ARTICLES];
  }, []);

  // Dynamic auto-glide animation matching CollectionSpotlight speed and mechanics
  useEffect(() => {
    if (prefersReducedMotion || !isVisible) return;

    let animationFrameId: number;
    const speed = 2.4; // lively, smooth editorial pace

    const autoGlide = () => {
      if (!isPaused && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        container.scrollLeft += speed;

        // Reset scroll position seamlessly when reaching half of the duplicated list
        const halfWidth = container.scrollWidth / 2;
        if (halfWidth > 0 && container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        }
      }
      animationFrameId = requestAnimationFrame(autoGlide);
    };

    animationFrameId = requestAnimationFrame(autoGlide);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, isVisible, prefersReducedMotion]);

  // Helper to resume auto-scroll after user interaction
  const resumeAfterDelay = useCallback((delayMs = 3500) => {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, delayMs);
  }, []);

  // Manual arrow navigation with wrap-around support and smooth animation
  const handleManualScroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;

    // Immediately pause auto-glide so it doesn't fight the smooth scroll
    setIsPaused(true);

    const halfWidth = container.scrollWidth / 2;
    // Step by approximately one card width + gap
    const cardEl = container.querySelector('article');
    const step = cardEl ? cardEl.getBoundingClientRect().width + 32 : 380;

    if (direction === 'left') {
      if (container.scrollLeft <= 20) {
        container.scrollLeft += halfWidth;
      }
      container.scrollBy({
        left: -step,
        behavior: 'smooth'
      });
    } else {
      if (container.scrollLeft >= halfWidth) {
        container.scrollLeft -= halfWidth;
      }
      container.scrollBy({
        left: step,
        behavior: 'smooth'
      });
    }

    resumeAfterDelay(3500);
  }, [resumeAfterDelay]);

  if (!ARTICLES.length) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="articles-spotlight"
      className="py-16 sm:py-24 lg:py-28 bg-[#FAF8F5] border-b border-[#EAE5DE] relative overflow-hidden select-none"
      aria-label="Articles Editorial Showcase"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Minimalist Centered Header: ARTICLES */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center space-x-3 sm:space-x-4">
            <span className="w-8 sm:w-12 h-px bg-[#BA945A]" aria-hidden="true" />
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#1D1D1B] tracking-[0.16em] uppercase">
              ARTICLES
            </h2>
            <span className="w-8 sm:w-12 h-px bg-[#BA945A]" aria-hidden="true" />
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
          resumeAfterDelay(2000);
        }}
      >
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 sm:space-x-8 lg:space-x-10 overflow-x-auto no-scrollbar py-4 cursor-grab active:cursor-grabbing"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {displayArticles.map((article, index) => {
            const cardKey = `${article.id}-${index}`;
            const isHovered = hoveredCardKey === cardKey;
            const originalIndex = index % ARTICLES.length;

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
                onClick={() => onSelectArticle(article)}
                className={`w-[300px] sm:w-[350px] lg:w-[380px] shrink-0 group cursor-pointer flex flex-col transition-all duration-500 ease-out bg-white p-4 border ${
                  isHovered
                    ? 'border-[#BA945A] shadow-xl scale-[1.02] -translate-y-1.5 z-20 ring-1 ring-[#BA945A]/40'
                    : 'border-[#EAE5DE] shadow-xs hover:border-[#BA945A]/60'
                }`}
              >
                {/* Visual Area: Editorial Photography */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EAE5DE] mb-4 sm:mb-5 border border-[#EAE5DE]/80">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
                      isHovered ? 'scale-106' : 'scale-100'
                    }`}
                  />

                  {/* Category Tag Overlay */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="font-mono text-[9px] tracking-[0.24em] uppercase bg-[#1D1D1B] text-[#FAF8F5] px-2.5 py-1 shadow-xs">
                      {article.category}
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
                        <BookOpen className="w-3.5 h-3.5 text-[#BA945A]" />
                        <span>READ ARTICLE</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Information Area */}
                <div className="flex flex-col flex-1">
                  {/* Date & Read Time */}
                  <div className="flex items-center justify-between text-[10px] tracking-[0.22em] uppercase text-[#7C746B] mb-2 font-mono">
                    <span className={isHovered ? 'text-[#BA945A] font-semibold' : ''}>
                      0{originalIndex + 1} / 0{ARTICLES.length}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 opacity-60 mr-1" />
                      {article.readTime}
                    </span>
                  </div>

                  {/* Article Title in Cormorant Garamond */}
                  <h3
                    className={`font-serif text-lg sm:text-xl font-light leading-snug mb-2 line-clamp-2 transition-colors duration-300 ${
                      isHovered ? 'text-[#BA945A]' : 'text-[#1D1D1B]'
                    }`}
                  >
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="font-sans text-xs text-[#7C746B] font-light line-clamp-3 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>

                  {/* Bottom Line: Read Story Link */}
                  <div className="mt-auto pt-3 border-t border-[#EAE5DE] flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#7C746B] tracking-wider uppercase">
                      {article.date}
                    </span>
                    <span
                      className={`font-sans text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 font-medium inline-flex items-center space-x-1 ${
                        isHovered ? 'text-[#BA945A]' : 'text-[#7C746B]'
                      }`}
                    >
                      <span>READ STORY</span>
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

      {/* ========================================================
          Centered Controls & ARTICLES Link Displayed Down Below
         ======================================================== */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-center space-x-4 sm:space-x-6 mt-8 sm:mt-12">
          {/* Previous Chevron Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleManualScroll('left');
            }}
            className="w-11 h-11 flex items-center justify-center border border-[#1D1D1B] bg-white text-[#1D1D1B] hover:bg-[#1D1D1B] hover:text-white transition-all duration-200 cursor-pointer shadow-xs active:scale-90 select-none"
            aria-label="Previous article"
          >
            <ChevronLeft className="w-5 h-5 pointer-events-none" />
          </button>

          {/* ARTICLES Action Button */}
          <button
            type="button"
            onClick={onViewAllArticles}
            className="group inline-flex items-center space-x-2.5 px-8 py-3 border border-[#1D1D1B] bg-[#1D1D1B] text-white hover:bg-[#BA945A] hover:border-[#BA945A] text-xs tracking-[0.22em] uppercase font-medium transition-all duration-300 cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <span>ARTICLES</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {/* Next Chevron Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleManualScroll('right');
            }}
            className="w-11 h-11 flex items-center justify-center border border-[#1D1D1B] bg-white text-[#1D1D1B] hover:bg-[#1D1D1B] hover:text-white transition-all duration-200 cursor-pointer shadow-xs active:scale-90 select-none"
            aria-label="Next article"
          >
            <ChevronRight className="w-5 h-5 pointer-events-none" />
          </button>
        </div>
      </div>
    </section>
  );
};
