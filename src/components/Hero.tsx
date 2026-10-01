import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Play, Pause } from 'lucide-react';
import { appPath } from '../config/routes';
import heroPosterImg from '../assets/images/hero_campaign_scene1_1790082372543.jpg';

interface HeroProps {
  onShopClick: () => void;
  onDiscoverClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  // Subtle, high-performance scroll parallax tracker via RAF
  useEffect(() => {
    if (prefersReducedMotion) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Only track while in hero range to save CPU
          if (window.scrollY < window.innerHeight * 1.2) {
            setScrollY(window.scrollY);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Subtle parallax values (strictly limited to prevent nausea or layout shifts)
  const videoScale = prefersReducedMotion ? 1 : 1 + Math.min(scrollY * 0.0002, 0.08);
  const contentParallax = prefersReducedMotion ? 0 : scrollY * 0.22;
  const overlayOpacity = prefersReducedMotion ? 0.45 : Math.min(0.45 + scrollY * 0.0006, 0.75);
  const scrollIndicatorOpacity = Math.max(1 - scrollY / 140, 0);

  return (
    <section
      id="hero-section"
      className="relative w-full h-[100svh] min-h-[600px] overflow-hidden flex items-center justify-center bg-[#0C0B0A] text-[#FAF8F5] select-none"
    >
      {/* 1. Full-screen Video Background with Parallax Scale & Poster Fallback */}
      <div
        className="absolute inset-0 w-full h-full will-change-transform transition-transform duration-100 ease-out"
        style={{ transform: `scale(${videoScale})` }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroPosterImg}
          aria-hidden="true"
          className="w-full h-full object-cover object-center pointer-events-none brightness-[0.70] contrast-[1.08] filter"
        >
          <source
            src={appPath('/videos/hero-campaign.mp4')}
            type="video/mp4"
          />
        </video>
      </div>

      {/* 2. Dynamic Overlay Layers with Scroll-Adaptive Contrast */}
      <div
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-150"
        style={{ opacity: overlayOpacity }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/60 pointer-events-none" />

      {/* Subtle Video Play/Pause toggle control */}
      <button
        onClick={toggleVideo}
        aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
        className="absolute bottom-6 right-6 z-20 w-9 h-9 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:border-white/60 transition-all cursor-pointer active:scale-95 shadow-sm"
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      {/* 3. Text content with subtle parallax translation */}
      <div
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-[#FAF8F5] flex flex-col items-center justify-center pb-8 sm:pb-12 will-change-transform"
        style={{ transform: `translate3d(0, ${contentParallax}px, 0)` }}
      >
        {/* Main Headline: High-Contrast Serif, Large, Light Weight, Generous Letter Spacing */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[42px] min-[360px]:text-[50px] min-[400px]:text-[58px] sm:text-7xl md:text-8xl lg:text-[96px] xl:text-[104px] font-light tracking-[0.12em] sm:tracking-[0.16em] md:tracking-[0.18em] leading-[1.04] sm:leading-[1.02] uppercase text-[#FAF8F5] mb-6 sm:mb-8 select-none drop-shadow-md"
        >
          <span className="block">THE NEW</span>
          <span className="block">FEMININE</span>
        </motion.h1>

        {/* CTA: Shop Women's New In */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center"
        >
          <button
            id="hero-explore-collection-btn"
            onClick={onShopClick}
            className="px-9 sm:px-11 py-3.5 sm:py-4 bg-[#FAF8F5] text-[#151413] hover:bg-white text-xs sm:text-[13px] tracking-[0.22em] sm:tracking-[0.25em] uppercase font-medium transition-all duration-300 transform active:scale-95 shadow-xl rounded-none cursor-pointer"
          >
            SHOP WOMEN'S NEW IN
          </button>
        </motion.div>
      </div>

      {/* 4. Minimal Scroll Down Indicator that fades as user scrolls */}
      <div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-[#EAE5DE]/70 pointer-events-none transition-opacity duration-300"
        style={{ opacity: scrollIndicatorOpacity }}
      >
        <ArrowDown className="w-4 h-4 animate-bounce stroke-[1.2]" />
      </div>
    </section>
  );
};
