import { Product } from '../types';

/**
 * LORÉA's single routing source of truth.
 *
 * The storefront is deployed as a Vite SPA (including GitHub Pages), so the
 * parser below deliberately accepts the legacy aliases as well as the
 * canonical public URLs. This keeps old bookmarks working while all newly
 * generated links use the requested URL structure.
 */
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
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildProductUrl(productOrSlug: Product | string): string {
  if (typeof productOrSlug === 'string') {
    return appPath(`/product/${slugify(productOrSlug)}`);
  }
  const slug = productOrSlug.slug || slugify(productOrSlug.name);
  return appPath(`/product/${slug}`);
}

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

// Keep this list local to the router to avoid coupling route parsing to UI data.
// It includes every category exposed by the current navigation and its legacy
// aliases, while still allowing an unknown collection URL to reach the 404 UI.
const COLLECTION_SLUGS = new Set([
  'dresses', 'tops', 'bottoms', 'sets', 'outerwear', 'modest',
  'loungewear', 'scarves'
]);

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

  if (cleanPath === '/') return { pathname: '/', view: 'home' };

  if (cleanPath === '/new-in' || cleanPath === '/store/new-in') {
    return { pathname: '/new-in', view: 'new-in', categoryParam: 'new-in' };
  }

  if (cleanPath === '/sale') {
    return { pathname: '/sale', view: 'sale', categoryParam: 'sale' };
  }

  if (cleanPath === '/shop' || cleanPath === '/store' || cleanPath === '/clothing') {
    return { pathname: '/shop', view: 'store', categoryParam, subcategoryParam };
  }

  if (cleanPath === '/collection' || cleanPath === '/collections') {
    return { pathname: '/collection', view: 'collections' };
  }

  const collectionMatch = cleanPath.match(/^\/collection\/([^/]+)$/);
  if (collectionMatch) {
    const category = slugify(collectionMatch[1]);
    if (!COLLECTION_SLUGS.has(category)) {
      return { pathname: cleanPath, view: '404', is404: true };
    }
    return {
      pathname: cleanPath,
      view: 'store',
      categoryParam: category,
      subcategoryParam
    };
  }

  const productMatch = cleanPath.match(/^\/product\/([^/]+)$/);
  if (productMatch) {
    return { pathname: cleanPath, view: 'product', productSlug: productMatch[1] };
  }

  if (cleanPath === '/search') return { pathname: '/search', view: 'search', searchQuery };
  if (cleanPath === '/wishlist') return { pathname: '/wishlist', view: 'wishlist' };
  if (cleanPath === '/account') return { pathname: '/account', view: 'account' };
  if (cleanPath === '/cart') return { pathname: '/cart', view: 'cart' };
  if (cleanPath === '/checkout') return { pathname: '/checkout', view: 'checkout' };
  if (cleanPath === '/about' || cleanPath === '/story') return { pathname: '/story', view: 'about' };
  if (cleanPath === '/journal') return { pathname: '/journal', view: 'journal' };
  if (cleanPath === '/contact') return { pathname: '/contact', view: 'contact' };
  if (cleanPath === '/shipping') return { pathname: '/shipping', view: 'shipping' };
  if (cleanPath === '/returns') return { pathname: '/returns', view: 'returns' };
  if (cleanPath === '/faq') return { pathname: '/faq', view: 'faq' };
  if (cleanPath === '/admin') return { pathname: '/admin', view: 'admin' };

  return { pathname: cleanPath, view: '404', is404: true };
}
