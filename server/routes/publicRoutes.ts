import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { db } from '../db';
import { extractToken, verifyAuthToken } from '../auth';

const router = Router();

// 1. Validate Coupon
router.post('/coupons/validate', (req: Request, res: Response) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Please enter a promo code.' });
    }

    const coupon = db.prepare(`
      SELECT * FROM coupons
      WHERE code = ? COLLATE NOCASE AND is_active = 1
    `).get(code.trim()) as any;

    if (!coupon) {
      return res.status(404).json({ error: 'Promo code is invalid or has expired.' });
    }

    if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
      return res.status(400).json({ error: 'This coupon code has expired.' });
    }

    const orderAmount = Number(subtotal) || 0;
    if (orderAmount < coupon.min_order_value) {
      return res.status(400).json({
        error: `Minimum order of ${coupon.min_order_value} EGP required to apply code ${coupon.code}.`,
      });
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = Math.round((orderAmount * coupon.discount_value) / 100);
      if (coupon.max_discount && discountAmount > coupon.max_discount) {
        discountAmount = coupon.max_discount;
      }
    } else {
      discountAmount = Math.min(orderAmount, coupon.discount_value);
    }

    return res.json({
      valid: true,
      code: coupon.code,
      discountAmount,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      message: `Coupon applied: ${discountAmount} EGP off`,
    });
  } catch (err: any) {
    console.error('Coupon validation error:', err);
    return res.status(500).json({ error: 'Failed to validate coupon.' });
  }
});

// 2. Checkout Submission
router.post('/checkout', (req: Request, res: Response) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod = 'Cash on Delivery',
      couponCode,
      currency = 'EGP',
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.city) {
      return res.status(422).json({ error: 'Please provide full shipping details.' });
    }

    // Determine user ID if authenticated, else link or create guest customer
    const token = extractToken(req);
    const authPayload = token ? verifyAuthToken(token) : null;
    let userId = authPayload?.userId;
    let customerId = '';

    if (userId) {
      const cust = db.prepare('SELECT id FROM customers WHERE user_id = ?').get(userId) as any;
      customerId = cust?.id;
    }

    if (!customerId) {
      // Create guest customer
      userId = `guest_${Date.now()}`;
      customerId = `cust_${userId}`;

      // Insert guest user
      db.prepare(`
        INSERT INTO users (id, uuid, email, password_hash, role, status, email_verified)
        VALUES (?, ?, ?, 'guest_no_login', 'customer', 'active', 0)
      `).run(userId, crypto.randomUUID(), shippingAddress.email || `guest_${Date.now()}@lorea.guest`);

      const [first, ...rest] = (shippingAddress.fullName || 'Guest Customer').split(' ');
      db.prepare(`
        INSERT INTO customers (id, user_id, first_name, last_name, phone, country, city)
        VALUES (?, ?, ?, ?, ?, 'Egypt', ?)
      `).run(customerId, userId, first, rest.join(' ') || 'Client', shippingAddress.phone, shippingAddress.city);
    }

    // Calculate subtotal
    let subtotal = 0;
    for (const item of items) {
      const price = Number(item.product?.priceEgp || item.price || 0);
      const qty = Number(item.quantity || 1);
      subtotal += price * qty;
    }

    // Discount check
    let discount = 0;
    if (couponCode) {
      const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND is_active = 1').get(couponCode) as any;
      if (coupon) {
        if (coupon.discount_type === 'percentage') {
          discount = Math.round((subtotal * coupon.discount_value) / 100);
          if (coupon.max_discount && discount > coupon.max_discount) discount = coupon.max_discount;
        } else {
          discount = Math.min(subtotal, coupon.discount_value);
        }
        db.prepare('UPDATE coupons SET times_used = times_used + 1 WHERE id = ?').run(coupon.id);
      }
    }

    const shippingCost = subtotal >= 2500 ? 0 : 85;
    const total = Math.max(0, subtotal - discount + shippingCost);

    const orderId = `ord_${Date.now()}`;
    const orderNumber = `LOR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Insert order
    db.prepare(`
      INSERT INTO orders (
        id, order_number, customer_id, user_id, status, payment_status, shipping_status,
        subtotal, discount, shipping_cost, total, currency, payment_method,
        shipping_address_json, tracking_number
      ) VALUES (
        ?, ?, ?, ?, 'pending', 'pending', 'unfulfilled',
        ?, ?, ?, ?, ?, ?,
        ?, ?
      )
    `).run(
      orderId,
      orderNumber,
      customerId,
      userId,
      subtotal,
      discount,
      shippingCost,
      total,
      currency,
      paymentMethod,
      JSON.stringify(shippingAddress),
      `BSTA-EG-${Math.floor(100000 + Math.random() * 900000)}`
    );

    // Insert order items & reduce stock
    const insertItem = db.prepare(`
      INSERT INTO order_items (
        id, order_id, product_id, product_name_snapshot, sku_snapshot,
        color_name, size, price, quantity, total, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of items) {
      const prodId = item.product?.id || item.productId;
      const prodName = item.product?.name || item.name || 'LORÉA Garment';
      const color = item.selectedColor?.name || item.color || '';
      const size = item.selectedSize || item.size || 'M';
      const price = Number(item.product?.priceEgp || item.price || 0);
      const qty = Number(item.quantity || 1);
      const itemTotal = price * qty;
      const img = item.product?.images?.[0] || item.image || '';

      insertItem.run(
        `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        orderId,
        prodId,
        prodName,
        `${prodId}-${size}`,
        color,
        size,
        price,
        qty,
        itemTotal,
        img
      );

      // Inventory decrement attempt
      try {
        db.prepare(`
          UPDATE product_variants
          SET stock = MAX(0, stock - ?)
          WHERE product_id = ? AND size = ?
        `).run(qty, prodId, size);
      } catch (e) {
        // ignore variant mismatch gracefully
      }
    }

    // Order status history
    db.prepare(`
      INSERT INTO order_status_history (id, order_id, status, notes, updated_by)
      VALUES (?, ?, 'pending', 'Order placed by client via online checkout', 'Client Checkout')
    `).run(`hist_${Date.now()}`, orderId);

    return res.status(201).json({
      message: 'Order created successfully.',
      orderId,
      orderNumber,
      total,
      currency,
    });
  } catch (err: any) {
    console.error('Checkout creation error:', err);
    return res.status(500).json({ error: 'Failed to process checkout.' });
  }
});

export default router;
