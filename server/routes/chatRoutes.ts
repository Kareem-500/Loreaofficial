import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { db } from '../db';
import { GoogleGenAI } from '@google/genai';
import { extractToken, verifyAuthToken, AuthenticatedRequest } from '../auth';

const router = Router();

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ============================================================================
// 1. SEND MESSAGE & GET AI ATELIER CONCIERGE RESPONSE
// ============================================================================
router.post('/message', async (req: Request, res: Response) => {
  try {
    const { message, conversationId: reqConvId, sessionToken: reqSessionToken, orderLookup } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const token = extractToken(req);
    const authPayload = token ? verifyAuthToken(token) : null;
    const userId = authPayload?.userId || null;
    const sessionToken = reqSessionToken || crypto.randomUUID();

    // 1. Get or create conversation
    let convId = reqConvId;
    if (convId) {
      const existingConv = db.prepare('SELECT id, user_id FROM chat_conversations WHERE id = ?').get(convId) as any;
      if (!existingConv) {
        convId = null;
      } else if (existingConv.user_id && existingConv.user_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized conversation access.' });
      }
    }

    if (!convId) {
      convId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      db.prepare(`
        INSERT INTO chat_conversations (id, user_id, session_token, title, status)
        VALUES (?, ?, ?, 'Atelier Styling Consultation', 'active')
      `).run(convId, userId, sessionToken);
    }

    // 2. Record Customer Message
    const userMsgId = `msg_${Date.now()}_u`;
    db.prepare(`
      INSERT INTO chat_messages (id, conversation_id, sender_role, sender_name, content, created_at)
      VALUES (?, ?, 'customer', ?, ?, CURRENT_TIMESTAMP)
    `).run(userMsgId, convId, authPayload?.firstName || 'Client', message.trim());

    // 3. Grounded Context Gathering from Real Database
    const cleanLower = message.toLowerCase().trim();
    let assistantReply = '';
    let recommendedProducts: any[] = [];
    let orderInfo: any = null;

    // Check if the user is asking about order tracking
    if (cleanLower.includes('order') || cleanLower.includes('track') || cleanLower.includes('طلب') || cleanLower.includes('تتبع')) {
      if (userId) {
        const userOrders = db.prepare(`
          SELECT id, order_number, status, payment_status, total, created_at, tracking_number
          FROM orders
          WHERE user_id = ?
          ORDER BY created_at DESC LIMIT 3
        `).all(userId) as any[];

        if (userOrders.length > 0) {
          const latest = userOrders[0];
          assistantReply = `I found your latest couture order **${latest.order_number}**. The current status is **${latest.status.toUpperCase()}** (Payment: ${latest.payment_status}). Estimated delivery to Cairo/Giza is within 2–3 business days. Tracking number: ${latest.tracking_number || 'BSTA-EG-CAIRO'}.`;
          orderInfo = latest;
        } else {
          assistantReply = "You currently do not have any orders associated with this account. Would you like assistance exploring our newest runway collection?";
        }
      } else if (orderLookup?.orderNumber && orderLookup?.phone) {
        // Guest verified order lookup
        const foundOrder = db.prepare(`
          SELECT o.id, o.order_number, o.status, o.payment_status, o.total, o.shipping_address_json, o.tracking_number
          FROM orders o
          JOIN customers c ON c.id = o.customer_id
          WHERE (o.order_number = ? OR o.id = ?) AND c.phone LIKE ?
        `).get(orderLookup.orderNumber.trim(), orderLookup.orderNumber.trim(), `%${orderLookup.phone.trim().slice(-8)}%`) as any;

        if (foundOrder) {
          assistantReply = `Order **${foundOrder.order_number}** is verified! Status: **${foundOrder.status.toUpperCase()}**. Delivery via express courier with tracking ${foundOrder.tracking_number || 'BSTA-EG-CAIRO'}.`;
          orderInfo = foundOrder;
        } else {
          assistantReply = "We couldn't locate an order with those credentials. Please verify your order number and the phone number used during checkout, or sign in to your LORÉA account.";
        }
      } else {
        assistantReply = "To assist with your order tracking, please sign in to your account, or provide your Order Number (e.g., LOR-2026-...) along with the phone number used at checkout.";
      }
    }

    // Check if the user is asking for product recommendations or dresses/tops/silks
    if (!assistantReply) {
      let matchedProducts: any[] = [];

      if (cleanLower.includes('dress') || cleanLower.includes('فستان') || cleanLower.includes('evening') || cleanLower.includes('gala')) {
        matchedProducts = db.prepare(`
          SELECT p.id, p.name, p.slug, p.price_egp, p.category_id, p.description,
                 (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC LIMIT 1) as image_url
          FROM products p
          WHERE p.status = 'active' AND (p.name LIKE '%Dress%' OR p.name LIKE '%Gown%' OR p.category_id LIKE '%dress%')
          LIMIT 3
        `).all() as any[];
      } else if (cleanLower.includes('top') || cleanLower.includes('blouse') || cleanLower.includes('قميص') || cleanLower.includes('بلوزة')) {
        matchedProducts = db.prepare(`
          SELECT p.id, p.name, p.slug, p.price_egp, p.category_id, p.description,
                 (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC LIMIT 1) as image_url
          FROM products p
          WHERE p.status = 'active' AND (p.name LIKE '%Top%' OR p.name LIKE '%Blouse%' OR p.name LIKE '%Shirt%')
          LIMIT 3
        `).all() as any[];
      } else if (cleanLower.includes('modest') || cleanLower.includes('abaya') || cleanLower.includes('عباية') || cleanLower.includes('محتشم')) {
        matchedProducts = db.prepare(`
          SELECT p.id, p.name, p.slug, p.price_egp, p.category_id, p.description,
                 (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC LIMIT 1) as image_url
          FROM products p
          WHERE p.status = 'active' AND (p.is_modest_edit = 1 OR p.name LIKE '%Abaya%' OR p.name LIKE '%Modest%')
          LIMIT 3
        `).all() as any[];
      } else {
        // General query: search products keyword
        matchedProducts = db.prepare(`
          SELECT p.id, p.name, p.slug, p.price_egp, p.category_id, p.description,
                 (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC LIMIT 1) as image_url
          FROM products p
          WHERE p.status = 'active'
          ORDER BY p.is_featured DESC, p.created_at DESC
          LIMIT 3
        `).all() as any[];
      }

      recommendedProducts = matchedProducts;

      // Use Gemini AI with strict grounding in real products
      const ai = getAiClient();
      if (ai) {
        const productCatalogSummary = matchedProducts.map((p) => `- ${p.name}: ${p.price_egp} EGP (Slug: ${p.slug})`).join('\n');
        const systemPrompt = `You are the Senior Atelier Concierge and Fashion Stylist at LORÉA, a luxury women's fashion house based in Zamalek, Cairo.
You uphold quiet luxury, architectural silhouettes, fine French linen, and Giza 45 Egyptian cotton.
Client question: "${message}"

AVAILABLE PRODUCTS IN ATELIER STOCK:
${productCatalogSummary || 'No specific products'}

Rules:
1. Speak in an elegant, gracious, and knowledgeable tone.
2. Recommend ONLY the garments listed above. NEVER invent products, prices, or false stock.
3. Keep the response to 2–3 concise sentences with clear styling advice.
4. If Arabic is detected in the question, reply in refined, modern Arabic. Otherwise, reply in English.`;

        try {
          const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ text: systemPrompt }],
          });
          if (aiResponse?.text) {
            assistantReply = aiResponse.text.trim();
          }
        } catch (e) {
          console.warn('Gemini chat generation fallback:', e);
        }
      }

      if (!assistantReply) {
        if (cleanLower.includes('size') || cleanLower.includes('sizing') || cleanLower.includes('مقاس')) {
          assistantReply = "Our garments follow standard European couture sizing (FR/EU 34–42). For tailored fits, our Giza cotton and French linen pieces are cut with effortless ease. You may also refer to our interactive Size Guide on any product page.";
        } else if (cleanLower.includes('shipping') || cleanLower.includes('delivery') || cleanLower.includes('شحن') || cleanLower.includes('توصيل')) {
          assistantReply = "We provide express atelier delivery across Egypt via Bosta Express (2–3 business days for Greater Cairo and Alexandria, 3–4 days for other governorates). Delivery is complimentary on all orders over 2,500 EGP.";
        } else if (cleanLower.includes('return') || cleanLower.includes('exchange') || cleanLower.includes('استرجاع') || cleanLower.includes('استبدال')) {
          assistantReply = "LORÉA offers complimentary 14-day atelier exchanges and returns for unworn garments with original security tags attached. Simply contact our concierge desk or request an exchange directly through your Account portal.";
        } else {
          assistantReply = "Welcome to LORÉA Atelier Concierge. We curate timeless silhouettes in Egyptian Giza cotton and French linen. How may I assist your wardrobe selection today?";
        }
      }
    }

    // 4. Record Assistant Message in DB
    const assistantMsgId = `msg_${Date.now()}_a`;
    const metadataJson = JSON.stringify({
      recommendedProducts: recommendedProducts.length > 0 ? recommendedProducts : undefined,
      order: orderInfo || undefined,
    });

    db.prepare(`
      INSERT INTO chat_messages (id, conversation_id, sender_role, sender_name, content, metadata_json, created_at)
      VALUES (?, ?, 'assistant', 'Atelier Concierge', ?, ?, CURRENT_TIMESTAMP)
    `).run(assistantMsgId, convId, assistantReply, metadataJson);

    // Update conversation timestamp
    db.prepare(`
      UPDATE chat_conversations
      SET last_message_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(convId);

    return res.json({
      success: true,
      conversationId: convId,
      sessionToken,
      message: {
        id: assistantMsgId,
        sender_role: 'assistant',
        sender_name: 'Atelier Concierge',
        content: assistantReply,
        metadata: {
          recommendedProducts,
          order: orderInfo,
        },
        created_at: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: 'Failed to process chat consultation.' });
  }
});

// ============================================================================
// 2. GET CHAT HISTORY
// ============================================================================
router.get('/history', (req: Request, res: Response) => {
  try {
    const { conversationId, sessionToken } = req.query;
    if (!conversationId && !sessionToken) {
      return res.json({ success: true, messages: [] });
    }

    let conversation: any = null;
    if (conversationId) {
      conversation = db.prepare('SELECT id, user_id, session_token FROM chat_conversations WHERE id = ?').get(conversationId as string);
    } else if (sessionToken) {
      conversation = db.prepare('SELECT id, user_id, session_token FROM chat_conversations WHERE session_token = ? ORDER BY last_message_at DESC LIMIT 1').get(sessionToken as string);
    }

    if (!conversation) {
      return res.json({ success: true, messages: [] });
    }

    const messages = db.prepare(`
      SELECT id, conversation_id, sender_role, sender_name, content, metadata_json, created_at
      FROM chat_messages
      WHERE conversation_id = ?
      ORDER BY created_at ASC
    `).all(conversation.id) as any[];

    const parsedMessages = messages.map((m) => {
      let metadata = null;
      if (m.metadata_json) {
        try {
          metadata = JSON.parse(m.metadata_json);
        } catch {}
      }
      return {
        id: m.id,
        sender_role: m.sender_role,
        sender_name: m.sender_name,
        content: m.content,
        metadata,
        created_at: m.created_at,
      };
    });

    return res.json({
      success: true,
      conversationId: conversation.id,
      messages: parsedMessages,
    });
  } catch (err: any) {
    console.error('Chat history error:', err);
    return res.status(500).json({ error: 'Failed to retrieve chat history.' });
  }
});

export default router;
