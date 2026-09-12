import React from 'react';
import logoDark from '../assets/lorea_logo_dark.png';
import logoLight from '../assets/lorea_logo_light.png';

interface LoreaLogoProps {
  variant?: 'light' | 'dark' | 'compact' | 'footer' | 'mark';
  className?: string;
  subtext?: boolean;
}

export const LoreaLogo: React.FC<LoreaLogoProps> = ({
  variant = 'light',
  className = '',
  subtext = false
}) => {
  const isDark = variant === 'dark' || variant === 'footer';
  const logoSrc = isDark ? logoLight : logoDark;
  const isCompact = variant === 'compact';
  const subColor = isDark ? '#B7ADA2' : '#7C746B';

  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <img
          src={logoSrc}
          alt="LORÉA"
          referrerPolicy="no-referrer"
          className="h-8 w-auto object-contain select-none"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col select-none ${className.includes('items-') ? className : `items-center justify-center ${className}`}`}>
      <div className="flex items-center">
        <img
          src={logoSrc}
          alt="LORÉA"
          referrerPolicy="no-referrer"
          className={`w-auto object-contain transition-all duration-300 ${
            isCompact
              ? 'h-6 sm:h-7'
              : variant === 'footer'
              ? 'h-8 sm:h-9'
              : 'h-8 sm:h-9 md:h-10'
          }`}
        />
      </div>
      {(subtext || variant === 'footer') && (
        <span
          className="text-[9px] sm:text-[10px] uppercase font-sans tracking-[0.36em] mt-1.5 font-light opacity-80"
          style={{ color: subColor }}
        >
          ATELIER · CAIRO
        </span>
      )}
    </div>
  );
};

