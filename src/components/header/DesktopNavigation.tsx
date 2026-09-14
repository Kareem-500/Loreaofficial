import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface NavLinkItem {
  label: string;
  action: () => void;
  isMega?: boolean;
  isSale?: boolean;
}

export interface DesktopNavigationProps {
  navLinks: NavLinkItem[];
  isMegaMenuOpen: boolean;
  setIsMegaMenuOpen: (open: boolean) => void;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * DesktopNavigation component:
 * - Clean editorial women's luxury typography
 * - Semantic <nav> element with accessible keyboard navigation
 * - Hover & focus interactions with gold accent transitions
 */
export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  navLinks,
  isMegaMenuOpen,
  setIsMegaMenuOpen,
  className = '',
  align = 'center'
}) => {
  const alignClass =
    align === 'left'
      ? 'justify-start'
      : align === 'right'
      ? 'justify-end'
      : 'justify-center';

  return (
    <nav
      aria-label="Main Navigation"
      className={`hidden lg:flex items-center ${alignClass} space-x-5 xl:space-x-7 text-[11px] xl:text-[12px] tracking-[0.18em] font-medium text-[#1D1D1B] ${className}`}
    >
      {navLinks.map((link) => (
        <div
          key={link.label}
          className="relative group py-2"
          onMouseEnter={() => {
            if (link.isMega) setIsMegaMenuOpen(true);
          }}
        >
          <button
            onClick={() => {
              link.action();
              setIsMegaMenuOpen(false);
            }}
            aria-expanded={link.isMega ? isMegaMenuOpen : undefined}
            aria-haspopup={link.isMega ? 'true' : undefined}
            className={`group/btn relative py-1 inline-flex items-center transition-colors duration-200 hover:text-[#BA945A] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] rounded-xs ${
              link.isSale ? 'text-[#964036] font-semibold' : ''
            }`}
          >
            <span>{link.label}</span>
            {link.isMega && (
              <ChevronDown
                className={`w-3 h-3 ml-1 opacity-60 transition-transform duration-300 ${
                  isMegaMenuOpen ? 'rotate-180 text-[#BA945A]' : 'group-hover/btn:rotate-180'
                }`}
              />
            )}
            {/* Subtle underline indicator on active/hover */}
            <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-[#BA945A] transition-all duration-300 group-hover/btn:w-full" />
          </button>
        </div>
      ))}
    </nav>
  );
};
