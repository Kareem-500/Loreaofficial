import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const EditorialMarquee: React.FC = () => {
  const { language, direction } = useLanguage();

  const englishItems = [
    "MODERN WOMEN'S READY-TO-WEAR",
    'EGYPTIAN GIZA 45 COTTON',
    'DESIGNED IN CAIRO',
    'FRENCH PURE FLAX LINEN',
    'SMALL-BATCH ATELIER CRAFT',
    'WORLDWIDE DELIVERY',
    'TIMELESS REFINED SILHOUETTES',
    'BESPOKE ATELIER TAILORING',
  ];

  const arabicItems = [
    'أزياء نسائية معاصرة وفاخرة',
    'قطن جيزة 45 المصري الأصيل',
    'صُممت ونُفّذت في القاهرة',
    'كتان فرنسي نقي عالي الجودة',
    'حِرفية الأتيليه بدُفعات حصرية',
    'شحن فوري وتغليف فاخر',
    'قصات كلاسيكية خالدة',
    'تفصيل يدوي متقن بأعلى المعايير',
  ];

  const items = language === 'ar' ? arabicItems : englishItems;
  const isRtl = direction === 'rtl';

  return (
    <div
      className="relative z-10 w-full py-3.5 bg-[#11100F] text-[#FAF8F5] overflow-hidden whitespace-nowrap border-y border-[#262422] select-none"
      aria-label="Brand Announcement Bar"
    >
      <div
        className={`flex ${
          isRtl ? 'animate-marquee-seamless-rtl' : 'animate-marquee-seamless'
        }`}
      >
        {/* Set 1 */}
        <div className="flex shrink-0 items-center space-x-8 sm:space-x-12 rtl:space-x-reverse px-4 text-[10.5px] sm:text-xs font-mono uppercase tracking-[0.28em]">
          {items.map((text, idx) => (
            <React.Fragment key={`set1-${idx}`}>
              <span className="hover:text-[#BA945A] transition-colors duration-200">
                {text}
              </span>
              <span className="text-[#BA945A] text-[11px] select-none font-sans" aria-hidden="true">
                ✦
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Set 2 (duplicates for infinite seamless loop) */}
        <div className="flex shrink-0 items-center space-x-8 sm:space-x-12 rtl:space-x-reverse px-4 text-[10.5px] sm:text-xs font-mono uppercase tracking-[0.28em]">
          {items.map((text, idx) => (
            <React.Fragment key={`set2-${idx}`}>
              <span className="hover:text-[#BA945A] transition-colors duration-200">
                {text}
              </span>
              <span className="text-[#BA945A] text-[11px] select-none font-sans" aria-hidden="true">
                ✦
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorialMarquee;
