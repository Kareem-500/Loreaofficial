import { Router, Response } from 'express';
import { db } from '../db';
import { AuthenticatedRequest, requireAuth } from '../auth';

const router = Router();

router.use(requireAuth);

// Get customer wishlist
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const wishlist = db.prepare('SELECT id FROM wishlists WHERE user_id = ?').get(req.user!.userId) as any;
    if (!wishlist) {
      return res.json({ productIds: [], products: [] });
    }

    const items = db.prepare(`
      SELECT wi.product_id, p.*,
             (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM wishlist_items wi
      JOIN products p ON p.id = wi.product_id
      WHERE wi.wishlist_id = ?
      ORDER BY wi.added_at DESC
    `).all(wishlist.id) as any[];

    const productIds = items.map((i) => i.product_id);
    return res.json({ productIds, products: items });
  } catch (err: any) {
    console.error('Fetch wishlist error:', err);
    return res.status(500).json({ error: 'Failed to retrieve wishlist.' });
  }
});

// Add to wishlist
router.post('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }

    const product = db.prepare("SELECT id FROM products WHERE id = ? AND status = 'active'").get(productId);
    if (!product) {
      return res.status(404).json({ error: 'This garment is no longer available.' });
    }

    // Ensure wishlist exists for user
    let wishlist = db.prepare('SELECT id FROM wishlists WHERE user_id = ?').get(req.user!.userId) as any;
    if (!wishlist) {
      const wishlistId = `wish_${Date.now()}`;
      db.prepare('INSERT INTO wishlists (id, user_id) VALUES (?, ?)').run(wishlistId, req.user!.userId);
      wishlist = { id: wishlistId };
    }

    const itemId = `wi_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    db.prepare(`
      INSERT OR IGNORE INTO wishlist_items (id, wishlist_id, product_id)
      VALUES (?, ?, ?)
    `).run(itemId, wishlist.id, productId);

    return res.json({ message: 'Added to wishlist.', productId });
  } catch (err: any) {
    console.error('Add to wishlist error:', err);
    return res.status(500).json({ error: 'Failed to add item to wishlist.' });
  }
});

// Remove from wishlist
router.delete('/:productId', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const wishlist = db.prepare('SELECT id FROM wishlists WHERE user_id = ?').get(req.user!.userId) as any;
    if (wishlist) {
      db.prepare('DELETE FROM wishlist_items WHERE wishlist_id = ? AND product_id = ?').run(wishlist.id, productId);
    }
    return res.json({ message: 'Removed from wishlist.', productId });
  } catch (err: any) {
    console.error('Remove wishlist error:', err);
    return res.status(500).json({ error: 'Failed to remove item.' });
  }
});

// Merge guest wishlist into user's DB wishlist
router.post('/merge', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { guestIds } = req.body;
    if (!Array.isArray(guestIds) || guestIds.length === 0) {
      return res.json({ message: 'No guest items to merge.' });
    }

    let wishlist = db.prepare('SELECT id FROM wishlists WHERE user_id = ?').get(req.user!.userId) as any;
    if (!wishlist) {
      const wishlistId = `wish_${Date.now()}`;
      db.prepare('INSERT INTO wishlists (id, user_id) VALUES (?, ?)').run(wishlistId, req.user!.userId);
      wishlist = { id: wishlistId };
    }

    const insertStmt = db.prepare(`
      INSERT OR IGNORE INTO wishlist_items (id, wishlist_id, product_id)
      VALUES (?, ?, ?)
    `);

    for (const id of guestIds) {
      if (typeof id === 'string') {
        const product = db.prepare("SELECT id FROM products WHERE id = ? AND status = 'active'").get(id);
        if (product) {
          insertStmt.run(`wi_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, wishlist.id, id);
        }
      }
    }

    // Return updated list
    const items = db.prepare('SELECT product_id FROM wishlist_items WHERE wishlist_id = ?').all(wishlist.id) as any[];
    return res.json({
      message: 'Wishlist merged successfully.',
      productIds: items.map((i) => i.product_id),
    });
  } catch (err: any) {
    console.error('Merge wishlist error:', err);
    return res.status(500).json({ error: 'Failed to merge wishlist.' });
  }
});

export default router;
