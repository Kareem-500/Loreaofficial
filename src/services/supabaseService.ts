import { supabase, isSupabaseConfigured, SupabaseProfile, SupabaseAddress, SupabaseProduct, SupabaseCategory, SupabaseOrder, SupabaseCoupon } from '../lib/supabase';

// ============================================================================
// 1. AUTHENTICATION & PROFILE SERVICE
// ============================================================================

export const supabaseAuthService = {
  async signUp(email: string, password: string, fullName: string, phone?: string) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase project URL and Anon Key not yet configured.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || '',
        },
      },
    });

    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase project URL and Anon Key not yet configured.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPasswordForEmail(email: string) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured.');
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return data;
  },

  async updatePassword(newPassword: string) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
    return data;
  },

  async getCurrentProfile(): Promise<SupabaseProfile | null> {
    if (!isSupabaseConfigured()) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.warn('Profile fetch note:', error.message);
      return null;
    }
    return data as SupabaseProfile;
  },

  async updateProfile(updates: Partial<SupabaseProfile>) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ============================================================================
// 2. ADDRESS BOOK SERVICE
// ============================================================================

export const supabaseAddressService = {
  async getAddresses(): Promise<SupabaseAddress[]> {
    if (!isSupabaseConfigured()) return [];

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as SupabaseAddress[];
  },

  async createAddress(address: Omit<SupabaseAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<SupabaseAddress> {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    if (address.is_default) {
      // Clear previous default
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert({
        ...address,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as SupabaseAddress;
  },

  async updateAddress(id: string, updates: Partial<SupabaseAddress>): Promise<SupabaseAddress> {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    if (updates.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const { data, error } = await supabase
      .from('addresses')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data as SupabaseAddress;
  },

  async deleteAddress(id: string): Promise<void> {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },
};

// ============================================================================
// 3. CATALOG & CATEGORIES SERVICE
// ============================================================================

export const supabaseProductService = {
  async getCategories(): Promise<SupabaseCategory[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return (data || []) as SupabaseCategory[];
  },

  async getProducts(params?: {
    categorySlug?: string;
    isFeatured?: boolean;
    isNew?: boolean;
    isSale?: boolean;
    limit?: number;
  }): Promise<SupabaseProduct[]> {
    if (!isSupabaseConfigured()) return [];

    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        product_images(*),
        product_variants(*)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (params?.isFeatured) query = query.eq('is_featured', true);
    if (params?.isNew) query = query.eq('is_new', true);
    if (params?.isSale) query = query.eq('is_sale', true);
    if (params?.limit) query = query.limit(params.limit);

    const { data, error } = await query;
    if (error) throw error;

    let results = (data || []) as SupabaseProduct[];
    if (params?.categorySlug) {
      results = results.filter((p) => p.category?.slug === params.categorySlug);
    }
    return results;
  },

  async getProductBySlug(slug: string): Promise<SupabaseProduct | null> {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        product_images(*),
        product_variants(*)
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      console.warn('Product fetch error:', error.message);
      return null;
    }
    return data as SupabaseProduct;
  },
};

// ============================================================================
// 4. WISHLIST / FAVORITES SERVICE
// ============================================================================

export const supabaseFavoriteService = {
  async getFavorites(): Promise<string[]> {
    if (!isSupabaseConfigured()) return [];

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);

    if (error) {
      console.warn('Favorites fetch note:', error.message);
      return [];
    }
    return (data || []).map((f) => f.product_id);
  },

  async addFavorite(productId: string): Promise<void> {
    if (!isSupabaseConfigured()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('favorites').upsert(
      { user_id: user.id, product_id: productId },
      { onConflict: 'user_id,product_id' }
    );
  },

  async removeFavorite(productId: string): Promise<void> {
    if (!isSupabaseConfigured()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);
  },

  async toggleFavorite(productId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .maybeSingle();

    if (data) {
      await this.removeFavorite(productId);
      return false;
    } else {
      await this.addFavorite(productId);
      return true;
    }
  },
};

// ============================================================================
// 5. SHOPPING CART SERVICE
// ============================================================================

export const supabaseCartService = {
  async getCart() {
    if (!isSupabaseConfigured()) return [];

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        product_variant:product_variants(
          id,
          sku,
          color,
          color_hex,
          size,
          price,
          stock_quantity,
          reserved_quantity,
          product:products(
            id,
            name,
            slug,
            main_image_url
          )
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.warn('Cart items fetch note:', error.message);
      return [];
    }
    return data || [];
  },

  async addToCart(variantId: string, quantity: number = 1) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user.id)
      .eq('product_variant_id', variantId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('cart_items')
        .update({
          quantity: existing.quantity + quantity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('cart_items').insert({
        user_id: user.id,
        product_variant_id: variantId,
        quantity,
      });
      if (error) throw error;
    }
  },

  async updateQuantity(cartItemId: string, quantity: number) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');

    if (quantity <= 0) {
      return this.removeFromCart(cartItemId);
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('id', cartItemId);

    if (error) throw error;
  },

  async removeFromCart(cartItemId: string) {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);
    if (error) throw error;
  },

  async clearCart() {
    if (!isSupabaseConfigured()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('cart_items').delete().eq('user_id', user.id);
  },
};

// ============================================================================
// 6. ORDER CREATION & HISTORY (RPC & DATABASE INTEGRATION)
// ============================================================================

export interface OrderCheckoutPayload {
  shippingFullName: string;
  shippingPhone: string;
  shippingGovernorate: string;
  shippingCity: string;
  shippingStreet: string;
  shippingBuilding: string;
  shippingApartment?: string;
  shippingArea?: string;
  customerNotes?: string;
  couponCode?: string;
  items?: Array<{ variant_id: string; quantity: number }>;
}

export const supabaseOrderService = {
  // Executes the atomic, server-side PostgreSQL function create_order()
  async createOrder(payload: OrderCheckoutPayload) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured.');
    }

    const { data, error } = await supabase.rpc('create_order', {
      p_shipping_full_name: payload.shippingFullName,
      p_shipping_phone: payload.shippingPhone,
      p_shipping_governorate: payload.shippingGovernorate,
      p_shipping_city: payload.shippingCity,
      p_shipping_street: payload.shippingStreet,
      p_shipping_building: payload.shippingBuilding,
      p_shipping_apartment: payload.shippingApartment || null,
      p_shipping_area: payload.shippingArea || null,
      p_customer_notes: payload.customerNotes || null,
      p_coupon_code: payload.couponCode || null,
      p_items: payload.items || null,
    });

    if (error) {
      console.error('Supabase create_order error:', error);
      throw new Error(error.message || 'Failed to complete order checkout');
    }

    return data as {
      order_id: string;
      order_number: string;
      subtotal: number;
      discount: number;
      shipping: number;
      total: number;
      currency: string;
    };
  },

  async getUserOrders(): Promise<SupabaseOrder[]> {
    if (!isSupabaseConfigured()) return [];

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as SupabaseOrder[];
  },

  async getOrderById(orderId: string): Promise<SupabaseOrder | null> {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('id', orderId)
      .single();

    if (error) return null;
    return data as SupabaseOrder;
  },
};

// ============================================================================
// 7. COUPON VALIDATION SERVICE
// ============================================================================

export const supabaseCouponService = {
  async validateCoupon(code: string, subtotal: number): Promise<{
    valid: boolean;
    code: string;
    discountAmount: number;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    message: string;
  }> {
    if (!isSupabaseConfigured()) {
      return { valid: false, code, discountAmount: 0, discountType: 'percentage', discountValue: 0, message: 'Supabase not connected' };
    }

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      return {
        valid: false,
        code,
        discountAmount: 0,
        discountType: 'percentage',
        discountValue: 0,
        message: 'Invalid discount code.',
      };
    }

    const coupon = data as SupabaseCoupon;

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return { valid: false, code, discountAmount: 0, discountType: coupon.discount_type, discountValue: coupon.discount_value, message: 'This coupon code has expired.' };
    }

    // Check min order amount
    if (subtotal < coupon.minimum_order_amount) {
      return {
        valid: false,
        code,
        discountAmount: 0,
        discountType: coupon.discount_type,
        discountValue: coupon.discount_value,
        message: `Order must be at least ${coupon.minimum_order_amount} EGP to use this coupon.`,
      };
    }

    // Check usage limits
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return { valid: false, code, discountAmount: 0, discountType: coupon.discount_type, discountValue: coupon.discount_value, message: 'This coupon has reached its usage limit.' };
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (subtotal * coupon.discount_value) / 100;
      if (coupon.maximum_discount_amount && discountAmount > coupon.maximum_discount_amount) {
        discountAmount = coupon.maximum_discount_amount;
      }
    } else {
      discountAmount = coupon.discount_value;
    }

    if (discountAmount > subtotal) discountAmount = subtotal;

    return {
      valid: true,
      code: coupon.code,
      discountAmount,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      message: `Coupon applied: ${coupon.discount_value}${coupon.discount_type === 'percentage' ? '%' : ' EGP'} privilege savings!`,
    };
  },
};

// ============================================================================
// 8. ADMIN OPERATIONS SERVICE (DATABASE-ENFORCED)
// ============================================================================

export const supabaseAdminService = {
  async isUserAdmin(): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    const { data, error } = await supabase.rpc('is_admin');
    if (error) return false;
    return Boolean(data);
  },

  async getDashboardMetrics() {
    if (!isSupabaseConfigured()) return null;

    const [ordersRes, productsRes, profilesRes] = await Promise.all([
      supabase.from('orders').select('id, total_amount, status, created_at'),
      supabase.from('products').select('id, status'),
      supabase.from('profiles').select('id, role').eq('role', 'customer'),
    ]);

    const orders = ordersRes.data || [];
    const products = productsRes.data || [];
    const customers = profilesRes.data || [];

    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    return {
      totalOrders: orders.length,
      totalRevenueEgp: totalRevenue,
      averageOrderValue,
      totalCustomers: customers.length,
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.status === 'active').length,
    };
  },

  async adjustInventory(variantId: string, quantityChange: number, reason: string = 'Admin adjustment') {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');

    const { data, error } = await supabase.rpc('update_inventory', {
      p_variant_id: variantId,
      p_quantity_change: quantityChange,
      p_reason: reason,
    });

    if (error) throw error;
    return data;
  },

  async updateOrderStatus(orderId: string, status: string, trackingNumber?: string) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');

    const updates: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (status === 'shipped') {
      updates.fulfillment_status = 'shipped';
    } else if (status === 'delivered') {
      updates.fulfillment_status = 'delivered';
      updates.payment_status = 'paid';
    }

    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId);

    if (error) throw error;
  },
};
