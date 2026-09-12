import React from 'react';

export const BrandStory: React.FC = () => {
  return (
    <section className="py-24 sm:py-36 bg-[#F7F4EF] border-b border-[#EAE5DE] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro Tag & Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
          <span className="text-[11px] tracking-[0.34em] uppercase text-[#7C746B] font-medium block mb-3">
            HERITAGE & CRAFTSMANSHIP
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-wide text-[#1D1D1B] leading-tight">
            The Story of LORÉA
          </h2>
          <div className="w-12 h-px bg-[#B88F88] mx-auto mt-6" />
        </div>

        {/* Story Section 1: The Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-20 sm:mb-28">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <span className="text-[10px] tracking-[0.24em] uppercase text-[#B88F88] font-medium block mb-2">
              01 — OUR GENESIS
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#1D1D1B] mb-4">
              Born Between Nile Mist and Mediterranean Light
            </h3>
            <p className="text-sm sm:text-base text-[#7C746B] font-light leading-relaxed mb-4">
              LORÉA was founded on a simple yet unyielding belief: contemporary women deserve wardrobe pieces that embody pure tactile serenity. We saw an international fashion market filled with synthetic fast fashion and unattainable couture, yet sparse in accessible quiet luxury.
            </p>
            <p className="text-sm sm:text-base text-[#7C746B] font-light leading-relaxed">
              Rooted in Cairo with global sensibilities, we look to the geometry of the ancient Mediterranean and the unparalleled heritage of Egyptian fiber cultivation to sculpt clothes that feel both intimate and monumental.
            </p>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative aspect-16/10 overflow-hidden bg-[#EAE5DE] shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1400&auto=format&fit=crop"
                alt="LORÉA Atelier Studio"
                loading="lazy"
                className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Visual Break with Stats / Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-[#EAE5DE] mb-20 sm:mb-28">
          <div className="text-center">
            <span className="font-serif text-3xl sm:text-4xl text-[#1D1D1B] font-normal block mb-1">
              100%
            </span>
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#7C746B] font-light">
              Natural Plant Fibers
            </span>
          </div>
          <div className="text-center">
            <span className="font-serif text-3xl sm:text-4xl text-[#1D1D1B] font-normal block mb-1">
              Giza 45
            </span>
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#7C746B] font-light">
              Long-Staple Egyptian Cotton
            </span>
          </div>
          <div className="text-center">
            <span className="font-serif text-3xl sm:text-4xl text-[#1D1D1B] font-normal block mb-1">
              Atelier Cut
            </span>
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#7C746B] font-light">
              Hand-Finished French Seams
            </span>
          </div>
          <div className="text-center">
            <span className="font-serif text-3xl sm:text-4xl text-[#1D1D1B] font-normal block mb-1">
              Zero Waste
            </span>
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#7C746B] font-light">
              Small-Batch Production Runs
            </span>
          </div>
        </div>

        {/* Story Section 2: Craft & Accessibility */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-3/4 overflow-hidden bg-[#EAE5DE]">
                <img
                  src="https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=800&auto=format&fit=crop"
                  alt="Pattern Making"
                  loading="lazy"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="aspect-3/4 overflow-hidden bg-[#EAE5DE] mt-6">
                <img
                  src="https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=800&auto=format&fit=crop"
                  alt="Fabric cutting in Cairo Atelier"
                  loading="lazy"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <span className="text-[10px] tracking-[0.24em] uppercase text-[#B88F88] font-medium block mb-2">
              02 — ACCESSIBLE LUXURY
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#1D1D1B] mb-4">
              Crafted in Egypt. Styled for the World.
            </h3>
            <p className="text-sm sm:text-base text-[#7C746B] font-light leading-relaxed mb-4">
              By working directly with master weavers in the Nile Delta and our dedicated atelier in Cairo, we eliminate the traditional 8x luxury markup. The result is pure Giza cotton, Italian horn buttons, and French linen brought directly to our community at authentic prices.
            </p>
            <p className="text-sm sm:text-base text-[#7C746B] font-light leading-relaxed">
              Whether you are shopping in Cairo with same-day delivery and Cash on Delivery, or ordering from London, Dubai, or New York, LORÉA bridges international elegance with Egyptian warmth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
