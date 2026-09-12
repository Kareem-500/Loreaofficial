import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Project identification & environment extraction
export const SUPABASE_PROJECT_REF = 'gyzxqhcwdyismayrbxva';
export const DEFAULT_SUPABASE_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co`;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseUrl !== 'your_supabase_project_url' &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your_supabase_anon_key' &&
    supabaseUrl.startsWith('https://')
  );
};

// Fallback dummy URL and key for safe instantiation in browser/build environments
const safeUrl = isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co';
const safeKey = isSupabaseConfigured() ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const supabase: SupabaseClient = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Database TypeScript interfaces matching our PostgreSQL schema
export interface SupabaseProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  role: 'customer' | 'admin';
  date_of_birth?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseAddress {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  governorate: string;
  city: string;
  area?: string | null;
  street: string;
  building: string;
  apartment?: string | null;
  postal_code?: string | null;
  notes?: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  is_active: boolean;
  sort_order: number;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseProduct {
  id: string;
  category_id?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  short_description?: string | null;
  sku: string;
  brand: string;
  price: number;
  compare_at_price?: number | null;
  cost_price?: number | null;
  status: 'draft' | 'active' | 'archived';
  is_featured: boolean;
  is_new: boolean;
  is_sale: boolean;
  gender: string;
  material?: string | null;
  care_instructions?: string | null;
  main_image_url?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  category?: SupabaseCategory | null;
  product_images?: SupabaseProductImage[];
  product_variants?: SupabaseProductVariant[];
}

export interface SupabaseProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface SupabaseProductVariant {
  id: string;
  product_id: string;
  sku: string;
  color: string;
  color_hex?: string | null;
  size: string;
  price: number;
  stock_quantity: number;
  reserved_quantity: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseFavorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: SupabaseProduct;
}

export interface SupabaseCartItem {
  id: string;
  user_id: string;
  product_variant_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product_variant?: SupabaseProductVariant & {
    product?: SupabaseProduct;
  };
}

export interface SupabaseOrder {
  id: string;
  order_number: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  fulfillment_status: 'unfulfilled' | 'processing' | 'shipped' | 'delivered' | 'returned';
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  total_amount: number;
  currency: string;
  shipping_full_name: string;
  shipping_phone: string;
  shipping_governorate: string;
  shipping_city: string;
  shipping_area?: string | null;
  shipping_street: string;
  shipping_building: string;
  shipping_apartment?: string | null;
  customer_notes?: string | null;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
  order_items?: SupabaseOrderItem[];
}

export interface SupabaseOrderItem {
  id: string;
  order_id: string;
  product_variant_id?: string | null;
  product_name: string;
  sku: string;
  size: string;
  color: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  image_url?: string | null;
  created_at: string;
}

export interface SupabaseCoupon {
  id: string;
  code: string;
  description?: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_amount: number;
  maximum_discount_amount?: number | null;
  usage_limit?: number | null;
  used_count: number;
  start_at?: string | null;
  expires_at?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseReview {
  id: string;
  product_id: string;
  user_id: string;
  order_id?: string | null;
  rating: number;
  title?: string | null;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user_profile?: SupabaseProfile;
}

export interface SupabaseBanner {
  id: string;
  title: string;
  subtitle?: string | null;
  image_url: string;
  mobile_image_url?: string | null;
  link_url?: string | null;
  button_text?: string | null;
  sort_order: number;
  is_active: boolean;
  start_at?: string | null;
  end_at?: string | null;
  created_at: string;
  updated_at: string;
}
