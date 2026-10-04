import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { initDatabase, db } from './server/db';
import { authenticate } from './server/auth';
import authRoutes from './server/routes/authRoutes';
import accountRoutes from './server/routes/accountRoutes';
import wishlistRoutes from './server/routes/wishlistRoutes';
import adminRoutes from './server/routes/adminRoutes';
import publicRoutes from './server/routes/publicRoutes';
import aiRoutes from './server/routes/aiRoutes';
import apiRoutes from './server/routes/apiRoutes';

dotenv.config();

// Initialize SQLite database, schemas, and seeds
initDatabase();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // CORS & Preflight Handling for iframe & dev preview
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Middlewares with high payload limit for photo try-on
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ limit: '20mb', extended: true }));
  app.use(cookieParser());
  app.use(authenticate);

  // Dynamic robots.txt with custom domain compatibility
  app.get('/robots.txt', (req, res) => {
    const siteUrl = process.env.SITE_URL || 'https://www.loreaofficial.com';
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/*

Sitemap: ${siteUrl}/sitemap.xml
`);
  });

  // Dynamic sitemap.xml with live product URLs
  app.get('/sitemap.xml', (req, res) => {
    const siteUrl = process.env.SITE_URL || 'https://www.loreaofficial.com';
    const today = new Date().toISOString().split('T')[0];

    const staticRoutes = [
      '',
      '/shop',
      '/shop/dresses',
      '/shop/tops',
      '/shop/sets',
      '/shop/bottoms',
      '/shop/outerwear',
      '/shop/modest',
      '/story',
      '/contact',
      '/journal',
      '/shipping',
      '/returns',
      '/faq'
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    for (const r of staticRoutes) {
      xml += `
  <url>
    <loc>${siteUrl}${r}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${r === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    }

    try {
      const prods = db.prepare("SELECT slug, updated_at FROM products WHERE status = 'active'").all() as any[];
      for (const p of prods) {
        xml += `
  <url>
    <loc>${siteUrl}/product/${p.slug}</loc>
    <lastmod>${(p.updated_at || today).split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
      }
    } catch {}

    xml += `
</urlset>`;
    res.type('application/xml');
    res.send(xml);
  });

  // Static brand assets
  app.get(['/LOREA fashion.svg', '/LOREA%20fashion.svg'], (req, res) => {
    res.type('image/svg+xml');
    res.sendFile(path.join(process.cwd(), 'public', 'LOREA fashion.svg'));
  });

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      brand: 'LORÉA',
      siteUrl: process.env.SITE_URL || 'https://www.loreaofficial.com',
      timestamp: new Date().toISOString(),
    });
  });

  // RESTful API Routers
  app.use('/api', apiRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/account', accountRoutes);
  app.use('/api/wishlist', wishlistRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/public', publicRoutes);
  app.use('/api/ai', aiRoutes);

  // Vite middleware for development vs static for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LORÉA Haute Couture Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
