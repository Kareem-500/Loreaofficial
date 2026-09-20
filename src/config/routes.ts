import { Product } from '../types';

/** Canonical public routes for the Vite SPA. Legacy aliases remain supported by the parser. */
export const ROUTES = {
  HOME: '/',
  STORE: '/shop',
  SHOP: '/shop',
  NEW_IN: '/new-in',
  SALE: '/sale',
  COLLECTIONS: '/collection',
  SEARCH: '/search',
  WISHLIST: '/wishlist',
  ACCOUNT: '/account',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ABOUT: '/story',
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

export function slugify(text: string): string {
  return text.toString().toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildProductUrl(productOrSlug: Product | string): string {
  const slug = typeof productOrSlug === 'string'
    ? slugify(productOrSlug)
    : productOrSlug.slug || slugify(productOrSlug.name);
  return appPath(`/product/${slug}`);
}

/** Normalize display labels and legacy category names to public collection slugs. */
export function normalizeCategorySlug(category: string): string {
  const value = slugify(category);
  const aliases: Record<string, string> = {
    'trousers-skirts': 'bottoms',
    pants: 'bottoms',
    'modest-edit': 'modest',
    'modest-wear': 'modest',
    'loungewear-sleepwear': 'loungewear',
    collections: ''
  };
  return aliases[value] ?? value;
}

export function buildCategoryUrl(categorySlug: string, subcategorySlug?: string): string {
  const cleanCat = normalizeCategorySlug(categorySlug);
  if (!cleanCat) return appPath(ROUTES.COLLECTIONS);
  const suffix = !subcategorySlug || subcategorySlug === 'all'
    ? ''
    : `?subcategory=${slugify(subcategorySlug)}`;
  return appPath(`/collection/${cleanCat}${suffix}`);
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

const COLLECTION_SLUGS = new Set([
  'dresses', 'tops', 'bottoms', 'pants', 'sets', 'outerwear',
  'modest', 'modest-edit', 'loungewear', 'scarves', 'trousers-skirts'
]);

export function parseCurrentRoute(
  pathname = window.location.pathname,
  search = window.location.search
): ParsedRoute {
  const base = BASE_PATH && BASE_PATH !== '/' ? BASE_PATH : '';
  const withoutBase = base && pathname.startsWith(base)
    ? pathname.slice(base.length) || '/'
    : pathname;
  const cleanPath = withoutBase.replace(/\/+$/, '') || '/';
  const params = new URLSearchParams(search);
  const categoryParam = params.get('category') || undefined;
  const subcategoryParam = params.get('subcategory') || undefined;
  const searchQuery = params.get('q') || undefined;

  if (cleanPath === '/') return { pathname: '/', view: 'home' };
  if (cleanPath === '/new-in' || cleanPath === '/store/new-in') {
    return { pathname: '/new-in', view: 'new-in', categoryParam: 'new-in' };
  }
  if (cleanPath === '/sale') return { pathname: '/sale', view: 'sale', categoryParam: 'sale' };
  if (cleanPath === '/shop' || cleanPath === '/store' || cleanPath === '/clothing') {
    return { pathname: '/shop', view: 'store', categoryParam, subcategoryParam };
  }
  if (cleanPath === '/collection' || cleanPath === '/collections') {
    return { pathname: '/collection', view: 'collections' };
  }

  const collectionMatch = cleanPath.match(/^\/collection\/([^/]+)$/);
  if (collectionMatch) {
    const rawCategory = slugify(collectionMatch[1]);
    if (!COLLECTION_SLUGS.has(rawCategory)) {
      return { pathname: cleanPath, view: '404', is404: true };
    }
    return {
      pathname: cleanPath,
      view: 'store',
      categoryParam: normalizeCategorySlug(rawCategory),
      subcategoryParam
    };
  }

  const productMatch = cleanPath.match(/^\/product\/([^/]+)$/);
  if (productMatch) return { pathname: cleanPath, view: 'product', productSlug: productMatch[1] };
  if (cleanPath === '/search') return { pathname: cleanPath, view: 'search', searchQuery };
  if (cleanPath === '/wishlist') return { pathname: cleanPath, view: 'wishlist' };
  if (cleanPath === '/account') return { pathname: cleanPath, view: 'account' };
  if (cleanPath === '/cart') return { pathname: cleanPath, view: 'cart' };
  if (cleanPath === '/checkout') return { pathname: cleanPath, view: 'checkout' };
  if (cleanPath === '/about' || cleanPath === '/story') return { pathname: '/story', view: 'about' };
  if (cleanPath === '/journal') return { pathname: cleanPath, view: 'journal' };
  if (cleanPath === '/contact') return { pathname: cleanPath, view: 'contact' };
  if (cleanPath === '/shipping') return { pathname: cleanPath, view: 'shipping' };
  if (cleanPath === '/returns') return { pathname: cleanPath, view: 'returns' };
  if (cleanPath === '/faq') return { pathname: cleanPath, view: 'faq' };
  if (cleanPath === '/admin') return { pathname: cleanPath, view: 'admin' };
  return { pathname: cleanPath, view: '404', is404: true };
}
