# LORÉA — Haute Couture & Modern Women's Fashion
### Full-Stack Production Architecture, Secure Backend & Enterprise E-Commerce Platform

---

## 1. Project Overview & Architectural Vision

**LORÉA** is an haute couture women’s fashion maison designed in Cairo, marrying architectural silhouettes, European deadstock linens, and quiet luxury. 

This platform represents a complete **Full-Stack E-Commerce Engine** adhering to the immutable principle: **The frontend is never the source of truth.** All business rules, garment valuations, discount bounds, stock decrement locks, and administrative authorizations are enforced strictly on the server-side.

```
┌─────────────────────────────────────────────────────────────┐
│                    LORÉA CLIENT BROWSER                     │
│    (React 19 SPA, Tailwind CSS v4, Motion, Lucide Icons)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / REST / JSON
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               BACKEND / API SECURITY LAYER                  │
│       (Express 4, Helmet Security Headers, CORS, Rate Limit)│
└──────────────────────────────┬──────────────────────────────┘
                               │ Authentication & Authorization
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             ROLE-BASED ACCESS CONTROL (RBAC)                │
│    CUSTOMER  │  STAFF  │  ADMIN  │  SUPER_ADMIN (Kareem)    │
└──────────────────────────────┬──────────────────────────────┘
                               │ Validation & Business Logic
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          ATELIER TRANSACTION & AUDIT LOG ENGINE             │
│    Price Verification · Atomic Inventory Locks · Timeline   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Normalized Relational Storage
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             DUAL RELATIONAL STORAGE PERSISTENCE             │
│   Primary Local/Cloud: SQLite with Foreign Key Cascade      │
│   Hosted PostgreSQL: Supabase with Row Level Security (RLS) │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Page & Routing Architecture

### Public Client Routes
| Route | View Component | Description |
| :--- | :--- | :--- |
| `/` | `Hero`, `Trending`, `BrandStory` | Homepage showcasing trending runway carousels |
| `/shop` | `ShopCatalogView` | Comprehensive catalog with multi-facet filters |
| `/shop/:category` | `ShopCatalogView` | Filtered category view (Dresses, Tops, Sets, Modest) |
| `/product/:slug` | `ProductPageView` | High-fidelity product page with interactive atelier try-on |
| `/story` | `BrandStory` | Cairo heritage editorial & deadstock fabric manifesto |
| `/contact` | `CustomerCareView` | Atelier concierge desk & WhatsApp inquiries |
| `/wishlist` | `WishlistDrawer` | Client private wishlist synced to relational DB |
| `/cart` | `CartDrawer` | Bag with live stock threshold feedback |
| `/checkout` | `CheckoutModal` | Express Egyptian shipping calculation (Governorates) |
| `/order-confirmation`| `OrderConfirmationView` | Acquisition confirmation, receipt, & Bosta tracking |
| `/account` | `CustomerAccountView` | Client dashboard (Overview tab) |
| `/account/orders` | `CustomerAccountView` | Real-time order fulfillment & receipt history |
| `/account/profile` | `CustomerAccountView` | Client personal details & measurements |
| `/account/addresses` | `CustomerAccountView` | Saved Cairo & Egyptian delivery locations |
| `/account/security` | `CustomerAccountView` | Password rotation & active device sessions |

### Protected Administrative Routes
| Route | Security Level | Functionality |
| :--- | :--- | :--- |
| `/admin` | `Staff+` | Atelier Operations Security Gateway |
| `/admin/dashboard` | `Staff+` | Real-time telemetry, revenue velocity, & stock alarms |
| `/admin/products` | `Admin+` | Garment catalog CRUD, batch edits, & image ordering |
| `/admin/products/new`| `Admin+` | New garment modal with variant generation |
| `/admin/categories` | `Admin+` | Taxonomy and collection spotlight management |
| `/admin/orders` | `Staff+` | Order pipeline (Pending → Delivered → Cancelled) |
| `/admin/orders/:id` | `Staff+` | Deep order inspection and courier dispatch |
| `/admin/customers` | `Admin+` | VIP customer intelligence and purchase frequency |
| `/admin/inventory` | `Manager+`| Variant SKU matrix with atomic stock adjustments |
| `/admin/coupons` | `Admin+` | Promotional codes with max discount caps |
| `/admin/reviews` | `Support+`| Verified purchase testimonial moderation |
| `/admin/analytics` | `SuperAdmin`| COGS margins, net revenue, and ledger analytics |
| `/admin/settings` | `SuperAdmin`| Atelier store parameters and currency rates |

---

## 3. Technology Stack

- **Frontend:** React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, Motion, Lucide React.
- **Backend / API:** Node.js, Express 4, Cookie-Parser, BcryptJS, JSONWebToken, Dotenv.
- **Persistence:** SQLite (`better-sqlite3` compatible), Supabase PostgreSQL with RLS.
- **AI Atelier:** Google Gemini 2.5 Flash for virtual garment styling.
- **SEO & Social:** OpenGraph, Twitter Cards, Schema.org JSON-LD (Product, Organization, WebSite).

---

## 4. Security & Role-Based Access Control (RBAC)

### Role Hierarchy
1. **`CUSTOMER`**: Can browse public catalog, save wishlists, submit orders, and manage personal address books.
2. **`STAFF`**: Can inspect assigned orders and customer care tickets.
3. **`ADMIN`**: Can create/edit products, manage categories, moderate reviews, adjust coupons, and dispatch orders.
4. **`SUPER_ADMIN` (`Kareem Zohrey`)**: Unrestricted operational governance, ledger analytics, and administrative role provisioning.

### Production Security Hardening
- **Zero-Trust Pricing:** The client never dictates prices or discounts. All line items are recalculated against the database during checkout.
- **Atomic Stock Deductions:** Orders execute within database transactions, checking variant stock availability and decrementing counts to prevent race conditions.
- **HTTP Security Headers:** Implemented `X-Content-Type-Options: nosniff`, `X-XSS-Protection: 1; mode=block`, and strict `Referrer-Policy`.
- **Credential Storage:** High-entropy salt hashing via Bcrypt; authentication tokens stored in HttpOnly, SameSite cookies or signed Bearer headers.
- **Admin Audit Trail:** Every product modification, inventory adjustment, and status change writes to `admin_activity_logs`.

---

## 5. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Key | Purpose | Scope |
| :--- | :--- | :--- |
| `PORT` | Local dev and production server port (Default: `3000`) | Server |
| `NODE_ENV` | `development` or `production` | Server |
| `SITE_URL` | Canonical custom domain (e.g. `https://www.loreaofficial.com`) | Server |
| `DATABASE_URL` | Local SQLite database file path (`./lorea.db`) | Server |
| `AUTH_SECRET` | Secret key for signing session tokens | Server Private |
| `JWT_SECRET` | Secret key for JWT payload validation | Server Private |
| `GEMINI_API_KEY`| API key for atelier virtual stylist try-on | Server Private |
| `VITE_SITE_URL` | Base canonical domain injected into client metadata | Client Public |
| `VITE_SUPABASE_URL` | Optional Supabase project URL | Client Public |
| `VITE_SUPABASE_ANON_KEY` | Optional Supabase anonymous public key | Client Public |

---

## 6. Local Installation & Development

```bash
# 1. Install dependencies
npm install

# 2. Run integrated full-stack server (Express API + Vite SPA)
npm run dev

# 3. Access local storefront
# http://localhost:3000
```

### Administrative Access & Security
* Administrative accounts must be provisioned via secure environment variables (`ADMIN_INITIAL_EMAIL`, `ADMIN_INITIAL_PASSWORD`) or authenticated through Supabase Auth.
* Plaintext credentials should never be committed to source control or exposed in documentation.
* Session tokens are cryptographically signed with `AUTH_SECRET`/`JWT_SECRET` and strictly validated server-side.

---

## 7. Production Build & Deployment

### Full-Stack Deployment (Cloud Run, Render, VPS, Railway)
```bash
# Build Vite client assets and compile backend
npm run build

# Start production server
npm start
```

### Custom Domain & SEO Verification
- **Canonical Domain:** Configurable via `SITE_URL=https://www.loreaofficial.com`.
- **Dynamic XML Sitemap:** Automatically available at `/sitemap.xml` with all catalog products.
- **Robots.txt:** Automatically served at `/robots.txt` disallowing `/admin` and `/api` crawlers.
- **SSL / HTTPS:** Ensure upstream reverse proxy (Cloudflare, Nginx, or Cloud Run) terminates TLS with automatic HTTP → HTTPS redirects.

---

## 8. License & Attribution

Copyright © 2026 LORÉA Atelier Cairo S.A.E. All rights reserved.
Crafted with quiet luxury, Egyptian textile heritage, and high-performance full-stack architecture.
