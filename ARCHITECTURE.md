# LORÉA Production Architecture

## Overview

LOREA follows a **Supabase-first, frontend-primary** architecture optimized for static/GitHub Pages deployment with secure Supabase backend integration.

```
┌─────────────────────────────────────────────────────────────┐
│  GitHub Pages / Static Frontend (React + Vite)              │
│  • Storefront (Shop, Product Details, Cart, Account)        │
│  • Search, Filters, Wishlist (localStorage + Auth)          │
│  • Admin Dashboard (Supabase queries + RLS checks)          │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTPS REST API + Auth SDK
┌────────────────▼────────────────────────────────────────────┐
│  Supabase                                                   │
│  ├─ PostgreSQL Database (Single Source of Truth)            │
│  │  ├─ products, categories, collections                    │
│  │  ├─ product_images, product_variants                     │
│  │  ├─ orders, customers, auth_users                        │
│  │  └─ ... (full commerce schema)                           │
│  ├─ Auth (Supabase Auth built on PostgreSQL)                │
│  │  ├─ User signup/login/password reset                     │
│  │  ├─ Role-based access (customer, admin, manager)         │
│  │  └─ JWT token session management                         │
│  ├─ Storage (CDN-backed file hosting)                       │
│  │  ├─ /product-images (public read)                        │
│  │  └─ /admin-uploads (private)                             │
│  └─ Row Level Security (RLS)                                │
│     ├─ Customers see only their data                        │
│     ├─ Admins can modify catalog/orders                     │
│     └─ Public read access to active products                │
└─────────────────────────────────────────────────────────────┘
```

## Database (Supabase PostgreSQL)

### Product Catalog

**products** table (source of truth):
- `id` (UUID, PK)
- `name`, `name_ar`
- `slug` (unique, indexed for product lookup)
- `description`, `short_description`
- `sku` (unique)
- `category_id` (FK → categories)
- `collection` (text or FK)
- `price` (EGP)
- `compare_at_price` (original/sale price)
- `status` ('draft' | 'active' | 'archived')
- `is_featured`, `is_new`, `is_sale`
- `material`, `care_instructions`
- `created_at`, `updated_at`
- `created_by` (admin user ID)

**product_images** table:
- `id` (UUID, PK)
- `product_id` (FK → products)
- `image_url` (path in Supabase Storage)
- `alt_text`
- `sort_order`
- `is_primary` (boolean, identifies front image)
- `image_type` ('front' | 'back' | 'detail' | null)
- `created_at`

**product_variants** table:
- `id` (UUID, PK)
- `product_id` (FK)
- `sku` (variant SKU)
- `color` (text)
- `color_hex`
- `size` ('XS' | 'S' | 'M' | 'L' | 'XL')
- `stock_quantity`
- `is_available` (boolean)
- `created_at`, `updated_at`

**categories** table:
- `id` (UUID, PK)
- `name`, `name_ar`
- `slug` (unique)
- `description`
- `is_active`
- `sort_order`

**collections** table:
- Similar structure to categories

### Authentication

- Supabase Auth users (PostgreSQL `auth.users` table)
- Customer signup via public sign-up endpoint
- Admin/manager accounts created by super_admin
- Custom `user_profiles` / `customers` table linking auth.users to additional data

### Orders & Customers

**customers** table:
- Links Supabase auth user to customer profile
- `user_id` (FK → auth.users)
- `first_name`, `last_name`, `email`
- `phone`, `date_of_birth`

**orders**, **order_items**, **addresses**: standard e-commerce schema

## Frontend (React + Vite)

### Data Fetching

1. **On App Load**:
   - Check Supabase Auth session (persisted in browser)
   - If not authenticated, show storefront (public products only)
   - If admin/manager, unlock admin dashboard access

2. **Product Catalog**:
   - Fetch from `supabaseProductService.getProducts()` → queries Supabase
   - Display only products with `status = 'active'` and `is_featured = true` (homepage)
   - Full catalog on shop page (filtered by category, price, etc.)
   - **Never** fetch from local `PRODUCTS` array in production
   - Use `src/data/products.ts` for **demo/fallback only**

3. **Authentication**:
   - Use `@supabase/supabase-js` Auth module
   - Email/password login, password reset, signup
   - Session persisted in localStorage via Supabase SDK

### UI Components

- **ProductCard**: Displays front/back image on hover, links to product details
- **ProductPageView**: Full product details, variants, images gallery
- **ShopCatalogView**: Category filters, search, sort (all tied to Supabase data)
- **AdminDashboardView**: Manage products, images, stock, orders

### Storage (Supabase Storage)

- **Bucket**: `lorea-products`
  - Path: `/products/{product-id}/front.jpg`
  - Path: `/products/{product-id}/back.jpg`
  - Path: `/products/{product-id}/gallery/{image-id}.jpg`
  - Public read access via CDN

## Admin Operations

Admin dashboard communicates directly with Supabase (no Express backend):

```
Admin UI → Supabase Auth (JWT token) → Supabase API
                                       ↓
                            PostgreSQL + RLS checks
                                       ↓
                            Confirm user role = admin
                                       ↓
                            Allow product create/update/delete
```

### Admin Capabilities

1. **Products**:
   - Create product (name, description, price, category, SKU)
   - Edit product details
   - Upload front image → auto-resize, store in Storage
   - Upload back image → separate entry, same product
   - Upload gallery images (unlimited)
   - Manage variants (colors, sizes, stock)
   - Set featured, new, sale status
   - Publish/draft/archive products

2. **Inventory**:
   - View stock per variant
   - Adjust stock (add/remove)
   - Set low-stock threshold

3. **Categories & Collections**:
   - Create/edit categories
   - Reorder categories
   - Create/edit collections

4. **Orders**:
   - View all orders
   - Update order status
   - Print shipping labels (if integrated)

## Security (Row Level Security)

### products table RLS

```sql
-- Public (anyone): read active products
CREATE POLICY "public_read_active_products" ON public.products
  FOR SELECT TO public
  USING (status = 'active');

-- Admin (admin_role): full access
CREATE POLICY "admin_full_access" ON public.products
  FOR ALL TO authenticated
  USING (auth.jwt_meta_class() ->> 'role' = 'admin'
    OR auth.jwt_meta_class() ->> 'role' = 'super_admin');
```

### customers table RLS

```sql
-- Customers: read/update own profile
CREATE POLICY "customer_read_own" ON public.customers
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Admin: read all
CREATE POLICY "admin_read_all" ON public.customers
  FOR SELECT TO authenticated
  USING (auth.jwt_meta_class() ->> 'role' IN ('admin', 'super_admin'));
```

## Development Workflow

1. **Local Development**:
   - Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`
   - Frontend queries live Supabase (staging or production)
   - Admin can test catalog management

2. **Demo/Offline Fallback**:
   - If Supabase is not configured, fallback to `src/data/products.ts`
   - Useful for GitHub Pages demos, offline preview
   - **Not** for production use

3. **Production**:
   - GitHub Pages serves static React SPA
   - CI/CD sets `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in GitHub Actions
   - All product data fetched from Supabase at runtime

## Migration from SQLite

1. **SQLite ← → Supabase**: Use Supabase migrations SQL to create schema
2. **Seed**: Run seed scripts to populate demo products (optional)
3. **Verify**: Confirm all queries in `supabaseProductService` work
4. **Update UI**: Refactor components to remove `PRODUCTS` array references
5. **Admin Dashboard**: Replace Express API routes with direct Supabase calls

## Key Decisions

✅ **Supabase PostgreSQL** = single source of truth  
✅ **GitHub Pages + Supabase** = no backend server needed  
✅ **RLS** = automatic security (no server-side authorization code)  
✅ **Storage** = CDN-backed image delivery  
✅ **Demo products.ts** = fallback for development only  
❌ **NO SQLite** = removed from production  
❌ **NO Express backend** = unnecessary overhead  
✅ **Direct Supabase queries** = from frontend with proper auth  

## Troubleshooting

- **No Supabase credentials**: Use fallback PRODUCTS array (dev mode)
- **Image loading fails**: Check Supabase Storage bucket permissions (public read)
- **Admin denied access**: Verify user role in auth.users / user_profiles
- **Product not showing**: Check `status = 'active'` in Supabase
