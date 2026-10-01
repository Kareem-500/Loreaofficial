import React, { useState } from 'react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

// High-resolution editorial photography of women in women's fashion
import catDressesImg from '../assets/images/cat_dresses_editorial_1790620925859.jpg';
import emeraldDressImg from '../assets/images/dress_emerald_oneshoulder_1790620905060.jpg';
import catSetsImg from '../assets/images/cat_sets_tailored_1790620974010.jpg';
import azurelleDressImg from '../assets/images/dress_azurelle_highneck_1790546930763.jpg';
import violetteDressImg from '../assets/images/dress_violette_mermaid_1790546911621.jpg';
import coraliaDressImg from '../assets/images/dress_coralia_feather_1790546941004.jpg';

interface SocialPlatformItem {
  id: string;
  name: string;
  handle: string;
  url: string;
  image: string;
  alt: string;
  iconSvg: React.ReactNode;
}

export const InstagramGallery: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // All major social media platforms with large, high-fashion editorial imagery
  const socialItems: SocialPlatformItem[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@lorea.women',
      url: 'https://instagram.com',
      image: catDressesImg,
      alt: "LORÉA Women's Fashion on Instagram",
      iconSvg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      handle: '@lorea.fashion',
      url: 'https://tiktok.com',
      image: emeraldDressImg,
      alt: "LORÉA Runway on TikTok",
      iconSvg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      )
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      handle: 'LORÉA Atelier',
      url: 'https://pinterest.com',
      image: catSetsImg,
      alt: "LORÉA Moodboards on Pinterest",
      iconSvg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.211-.174.256-.402.154-1.498-.697-2.435-2.889-2.435-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      )
    },
    {
      id: 'facebook',
      name: 'Facebook',
      handle: 'LORÉA Women',
      url: 'https://facebook.com',
      image: azurelleDressImg,
      alt: "LORÉA Fashion Community on Facebook",
      iconSvg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      )
    },
    {
      id: 'youtube',
      name: 'YouTube',
      handle: 'LORÉA Runway',
      url: 'https://youtube.com',
      image: violetteDressImg,
      alt: "LORÉA Fashion Shows & Atelier on YouTube",
      iconSvg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
      )
    },
    {
      id: 'threads',
      name: 'Threads / X',
      handle: '@lorea_style',
      url: 'https://threads.net',
      image: coraliaDressImg,
      alt: "LORÉA Style Conversations on Threads",
      iconSvg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.001 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12.001 12 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12zm6.273 15.772c-.443 1.157-1.196 2.051-2.181 2.613-1.002.571-2.176.865-3.488.865-1.921 0-3.526-.642-4.706-1.899-1.171-1.246-1.785-2.883-1.785-4.887 0-2.023.635-3.673 1.838-4.908 1.205-1.237 2.825-1.879 4.808-1.879 2.001 0 3.593.633 4.743 1.879 1.129 1.226 1.705 2.812 1.719 4.717h-2.193c-.023-1.341-.397-2.42-1.121-3.208-.724-.789-1.745-1.19-3.048-1.19-1.362 0-2.464.444-3.275 1.319-.809.873-1.229 2.072-1.229 3.567 0 1.488.409 2.696 1.216 3.591.808.896 1.91 1.35 3.275 1.35 1.792 0 3.098-.797 3.69-2.261l1.79 1.332z" />
        </svg>
      )
    }
  ];

  return (
    <section
      id="social-media-spotlight"
      className="py-16 sm:py-24 lg:py-28 bg-[#FAF8F5] border-b border-[#EAE5DE] relative overflow-hidden select-none"
      aria-label="Social Media Editorial Showcase"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Minimalist Centered Header: SOCIAL MEDIA */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center justify-center space-x-3 sm:space-x-4">
            <span className="w-8 sm:w-12 h-px bg-[#BA945A]" aria-hidden="true" />
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#1D1D1B] tracking-[0.16em] uppercase">
              SOCIAL MEDIA
            </h2>
            <span className="w-8 sm:w-12 h-px bg-[#BA945A]" aria-hidden="true" />
          </div>
        </div>

        {/* Large, High-Impact Editorial Social Grid (Enlarged Images) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-7">
          {socialItems.map((item) => {
            const isHovered = hoveredId === item.id;

            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`group relative flex flex-col overflow-hidden bg-white p-2.5 sm:p-3 border transition-all duration-500 ease-out cursor-pointer ${
                  isHovered
                    ? 'border-[#BA945A] shadow-xl scale-[1.03] -translate-y-2 z-20 ring-1 ring-[#BA945A]/40'
                    : 'border-[#EAE5DE] shadow-xs hover:border-[#BA945A]/60'
                }`}
              >
                {/* Large Portrait Image: Aspect 3/4 */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EAE5DE] border border-[#EAE5DE]/80 mb-3">
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
                      isHovered ? 'scale-108' : 'scale-100'
                    }`}
                  />

                  {/* Top Platform Tag */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="font-mono text-[9px] tracking-[0.22em] uppercase bg-[#1D1D1B] text-[#FAF8F5] px-2 py-0.5 shadow-xs">
                      {item.name}
                    </span>
                  </div>

                  {/* Hover Overlay with Social Icon & Follow Call */}
                  <div
                    className={`absolute inset-0 bg-[#1D1D1B]/60 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center text-white transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center mb-2 text-[#FAF8F5]">
                      {item.iconSvg}
                    </div>
                    <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-medium text-white mb-0.5">
                      {item.name}
                    </span>
                    <span className="font-mono text-[9px] text-[#D4CCC2] tracking-wider mb-2">
                      {item.handle}
                    </span>
                    <span className="inline-flex items-center space-x-1 font-sans text-[9px] tracking-[0.22em] uppercase text-[#BA945A] font-semibold bg-white px-2.5 py-1 text-[#1D1D1B]">
                      <span>FOLLOW</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Minimal Card Footer: Platform Name & Handle */}
                <div className="flex items-center justify-between px-1 py-1">
                  <div className="flex items-center space-x-1.5 text-[#1D1D1B]">
                    <span className={`transition-colors duration-300 ${isHovered ? 'text-[#BA945A]' : 'text-[#7C746B]'}`}>
                      {item.iconSvg}
                    </span>
                    <span className="font-serif text-sm font-light text-[#1D1D1B] tracking-wide">
                      {item.name}
                    </span>
                  </div>
                  <ExternalLink className={`w-3.5 h-3.5 transition-colors duration-300 ${isHovered ? 'text-[#BA945A]' : 'text-[#7C746B]'}`} />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
