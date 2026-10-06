/**
 * LORÉA Haute Couture - Site & Domain Configuration
 * Supports custom domain mapping (e.g. https://www.loreaofficial.com)
 * Configurable via environment variables (VITE_SITE_URL or SITE_URL).
 */

export const SITE_CONFIG = {
  name: 'LORÉA',
  legalName: 'LORÉA Atelier Cairo S.A.E.',
  brandTagline: 'Quiet Luxury & Timeless Poise',
  description: 'Bespoke modern silhouettes, tailored outerwear, and quiet-luxury essentials crafted in Cairo from rare European and Egyptian textiles.',
  defaultDomain: 'loreafashion.ai.studio',
  baseUrl: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) 
    || (typeof process !== 'undefined' && process.env?.SITE_URL) 
    || 'https://loreafashion.ai.studio',
  currency: {
    code: 'EGP',
    symbol: 'EGP',
    name: 'Egyptian Pound',
    rateToUsd: 0.02,
  },
  contact: {
    email: 'concierge@loreaofficial.com',
    phone: '+20 100 892 4410',
    address: '14 Hassan Sabry Street, Zamalek, Cairo, Egypt',
    hours: 'Saturday – Thursday: 10:00 AM – 9:00 PM',
  },
  socials: {
    instagram: 'https://instagram.com/lorea_official',
    facebook: 'https://facebook.com/loreaofficial',
    pinterest: 'https://pinterest.com/loreaofficial',
  },
} as const;

export function getCanonicalUrl(path = ''): string {
  const cleanBase = SITE_CONFIG.baseUrl.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath === '/' ? '' : cleanPath}`;
}
