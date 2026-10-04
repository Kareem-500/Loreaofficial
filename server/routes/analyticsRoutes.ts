import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { db } from '../db';
import { extractToken, verifyAuthToken, AuthenticatedRequest, requireAuth, requireRoles } from '../auth';

const router = Router();

const ALLOWED_EVENT_NAMES = new Set([
  'page_view',
  'product_view',
  'product_search',
  'category_view',
  'add_to_cart',
  'remove_from_cart',
  'wishlist_add',
  'wishlist_remove',
  'checkout_started',
  'checkout_completed',
  'purchase',
  'login',
  'signup',
  'chat_opened',
  'tryon_opened',
]);

// ============================================================================
// 1. RECORD FIRST-PARTY ANALYTICS EVENT
// ============================================================================
router.post('/event', (req: Request, res: Response) => {
  try {
    const { event_name, session_id, path = '/', properties = {} } = req.body;

    if (!event_name || !ALLOWED_EVENT_NAMES.has(event_name)) {
      return res.status(400).json({ error: 'Valid event_name is required.' });
    }

    const token = extractToken(req);
    const authPayload = token ? verifyAuthToken(token) : null;
    const userId = authPayload?.userId || null;

    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const sessionId = session_id || 'guest_sess';
    const ipHash = crypto.createHash('sha256').update(req.ip || '127.0.0.1').digest('hex').substring(0, 16);

    db.prepare(`
      INSERT INTO analytics_events (id, event_name, user_id, session_id, path, properties_json, ip_hash, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      eventId,
      event_name,
      userId,
      sessionId,
      String(path).substring(0, 255),
      JSON.stringify(properties),
      ipHash
    );

    return res.json({ success: true, eventId });
  } catch (err: any) {
    console.error('Analytics event record error:', err);
    return res.status(500).json({ error: 'Failed to record analytics event.' });
  }
});

// ============================================================================
// 2. ADMIN ANALYTICS DASHBOARD API
// Authoritative aggregation from real database tables
// ============================================================================
router.get('/dashboard', requireAuth, requireRoles(['super_admin', 'admin', 'manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { period = '30d' } = req.query;

    // 1. Revenue & Order Aggregates from orders table
    const revStats = db.prepare(`
      SELECT 
        COALESCE(SUM(total), 0) as total_revenue,
        COALESCE(SUM(subtotal), 0) as net_merchandise_revenue,
        COALESCE(SUM(discount), 0) as total_discounts,
        COALESCE(SUM(shipping_cost), 0) as shipping_revenue,
        COUNT(id) as total_orders
      FROM orders
      WHERE status != 'cancelled'
    `).get() as any;

    const totalOrders = revStats.total_orders || 0;
    const totalRevenue = revStats.total_revenue || 0;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // 2. Conversion Metrics (checkout_started vs purchase)
    const eventCounts = db.prepare(`
      SELECT event_name, COUNT(id) as count
      FROM analytics_events
      WHERE event_name IN ('page_view', 'product_view', 'checkout_started', 'purchase')
      GROUP BY event_name
    `).all() as any[];

    const countsMap: Record<string, number> = {};
    for (const ec of eventCounts) {
      countsMap[ec.event_name] = ec.count;
    }

    const checkoutsStarted = countsMap['checkout_started'] || Math.max(totalOrders, 1);
    const purchases = totalOrders || countsMap['purchase'] || 0;
    const conversionRate = checkoutsStarted > 0 ? Number(((purchases / checkoutsStarted) * 100).toFixed(1)) : 0;

    // 3. Top Products by sales volume & revenue from order_items
    const topProducts = db.prepare(`
      SELECT 
        oi.product_id,
        oi.product_name_snapshot as name,
        COALESCE(SUM(oi.quantity), 0) as units_sold,
        COALESCE(SUM(oi.total), 0) as revenue,
        oi.image_url
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE o.status != 'cancelled'
      GROUP BY oi.product_id, oi.product_name_snapshot
      ORDER BY units_sold DESC
      LIMIT 5
    `).all() as any[];

    // 4. Category Distribution from products & categories
    const categoryStats = db.prepare(`
      SELECT 
        c.name as category_name,
        COUNT(DISTINCT p.id) as product_count,
        COALESCE(SUM(oi.total), 0) as category_revenue
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      LEFT JOIN order_items oi ON oi.product_id = p.id
      GROUP BY c.id, c.name
      ORDER BY category_revenue DESC
    `).all() as any[];

    // 5. Customer Metrics
    const totalCustomersRow = db.prepare('SELECT COUNT(id) as count FROM customers').get() as any;
    const activeCustomersRow = db.prepare('SELECT COUNT(DISTINCT customer_id) as count FROM orders WHERE status != \'cancelled\'').get() as any;

    // 6. Revenue Timeline (Monthly breakdown)
    const monthlyTimeline = db.prepare(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        COALESCE(SUM(total), 0) as revenue,
        COUNT(id) as orders_count
      FROM orders
      WHERE status != 'cancelled'
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month DESC
      LIMIT 6
    `).all() as any[];

    // 7. Recent Telemetry Events
    const recentEvents = db.prepare(`
      SELECT id, event_name, path, created_at, session_id
      FROM analytics_events
      ORDER BY created_at DESC
      LIMIT 15
    `).all() as any[];

    return res.json({
      success: true,
      data: {
        overview: {
          totalRevenue,
          netRevenue: revStats.net_merchandise_revenue || 0,
          totalDiscounts: revStats.total_discounts || 0,
          shippingRevenue: revStats.shipping_revenue || 0,
          totalOrders,
          averageOrderValue,
          conversionRate,
          totalCustomers: totalCustomersRow?.count || 0,
          activeCustomers: activeCustomersRow?.count || 0,
        },
        topProducts,
        categories: categoryStats,
        timeline: monthlyTimeline.reverse(),
        recentEvents,
      },
    });
  } catch (err: any) {
    console.error('Admin analytics error:', err);
    return res.status(500).json({ error: 'Failed to retrieve analytics metrics.' });
  }
});

export default router;
