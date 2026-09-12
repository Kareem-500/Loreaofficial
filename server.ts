import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { initDatabase } from './server/db';
import { authenticate } from './server/auth';
import authRoutes from './server/routes/authRoutes';
import accountRoutes from './server/routes/accountRoutes';
import wishlistRoutes from './server/routes/wishlistRoutes';
import adminRoutes from './server/routes/adminRoutes';
import publicRoutes from './server/routes/publicRoutes';

dotenv.config();

// Initialize SQLite database, schemas, and seeds
initDatabase();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(authenticate);

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', brand: 'LORÉA', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/account', accountRoutes);
  app.use('/api/wishlist', wishlistRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/public', publicRoutes);

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
