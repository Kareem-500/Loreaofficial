import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Product, Currency } from '../types';
import { PRODUCTS } from '../data/products';

import storyNileImg from '../assets/images/story_nile_mediterranean_1790622900084.jpg';
import storyCraftImg from '../assets/images/story_craft_detail_1790622915822.jpg';
import storyWomanImg from '../assets/images/story_woman_editorial_1790622929398.jpg';
import storyManifestoImg from '../assets/images/story_manifesto_scene_1790622942539.jpg';
import catTopsImg from '../assets/images/cat_tops_blouse_1790620941579.jpg';
import catSetsImg from '../assets/images/cat_sets_tailored_1790620974010.jpg';

export interface BrandStoryProps {
  onNavigateStore?: () => void;
  onExploreCollection?: () => void;
  onProductClick?: (product: Product) => void;
  currency?: Currency;
  onNavigateStory?: () => void;
  isHomePage?: boolean;
}

// 4 Principles with interactive preview imagery
const PRINCIPLES = [
  {
    number: '01',
    title: 'CRAFT',
    description: 'Thoughtful construction and considered finishing.',
    detail: 'Every seam, bias cut, and hemline is constructed by master artisans in Cairo, celebrating techniques passed through generations.',
    image: storyCraftImg,
    tag: 'Atelier Execution'
  },
  {
    number: '02',
    title: 'MATERIAL',
    description: 'Fabrics selected for texture, movement and everyday wear.',
    detail: 'We exclusively source genuine Egyptian extra-long staple Giza cotton, pure European flax linen, and heavy 22-momme mulberry silks.',
    image: catTopsImg,
    tag: 'Noble Fibers'
  },
  {
    number: '03',
    title: 'ORIGIN',
    description: 'Proudly rooted in Egypt and inspired by its visual culture.',
    detail: 'Drawing from the geometry of Mediterranean shores and the tranquility of the Nile to design garments with an enduring sense of place.',
    image: storyNileImg,
    tag: 'Cultural Heritage'
  },
  {
    number: '04',
    title: 'INTENTION',
    description: 'Designing fewer, more meaningful pieces with purpose.',
    detail: 'Rejecting fast fashion cycles in favor of intentional small-batch capsules designed to be cherished across years and occasions.',
    image: catSetsImg,
    tag: 'Conscious Design'
  }
];

interface StoryContinuationSectionProps {
  onDiscoverStory: () => void;
  prefersReducedMotion: boolean;
}

const StoryContinuationSection: React.FC<StoryContinuationSectionProps> = ({
  onDiscoverStory,
  prefersReducedMotion
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="story-continuation"
      className="py-20 sm:py-28 lg:py-36 bg-[#FAF9F6] border-b border-[#EAE5DE] relative overflow-hidden select-none"
      aria-label="The Story Continuation"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Asymmetrical Left Typography Column (5 cols) */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center">
            {/* Small Editorial Eyebrow */}
            <div
              className={`transition-all duration-700 ease-out ${
                isVisible || prefersReducedMotion
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-3'
              }`}
            >
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <span className="w-8 h-px bg-[#BA945A]" aria-hidden="true" />
                <span className="font-sans text-[11px] sm:text-xs tracking-[0.32em] uppercase text-[#BA945A] font-medium">
                  THE STORY
                </span>
              </div>
            </div>

            {/* Refined Headline */}
            <h2
              className={`font-serif text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-light text-[#1D1D1B] leading-[1.14] tracking-[-0.01em] mb-6 transition-all duration-700 delay-150 ease-out ${
                isVisible || prefersReducedMotion
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              More Than What You Wear.
            </h2>

            {/* Concise Story Paragraph */}
            <p
              className={`font-sans text-[15px] sm:text-[16px] lg:text-[17px] text-[#55504A] font-light leading-[1.8] max-w-xl mb-6 transition-all duration-700 delay-300 ease-out ${
                isVisible || prefersReducedMotion
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              LORÉA was created around a simple idea — that elegance should feel effortless. A modern expression of femininity, shaped by thoughtful details, refined silhouettes, and pieces designed to become part of your own story.
            </p>

            {/* Quiet Editorial Detail */}
            <div
              className={`pt-6 border-t border-[#EAE5DE] mb-8 transition-all duration-700 delay-450 ease-out ${
                isVisible || prefersReducedMotion
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              <blockquote className="font-serif italic text-base sm:text-lg text-[#1D1D1B]/80 font-light">
                “Designed around her presence, her movement, and her individuality.”
              </blockquote>
            </div>

            {/* Subtle Editorial CTA Text Link */}
            <div
              className={`transition-all duration-700 delay-600 ease-out ${
                isVisible || prefersReducedMotion
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-3'
              }`}
            >
              <button
                type="button"
                onClick={onDiscoverStory}
                className="group inline-flex items-center space-x-3 text-xs sm:text-[13px] tracking-[0.28em] uppercase text-[#1D1D1B] hover:text-[#BA945A] transition-colors duration-300 font-medium cursor-pointer border-b border-[#1D1D1B]/30 hover:border-[#BA945A] pb-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A]"
                aria-label="Discover our story"
              >
                <span>DISCOVER OUR STORY</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5 stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* Asymmetrical Right Visual Area (7 cols) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div
              className={`relative max-w-[620px] mx-auto lg:ml-auto transition-all duration-1000 delay-200 ease-out ${
                isVisible || prefersReducedMotion
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-[0.98] translate-y-6'
              }`}
            >
              {/* Background Architectural Offset Border */}
              <div
                className="hidden sm:block absolute -inset-2 sm:-inset-3 bg-[#EAE5DE]/60 pointer-events-none transform translate-x-2 translate-y-2 sm:translate-x-3 sm:translate-y-3"
                aria-hidden="true"
              />

              {/* Editorial Fashion Photography of LORÉA Woman */}
              <div className="relative aspect-4/5 sm:aspect-16/11 lg:aspect-4/3 w-full overflow-hidden bg-[#EAE5DE] shadow-sm border border-[#EAE5DE] group">
                <img
                  src={storyWomanImg}
                  alt="LORÉA woman moving with effortless confidence in contemporary silhouette"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-103"
                />

                {/* Subtle Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Subtle Floating Editorial Caption */}
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 border border-[#EAE5DE] shadow-xs z-10">
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.26em] uppercase text-[#1D1D1B] font-medium">
                    CHAPTER I · THE WOMAN & THE SILHOUETTE
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export const BrandStory: React.FC<BrandStoryProps> = ({
  onNavigateStore,
  onExploreCollection,
  onProductClick,
  currency = 'EGP',
  onNavigateStory,
  isHomePage = false
}) => {
  const [activePrinciple, setActivePrinciple] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Smooth scroll helper
  const scrollToChapterOne = () => {
    const el = document.getElementById('story-chapter-01');
    if (el) {
      el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  const handleCtaClick = () => {
    if (onNavigateStore) {
      onNavigateStore();
    } else if (onExploreCollection) {
      onExploreCollection();
    }
  };

  const handleDiscoverStory = () => {
    if (onNavigateStory) {
      onNavigateStory();
    } else if (onNavigateStore) {
      onNavigateStore();
    } else if (onExploreCollection) {
      onExploreCollection();
    }
  };

  // 3 Curated pieces for "FROM THE STORY"
  const curatedStoryProducts = PRODUCTS.filter(
    (p) => p.id === 'lorea-01' || p.id === 'lorea-02' || p.id === 'lorea-dress-emerald'
  ).slice(0, 3);

  const formatPrice = (egp: number, usd: number) => {
    if (currency === 'USD') return `$${usd}`;
    if (currency === 'EUR') return `€${Math.round(usd * 0.92)}`;
    if (currency === 'AED') return `AED ${Math.round(usd * 3.67)}`;
    return `LE ${egp.toLocaleString()}`;
  };

  if (isHomePage) {
    return (
      <article className="bg-[#FAF8F5] text-[#1D1D1B] overflow-hidden select-none selection:bg-[#BA945A]/20">
        {/* ========================================================
            1. LORÉA VISUAL MANIFESTO: Dramatic Full-Width Scene
           ======================================================== */}
        <section className="relative min-h-[75vh] flex items-center justify-center py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
          {/* Full-width Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={storyManifestoImg}
              alt="LORÉA Visual Manifesto"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
          </div>

          {/* Centered Typographic Overlay */}
          <div className="relative z-10 max-w-4xl mx-auto text-center text-white px-4">
            <span className="font-serif text-3xl sm:text-4xl tracking-[0.34em] uppercase text-[#F7F4EF] font-light block mb-6 drop-shadow-sm">
              LORÉA
            </span>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light leading-[1.3] mb-8 text-[#FAF9F6] max-w-3xl mx-auto drop-shadow-sm">
              “Modern Egyptian fashion,
              <br className="hidden sm:inline" />
              <span className="italic font-normal"> made for the woman who defines her own way.”</span>
            </h2>

            <div className="mt-8 sm:mt-10">
              <button
                type="button"
                onClick={handleDiscoverStory}
                className="group inline-flex items-center space-x-3 px-10 sm:px-14 py-4 bg-white text-[#1D1D1B] hover:bg-[#BA945A] hover:text-white transition-all duration-300 font-sans text-xs tracking-[0.28em] uppercase font-medium cursor-pointer rounded-none active:scale-[0.99] shadow-lg"
              >
                <span>DISCOVER LORÉA</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. THE STORY CONTINUATION: More Than What You Wear
           ======================================================== */}
        <StoryContinuationSection
          onDiscoverStory={handleDiscoverStory}
          prefersReducedMotion={prefersReducedMotion}
        />
      </article>
    );
  }

  return (
    <article className="bg-[#FAF8F5] text-[#1D1D1B] overflow-hidden select-none selection:bg-[#BA945A]/20">
      {/* ========================================================
          1. NEW STORY HERO: Spacious, Immersive & Editorial
         ======================================================== */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex flex-col justify-between pt-16 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-12 border-b border-[#EAE5DE]">
        {/* Background Subtle Ambience */}
        <div className="absolute inset-0 bg-radial from-[#F4EFE6]/60 via-[#FAF8F5] to-[#FAF8F5] pointer-events-none" />

        {/* Hero Top Content */}
        <div className="relative z-10 max-w-[1440px] mx-auto w-full">
          <div className="max-w-4xl">
            {/* Small Eyebrow */}
            <span className="font-sans text-[11px] sm:text-xs tracking-[0.38em] uppercase text-[#BA945A] font-medium block mb-4 sm:mb-6">
              THE STORY OF LORÉA
            </span>

            {/* Large Editorial Headline with responsive typography */}
            <h1 className="font-serif text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[1.06] font-light tracking-[-0.01em] text-[#1D1D1B] mb-6 sm:mb-8">
              Born by the Nile.
              <br />
              <span className="italic font-normal text-[#1D1D1B]/90">Made for Her.</span>
            </h1>

            {/* Editorial Lead Paragraph */}
            <p className="font-sans text-base sm:text-lg lg:text-[19px] text-[#55504A] font-light leading-[1.75] max-w-2xl">
              LORÉA began with a simple belief — that contemporary women deserve clothing that feels as effortless as it looks. Rooted in Egypt and shaped by a modern perspective, we create pieces that move naturally between everyday life, quiet moments and unforgettable occasions.
            </p>
          </div>
        </div>

        {/* Hero Overlapping Image Composition */}
        <div className="relative z-10 max-w-[1440px] mx-auto w-full my-8 sm:my-12">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            {/* Primary Large Editorial Hero Visual */}
            <div className="lg:col-span-8 overflow-hidden aspect-16/10 sm:aspect-21/10 bg-[#EAE5DE] shadow-sm group">
              <img
                src={storyNileImg}
                alt="LORÉA Nile Sanctuary Editorial"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-102"
              />
            </div>

            {/* Secondary Floating Accent Card */}
            <div className="lg:col-span-4 bg-white p-6 sm:p-8 border border-[#EAE5DE] shadow-xs lg:-ml-12 lg:mb-8 relative z-20">
              <span className="font-sans text-[10px] tracking-[0.28em] uppercase text-[#7C746B] block mb-2 font-medium">
                BRAND ESSENCE
              </span>
              <p className="font-serif text-lg sm:text-xl text-[#1D1D1B] font-light leading-relaxed mb-3">
                “Quiet luxury rooted in Egyptian heritage, reimagined for the modern global silhouette.”
              </p>
              <div className="flex items-center space-x-3 text-xs text-[#7C746B]">
                <span className="w-6 h-px bg-[#BA945A]" />
                <span className="tracking-wider uppercase text-[10px]">Cairo · Alexandria · Global</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Bottom Minimal Action Link */}
        <div className="relative z-10 max-w-[1440px] mx-auto w-full flex justify-between items-end pt-4">
          <button
            type="button"
            onClick={scrollToChapterOne}
            className="group inline-flex items-center space-x-3 text-xs tracking-[0.26em] uppercase text-[#1D1D1B] hover:text-[#BA945A] transition-colors cursor-pointer py-2"
            aria-label="Scroll down to explore story"
          >
            <span className="font-medium">EXPLORE OUR STORY</span>
            <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" />
          </button>

          <span className="hidden sm:inline font-mono text-[10px] tracking-[0.28em] uppercase text-[#A3998F]">
            CHAPTERS 01 — 04
          </span>
        </div>
      </section>

      {/* ========================================================
          2. CHAPTER 01: THE BEGINNING
         ======================================================== */}
      <section id="story-chapter-01" className="py-20 sm:py-32 border-b border-[#EAE5DE] relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Chapter Header */}
          <div className="flex items-center space-x-4 mb-10 sm:mb-16">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#BA945A] font-medium">
              CHAPTER 01
            </span>
            <span className="w-12 h-px bg-[#D4CCC2]" />
            <span className="font-sans text-xs tracking-[0.26em] uppercase text-[#7C746B]">
              THE BEGINNING
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Story Text Column */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1D1D1B] leading-tight mb-6">
                Born Between Nile & Mediterranean Light
              </h2>
              <div className="space-y-4 font-sans text-base sm:text-[17px] text-[#55504A] font-light leading-relaxed">
                <p>
                  LORÉA was founded in Egypt with a clear intention: to create modern women’s fashion with a sense of place.
                </p>
                <p>
                  Inspired by Cairo’s energy, the calm of the Nile and the visual language of the Mediterranean, every collection begins with the woman herself — how she moves, lives and expresses her individuality.
                </p>
              </div>

              {/* Editorial Pull Quote */}
              <div className="mt-8 pt-8 border-t border-[#EAE5DE]">
                <blockquote className="font-serif italic text-lg sm:text-xl text-[#1D1D1B]/90 font-light">
                  “A quiet balance of Egyptian grace and clean architectural form.”
                </blockquote>
              </div>
            </div>

            {/* Editorial Image Column with Clip & Parallax Polish */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative aspect-4/3 sm:aspect-16/10 overflow-hidden bg-[#EAE5DE] shadow-sm">
                <img
                  src={storyNileImg}
                  alt="Mediterranean and Nile inspiration for LORÉA"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out hover:scale-103"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 text-[10px] tracking-[0.24em] uppercase text-[#1D1D1B] font-mono">
                  FIG. 01 — THE NILE HORIZON
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. CHAPTER 02: THE CRAFT
         ======================================================== */}
      <section className="py-20 sm:py-32 bg-white border-b border-[#EAE5DE] relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Chapter Header */}
          <div className="flex items-center space-x-4 mb-10 sm:mb-16">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#BA945A] font-medium">
              CHAPTER 02
            </span>
            <span className="w-12 h-px bg-[#D4CCC2]" />
            <span className="font-sans text-xs tracking-[0.26em] uppercase text-[#7C746B]">
              THE CRAFT
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Visual: Macro Tailoring & Stitching */}
            <div className="lg:col-span-7">
              <div className="relative aspect-4/3 sm:aspect-16/11 overflow-hidden bg-[#EAE5DE] shadow-sm group">
                <img
                  src={storyCraftImg}
                  alt="LORÉA hand-stitching and fabric cutting in Cairo atelier"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-103"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 text-[10px] tracking-[0.24em] uppercase text-[#1D1D1B] font-mono">
                  FIG. 02 — THE ATELIER BENCH
                </div>
              </div>
            </div>

            {/* Story Text Column */}
            <div className="lg:col-span-5">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1D1D1B] leading-tight mb-6">
                Made With Intention
              </h2>
              <div className="space-y-4 font-sans text-base sm:text-[17px] text-[#55504A] font-light leading-relaxed mb-8">
                <p>
                  From fabric selection to the smallest finishing detail, LORÉA believes that beautiful clothing begins with thoughtful construction.
                </p>
                <p>
                  We work with carefully selected materials and skilled local craftsmanship to create pieces that feel considered, wearable and lasting.
                </p>
              </div>

              {/* Craft Pillars as Unboxed Clean Typography (Zero-Pills Discipline) */}
              <div className="border-t border-[#EAE5DE] pt-6 space-y-4">
                <div className="flex items-start space-x-3 text-sm text-[#1D1D1B]">
                  <span className="text-[#BA945A] font-serif font-normal">—</span>
                  <div>
                    <span className="font-medium text-xs tracking-wider uppercase block text-[#1D1D1B]">
                      Hand-Finished French Seams
                    </span>
                    <span className="text-xs text-[#7C746B] font-light">
                      Clean interior construction that feels gentle against skin.
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-sm text-[#1D1D1B]">
                  <span className="text-[#BA945A] font-serif font-normal">—</span>
                  <div>
                    <span className="font-medium text-xs tracking-wider uppercase block text-[#1D1D1B]">
                      Pure Egyptian Extra-Long Staple Cotton
                    </span>
                    <span className="text-xs text-[#7C746B] font-light">
                      Fibers nurtured in the Nile Delta for natural luster and breathability.
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-sm text-[#1D1D1B]">
                  <span className="text-[#BA945A] font-serif font-normal">—</span>
                  <div>
                    <span className="font-medium text-xs tracking-wider uppercase block text-[#1D1D1B]">
                      Sculptural Natural Drapes
                    </span>
                    <span className="text-xs text-[#7C746B] font-light">
                      Precision bias cutting to move fluidly with the human body.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. CHAPTER 03: THE WOMAN
         ======================================================== */}
      <section className="py-20 sm:py-32 bg-[#FAF8F5] border-b border-[#EAE5DE] relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Chapter Header */}
          <div className="flex items-center space-x-4 mb-10 sm:mb-16">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#BA945A] font-medium">
              CHAPTER 03
            </span>
            <span className="w-12 h-px bg-[#D4CCC2]" />
            <span className="font-sans text-xs tracking-[0.26em] uppercase text-[#7C746B]">
              THE WOMAN
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Story Text Column */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1D1D1B] leading-tight mb-6">
                Designed Around Her
              </h2>
              <div className="space-y-4 font-sans text-base sm:text-[17px] text-[#55504A] font-light leading-relaxed mb-8">
                <p>
                  LORÉA is not built around one definition of femininity.
                </p>
                <p>
                  Our collections move between modest silhouettes, contemporary dresses, elevated essentials and expressive occasionwear — giving every woman room to define her own style.
                </p>
              </div>

              {/* Wardrobe Continuum (Unboxed, Sophisticated) */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#EAE5DE]">
                <div className="p-4 bg-white/70 border border-[#EAE5DE]">
                  <span className="text-[10px] tracking-[0.24em] uppercase text-[#BA945A] font-mono block mb-1">
                    01 / VERSATILITY
                  </span>
                  <h4 className="font-serif text-base text-[#1D1D1B] mb-1">Modest to Occasion</h4>
                  <p className="text-xs text-[#7C746B] font-light">
                    Fluid abayas, column gowns and relaxed tailoring that adapt to her calendar.
                  </p>
                </div>
                <div className="p-4 bg-white/70 border border-[#EAE5DE]">
                  <span className="text-[10px] tracking-[0.24em] uppercase text-[#BA945A] font-mono block mb-1">
                    02 / PRESENCE
                  </span>
                  <h4 className="font-serif text-base text-[#1D1D1B] mb-1">Effortless Ease</h4>
                  <p className="text-xs text-[#7C746B] font-light">
                    Garments that never constrict or overpower, allowing personal grace to lead.
                  </p>
                </div>
              </div>
            </div>

            {/* Editorial Portrait Column */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative aspect-3/4 sm:aspect-4/3 lg:aspect-4/5 overflow-hidden bg-[#EAE5DE] shadow-sm max-w-lg mx-auto lg:ml-auto group">
                <img
                  src={storyWomanImg}
                  alt="Contemporary woman wearing LORÉA in modern architectural setting"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-103"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 text-[10px] tracking-[0.24em] uppercase text-[#1D1D1B] font-mono">
                  FIG. 03 — MODERN POISE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. CHAPTER 04: THE FUTURE
         ======================================================== */}
      <section className="py-20 sm:py-32 bg-white border-b border-[#EAE5DE] relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Chapter Header */}
          <div className="flex items-center space-x-4 mb-10 sm:mb-16">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#BA945A] font-medium">
              CHAPTER 04
            </span>
            <span className="w-12 h-px bg-[#D4CCC2]" />
            <span className="font-sans text-xs tracking-[0.26em] uppercase text-[#7C746B]">
              THE FUTURE
            </span>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[#1D1D1B] leading-tight mb-8">
              From Egypt, For Everywhere
            </h2>
            <p className="font-sans text-base sm:text-lg lg:text-xl text-[#55504A] font-light leading-relaxed mb-6">
              LORÉA is proudly rooted in Egypt while looking outward.
            </p>
            <p className="font-sans text-base sm:text-lg text-[#7C746B] font-light leading-relaxed mb-10 max-w-2xl mx-auto">
              Our ambition is to build a modern Egyptian fashion house with a visual language that feels at home anywhere in the world.
            </p>

            <button
              type="button"
              onClick={handleCtaClick}
              className="group inline-flex items-center space-x-3 px-10 sm:px-14 py-4 bg-[#1D1D1B] text-white hover:bg-[#BA945A] transition-colors duration-300 font-sans text-xs tracking-[0.26em] uppercase font-light cursor-pointer rounded-none active:scale-[0.99]"
            >
              <span>DISCOVER THE COLLECTION</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. THE LORÉA PRINCIPLES: Interactive Brand Values
         ======================================================== */}
      <section className="py-20 sm:py-32 bg-[#F6F3ED] border-b border-[#EAE5DE] relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
            <span className="font-mono text-xs tracking-[0.34em] uppercase text-[#BA945A] font-medium block mb-3">
              FOUNDATIONAL COMMITMENTS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1D1D1B] tracking-[0.08em] uppercase">
              THE LORÉA PRINCIPLES
            </h2>
            <div className="w-12 h-px bg-[#D4CCC2] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Interactive Principles List */}
            <div className="lg:col-span-7 space-y-3">
              {PRINCIPLES.map((principle, index) => {
                const isActive = activePrinciple === index;
                return (
                  <div
                    key={principle.number}
                    onMouseEnter={() => setActivePrinciple(index)}
                    onClick={() => setActivePrinciple(index)}
                    className={`p-6 sm:p-7 transition-all duration-300 cursor-pointer border ${
                      isActive
                        ? 'bg-white border-[#1D1D1B] shadow-sm translate-x-1 sm:translate-x-2'
                        : 'bg-white/50 border-[#EAE5DE] hover:bg-white hover:border-[#D4CCC2]'
                    }`}
                  >
                    <div className="flex items-baseline justify-between mb-2">
                      <div className="flex items-baseline space-x-4">
                        <span className="font-mono text-sm tracking-wider text-[#BA945A] font-medium">
                          {principle.number}
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl text-[#1D1D1B] tracking-wide">
                          {principle.title}
                        </h3>
                      </div>
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#7C746B]">
                        {principle.tag}
                      </span>
                    </div>

                    <p className="font-sans text-sm sm:text-base text-[#1D1D1B]/80 font-normal leading-relaxed mb-1">
                      {principle.description}
                    </p>
                    <p className="font-sans text-xs sm:text-sm text-[#7C746B] font-light leading-relaxed">
                      {principle.detail}
                    </p>

                    <div
                      className={`h-0.5 bg-[#BA945A] transition-all duration-300 mt-4 ${
                        isActive ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Interactive Dynamic Image Preview */}
            <div className="lg:col-span-5">
              <div className="relative aspect-4/5 overflow-hidden bg-[#EAE5DE] shadow-sm">
                {PRINCIPLES.map((principle, index) => (
                  <img
                    key={principle.number}
                    src={principle.image}
                    alt={`LORÉA Principle — ${principle.title}`}
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
                      activePrinciple === index
                        ? 'opacity-100 scale-100 z-10'
                        : 'opacity-0 scale-105 z-0 pointer-events-none'
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20 pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 z-30 text-white">
                  <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#BA945A] block mb-1">
                    {PRINCIPLES[activePrinciple].number} / {PRINCIPLES[activePrinciple].tag}
                  </span>
                  <h4 className="font-serif text-2xl font-light">
                    {PRINCIPLES[activePrinciple].title}
                  </h4>
                  <p className="font-sans text-xs text-white/80 font-light mt-1">
                    {PRINCIPLES[activePrinciple].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. LORÉA VISUAL MANIFESTO: Dramatic Full-Width Scene
         ======================================================== */}
      <section className="relative min-h-[75vh] flex items-center justify-center py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
        {/* Full-width Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={storyManifestoImg}
            alt="LORÉA Visual Manifesto"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>

        {/* Centered Typographic Overlay */}
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white px-4">
          <span className="font-serif text-3xl sm:text-4xl tracking-[0.34em] uppercase text-[#F7F4EF] font-light block mb-6 drop-shadow-sm">
            LORÉA
          </span>

          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light leading-[1.3] mb-8 text-[#FAF9F6] max-w-3xl mx-auto drop-shadow-sm">
            “Modern Egyptian fashion,
            <br className="hidden sm:inline" />
            <span className="italic font-normal"> made for the woman who defines her own way.”</span>
          </h2>

          <div className="mt-8 sm:mt-10">
            <button
              type="button"
              onClick={handleCtaClick}
              className="group inline-flex items-center space-x-3 px-10 sm:px-14 py-4 bg-white text-[#1D1D1B] hover:bg-[#BA945A] hover:text-white transition-all duration-300 font-sans text-xs tracking-[0.28em] uppercase font-medium cursor-pointer rounded-none active:scale-[0.99] shadow-lg"
            >
              <span>DISCOVER LORÉA</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          7B. THE STORY CONTINUATION: More Than What You Wear
         ======================================================== */}
      <StoryContinuationSection
        onDiscoverStory={handleDiscoverStory}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* ========================================================
          8. FROM THE STORY: Exactly 3 Curated Iconic Silhouettes
         ======================================================== */}
      <section className="py-20 sm:py-28 bg-[#FAF8F5]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Section Header */}
          <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#BA945A] font-medium block mb-2">
              CURATED ARCHIVE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#1D1D1B] tracking-[0.12em] uppercase">
              FROM THE STORY
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#7C746B] font-light mt-2">
              Three foundational silhouettes that embody our materials and philosophy.
            </p>
          </div>

          {/* 3 Iconic Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {curatedStoryProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onProductClick && onProductClick(product)}
                className="group bg-white border border-[#EAE5DE] overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300"
              >
                {/* Product Image */}
                <div className="aspect-3/4 overflow-hidden bg-[#EAE5DE] relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-104"
                  />
                  {product.badge && (
                    <div className="absolute top-3 left-3 bg-[#1D1D1B] text-white text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 font-mono">
                      {product.badge}
                    </div>
                  )}
                </div>

                {/* Product Metadata */}
                <div className="p-5 sm:p-6 text-center">
                  <span className="text-[10px] tracking-[0.24em] uppercase text-[#7C746B] block mb-1 font-mono">
                    {product.category}
                  </span>
                  <h3 className="font-serif text-base sm:text-lg text-[#1D1D1B] group-hover:text-[#BA945A] transition-colors mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#7C746B] font-light line-clamp-1 mb-3">
                    {product.fabric}
                  </p>
                  <span className="font-sans text-sm font-medium text-[#1D1D1B]">
                    {formatPrice(product.priceEgp, product.priceUsd)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* View Complete Collection */}
          <div className="text-center mt-12">
            <button
              type="button"
              onClick={handleCtaClick}
              className="inline-flex items-center space-x-2 text-xs tracking-[0.24em] uppercase text-[#1D1D1B] hover:text-[#BA945A] transition-colors font-medium border-b border-[#1D1D1B] hover:border-[#BA945A] pb-1 cursor-pointer"
            >
              <span>VIEW ALL SILHOUETTES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </article>
  );
};
