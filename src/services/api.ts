// Typed API client for LORÉA
import { isSupabaseConfigured } from '../lib/supabase';
import {
  supabaseAddressService,
  supabaseFavoriteService,
  supabaseOrderService,
  supabaseCouponService,
  supabaseAdminService,
} from './supabaseService';

export interface User {
  id: string;
  uuid: string;
  email: string;
  role: 'customer' | 'admin' | 'super_admin' | 'manager' | 'support';
  firstName: string;
  lastName: string;
  phone?: string;
  emailVerified: boolean;
  city?: string;
  country?: string;
  permissions?: string[];
  createdAt?: string;
  lastLoginAt?: string;
}

export interface CustomerProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  email: string;
  date_of_birth?: string;
  gender?: string;
  bio?: string;
  country?: string;
  city?: string;
  avatar_url?: string;
  marketing_consent?: number;
  email_verified?: number;
  member_since?: string;
}

export interface Address {
  id: string;
  customer_id: string;
  full_name: string;
  phone: string;
  governorate: string;
  city: string;
  area?: string;
  street: string;
  building_number: string;
  apartment?: string;
  floor?: string;
  postal_code?: string;
  instructions?: string;
  is_default: number;
}

export interface OrderItem {
  id: string;
  product_id?: string;
  product_name_snapshot: string;
  sku_snapshot: string;
  color_name?: string;
  size?: string;
  price: number;
  quantity: number;
  total: number;
  image_url?: string;
}

export interface OrderTimeline {
  id: string;
  status: string;
  notes?: string;
  updated_by?: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_status: 'unfulfilled' | 'preparing' | 'in_transit' | 'delivered';
  subtotal: number;
  discount: number;
  shipping_cost: number;
  tax: number;
  total: number;
  currency: string;
  payment_method: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  shippingAddress: {
    fullName?: string;
    phone?: string;
    governorate?: string;
    city?: string;
    street?: string;
    buildingNumber?: string;
  };
  items?: OrderItem[];
  items_count?: number;
  timeline?: OrderTimeline[];
}

function getStoredToken(): string | null {
  try {
    return localStorage.getItem('lorea_jwt_token');
  } catch {
    return null;
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function getApiUrl(url: string): string {
  return `${API_BASE_URL}${url}`;
}

export function setStoredToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem('lorea_jwt_token', token);
    } else {
      localStorage.removeItem('lorea_jwt_token');
    }
  } catch {
    // ignore
  }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(getApiUrl(url), {
    ...options,
    headers,
    credentials: 'include', // sends cookies
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Authentication
  auth: {
    register: (body: any) => request<{ message: string; token: string; user: User; verificationToken?: string }>('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (email: string, password: string, rememberMe = false) =>
      request<{ message: string; token: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, rememberMe }),
      }),
    logout: () => request<{ message: string }>('/api/auth/logout', { method: 'POST' }),
    me: () => request<{ user: User | null }>('/api/auth/me'),
    forgotPassword: (email: string) => request<{ message: string; previewResetToken?: string }>('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (token: string, newPassword: string, confirmPassword: string) =>
      request<{ message: string }>('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      }),
    verifyEmail: (token: string) => request<{ message: string; verified: boolean }>('/api/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) }),
    resendVerification: (email?: string) => request<{ message: string; previewToken?: string }>('/api/auth/resend-verification', { method: 'POST', body: JSON.stringify({ email }) }),
  },

  // Customer Account
  account: {
    getProfile: async () => {
      return request<{ profile: CustomerProfile }>('/api/account/profile');
    },
    updateProfile: (data: Partial<CustomerProfile>) => request<{ message: string }>('/api/account/profile', { method: 'PUT', body: JSON.stringify(data) }),
    getOrders: async () => {
      if (isSupabaseConfigured()) {
        try {
          const sbOrders = await supabaseOrderService.getUserOrders();
          if (sbOrders && sbOrders.length > 0) {
            const mappedOrders: Order[] = sbOrders.map((o) => ({
              id: o.id,
              order_number: o.order_number,
              customer_id: o.user_id,
              user_id: o.user_id,
              status: o.status as any,
              payment_status: o.payment_status as any,
              shipping_status: o.fulfillment_status as any,
              subtotal: Number(o.subtotal),
              discount: Number(o.discount_amount),
              shipping_cost: Number(o.shipping_amount),
              tax: 0,
              total: Number(o.total_amount),
              currency: o.currency,
              payment_method: 'Cash on Delivery (Egypt)',
              created_at: o.created_at,
              updated_at: o.updated_at,
              shippingAddress: {
                fullName: o.shipping_full_name,
                phone: o.shipping_phone,
                governorate: o.shipping_governorate,
                city: o.shipping_city,
                street: o.shipping_street,
                buildingNumber: o.shipping_building,
              },
              items: (o.order_items || []).map((oi) => ({
                id: oi.id,
                product_name_snapshot: oi.product_name,
                sku_snapshot: oi.sku,
                color_name: oi.color,
                size: oi.size,
                price: Number(oi.unit_price),
                quantity: oi.quantity,
                total: Number(oi.total_price),
                image_url: oi.image_url || undefined,
              })),
            }));
            return { orders: mappedOrders };
          }
        } catch (e) {
          console.warn('Supabase orders fallback:', e);
        }
      }
      return request<{ orders: Order[] }>('/api/account/orders');
    },
    getOrderDetails: (id: string) => request<{ order: Order }>('/api/account/orders/' + id),
    getAddresses: async () => {
      if (isSupabaseConfigured()) {
        try {
          const sbAddrs = await supabaseAddressService.getAddresses();
          const mappedAddrs: Address[] = sbAddrs.map((a) => ({
            id: a.id,
            customer_id: a.user_id,
            full_name: a.full_name,
            phone: a.phone,
            governorate: a.governorate,
            city: a.city,
            area: a.area || undefined,
            street: a.street,
            building_number: a.building,
            apartment: a.apartment || undefined,
            is_default: a.is_default ? 1 : 0,
          }));
          return { addresses: mappedAddrs };
        } catch (e) {
          console.warn('Supabase addresses fallback:', e);
        }
      }
      return request<{ addresses: Address[] }>('/api/account/addresses');
    },
    createAddress: async (data: any) => {
      if (isSupabaseConfigured()) {
        try {
          const created = await supabaseAddressService.createAddress({
            full_name: data.full_name,
            phone: data.phone,
            governorate: data.governorate,
            city: data.city,
            area: data.area || null,
            street: data.street,
            building: data.building_number || data.building,
            apartment: data.apartment || null,
            postal_code: data.postal_code || null,
            notes: data.notes || null,
            is_default: Boolean(data.is_default),
          });
          return { message: 'Address saved in Supabase', id: created.id };
        } catch (e) {
          console.warn('Supabase createAddress fallback:', e);
        }
      }
      return request<{ message: string; id: string }>('/api/account/addresses', { method: 'POST', body: JSON.stringify(data) });
    },
    updateAddress: (id: string, data: any) => request<{ message: string }>('/api/account/addresses/' + id, { method: 'PUT', body: JSON.stringify(data) }),
    deleteAddress: async (id: string) => {
      if (isSupabaseConfigured()) {
        try {
          await supabaseAddressService.deleteAddress(id);
          return { message: 'Address removed from Supabase' };
        } catch (e) {
          console.warn('Supabase deleteAddress fallback:', e);
        }
      }
      return request<{ message: string }>('/api/account/addresses/' + id, { method: 'DELETE' });
    },
    changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) =>
      request<{ message: string }>('/api/account/security/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      }),
    getSessions: () => request<{ sessions: any[] }>('/api/account/security/sessions'),
    logoutAll: () => request<{ message: string }>('/api/account/security/logout-all', { method: 'POST' }),
  },

  // Wishlist
  wishlist: {
    get: async () => {
      if (isSupabaseConfigured()) {
        try {
          const ids = await supabaseFavoriteService.getFavorites();
          return { productIds: ids, products: [] };
        } catch (e) {
          console.warn('Supabase wishlist fallback:', e);
        }
      }
      return request<{ productIds: string[]; products: any[] }>('/api/wishlist');
    },
    add: async (productId: string) => {
      if (isSupabaseConfigured()) {
        try {
          await supabaseFavoriteService.addFavorite(productId);
          return { message: 'Item saved to wishlist', productId };
        } catch (e) {
          console.warn('Supabase wishlist add fallback:', e);
        }
      }
      return request<{ message: string; productId: string }>('/api/wishlist', { method: 'POST', body: JSON.stringify({ productId }) });
    },
    remove: async (productId: string) => {
      if (isSupabaseConfigured()) {
        try {
          await supabaseFavoriteService.removeFavorite(productId);
          return { message: 'Item removed from wishlist', productId };
        } catch (e) {
          console.warn('Supabase wishlist remove fallback:', e);
        }
      }
      return request<{ message: string; productId: string }>('/api/wishlist/' + productId, { method: 'DELETE' });
    },
    toggle: async (productId: string) => {
      if (isSupabaseConfigured()) {
        try {
          const added = await supabaseFavoriteService.toggleFavorite(productId);
          return { message: added ? 'Saved to wishlist' : 'Removed from wishlist', action: added ? 'added' : 'removed' };
        } catch (e) {
          console.warn('Supabase toggle fallback:', e);
        }
      }
      try {
        return await request<{ message: string; action: string }>('/api/wishlist/toggle', {
          method: 'POST',
          body: JSON.stringify({ productId }),
        });
      } catch {
        return await request<{ message: string; productId: string }>('/api/wishlist', {
          method: 'POST',
          body: JSON.stringify({ productId }),
        });
      }
    },
    merge: (guestIds: string[]) => request<{ message: string; productIds: string[] }>('/api/wishlist/merge', { method: 'POST', body: JSON.stringify({ guestIds }) }),
  },

  // Orders / Checkout
  orders: {
    create: async (payload: any) => {
      if (isSupabaseConfigured()) {
        try {
          const res = await supabaseOrderService.createOrder({
            shippingFullName: payload.shippingFullName || payload.name,
            shippingPhone: payload.shippingPhone || payload.phone,
            shippingGovernorate: payload.shippingGovernorate || payload.governorate,
            shippingCity: payload.shippingCity || payload.city,
            shippingStreet: payload.shippingStreet || payload.street,
            shippingBuilding: payload.shippingBuilding || payload.building || '1',
            shippingApartment: payload.shippingApartment || payload.apartment,
            shippingArea: payload.shippingArea || payload.area,
            customerNotes: payload.customerNotes || payload.notes,
            couponCode: payload.couponCode || payload.promoCode,
            items: payload.items?.map((item: any) => ({
              variant_id: item.variantId || item.id,
              quantity: item.quantity,
            })),
          });
          return {
            message: 'Order created via Supabase PostgreSQL transactional function',
            order: { id: res.order_id, order_number: res.order_number },
          };
        } catch (e) {
          console.warn('Supabase checkout fallback:', e);
        }
      }
      return request<{ message: string; order: { id: string; order_number: string } }>('/api/public/checkout', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  },

  // Admin Control Panel
  admin: {
    getDashboard: () => request<any>('/api/admin/dashboard'),
    getCustomers: (params?: { search?: string; status?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return request<{ customers: any[] }>('/api/admin/customers' + (q ? '?' + q : ''));
    },
    getCustomerDetails: (id: string) => request<{ customer: any }>('/api/admin/customers/' + id),
    updateCustomerStatus: (id: string, status: 'active' | 'disabled') =>
      request<{ message: string }>('/api/admin/customers/' + id + '/status', {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
    getOrders: (params?: { search?: string; status?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return request<{ orders: any[] }>('/api/admin/orders' + (q ? '?' + q : ''));
    },
    getOrderDetails: (id: string) => request<{ order: any }>('/api/admin/orders/' + id),
    updateOrderStatus: (id: string, data: any) =>
      request<{ message: string }>('/api/admin/orders/' + id + '/status', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    getProducts: (params?: { search?: string; category?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return request<{ products: any[] }>('/api/admin/products' + (q ? '?' + q : ''));
    },
    getProductDetails: (id: string) => request<{ product: any }>('/api/admin/products/' + id),
    createProduct: (data: any) => request<{ message: string; productId: string }>('/api/admin/products', { method: 'POST', body: JSON.stringify(data) }),
    updateProduct: (id: string, data: any) => request<{ message: string }>('/api/admin/products/' + id, { method: 'PUT', body: JSON.stringify(data) }),
    getInventory: () => request<{ inventory: any[]; history: any[] }>('/api/admin/inventory'),
    adjustInventory: (data: { variantId: string; quantityChange: number; reason?: string }) =>
      request<{ message: string; variantId: string; previousStock: number; newStock: number }>('/api/admin/inventory/adjust', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getCategories: () => request<{ categories: any[] }>('/api/admin/categories'),
    createCategory: (data: any) => request<{ message: string; id: string }>('/api/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
    getCoupons: () => request<{ coupons: any[] }>('/api/admin/coupons'),
    createCoupon: (data: any) => request<{ message: string; id: string }>('/api/admin/coupons', { method: 'POST', body: JSON.stringify(data) }),
    getReviews: () => request<{ reviews: any[] }>('/api/admin/reviews'),
    updateReview: (id: string, status: string) => request<{ message: string }>('/api/admin/reviews/' + id, { method: 'PUT', body: JSON.stringify({ status }) }),
    getAdminUsers: () => request<{ adminUsers: any[]; roles: any[] }>('/api/admin/admin-users'),
    getActivityLogs: () => request<{ logs: any[] }>('/api/admin/activity-logs'),
    getSettings: () => request<{ settings: Record<string, string> }>('/api/admin/settings'),
    updateSettings: (settings: Record<string, string>) => request<{ message: string }>('/api/admin/settings', { method: 'PUT', body: JSON.stringify({ settings }) }),
  },

  // Public
  public: {
    validateCoupon: async (code: string, subtotal: number) => {
      if (isSupabaseConfigured()) {
        try {
          const res = await supabaseCouponService.validateCoupon(code, subtotal);
          return res;
        } catch (e) {
          console.warn('Supabase coupon validation fallback:', e);
        }
      }
      return request<{ valid: boolean; code: string; discountAmount: number; discountType: string; discountValue: number; message: string }>(
        '/api/public/coupons/validate',
        { method: 'POST', body: JSON.stringify({ code, subtotal }) }
      );
    },
    checkout: async (payload: any) => {
      if (isSupabaseConfigured()) {
        try {
          const res = await supabaseOrderService.createOrder({
            shippingFullName: payload.shippingFullName || payload.name,
            shippingPhone: payload.shippingPhone || payload.phone,
            shippingGovernorate: payload.shippingGovernorate || payload.governorate,
            shippingCity: payload.shippingCity || payload.city,
            shippingStreet: payload.shippingStreet || payload.street,
            shippingBuilding: payload.shippingBuilding || payload.building || '1',
            shippingApartment: payload.shippingApartment || payload.apartment,
            shippingArea: payload.shippingArea || payload.area,
            customerNotes: payload.customerNotes || payload.notes,
            couponCode: payload.couponCode || payload.promoCode,
            items: payload.items?.map((item: any) => ({
              variant_id: item.variantId || item.id,
              quantity: item.quantity,
            })),
          });
          return {
            message: 'Order placed securely via Supabase transactional order function',
            orderId: res.order_id,
            orderNumber: res.order_number,
            total: res.total,
            currency: res.currency,
          };
        } catch (e) {
          console.warn('Supabase public checkout fallback:', e);
        }
      }
      return request<{ message: string; orderId: string; orderNumber: string; total: number; currency: string }>(
        '/api/public/checkout',
        { method: 'POST', body: JSON.stringify(payload) }
      );
    },
  },
};
