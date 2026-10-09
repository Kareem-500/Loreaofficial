# Migration Guide: Products.ts → Supabase

## Current State

- ✅ `src/data/products.ts` — hardcoded demo products
- ✅ `supabaseProductService` — Supabase integration already exists
- ✅ `server/db.ts` — SQLite schema exists but not used in production
- ⚠️ App defaults to `PRODUCTS` array, not Supabase

## Steps to Complete Migration

### 1. Supabase Schema (SQL Migrations)

Run these in Supabase SQL Editor or apply migrations from `supabase/migrations/`.

**Key additions/updates**:
- Ensure `products.is_primary_image_id` or similar for front/back image distinction
- Add `product_images.image_type` ('front' | 'back' | 'detail')
- Add `product_images.sort_order` for gallery sequencing
- Ensure RLS is enabled on all tables

### 2. Populate Supabase Catalog

Option A: **Use seed data from products.ts**

```typescript
// supabase/seed.ts
import { createClient } from '@supabase/supabase-js';
import { PRODUCTS } from '../src/data/products';

// Convert local products to Supabase format and insert
```

Option B: **Manual admin insert** via Supabase dashboard

Option C: **Import via admin API** once admin dashboard is ready

### 3. Update Frontend Services

**src/services/supabaseService.ts**:
- ✅ Already has `supabaseProductService.getProducts()`
- ✅ Already has `getProductBySlug()`
- Verify queries include `product_images(*)`
- Add `getProductsByCategory(slug)`
- Add `getFeaturedProducts(limit)`

### 4. Refactor App.tsx

Replace:
```typescript
const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
```

With:
```typescript
const [productsList, setProductsList] = useState<Product[]>([]);

useEffect(() => {
  supabaseProductService.getProducts()
    .then(setProductsList)
    .catch(err => {
      console.warn('Supabase fetch failed, using demo data:', err);
      setProductsList(PRODUCTS); // fallback
    });
}, []);
```

### 5. Remove Express Backend (Optional)

If admin dashboard is fully migrated to Supabase queries:
- Delete `server/routes/adminRoutes.ts`
- Delete `server/db.ts` SQLite code (or keep as dev fallback)
- Update package.json scripts to remove `npm run dev` (server)
- Keep GitHub Pages build only

### 6. Admin Dashboard Refactor

**Before**:
```typescript
await api.admin.getProducts(); // → Express API
```

**After**:
```typescript
const { data } = await supabase
  .from('products')
  .select('*, category:categories(*), product_images(*)')
  .eq('status', 'active');
```

**Key refactors**:
- Replace API calls with direct Supabase queries
- Add file upload to Supabase Storage (front/back images)
- Use Supabase real-time subscriptions for live catalog updates

### 7. Testing Checklist

- [ ] Supabase is configured in `.env`
- [ ] Products load on homepage
- [ ] Product details page displays images
- [ ] Filters work (category, price, search)
- [ ] Admin can create/edit products
- [ ] Image uploads work
- [ ] Cart/wishlist persist
- [ ] Mobile responsive

## Fallback Strategy

If Supabase fails or is not configured:

```typescript
if (isSupabaseConfigured()) {
  // Fetch from Supabase
} else {
  // Use local PRODUCTS (dev/demo)
}
```

This keeps the app working offline for demos/GitHub Pages.

## Rollback Plan

If issues occur:
1. Revert to previous branch
2. Keep SQLite intact as temporary fallback
3. Debug Supabase schema/RLS
4. Re-test before re-deploying
