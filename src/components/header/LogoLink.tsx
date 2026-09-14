import React from 'react';
import { LoreaLogo } from '../LoreaLogo';

export interface LogoLinkProps {
  onNavigate: (view: string) => void;
  isScrolled?: boolean;
  className?: string;
  variant?: 'light' | 'dark' | 'compact' | 'footer' | 'mark' | 'gold';
  ariaLabel?: string;
}

/**
 * LogoLink component:
 * - Semantic root navigation element linking to '/'
 * - Intercepts primary click to smoothly route client-side without full reload
 * - Supports middle-click / open in new tab natively
 * - Accessible with proper aria-label and descriptive alt tags
 * - Strict aspect-ratio preservation across all responsive breakpoints
 */
export const LogoLink: React.FC<LogoLinkProps> = ({
  onNavigate,
  isScrolled = false,
  className = '',
  variant = 'light',
  ariaLabel = 'LORÉA Home'
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only intercept normal left click without modifiers
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      onNavigate('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <a
      href="/"
      onClick={handleClick}
      aria-label={ariaLabel}
      title="LORÉA Home"
      className={`group inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA945A] focus-visible:ring-offset-2 rounded-xs transition-transform duration-300 active:scale-[0.99] ${className}`}
    >
      <LoreaLogo
        variant={variant}
        size="responsive"
        isScrolled={isScrolled}
        subtitle={true}
        className="group-hover:opacity-90 transition-opacity"
      />
    </a>
  );
};
