import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  url?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Editorial Luxury Breadcrumbs Component
 * Accessible <nav aria-label="Breadcrumb"> with microdata/aria compliance.
 * Minimalist typography matching LORÉA aesthetic.
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumbs" className={`py-3 text-[11px] font-medium tracking-[0.16em] uppercase text-[#7C746B] ${className}`}>
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center">
              {index > 0 && (
                <ChevronRight className="w-3 h-3 mx-1 text-[#C2B8AA] shrink-0 stroke-[1.5]" />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className="text-[#1D1D1B] font-semibold truncate max-w-[220px] sm:max-w-xs"
                >
                  {item.label}
                </span>
              ) : item.onClick ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="hover:text-[#BA945A] transition-colors focus-visible:outline-none focus-visible:underline cursor-pointer"
                >
                  {item.label}
                </button>
              ) : item.url ? (
                <a
                  href={item.url}
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      window.history.pushState({}, '', item.url);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-[#BA945A] transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  {item.label}
                </a>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
