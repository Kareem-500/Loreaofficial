import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
  onDiscoverClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onDiscoverClick }) => {
  return (
    <section
      id="hero-section"
      className="relative w-full h-[calc(100svh-100px)] sm:h-[calc(100vh-112px)] min-h-[520px] sm:min-h-[600px] max-h-[960px] overflow-hidden flex items-center justify-center bg-[#151413]"
    >
      {/* 1. Full-width cinematic fashion film with a poster fallback */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none scale-102"
      >
        <source
          src="https://videos.pexels.com/video-files/3764250/3764250-hd_1920_1080_25fps.mp4"
          type="video/mp4"
        />
      </video>
      <img
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
        alt="LORÉA atelier collection"
        className="absolute inset-0 -z-10 w-full h-full object-cover object-center pointer-events-none scale-102 transform duration-1000"
      />

      {/* 2. Dark editorial treatment keeps the moving image legible behind type */}
      <div className="absolute inset-0 bg-black/35 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/20 to-black/75 pointer-events-none" />

      {/* 3. Centered Content Container with Mathematical Fashion Editorial Typography */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-[#FAF8F5] flex flex-col items-center justify-center pt-4 pb-10 sm:pb-12 md:pb-14">
        {/* Small Eyebrow: Minimal Uppercase Sans-Serif with 4-6px letter spacing */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] min-[360px]:text-[11px] sm:text-xs md:text-[13px] tracking-[4px] min-[360px]:tracking-[5px] sm:tracking-[6px] uppercase font-sans font-light text-[#EAE5DE]/90 mb-3 sm:mb-4 select-none"
        >
          LORÉA WOMEN'S FASHION · CAIRO / 2026
        </motion.p>

        {/* Main Headline: High-Contrast Serif, Large, Thin/Light Weight, Generous Letter Spacing */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[38px] min-[360px]:text-[44px] min-[400px]:text-[50px] sm:text-6xl md:text-7xl lg:text-[84px] xl:text-[90px] font-light tracking-[0.1em] sm:tracking-[0.14em] md:tracking-[0.16em] leading-[1.06] sm:leading-[1.03] uppercase text-[#FAF8F5] mb-4 sm:mb-5 select-none"
        >
          <span className="block">THE NEW</span>
          <span className="block">FEMININE</span>
        </motion.h1>

        {/* Subtext: Modern Clean Sans-Serif, Light Weight, max-w 280-310px mobile, 520-600px desktop */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-[13px] sm:text-sm md:text-base font-light text-[#EAE5DE]/90 max-w-[290px] sm:max-w-[520px] md:max-w-[580px] mx-auto leading-relaxed mb-7 sm:mb-9 tracking-wide"
        >
          Refined silhouettes, natural fabrics, and quiet confidence for the woman becoming her next self.
        </motion.p>

        {/* CTAs: Minimal Luxury Fashion Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
        >
          {/* Primary CTA: EXPLORE THE COLLECTION */}
          <button
            id="hero-explore-collection-btn"
            onClick={onShopClick}
            className="w-full sm:w-auto px-8 py-3.5 sm:px-9 sm:py-4 bg-[#FAF8F5] text-[#151413] hover:bg-white text-xs sm:text-[13px] tracking-[0.2em] sm:tracking-[0.22em] uppercase font-medium transition-all duration-300 transform active:scale-98 shadow-md rounded-none cursor-pointer"
          >
            SHOP WOMEN'S NEW IN
          </button>

          {/* Secondary CTA: DISCOVER LORÉA */}
          <button
            id="hero-discover-btn"
            onClick={onDiscoverClick}
            className="w-full sm:w-auto px-8 py-3.5 sm:px-9 sm:py-4 bg-transparent border border-[#FAF8F5]/60 text-[#FAF8F5] hover:border-white hover:bg-white/10 text-xs sm:text-[13px] tracking-[0.2em] sm:tracking-[0.22em] uppercase font-medium transition-all duration-300 rounded-none cursor-pointer backdrop-blur-[2px]"
          >
            OUR ATELIER STORY
          </button>
        </motion.div>
      </div>

      {/* 4. Elegant Minimal Scroll Indicator */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-[#EAE5DE]/50 pointer-events-none">
        <ArrowDown className="w-3.5 h-3.5 animate-bounce stroke-[1.2]" />
      </div>
    </section>
  );
};
