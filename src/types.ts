export type Currency = 'EGP' | 'USD' | 'EUR' | 'AED';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export type ProductBadge = 'NEW' | 'BEST SELLER' | 'LIMITED' | 'SALE' | null;

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  subtitle: string;
  slug?: string;
  isNew?: boolean;
  category: 'Dresses' | 'Tops' | 'Sets' | 'Outerwear' | 'Bottoms' | 'Pants' | 'Modest Edit' | 'Modest Wear' | 'Loungewear & Sleepwear' | 'Loungewear' | 'Scarves' | string;
  subcategory: string;
  collection: 'New Collection' | 'Essentials' | 'Seasonal' | 'Limited Edition' | 'Best Sellers' | string;
  priceEgp: number;
  priceUsd: number;
  originalPriceEgp?: number;
  originalPriceUsd?: number;
  badge: ProductBadge;
  colors: ProductColor[];
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL')[];
  images: string[];
  description: string;
  fabric: string;
  fit: string;
  care: string;
  shipping: string;
  sku: string;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  isModestEdit: boolean;
  tags: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: ProductColor;
  selectedSize: 'XS' | 'S' | 'M' | 'L' | 'XL';
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  description: string;
  itemCount: number;
}

export interface Article {
  id: string;
  title: string;
  titleAr: string;
  category: 'STYLE' | 'FABRICS' | 'LORÉA STORIES' | 'HOW TO WEAR' | 'CRAFT';
  readTime: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  content: string[];
}

export interface FilterState {
  category: string;
  subcategory: string;
  collection: string;
  size: string;
  color: string;
  priceMax: number;
  fabric: string;
  isModestOnly: boolean;
  sortBy: 'featured' | 'newest' | 'price-low' | 'price-high' | 'rating';
}
