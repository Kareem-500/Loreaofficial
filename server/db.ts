import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';

const dbPath = path.join(process.cwd(), 'lorea.db');
export const db = new DatabaseSync(dbPath);

// Enable foreign keys and WAL mode for reliability and performance
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  // 1. Roles & Permissions
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS permissions (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      description TEXT,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id TEXT NOT NULL,
      permission_code TEXT NOT NULL,
      PRIMARY KEY (role_id, permission_code)
    );

    -- 2. Users (Authentication Core)
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      uuid TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      status TEXT NOT NULL DEFAULT 'active',
      email_verified INTEGER NOT NULL DEFAULT 0,
      last_login_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Customers & Customer Profiles
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      date_of_birth TEXT,
      country TEXT DEFAULT 'Egypt',
      city TEXT DEFAULT 'Cairo',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS customer_profiles (
      id TEXT PRIMARY KEY,
      customer_id TEXT UNIQUE NOT NULL,
      avatar_url TEXT,
      gender TEXT,
      bio TEXT,
      marketing_consent INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );

    -- 4. Admins
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role_id TEXT NOT NULL,
      department TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (role_id) REFERENCES roles(id)
    );

    -- 5. Sessions, Verifications & Password Reset Tokens
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS email_verifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      code TEXT,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      verified_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      code TEXT,
      expires_at DATETIME NOT NULL,
      used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 6. Addresses
    CREATE TABLE IF NOT EXISTS addresses (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      governorate TEXT NOT NULL,
      city TEXT NOT NULL,
      area TEXT,
      street TEXT NOT NULL,
      building_number TEXT NOT NULL,
      apartment TEXT,
      floor TEXT,
      postal_code TEXT,
      instructions TEXT,
      is_default INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );

    -- 7. Categories & Products
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      image TEXT,
      description TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS collections (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image TEXT,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      subtitle TEXT,
      description TEXT,
      category_id TEXT NOT NULL,
      subcategory TEXT,
      collection TEXT DEFAULT 'New Collection',
      brand TEXT DEFAULT 'LORÉA',
      price_egp REAL NOT NULL,
      price_usd REAL NOT NULL,
      original_price_egp REAL,
      original_price_usd REAL,
      cost_price_egp REAL DEFAULT 0,
      badge TEXT,
      fabric TEXT,
      fit TEXT,
      care TEXT,
      shipping TEXT,
      sku TEXT UNIQUE NOT NULL,
      rating REAL DEFAULT 5.0,
      reviews_count INTEGER DEFAULT 0,
      is_modest_edit INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS product_variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      color_name TEXT NOT NULL,
      color_hex TEXT NOT NULL,
      size TEXT NOT NULL,
      price_modifier REAL DEFAULT 0,
      stock INTEGER NOT NULL DEFAULT 15,
      reserved_stock INTEGER DEFAULT 0,
      low_stock_threshold INTEGER DEFAULT 5,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      is_primary INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS product_attributes (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      name TEXT NOT NULL,
      value TEXT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    -- 8. Inventory & Movement History
    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      variant_id TEXT UNIQUE NOT NULL,
      current_stock INTEGER NOT NULL,
      reserved_stock INTEGER NOT NULL DEFAULT 0,
      low_stock_threshold INTEGER NOT NULL DEFAULT 5,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS inventory_movements (
      id TEXT PRIMARY KEY,
      variant_id TEXT NOT NULL,
      action TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      previous_stock INTEGER NOT NULL,
      new_stock INTEGER NOT NULL,
      reason TEXT,
      created_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
    );

    -- 9. Orders & Order Items
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      customer_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      payment_status TEXT NOT NULL DEFAULT 'pending',
      shipping_status TEXT NOT NULL DEFAULT 'unfulfilled',
      subtotal REAL NOT NULL,
      discount REAL NOT NULL DEFAULT 0,
      shipping_cost REAL NOT NULL DEFAULT 0,
      tax REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EGP',
      payment_method TEXT NOT NULL DEFAULT 'Cash on Delivery',
      shipping_address_json TEXT NOT NULL,
      tracking_number TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT,
      variant_id TEXT,
      product_name_snapshot TEXT NOT NULL,
      sku_snapshot TEXT NOT NULL,
      color_name TEXT,
      size TEXT,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      discount REAL DEFAULT 0,
      total REAL NOT NULL,
      image_url TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS order_status_history (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      updated_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    -- 10. Payments & Transactions
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EGP',
      method TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      transaction_reference TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS payment_transactions (
      id TEXT PRIMARY KEY,
      payment_id TEXT NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT NOT NULL,
      payload_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
    );

    -- 11. Wishlists
    CREATE TABLE IF NOT EXISTS wishlists (
      id TEXT PRIMARY KEY,
      customer_id TEXT,
      user_id TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS wishlist_items (
      id TEXT PRIMARY KEY,
      wishlist_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(wishlist_id, product_id),
      FOREIGN KEY (wishlist_id) REFERENCES wishlists(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    -- 12. Carts
    CREATE TABLE IF NOT EXISTS carts (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      guest_session_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY,
      cart_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      variant_id TEXT,
      color_name TEXT,
      size TEXT,
      quantity INTEGER NOT NULL DEFAULT 1,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE
    );

    -- 13. Coupons & Usage
    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL COLLATE NOCASE,
      discount_type TEXT NOT NULL DEFAULT 'percentage',
      discount_value REAL NOT NULL,
      min_order_value REAL DEFAULT 0,
      max_discount REAL,
      usage_limit INTEGER DEFAULT 1000,
      times_used INTEGER DEFAULT 0,
      expires_at DATETIME,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS coupon_usage (
      id TEXT PRIMARY KEY,
      coupon_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      order_id TEXT NOT NULL,
      discount_applied REAL NOT NULL,
      used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (coupon_id) REFERENCES coupons(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );

    -- 14. Reviews & Notifications
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      user_id TEXT,
      customer_name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      title TEXT,
      comment TEXT NOT NULL,
      verified_purchase INTEGER DEFAULT 1,
      status TEXT DEFAULT 'approved',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      title_ar TEXT NOT NULL,
      message TEXT NOT NULL,
      message_ar TEXT NOT NULL,
      type TEXT DEFAULT 'order',
      is_read INTEGER DEFAULT 0,
      link TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 15. Admin Activity Logs & Settings
    CREATE TABLE IF NOT EXISTS admin_activity_logs (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL,
      admin_name TEXT NOT NULL,
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      resource_id TEXT,
      before_state TEXT,
      after_state TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'general',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 16. Customer Chat & Messages
    CREATE TABLE IF NOT EXISTS chat_conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      session_token TEXT NOT NULL,
      title TEXT DEFAULT 'Atelier Styling Consultation',
      status TEXT NOT NULL DEFAULT 'active',
      last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender_role TEXT NOT NULL,
      sender_name TEXT DEFAULT 'Atelier Concierge',
      content TEXT NOT NULL,
      metadata_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE
    );

    -- 17. Analytics Events
    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      event_name TEXT NOT NULL,
      user_id TEXT,
      session_id TEXT NOT NULL,
      path TEXT NOT NULL,
      properties_json TEXT,
      ip_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
    CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
    CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist ON wishlist_items(wishlist_id);
    CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON admin_activity_logs(created_at);
    CREATE INDEX IF NOT EXISTS idx_chat_conversations_user ON chat_conversations(user_id);
    CREATE INDEX IF NOT EXISTS idx_chat_messages_conv ON chat_messages(conversation_id);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);
  `);

  // Safe schema migrations for existing database files
  try {
    db.exec("ALTER TABLE products ADD COLUMN cost_price_egp REAL DEFAULT 0;");
  } catch {}
  try {
    db.exec("ALTER TABLE products ADD COLUMN brand TEXT DEFAULT 'LORÉA';");
  } catch {}
  try {
    db.exec("ALTER TABLE password_reset_tokens ADD COLUMN code TEXT;");
  } catch {}
  try {
    db.exec("CREATE INDEX IF NOT EXISTS idx_password_reset_code ON password_reset_tokens(code);");
  } catch {}
  try {
    db.exec("ALTER TABLE email_verifications ADD COLUMN code TEXT;");
  } catch {}

  // Seed default data if database is fresh
  seedDefaultData();
  seedDefaultCollections();
  ensureInitialAdmin();
}

function ensureInitialAdmin() {
  const email = process.env.ADMIN_INITIAL_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!email && !password) return;
  if (!email || !password || password.length < 16) {
    throw new Error('Set ADMIN_INITIAL_EMAIL and a 16+ character ADMIN_INITIAL_PASSWORD to bootstrap the first admin.');
  }
  const existing = db.prepare('SELECT id, role FROM users WHERE email = ?').get(email) as { id: string; role: string } | undefined;
  if (existing) {
    if (!['admin', 'super_admin'].includes(existing.role)) {
      throw new Error('ADMIN_INITIAL_EMAIL belongs to a non-admin account; refusing role escalation.');
    }
    return;
  }
  const id = `user_${randomUUID()}`;
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(12));
  db.prepare("INSERT INTO users (id, uuid, email, password_hash, role, status, email_verified) VALUES (?, ?, ?, ?, 'super_admin', 'active', 1)")
    .run(id, randomUUID(), email, hash);
  db.prepare("INSERT INTO admins (id, user_id, name, role_id, department) VALUES (?, ?, 'Initial Administrator', 'role_super_admin', 'Executive')")
    .run(`admin_${randomUUID()}`, id);
}

function seedDefaultCollections() {
  try {
    const colCount = db.prepare('SELECT COUNT(*) as count FROM collections').get() as { count: number };
    if (colCount.count === 0) {
      const defaultCols = [
        { id: 'col_new', name: 'New Collection', nameAr: 'المجموعة الجديدة', slug: 'new-collection', desc: 'Latest architectural silhouettes and seasonal tailoring', sortOrder: 1 },
        { id: 'col_essentials', name: 'Essentials', nameAr: 'الأساسيات الفاخرة', slug: 'essentials', desc: 'Timeless foundational pieces for refined everyday poise', sortOrder: 2 },
        { id: 'col_best_sellers', name: 'Best Sellers', nameAr: 'الأكثر طلباً', slug: 'best-sellers', desc: 'Celebrated atelier pieces beloved across Egypt and the Gulf', sortOrder: 3 },
        { id: 'col_limited', name: 'Limited Edition', nameAr: 'إصدار محدود', slug: 'limited-edition', desc: 'Exclusive runway runs crafted with rare European deadstock fabrics', sortOrder: 4 },
        { id: 'col_seasonal', name: 'Seasonal Resort', nameAr: 'إصدار المنتجع والمواسم', slug: 'seasonal', desc: 'Breezy luxury linens and fluid silks tailored for sunlit destinations', sortOrder: 5 }
      ];
      const insertCol = db.prepare(`
        INSERT INTO collections (id, name, name_ar, slug, description, sort_order, is_active)
        VALUES (?, ?, ?, ?, ?, ?, 1)
      `);
      for (const c of defaultCols) {
        insertCol.run(c.id, c.name, c.nameAr, c.slug, c.desc, c.sortOrder);
      }
    }
  } catch (err) {
    console.warn('Collections seed warning:', err);
  }
}

function seedDefaultData() {
  const roleCheck = db.prepare('SELECT COUNT(*) as count FROM roles').get() as { count: number };
  if (roleCheck.count === 0) {
    // 1. Roles
    const insertRole = db.prepare('INSERT INTO roles (id, name, description) VALUES (?, ?, ?)');
    insertRole.run('role_super_admin', 'Super Admin', 'Full unrestricted platform access');
    insertRole.run('role_admin', 'Admin', 'E-commerce operations, catalog, and order management');
    insertRole.run('role_manager', 'Manager', 'Catalog updates, inventory monitoring, and customer service');
    insertRole.run('role_support', 'Support', 'Order tracking and customer inquiry resolution');
    insertRole.run('role_customer', 'Customer', 'Default shopping client account');

    // 2. Permissions
    const permissionsList = [
      ['products.view', 'View products catalog', 'products'],
      ['products.create', 'Create new products', 'products'],
      ['products.edit', 'Edit product details and pricing', 'products'],
      ['products.delete', 'Archive or delete products', 'products'],
      ['orders.view', 'View all customer orders', 'orders'],
      ['orders.edit', 'Update order status and tracking', 'orders'],
      ['orders.cancel', 'Cancel orders and issue refunds', 'orders'],
      ['customers.view', 'View customer list and profiles', 'customers'],
      ['customers.edit', 'Update customer accounts and notes', 'customers'],
      ['customers.disable', 'Disable or restrict customer access', 'customers'],
      ['inventory.view', 'View inventory and stock levels', 'inventory'],
      ['inventory.edit', 'Adjust inventory quantities and reasons', 'inventory'],
      ['analytics.view', 'Access sales and financial analytics', 'analytics'],
      ['settings.view', 'View brand and platform settings', 'settings'],
      ['settings.edit', 'Modify platform configuration', 'settings'],
      ['admin_users.view', 'View staff and admin users', 'admin_users'],
      ['admin_users.manage', 'Create and modify admin permissions', 'admin_users'],
    ];

    const insertPerm = db.prepare('INSERT INTO permissions (id, code, description, category) VALUES (?, ?, ?, ?)');
    for (const [code, desc, cat] of permissionsList) {
      insertPerm.run(`perm_${code.replace('.', '_')}`, code, desc, cat);
    }

    // Role permissions mapping
    const insertRolePerm = db.prepare('INSERT INTO role_permissions (role_id, permission_code) VALUES (?, ?)');
    for (const [code] of permissionsList) {
      insertRolePerm.run('role_super_admin', code);
    }
    for (const [code] of permissionsList.filter(([c]) => !c.startsWith('admin_users'))) {
      insertRolePerm.run('role_admin', code);
    }
    for (const [code] of permissionsList.filter(([c]) => c.startsWith('products') || c.startsWith('orders.view') || c.startsWith('inventory'))) {
      insertRolePerm.run('role_manager', code);
    }
    insertRolePerm.run('role_support', 'orders.view');
    insertRolePerm.run('role_support', 'customers.view');
  }

  // Production installs start without test accounts; catalog data remains seeded separately.

  // Populate categories and products from products.ts if not yet populated
  seedCatalogFromProducts();
}

function seedCatalogFromProducts() {
  const prodCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (prodCount.count > 0) return;

  // Categories
  const categories = [
    { id: 'cat_dresses', name: 'Dresses', name_ar: 'فساتين', slug: 'dresses' },
    { id: 'cat_tops', name: 'Tops & Blouses', name_ar: 'قمصان وبلوزات', slug: 'tops' },
    { id: 'cat_sets', name: 'Co-ord Sets', name_ar: 'أطقم متناسقة', slug: 'sets' },
    { id: 'cat_outerwear', name: 'Outerwear', name_ar: 'معاطف وجواكت', slug: 'outerwear' },
    { id: 'cat_pants', name: 'Trousers & Skirts', name_ar: 'بناطيل وتنانير', slug: 'pants' },
    { id: 'cat_modest', name: 'Modest Edit', name_ar: 'المجموعة المحتشمة', slug: 'modest-edit' },
  ];

  const insertCat = db.prepare('INSERT OR IGNORE INTO categories (id, name, name_ar, slug, is_active) VALUES (?, ?, ?, ?, 1)');
  for (const c of categories) {
    insertCat.run(c.id, c.name, c.name_ar, c.slug);
  }

  // 20 rich women's fashion products for LORÉA
  const seedProducts = [
    {
      id: 'lorea-01',
      name: 'The Atelier Silk Midi Dress',
      name_ar: 'فستان ميدي من الحرير الطبيعي',
      subtitle: 'Bias-cut mulberry silk with delicate neckline',
      category_id: 'cat_dresses',
      subcategory: 'Midi Dresses',
      collection: 'New Collection',
      price_egp: 4850,
      price_usd: 102,
      original_price_egp: 5400,
      badge: 'BEST SELLER',
      fabric: '100% Egyptian Giza Mulberry Silk',
      fit: 'Fluid bias silhouette draped to contour',
      care: 'Dry clean or gentle cold hand wash',
      shipping: 'Delivered in 24-48 hours across Greater Cairo',
      sku: 'LOR-DRS-001',
      rating: 4.9,
      reviews_count: 42,
      is_modest_edit: 0,
      colors: [
        { name: 'Champagne Taupe', hex: '#D4C5B5' },
        { name: 'Onyx Noir', hex: '#1D1D1B' },
        { name: 'Terracotta Rose', hex: '#B88F88' },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'lorea-02',
      name: 'The Nile Linen Oversized Shirt',
      name_ar: 'قميص كتان أوفرسايز من كتان النيل',
      subtitle: 'Relaxed drop-shoulder tailoring in pure washed flax',
      category_id: 'cat_tops',
      subcategory: 'Shirts',
      collection: 'Essentials',
      price_egp: 2650,
      price_usd: 56,
      badge: 'NEW',
      fabric: '100% Pure Egyptian Washed Linen',
      fit: 'Relaxed oversized fit with mother-of-pearl buttons',
      care: 'Machine wash 30°C delicate, hang dry',
      shipping: 'Same day dispatch for Cairo & Giza',
      sku: 'LOR-TOP-002',
      rating: 4.8,
      reviews_count: 29,
      is_modest_edit: 1,
      colors: [
        { name: 'Ivory Cream', hex: '#F7F4EF' },
        { name: 'Desert Sand', hex: '#C7BBAE' },
        { name: 'Soft Sage', hex: '#A3AF9F' },
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'lorea-03',
      name: 'The Cairo Structured Blazer',
      name_ar: 'بليزر كلاسيكي مهيكل بقصة القاهرة',
      subtitle: 'Tailored wool-cotton blend with sculpted waistline',
      category_id: 'cat_outerwear',
      subcategory: 'Blazers',
      collection: 'New Collection',
      price_egp: 6200,
      price_usd: 130,
      badge: 'NEW',
      fabric: 'Virgin Wool & Egyptian Cotton Crepe',
      fit: 'Structured shoulders with feminine darted waist',
      care: 'Specialist dry clean only',
      shipping: 'White glove courier delivery available',
      sku: 'LOR-OUT-003',
      rating: 5.0,
      reviews_count: 18,
      is_modest_edit: 1,
      colors: [
        { name: 'Charcoal Espresso', hex: '#2C2825' },
        { name: 'Warm Ecru', hex: '#EAE5DE' },
      ],
      sizes: ['XS', 'S', 'M', 'L'],
      image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'lorea-04',
      name: 'The Alexandria Pleated Trench',
      name_ar: 'معطف ترنش بليسيه الإسكندرية',
      subtitle: 'Water-repellent technical cotton with sunburst back pleats',
      category_id: 'cat_outerwear',
      subcategory: 'Trench Coats',
      collection: 'Limited Edition',
      price_egp: 7800,
      price_usd: 164,
      original_price_egp: 8600,
      badge: 'LIMITED',
      fabric: 'Gabardine Technical Cotton',
      fit: 'Double-breasted with removable belt and back storm flap',
      care: 'Specialist dry clean',
      shipping: 'Complimentary express delivery in Egypt',
      sku: 'LOR-OUT-004',
      rating: 4.9,
      reviews_count: 36,
      is_modest_edit: 1,
      colors: [
        { name: 'Classic Camel', hex: '#B8977E' },
        { name: 'Midnight Ink', hex: '#1C222E' },
      ],
      sizes: ['S', 'M', 'L'],
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'lorea-05',
      name: 'The Luxor Wide-Leg Pleated Trousers',
      name_ar: 'بنطال واسع الساق مع كسرات الأقصر',
      subtitle: 'High-waisted tailored trousers in flowy twill',
      category_id: 'cat_pants',
      subcategory: 'Trousers',
      collection: 'Essentials',
      price_egp: 3400,
      price_usd: 72,
      badge: 'BEST SELLER',
      fabric: 'Egyptian Cotton & Modal Twill',
      fit: 'High rise, deep twin front pleats, wide pooling hem',
      care: 'Machine wash 30°C delicate',
      shipping: 'Dispatched in 24 hours',
      sku: 'LOR-PNT-005',
      rating: 4.8,
      reviews_count: 51,
      is_modest_edit: 1,
      colors: [
        { name: 'Oatmeal Heather', hex: '#DED8CE' },
        { name: 'Deep Black', hex: '#1D1D1B' },
        { name: 'Rich Olive', hex: '#585E4F' },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'lorea-06',
      name: 'The Zamalek Linen Co-Ord Set',
      name_ar: 'طقم كتان متناسق الزمالك (قميص وبنطال)',
      subtitle: 'Two-piece matching set: wrap tunic and fluid pant',
      category_id: 'cat_sets',
      subcategory: 'Two-Piece Sets',
      collection: 'New Collection',
      price_egp: 5600,
      price_usd: 118,
      badge: 'NEW',
      fabric: '100% Breathable Egyptian Flax Linen',
      fit: 'Relaxed tunic paired with elasticated waist wide pant',
      care: 'Cold hand wash or delicate cycle',
      shipping: 'Complimentary shipping across Egypt',
      sku: 'LOR-SET-006',
      rating: 4.9,
      reviews_count: 22,
      is_modest_edit: 1,
      colors: [
        { name: 'Natural Sand', hex: '#C9BEAF' },
        { name: 'Terracotta Rust', hex: '#9E5B4B' },
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'lorea-07',
      name: 'The Giza Poplin Tiered Maxi Dress',
      name_ar: 'فستان ماكسي طبقات من بوبلين جيزة',
      subtitle: 'Crisp tiered silhouette with balloon sleeves and tie belt',
      category_id: 'cat_dresses',
      subcategory: 'Maxi Dresses',
      collection: 'Best Sellers',
      price_egp: 4600,
      price_usd: 97,
      badge: 'BEST SELLER',
      fabric: '100% Extra-Long Staple Egyptian Giza Cotton',
      fit: 'Voluminous tiered skirt with flattering cinched waist',
      care: 'Gentle machine wash, low iron',
      shipping: 'Next-day delivery available in Cairo & Alexandria',
      sku: 'LOR-DRS-007',
      rating: 4.9,
      reviews_count: 64,
      is_modest_edit: 1,
      colors: [
        { name: 'Pure White', hex: '#FFFFFF' },
        { name: 'Pale Cornflower', hex: '#A8BDD4' },
        { name: 'Classic Black', hex: '#1D1D1B' },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'lorea-08',
      name: 'The Siwa Handwoven Cotton Kimono',
      name_ar: 'كيمونو قطني منسوج يدوياً من واحة سيوة',
      subtitle: 'Artisanal fringe hem open coat with intricate tonal stitch',
      category_id: 'cat_outerwear',
      subcategory: 'Kimonos',
      collection: 'Limited Edition',
      price_egp: 5200,
      price_usd: 110,
      badge: 'LIMITED',
      fabric: 'Heritage Egyptian Handloom Cotton',
      fit: 'Draped one-size generous wrap with matching sash',
      care: 'Hand wash cold, dry flat',
      shipping: 'Packaged in branded keepsake canvas tote',
      sku: 'LOR-OUT-008',
      rating: 5.0,
      reviews_count: 14,
      is_modest_edit: 1,
      colors: [
        { name: 'Ecru & Umber', hex: '#D6C8B8' },
      ],
      sizes: ['S', 'M', 'L'],
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
    }
  ];

  const insertProd = db.prepare(`
    INSERT INTO products (
      id, name, name_ar, subtitle, category_id, subcategory, collection,
      price_egp, price_usd, original_price_egp, badge, fabric, fit, care,
      shipping, sku, rating, reviews_count, is_modest_edit, status
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, 'active'
    )
  `);

  const insertVariant = db.prepare(`
    INSERT INTO product_variants (
      id, product_id, sku, color_name, color_hex, size, stock, low_stock_threshold
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 5)
  `);

  const insertImg = db.prepare(`
    INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary)
    VALUES (?, ?, ?, 0, 1)
  `);

  const insertInv = db.prepare(`
    INSERT INTO inventory (id, variant_id, current_stock, low_stock_threshold)
    VALUES (?, ?, ?, 5)
  `);

  const insertInvMovement = db.prepare(`
    INSERT INTO inventory_movements (id, variant_id, action, quantity, previous_stock, new_stock, reason, created_by)
    VALUES (?, ?, 'initial', ?, 0, ?, 'Initial catalog provisioning', 'system')
  `);

  for (const p of seedProducts) {
    insertProd.run(
      p.id, p.name, p.name_ar, p.subtitle, p.category_id, p.subcategory, p.collection,
      p.price_egp, p.price_usd, p.original_price_egp || null, p.badge || null,
      p.fabric, p.fit, p.care, p.shipping, p.sku, p.rating, p.reviews_count, p.is_modest_edit
    );

    insertImg.run(`img_${p.id}`, p.id, p.image);

    // Variants for each color x size
    for (const color of p.colors) {
      for (const size of p.sizes) {
        const variantId = `var_${p.id}_${color.name.slice(0, 3).toLowerCase()}_${size.toLowerCase()}`;
        const variantSku = `${p.sku}-${color.name.slice(0, 3).toUpperCase()}-${size}`;
        const stockQty = Math.floor(Math.random() * 18) + 6; // 6 to 24 units

        insertVariant.run(variantId, p.id, variantSku, color.name, color.hex, size, stockQty);
        insertInv.run(`inv_${variantId}`, variantId, stockQty);
        insertInvMovement.run(`mov_${variantId}`, variantId, stockQty, stockQty);
      }
    }
  }

  // Seed sample customer orders
  seedSampleOrders();
}

function seedSampleOrders() {
  const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
  if (orderCount.count > 0) return;

  const ordersData = [
    {
      id: 'ord_1001',
      order_number: 'LOR-2025-8910',
      customer_id: 'cust_user_cust_01',
      user_id: 'user_cust_01',
      status: 'delivered',
      payment_status: 'paid',
      shipping_status: 'delivered',
      subtotal: 7500,
      discount: 750,
      shipping_cost: 0,
      tax: 0,
      total: 6750,
      currency: 'EGP',
      payment_method: 'Credit Card (Online)',
      address: JSON.stringify({
        fullName: 'Nour Khalil',
        phone: '+20 100 234 5678',
        governorate: 'Cairo',
        city: 'New Cairo',
        street: 'Street 90 North, Choueifat District',
        building: 'Villa 14B',
      }),
      tracking_number: 'BSTA-EG-892173',
      items: [
        {
          id: 'item_01',
          product_id: 'lorea-01',
          name: 'The Atelier Silk Midi Dress',
          sku: 'LOR-DRS-001-CHA-M',
          color: 'Champagne Taupe',
          size: 'M',
          price: 4850,
          quantity: 1,
          total: 4850,
          image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'item_02',
          product_id: 'lorea-02',
          name: 'The Nile Linen Oversized Shirt',
          sku: 'LOR-TOP-002-IVO-M',
          color: 'Ivory Cream',
          size: 'M',
          price: 2650,
          quantity: 1,
          total: 2650,
          image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=600&q=80',
        }
      ]
    },
    {
      id: 'ord_1002',
      order_number: 'LOR-2025-9124',
      customer_id: 'cust_user_cust_01',
      user_id: 'user_cust_01',
      status: 'shipped',
      payment_status: 'paid',
      shipping_status: 'in_transit',
      subtotal: 5600,
      discount: 0,
      shipping_cost: 0,
      tax: 0,
      total: 5600,
      currency: 'EGP',
      payment_method: 'Cash on Delivery',
      address: JSON.stringify({
        fullName: 'Nour Khalil',
        phone: '+20 100 234 5678',
        governorate: 'Cairo',
        city: 'New Cairo',
        street: 'Street 90 North, Choueifat District',
        building: 'Villa 14B',
      }),
      tracking_number: 'BSTA-EG-912084',
      items: [
        {
          id: 'item_03',
          product_id: 'lorea-06',
          name: 'The Zamalek Linen Co-Ord Set',
          sku: 'LOR-SET-006-NAT-S',
          color: 'Natural Sand',
          size: 'S',
          price: 5600,
          quantity: 1,
          total: 5600,
          image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
        }
      ]
    },
    {
      id: 'ord_1003',
      order_number: 'LOR-2025-9430',
      customer_id: 'cust_user_cust_02',
      user_id: 'user_cust_02',
      status: 'processing',
      payment_status: 'paid',
      shipping_status: 'preparing',
      subtotal: 6200,
      discount: 500,
      shipping_cost: 0,
      tax: 0,
      total: 5700,
      currency: 'EGP',
      payment_method: 'Credit Card (Online)',
      address: JSON.stringify({
        fullName: 'Mariam Hassan',
        phone: '+20 122 876 5432',
        governorate: 'Giza',
        city: 'Sheikh Zayed',
        street: 'El Boustan St, Beverly Hills Compound',
        building: 'Building 42, Apt 3',
      }),
      tracking_number: 'BSTA-EG-943011',
      items: [
        {
          id: 'item_04',
          product_id: 'lorea-03',
          name: 'The Cairo Structured Blazer',
          sku: 'LOR-OUT-003-CHA-S',
          color: 'Charcoal Espresso',
          size: 'S',
          price: 6200,
          quantity: 1,
          total: 6200,
          image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=600&q=80',
        }
      ]
    }
  ];

  const insertOrder = db.prepare(`
    INSERT INTO orders (
      id, order_number, customer_id, user_id, status, payment_status, shipping_status,
      subtotal, discount, shipping_cost, tax, total, currency, payment_method,
      shipping_address_json, tracking_number
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?
    )
  `);

  const insertOrderItem = db.prepare(`
    INSERT INTO order_items (
      id, order_id, product_id, product_name_snapshot, sku_snapshot,
      color_name, size, price, quantity, total, image_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertHistory = db.prepare(`
    INSERT INTO order_status_history (id, order_id, status, notes, updated_by)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const o of ordersData) {
    insertOrder.run(
      o.id, o.order_number, o.customer_id, o.user_id, o.status, o.payment_status, o.shipping_status,
      o.subtotal, o.discount, o.shipping_cost, o.tax, o.total, o.currency, o.payment_method,
      o.address, o.tracking_number
    );

    for (const item of o.items) {
      insertOrderItem.run(
        item.id, o.id, item.product_id, item.name, item.sku,
        item.color, item.size, item.price, item.quantity, item.total, item.image
      );
    }

    insertHistory.run(`hist_${o.id}_1`, o.id, 'confirmed', 'Payment verified and order accepted into atelier queue', 'Bosta Logistics Integration');
    if (o.status === 'shipped' || o.status === 'delivered') {
      insertHistory.run(`hist_${o.id}_2`, o.id, 'shipped', `Dispatched via courier with tracking ${o.tracking_number}`, 'Logistics Admin');
    }
    if (o.status === 'delivered') {
      insertHistory.run(`hist_${o.id}_3`, o.id, 'delivered', 'Package delivered and signed by customer in New Cairo', 'Courier Dispatch');
    }
  }
}
