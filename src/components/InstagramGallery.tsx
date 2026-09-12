import React from 'react';
import { Instagram } from 'lucide-react';

export const InstagramGallery: React.FC = () => {
  const images = [
    {
      url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=600&auto=format&fit=crop',
      alt: 'Atelier fitting in Cairo'
    },
    {
      url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop',
      alt: 'Linen column dress morning sun'
    },
    {
      url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop',
      alt: 'Giza cotton shirt styling'
    },
    {
      url: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=600&auto=format&fit=crop',
      alt: 'Modest architectural series'
    },
    {
      url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
      alt: 'Silk skirt movement'
    },
    {
      url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=600&auto=format&fit=crop',
      alt: 'Wool sand trench coat'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#F7F4EF] border-b border-[#EAE5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#7C746B] font-medium block mb-2">
            JOIN OUR COMMUNITY
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-[#1D1D1B] mb-2">
            @lorea.atelier
          </h2>
          <p className="text-xs sm:text-sm text-[#7C746B] font-light">
            Tag #LoreaWomen and #DressYourStory to be featured in our seasonal curation.
          </p>
        </div>

        {/* 6-image curated grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden bg-[#EAE5DE] cursor-pointer"
            >
              <img
                src={img.url}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-[#1D1D1B]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-white">
                <Instagram className="w-5 h-5 mb-1 stroke-[1.5]" />
                <span className="text-[9px] tracking-[0.2em] uppercase font-light">
                  View Post
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
