import { Product } from '../types';

/**
 * LORÉA Centralized Routing Configuration
 * Provides unified, single-source-of-truth route constants, URL builders, and route parsing.
 */

export const ROUTES = {
  HOME: '/',
  STORE: '/store',
  SHOP: '/shop',
  NEW_IN: '/store/new-in',
  SALE: '/sale',
  COLLECTIONS: '/collections',
  SEARCH: '/search',
  WISHLIST: '/wishlist',
  ACCOUNT: '/account',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ABOUT: '/about',
  JOURNAL: '/journal',
  CONTACT: '/contact',
  SHIPPING: '/shipping',
  RETURNS: '/returns',
  FAQ: '/faq',
  ADMIN: '/admin'
} as const;

const BASE_PATH = import.meta.env.BASE_URL === './'
  ? ''
  : import.meta.env.BASE_URL.replace(/\/$/, '');

export function appPath(path: string): string {
  return `${BASE_PATH}${path === '/' ? '/' : path}`;
}

export type RouteKey = keyof typeof ROUTES;

/**
 * Converts a string into a clean lowercase kebab-case slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Build URL for a product
 */
export function buildProductUrl(productOrSlug: Product | string): string {
  if (typeof productOrSlug === 'string') {
    return appPath(`/product/${slugify(productOrSlug)}`);
  }
  const slug = productOrSlug.slug || slugify(productOrSlug.name);
  return appPath(`/product/${slug}`);
}

/**
 * Build URL for a store category and optional subcategory
 */
export function buildCategoryUrl(categorySlug: string, subcategorySlug?: string): string {
  const cleanCat = slugify(categorySlug);
  if (!subcategorySlug || subcategorySlug === 'all') {
    return appPath(`/collection/${cleanCat}`);
  }
  return appPath(`/collection/${cleanCat}?subcategory=${slugify(subcategorySlug)}`);
}

export interface ParsedRoute {
  pathname: string;
  view: string;
  productSlug?: string;
  categoryParam?: string;
  subcategoryParam?: string;
  searchQuery?: string;
  is404?: boolean;
}

/**
 * Parses the current window.location into route state
 */
export function parseCurrentRoute(
  pathname = window.location.pathname,
  search = window.location.search
): ParsedRoute {
  const normalizedBasePath = BASE_PATH && BASE_PATH !== '/' ? BASE_PATH : '';
  const pathWithoutBase = normalizedBasePath && pathname.startsWith(normalizedBasePath)
    ? pathname.slice(normalizedBasePath.length) || '/'
    : pathname;
  const cleanPath = pathWithoutBase.replace(/\/+$/, '') || '/';
  const searchParams = new URLSearchParams(search);
  const categoryParam = searchParams.get('category') || undefined;
  const subcategoryParam = searchParams.get('subcategory') || undefined;
  const searchQuery = searchParams.get('q') || undefined;

  // 1. Root Homepage
  if (cleanPath === '/' || cleanPath === '') {
    return { pathname: '/', view: 'home' };
  }

  // 2. New In
  if (cleanPath === '/store/new-in' || cleanPath === '/new-in') {
    return { pathname: '/store/new-in', view: 'new-in', categoryParam: 'new-in' };
  }

  if (cleanPath === '/sale') {
    return { pathname: '/sale', view: 'sale', categoryParam: 'sale' };
  }

  // 3. Store / Shop
  if (cleanPath === '/store' || cleanPath === '/shop' || cleanPath === '/clothing') {
    return {
      pathname: '/store',
      view: 'store',
      categoryParam,
      subcategoryParam
    };
  }

  // 4. Collections
  if (cleanPath === '/collections' || cleanPath === '/collection') {
    return { pathname: '/collections', view: 'collections' };
  }

  const collectionMatch = cleanPath.match(/^\/collection\/([^/]+)/);
  if (collectionMatch) {
    return {
      pathname: cleanPath,
      view: 'store',
      categoryParam: collectionMatch[1],
      subcategoryParam
    };
  }

  // 5. Product Page (/product/:slug)
  const productMatch = cleanPath.match(/^\/product\/([^/]+)/);
  if (productMatch) {
    return {
      pathname: cleanPath,
      view: 'product',
      productSlug: productMatch[1]
    };
  }

  // 6. Search
  if (cleanPath === '/search') {
    return { pathname: '/search', view: 'search', searchQuery };
  }

  // 7. Wishlist
  if (cleanPath === '/wishlist') {
    return { pathname: '/wishlist', view: 'wishlist' };
  }

  // 8. Account
  if (cleanPath === '/account') {
    return { pathname: '/account', view: 'account' };
  }

  // 9. Cart
  if (cleanPath === '/cart') {
    return { pathname: '/cart', view: 'cart' };
  }

  // 10. Checkout
  if (cleanPath === '/checkout') {
    return { pathname: '/checkout', view: 'checkout' };
  }

  // 11. Static Pages
  if (cleanPath === '/about' || cleanPath === '/story') {
    return { pathname: '/about', view: 'about' };
  }
  if (cleanPath === '/journal') {
    return { pathname: '/journal', view: 'journal' };
  }
  if (cleanPath === '/contact') {
    return { pathname: '/contact', view: 'contact' };
  }
  if (cleanPath === '/shipping') {
    return { pathname: '/shipping', view: 'shipping' };
  }
  if (cleanPath === '/returns') {
    return { pathname: '/returns', view: 'returns' };
  }
  if (cleanPath === '/faq') {
    return { pathname: '/faq', view: 'faq' };
  }
  if (cleanPath === '/admin') {
    return { pathname: '/admin', view: 'admin' };
  }

  // Unknown route -> 404
  return { pathname: cleanPath, view: '404', is404: true };
}
