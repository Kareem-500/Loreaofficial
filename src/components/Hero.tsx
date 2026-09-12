import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
  onDiscoverClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onDiscoverClick }) => {
  return (
    <section className="relative w-full h-[100vh] min-h-[640px] overflow-hidden flex items-center justify-center bg-[#151413]">
      {/* 1. Cinematic Background Video with high-res editorial poster fallback */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none scale-105 transform duration-1000"
        src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-cream-dress-walking-in-a-studio-41481-large.mp4"
      />

      {/* 2. Subtle luxury dark transparent overlay (scrim for readability) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/60 pointer-events-none" />

      {/* 3. Centered Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-[#F7F4EF] flex flex-col items-center">
        {/* Subtle Brand Tag */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-sm tracking-[0.38em] uppercase font-light text-[#EAE5DE]/85 mb-4"
        >
          LORÉA ATELIER · 2026 CAMPAIGN
        </motion.p>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-normal tracking-[0.06em] leading-[1.05] uppercase text-[#F7F4EF] mb-6"
        >
          DRESS YOUR STORY
        </motion.h1>

        {/* Small Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm sm:text-base md:text-lg font-light text-[#D4CCC2] max-w-xl mx-auto leading-relaxed mb-10 tracking-wide"
        >
          Contemporary pieces crafted with quiet presence, natural fibers, and timeless feminine restraint. Designed for every version of you.
        </motion.p>

        {/* Dual CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          {/* Primary CTA */}
          <button
            id="hero-shop-collection-btn"
            onClick={onShopClick}
            className="w-full sm:w-auto px-8 py-4 bg-[#F7F4EF] text-[#1D1D1B] hover:bg-[#EAE5DE] text-xs sm:text-[13px] tracking-[0.22em] uppercase font-medium transition-all duration-300 transform active:scale-98 shadow-lg"
          >
            SHOP THE COLLECTION
          </button>

          {/* Secondary CTA */}
          <button
            id="hero-discover-btn"
            onClick={onDiscoverClick}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#F7F4EF]/50 text-[#F7F4EF] hover:border-[#F7F4EF] hover:bg-white/10 text-xs sm:text-[13px] tracking-[0.22em] uppercase font-medium transition-all duration-300 backdrop-blur-xs"
          >
            DISCOVER LORÉA
          </button>
        </motion.div>
      </div>

      {/* 4. Elegant Scroll Down Hint */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-[#EAE5DE]/60 hover:text-[#EAE5DE] transition-colors pointer-events-none">
        <span className="text-[9px] uppercase tracking-[0.28em] font-light mb-2">SCROLL</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce stroke-[1.5]" />
      </div>
    </section>
  );
};
