import React from 'react';
import { ArrowRight } from 'lucide-react';

interface EditorialCampaignProps {
  onShopCampaign: () => void;
  onReadStory: () => void;
}

export const EditorialCampaign: React.FC<EditorialCampaignProps> = ({
  onShopCampaign,
  onReadStory
}) => {
  return (
    <section className="bg-[#151413] text-[#F7F4EF] py-20 sm:py-32 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image Diptych / Visual Story */}
          <div className="lg:col-span-7 grid grid-cols-12 gap-4 sm:gap-6">
            <div className="col-span-8 relative aspect-3/4 overflow-hidden bg-[#222]">
              <img
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1200&auto=format&fit=crop"
                alt="LORÉA Summer Campaign Editorial"
                loading="lazy"
                className="w-full h-full object-cover object-center transform hover:scale-103 transition-transform duration-700"
              />
              <span className="absolute bottom-3 left-3 text-[9px] uppercase tracking-[0.24em] text-[#F7F4EF]/70 bg-black/40 px-2 py-1 backdrop-blur-xs">
                FIG. 01 — THE COLUMN DRESS
              </span>
            </div>

            <div className="col-span-4 flex flex-col justify-between space-y-4">
              <div className="aspect-3/4 relative overflow-hidden bg-[#222]">
                <img
                  src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop"
                  alt="Fabric Detail"
                  loading="lazy"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-4 bg-[#1E1D1B] border border-[#2D2B28]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#B7ADA2] mb-1 font-medium">MATERIAL STUDY</p>
                <p className="text-xs text-[#D4CCC2] font-light leading-relaxed">
                  Stone-washed French flax linen (185 gsm) paired with Giza 45 poplin.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Text & Narrative */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-[11px] tracking-[0.32em] uppercase text-[#B88F88] font-medium mb-3">
              EDITORIAL CAMPAIGN · VOLUME IV
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-wide text-[#F7F4EF] leading-[1.1] mb-6">
              The Architecture of Ease
            </h2>

            <p className="text-base sm:text-lg font-serif italic text-[#D4CCC2] mb-6 leading-relaxed font-light">
              “True presence does not raise its voice. It drapes naturally, honors the breeze, and endures across seasons.”
            </p>

            <p className="text-sm sm:text-base text-[#B7ADA2] font-light leading-relaxed mb-8">
              Conceived in our Cairo atelier and realized in pure Egyptian long-staple cottons and natural European flax. Each piece in this series explores the tension between masculine tailoring and feminine fluidity—sculptural garments cut to move effortlessly from dawn meetings in New Cairo to seaside dinners in El Gouna.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onShopCampaign}
                className="px-8 py-4 bg-[#F7F4EF] text-[#1D1D1B] hover:bg-[#EAE5DE] text-xs tracking-[0.22em] uppercase font-medium transition-all text-center flex items-center justify-center space-x-2"
              >
                <span>SHOP THE CAMPAIGN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onReadStory}
                className="px-6 py-4 border border-[#B7ADA2]/40 text-[#F7F4EF] hover:border-[#F7F4EF] text-xs tracking-[0.22em] uppercase font-medium transition-all text-center"
              >
                READ THE ATELIER STORY
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
