-- ====================================================================
-- LORÉA LUXURY FASHION E-COMMERCE
-- COMPLETE SUPABASE POSTGRESQL PRODUCTION MIGRATION
-- Target Market: Egypt (EGP currency standard)
-- ====================================================================

-- 1. EXTENSIONS & SEQUENCES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Sequence for professional, collision-safe order numbers (e.g. LOREA-2026-000001)
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1 INCREMENT BY 1;

-- ====================================================================
-- 2. CORE DATABASE TABLES
-- ====================================================================

-- 2.1 PROFILES (Linked directly to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  date_of_birth DATE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2.2 ADDRESSES (Customer shipping addresses in Egypt)
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  governorate TEXT NOT NULL,
  city TEXT NOT NULL,
  area TEXT,
  street TEXT NOT NULL,
  building TEXT NOT NULL,
  apartment TEXT,
  postal_code TEXT,
  notes TEXT,
  is_default BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2.3 CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2.4 PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  sku TEXT UNIQUE NOT NULL,
  brand TEXT DEFAULT 'LORÉA' NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10,2) CHECK (compare_at_price IS NULL OR compare_at_price >= price),
  cost_price NUMERIC(10,2) CHECK (cost_price IS NULL OR cost_price >= 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
  is_featured BOOLEAN DEFAULT false NOT NULL,
  is_new BOOLEAN DEFAULT true NOT NULL,
  is_sale BOOLEAN DEFAULT false NOT NULL,
  gender TEXT DEFAULT 'women' NOT NULL,
  material TEXT,
  care_instructions TEXT,
  main_image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2.5 PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  is_primary BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2.6 PRODUCT VARIANTS (Size, color, SKU, and inventory)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL,
  color_hex TEXT,
  size TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0 AND reserved_quantity <= stock_quantity),
  is_available BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2.7 FAVORITES (Customer Wishlist)
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT unique_user_favorite UNIQUE (user_id, product_id)
);

-- 2.8 CART ITEMS
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT unique_user_cart_variant UNIQUE (user_id, product_variant_id)
);

-- 2.9 ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled', 'processing', 'shipped', 'delivered', 'returned')),
  subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  shipping_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (shipping_amount >= 0),
  total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  currency TEXT NOT NULL DEFAULT 'EGP',
  shipping_full_name TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  shipping_governorate TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_area TEXT,
  shipping_street TEXT NOT NULL,
  shipping_building TEXT NOT NULL,
  shipping_apartment TEXT,
  customer_notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2.10 ORDER ITEMS (Historical Snapshot of Purchased Products)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  sku TEXT NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2.11 COUPONS
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
  minimum_order_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (minimum_order_amount >= 0),
  maximum_discount_amount NUMERIC(10,2),
  usage_limit INTEGER CHECK (usage_limit IS NULL OR usage_limit > 0),
  used_count INTEGER NOT NULL DEFAULT 0 CHECK (used_count >= 0),
  start_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2.12 COUPON USAGES
CREATE TABLE IF NOT EXISTS public.coupon_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2.13 REVIEWS (Verified purchase reviews)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2.14 BANNERS (Promotional Homepage Banners)
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  link_url TEXT,
  button_text TEXT,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2.15 NEWSLETTER SUBSCRIBERS
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  unsubscribed_at TIMESTAMPTZ
);

-- 2.16 CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2.17 ADMIN ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ====================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ====================================================================

-- Products & Variants
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_new ON public.products(is_new) WHERE is_new = true;
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON public.product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_variants_available ON public.product_variants(is_available);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);

-- Cart & Wishlist
CREATE INDEX IF NOT EXISTS idx_cart_user ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- Reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);

-- ====================================================================
-- 4. SECURITY & HELPER FUNCTIONS
-- ====================================================================

-- Function to check if the authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- Function to automatically create a profile when a new user signs up via auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, phone, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'customer', -- strictly default to customer, admin role cannot be self-assigned
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    updated_at = now();

  RETURN NEW;
END;
$$;

-- Trigger to execute profile creation on new signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger function to automatically update `updated_at` timestamps
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Attach timestamp triggers
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_addresses_updated_at ON public.addresses;
CREATE TRIGGER trigger_addresses_updated_at BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_categories_updated_at ON public.categories;
CREATE TRIGGER trigger_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_product_variants_updated_at ON public.product_variants;
CREATE TRIGGER trigger_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_cart_items_updated_at ON public.cart_items;
CREATE TRIGGER trigger_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_coupons_updated_at ON public.coupons;
CREATE TRIGGER trigger_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_reviews_updated_at ON public.reviews;
CREATE TRIGGER trigger_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ====================================================================
-- 5. TRANSACTIONAL BUSINESS LOGIC (ORDER CREATION & STOCK)
-- ====================================================================

-- Function to safely adjust inventory with audit trail
CREATE OR REPLACE FUNCTION public.update_inventory(
  p_variant_id UUID,
  p_quantity_change INTEGER,
  p_reason TEXT DEFAULT 'Manual adjustment'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_old_stock INTEGER;
  v_new_stock INTEGER;
  v_product_id UUID;
  v_admin_id UUID := auth.uid();
BEGIN
  -- Admin check
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can adjust inventory';
  END IF;

  SELECT stock_quantity, product_id INTO v_old_stock, v_product_id
  FROM public.product_variants
  WHERE id = p_variant_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Variant with ID % not found', p_variant_id;
  END IF;

  v_new_stock := v_old_stock + p_quantity_change;
  IF v_new_stock < 0 THEN
    RAISE EXCEPTION 'Cannot adjust stock: New stock would be negative (%)', v_new_stock;
  END IF;

  UPDATE public.product_variants
  SET
    stock_quantity = v_new_stock,
    is_available = (v_new_stock > reserved_quantity),
    updated_at = now()
  WHERE id = p_variant_id;

  -- Record audit log
  INSERT INTO public.admin_activity_logs (admin_id, action, resource, resource_id, details)
  VALUES (
    v_admin_id,
    'INVENTORY_ADJUSTED',
    'product_variants',
    p_variant_id::text,
    jsonb_build_object(
      'previous_stock', v_old_stock,
      'quantity_change', p_quantity_change,
      'new_stock', v_new_stock,
      'reason', p_reason
    )
  );

  RETURN jsonb_build_object(
    'variant_id', p_variant_id,
    'previous_stock', v_old_stock,
    'new_stock', v_new_stock
  );
END;
$$;

-- Secure Transactional Order Creation RPC
CREATE OR REPLACE FUNCTION public.create_order(
  p_shipping_full_name TEXT,
  p_shipping_phone TEXT,
  p_shipping_governorate TEXT,
  p_shipping_city TEXT,
  p_shipping_street TEXT,
  p_shipping_building TEXT,
  p_shipping_apartment TEXT DEFAULT NULL,
  p_shipping_area TEXT DEFAULT NULL,
  p_customer_notes TEXT DEFAULT NULL,
  p_coupon_code TEXT DEFAULT NULL,
  p_items JSONB DEFAULT NULL -- Optional items array [{variant_id, quantity}], defaults to user's cart_items
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_order_id UUID := gen_random_uuid();
  v_order_number TEXT;
  v_item RECORD;
  v_subtotal NUMERIC(10,2) := 0;
  v_discount NUMERIC(10,2) := 0;
  v_shipping NUMERIC(10,2) := 0;
  v_total NUMERIC(10,2) := 0;
  v_coupon RECORD;
  v_variant RECORD;
  v_cart_count INTEGER;
BEGIN
  -- 1. Validate customer is authenticated
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to place an order';
  END IF;

  -- 2. Determine and validate items
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    -- Pull directly from cart_items
    SELECT COUNT(*) INTO v_cart_count FROM public.cart_items WHERE user_id = v_user_id;
    IF v_cart_count = 0 THEN
      RAISE EXCEPTION 'Shopping cart is empty';
    END IF;
  END IF;

  -- 3. Calculate Egypt shipping cost based on governorate
  IF LOWER(p_shipping_governorate) IN ('cairo', 'giza', 'القاهرة', 'الجيزة') THEN
    v_shipping := 85.00;
  ELSIF LOWER(p_shipping_governorate) IN ('alexandria', 'الإسكندرية') THEN
    v_shipping := 100.00;
  ELSE
    v_shipping := 130.00;
  END IF;

  -- 4. Process each item: Lock stock row, validate inventory, calculate subtotal
  IF p_items IS NOT NULL AND jsonb_array_length(p_items) > 0 THEN
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS (variant_id UUID, quantity INTEGER) LOOP
      IF v_item.quantity <= 0 THEN
        RAISE EXCEPTION 'Item quantity must be greater than zero';
      END IF;

      SELECT pv.*, p.name AS prod_name, p.main_image_url
      INTO v_variant
      FROM public.product_variants pv
      JOIN public.products p ON p.id = pv.product_id
      WHERE pv.id = v_item.variant_id
      FOR UPDATE;

      IF NOT FOUND THEN
        RAISE EXCEPTION 'Product variant % not found', v_item.variant_id;
      END IF;

      IF (v_variant.stock_quantity - v_variant.reserved_quantity) < v_item.quantity THEN
        RAISE EXCEPTION 'Insufficient stock for product "%" (Variant: % / %). Available: %',
          v_variant.prod_name, v_variant.color, v_variant.size, (v_variant.stock_quantity - v_variant.reserved_quantity);
      END IF;

      v_subtotal := v_subtotal + (v_variant.price * v_item.quantity);
    END LOOP;
  ELSE
    -- Process from cart_items table
    FOR v_item IN
      SELECT ci.product_variant_id AS variant_id, ci.quantity
      FROM public.cart_items ci
      WHERE ci.user_id = v_user_id
    LOOP
      SELECT pv.*, p.name AS prod_name, p.main_image_url
      INTO v_variant
      FROM public.product_variants pv
      JOIN public.products p ON p.id = pv.product_id
      WHERE pv.id = v_item.variant_id
      FOR UPDATE;

      IF NOT FOUND THEN
        RAISE EXCEPTION 'Product variant in cart not found';
      END IF;

      IF (v_variant.stock_quantity - v_variant.reserved_quantity) < v_item.quantity THEN
        RAISE EXCEPTION 'Insufficient stock for "%". Available: %',
          v_variant.prod_name, (v_variant.stock_quantity - v_variant.reserved_quantity);
      END IF;

      v_subtotal := v_subtotal + (v_variant.price * v_item.quantity);
    END LOOP;
  END IF;

  -- 5. Validate coupon if provided
  IF p_coupon_code IS NOT NULL AND TRIM(p_coupon_code) <> '' THEN
    SELECT * INTO v_coupon
    FROM public.coupons
    WHERE UPPER(code) = UPPER(TRIM(p_coupon_code))
      AND is_active = true
      AND (start_at IS NULL OR start_at <= now())
      AND (expires_at IS NULL OR expires_at >= now())
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Coupon code "%" is invalid or expired', p_coupon_code;
    END IF;

    IF v_coupon.usage_limit IS NOT NULL AND v_coupon.used_count >= v_coupon.usage_limit THEN
      RAISE EXCEPTION 'Coupon code "%" has reached its maximum usage limit', p_coupon_code;
    END IF;

    IF v_subtotal < v_coupon.minimum_order_amount THEN
      RAISE EXCEPTION 'Order subtotal must be at least % EGP to use coupon "%"', v_coupon.minimum_order_amount, p_coupon_code;
    END IF;

    -- Calculate discount
    IF v_coupon.discount_type = 'percentage' THEN
      v_discount := (v_subtotal * v_coupon.discount_value) / 100.0;
      IF v_coupon.maximum_discount_amount IS NOT NULL AND v_discount > v_coupon.maximum_discount_amount THEN
        v_discount := v_coupon.maximum_discount_amount;
      END IF;
    ELSE
      v_discount := v_coupon.discount_value;
    END IF;

    IF v_discount > v_subtotal THEN
      v_discount := v_subtotal;
    END IF;
  END IF;

  -- Free delivery over 3,500 EGP
  IF v_subtotal >= 3500 THEN
    v_shipping := 0.00;
  END IF;

  v_total := v_subtotal - v_discount + v_shipping;

  -- 6. Generate collision-safe Order Number
  v_order_number := 'LOREA-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('order_number_seq')::text, 6, '0');

  -- 7. Insert the order record
  INSERT INTO public.orders (
    id, order_number, user_id, status, payment_status, fulfillment_status,
    subtotal, discount_amount, shipping_amount, total_amount, currency,
    shipping_full_name, shipping_phone, shipping_governorate, shipping_city,
    shipping_area, shipping_street, shipping_building, shipping_apartment,
    customer_notes
  ) VALUES (
    v_order_id, v_order_number, v_user_id, 'pending', 'pending', 'unfulfilled',
    v_subtotal, v_discount, v_shipping, v_total, 'EGP',
    p_shipping_full_name, p_shipping_phone, p_shipping_governorate, p_shipping_city,
    p_shipping_area, p_shipping_street, p_shipping_building, p_shipping_apartment,
    p_customer_notes
  );

  -- 8. Insert snapshots into order_items & deduct stock
  IF p_items IS NOT NULL AND jsonb_array_length(p_items) > 0 THEN
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS (variant_id UUID, quantity INTEGER) LOOP
      SELECT pv.*, p.name AS prod_name, p.main_image_url
      INTO v_variant
      FROM public.product_variants pv
      JOIN public.products p ON p.id = pv.product_id
      WHERE pv.id = v_item.variant_id;

      INSERT INTO public.order_items (
        order_id, product_variant_id, product_name, sku, size, color,
        unit_price, quantity, total_price, image_url
      ) VALUES (
        v_order_id, v_variant.id, v_variant.prod_name, v_variant.sku, v_variant.size, v_variant.color,
        v_variant.price, v_item.quantity, (v_variant.price * v_item.quantity), v_variant.main_image_url
      );

      -- Deduct inventory
      UPDATE public.product_variants
      SET
        stock_quantity = stock_quantity - v_item.quantity,
        is_available = ((stock_quantity - v_item.quantity) > reserved_quantity)
      WHERE id = v_variant.id;
    END LOOP;
  ELSE
    FOR v_item IN
      SELECT ci.product_variant_id AS variant_id, ci.quantity
      FROM public.cart_items ci
      WHERE ci.user_id = v_user_id
    LOOP
      SELECT pv.*, p.name AS prod_name, p.main_image_url
      INTO v_variant
      FROM public.product_variants pv
      JOIN public.products p ON p.id = pv.product_id
      WHERE pv.id = v_item.variant_id;

      INSERT INTO public.order_items (
        order_id, product_variant_id, product_name, sku, size, color,
        unit_price, quantity, total_price, image_url
      ) VALUES (
        v_order_id, v_variant.id, v_variant.prod_name, v_variant.sku, v_variant.size, v_variant.color,
        v_variant.price, v_item.quantity, (v_variant.price * v_item.quantity), v_variant.main_image_url
      );

      -- Deduct inventory
      UPDATE public.product_variants
      SET
        stock_quantity = stock_quantity - v_item.quantity,
        is_available = ((stock_quantity - v_item.quantity) > reserved_quantity)
      WHERE id = v_variant.id;
    END LOOP;
  END IF;

  -- 9. Record coupon usage and increment coupon count
  IF v_coupon.id IS NOT NULL THEN
    INSERT INTO public.coupon_usages (coupon_id, user_id, order_id)
    VALUES (v_coupon.id, v_user_id, v_order_id);

    UPDATE public.coupons
    SET used_count = used_count + 1
    WHERE id = v_coupon.id;
  END IF;

  -- 10. Clear user's cart
  DELETE FROM public.cart_items WHERE user_id = v_user_id;

  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'subtotal', v_subtotal,
    'discount', v_discount,
    'shipping', v_shipping,
    'total', v_total,
    'currency', 'EGP'
  );
END;
$$;

-- ====================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- 6.1 PROFILES POLICIES
-- Customer reads own profile; Admin reads all profiles
CREATE POLICY "Profiles are viewable by owner or admin"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Customer updates own profile (cannot change role); Admin can update any profile
CREATE POLICY "Profiles update by owner or admin"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (
    (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
    OR public.is_admin()
  );

-- 6.2 ADDRESSES POLICIES
CREATE POLICY "Addresses selectable by owner or admin"
  ON public.addresses FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Addresses insertable by owner"
  ON public.addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Addresses modifiable by owner or admin"
  ON public.addresses FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Addresses deletable by owner or admin"
  ON public.addresses FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

-- 6.3 CATEGORIES POLICIES
CREATE POLICY "Active categories are publicly viewable"
  ON public.categories FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins have full control over categories"
  ON public.categories FOR ALL
  USING (public.is_admin());

-- 6.4 PRODUCTS POLICIES
CREATE POLICY "Active products are publicly viewable"
  ON public.products FOR SELECT
  USING (status = 'active' OR public.is_admin());

CREATE POLICY "Admins have full control over products"
  ON public.products FOR ALL
  USING (public.is_admin());

-- 6.5 PRODUCT IMAGES POLICIES
CREATE POLICY "Product images are publicly viewable"
  ON public.product_images FOR SELECT
  USING (true);

CREATE POLICY "Admins manage product images"
  ON public.product_images FOR ALL
  USING (public.is_admin());

-- 6.6 PRODUCT VARIANTS POLICIES
CREATE POLICY "Product variants are publicly viewable"
  ON public.product_variants FOR SELECT
  USING (true);

CREATE POLICY "Admins manage product variants"
  ON public.product_variants FOR ALL
  USING (public.is_admin());

-- 6.7 FAVORITES (WISHLIST) POLICIES
CREATE POLICY "Favorites viewable by owner"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Favorites insertable by owner"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Favorites deletable by owner"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- 6.8 CART ITEMS POLICIES
CREATE POLICY "Cart items viewable by owner"
  ON public.cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Cart items insertable by owner"
  ON public.cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Cart items modifiable by owner"
  ON public.cart_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Cart items deletable by owner"
  ON public.cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- 6.9 ORDERS POLICIES
CREATE POLICY "Orders viewable by customer owner or admin"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- Inserting orders should go through create_order() function, but policy allows authenticated owner
CREATE POLICY "Orders insertable by customer"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Orders updatable by admin"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- 6.10 ORDER ITEMS POLICIES
CREATE POLICY "Order items viewable by order owner or admin"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = public.order_items.order_id
        AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Order items insertable through order flow or admin"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = public.order_items.order_id
        AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );

-- 6.11 COUPONS POLICIES
CREATE POLICY "Active coupons viewable by authenticated users and guests"
  ON public.coupons FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins manage coupons"
  ON public.coupons FOR ALL
  USING (public.is_admin());

-- 6.12 COUPON USAGES POLICIES
CREATE POLICY "Coupon usages viewable by owner or admin"
  ON public.coupon_usages FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- 6.13 REVIEWS POLICIES
CREATE POLICY "Approved reviews are publicly viewable"
  ON public.reviews FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Verified customers can submit reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.order_items oi ON oi.order_id = o.id
      JOIN public.product_variants pv ON pv.id = oi.product_variant_id
      WHERE o.user_id = auth.uid()
        AND pv.product_id = public.reviews.product_id
        AND o.status = 'delivered'
    )
  );

CREATE POLICY "Admins moderate reviews"
  ON public.reviews FOR ALL
  USING (public.is_admin());

-- 6.14 BANNERS POLICIES
CREATE POLICY "Active banners are publicly viewable"
  ON public.banners FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins manage banners"
  ON public.banners FOR ALL
  USING (public.is_admin());

-- 6.15 NEWSLETTER SUBSCRIBERS POLICIES
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins view and manage subscribers"
  ON public.newsletter_subscribers FOR ALL
  USING (public.is_admin());

-- 6.16 CONTACT MESSAGES POLICIES
CREATE POLICY "Anyone can submit contact message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins view and manage contact messages"
  ON public.contact_messages FOR ALL
  USING (public.is_admin());

-- 6.17 ADMIN ACTIVITY LOGS POLICIES
CREATE POLICY "Admins view activity logs"
  ON public.admin_activity_logs FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins insert activity logs"
  ON public.admin_activity_logs FOR INSERT
  WITH CHECK (public.is_admin());

-- ====================================================================
-- 7. SUPABASE STORAGE BUCKETS & POLICIES
-- ====================================================================

-- Create buckets in storage schema if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('product-images', 'product-images', true),
  ('category-images', 'category-images', true),
  ('banners', 'banners', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies
CREATE POLICY "Public read access on product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Public read access on category images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'category-images');

CREATE POLICY "Public read access on banners"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

CREATE POLICY "Public read access on avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Admin upload to product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin upload to category images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'category-images' AND public.is_admin());

CREATE POLICY "Admin upload to banners"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'banners' AND public.is_admin());

CREATE POLICY "Users upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ====================================================================
-- 8. REFERENCE & ESSENTIAL SEED DATA
-- (Categories and initial luxury foundation)
-- ====================================================================

INSERT INTO public.categories (name, slug, description, image_url, sort_order)
VALUES
  ('Dresses', 'dresses', 'Sophisticated evening wear, silk midi silhouettes, and effortless day dresses crafted from fine Egyptian textiles.', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop', 1),
  ('Tops', 'tops', 'Refined silk blouses, structured knit halters, and tailored poplin shirts.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', 2),
  ('Shirts', 'shirts', 'Crisp Egyptian cotton tailored button-downs and relaxed oversized linen shirts.', 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1200&auto=format&fit=crop', 3),
  ('Pants', 'pants', 'High-waisted tailored trousers, wide-leg pleated pants, and relaxed raw linen culottes.', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop', 4),
  ('Skirts', 'skirts', 'Architectural pleated skirts, fluid satin column skirts, and wrapped linen silhouettes.', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1200&auto=format&fit=crop', 5),
  ('Hoodies', 'hoodies', 'Elevated heavy-weight Egyptian Giza cotton luxury loungewear.', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop', 6),
  ('Sweatshirts', 'sweatshirts', 'Minimalist French Terry sweatshirts with subtle tonal embroidery.', 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1200&auto=format&fit=crop', 7),
  ('Coats', 'coats', 'Double-breasted virgin wool outerwear, cashmere blend dusters, and lightweight trench coats.', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop', 8),
  ('Jackets', 'jackets', 'Architectural tailored blazers and structured cropped jackets.', 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=1200&auto=format&fit=crop', 9),
  ('Cardigans', 'cardigans', 'Fine gauge ribbed cardigans and oversized mother-of-pearl buttoned wraps.', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1200&auto=format&fit=crop', 10),
  ('Knitwear', 'knitwear', 'Tactile pointelle knits, breathable summer crochet, and merino wool crewnecks.', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1200&auto=format&fit=crop', 11),
  ('Accessories', 'accessories', 'Artisanal Italian leather belts, silk twill scarves, and statement minimalist jewelry.', 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1200&auto=format&fit=crop', 12),
  ('New Arrivals', 'new-arrivals', 'The freshest drops straight from our Cairo and Alexandria atelier workshops.', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop', 13),
  ('Sale', 'sale', 'Exclusive seasonal private archive pieces at special rates.', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop', 14)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Sample Promotional Coupons
INSERT INTO public.coupons (code, description, discount_type, discount_value, minimum_order_amount, maximum_discount_amount, usage_limit, is_active)
VALUES
  ('WELCOME10', 'Welcome gift: 10% off your first luxury order', 'percentage', 10.00, 1000.00, 500.00, 5000, true),
  ('LOREAVIP', 'Atelier Privé 15% VIP discount', 'percentage', 15.00, 3000.00, 1000.00, 1000, true),
  ('CAIROFREE', 'Fixed 500 EGP privilege on orders over 4000 EGP', 'fixed', 500.00, 4000.00, 500.00, 500, true)
ON CONFLICT (code) DO NOTHING;

-- Sample Homepage Promotional Banners
INSERT INTO public.banners (title, subtitle, image_url, link_url, button_text, sort_order, is_active)
VALUES
  (
    'THE CAIRO ATELIER COLLECTION',
    'Spring / Summer 2026: Fluid silks, raw Egyptian linen, and sculptural tailoring designed for the contemporary woman.',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop',
    '/shop',
    'DISCOVER COLLECTION',
    1,
    true
  ),
  (
    'SUMMER SILK & LINEN EDIT',
    'Airy silhouettes crafted from Giza 45 cotton and imported French mulberry silk.',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop',
    '/category/dresses',
    'EXPLORE DRESSES',
    2,
    true
  )
ON CONFLICT DO NOTHING;
