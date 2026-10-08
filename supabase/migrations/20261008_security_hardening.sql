-- Harden client-facing RLS and privileged RPCs. Apply after the base schema
-- and chat/analytics migrations.

-- Order totals and snapshots must only be written by create_order() and by
-- admins. Direct authenticated inserts would otherwise let clients forge totals.
DROP POLICY IF EXISTS "Orders insertable by customer" ON public.orders;
DROP POLICY IF EXISTS "Orders updatable by admin" ON public.orders;
CREATE POLICY "Orders updatable by admin"
  ON public.orders FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Order items insertable through order flow or admin" ON public.order_items;

-- These SECURITY DEFINER functions perform trusted inventory/order changes.
-- Do not leave PostgreSQL's default PUBLIC execute grant in place.
REVOKE ALL ON FUNCTION public.create_order(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_order(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) TO authenticated;
REVOKE ALL ON FUNCTION public.update_inventory(UUID, INTEGER, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_inventory(UUID, INTEGER, TEXT) TO authenticated;

-- Draft/archived product media and variants are visible only to administrators.
DROP POLICY IF EXISTS "Product images are publicly viewable" ON public.product_images;
CREATE POLICY "Active product images are publicly viewable"
  ON public.product_images FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_images.product_id AND p.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Product variants are publicly viewable" ON public.product_variants;
CREATE POLICY "Active product variants are publicly viewable"
  ON public.product_variants FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_variants.product_id AND p.status = 'active'
    )
  );

-- Anonymous chat writes are served through the application API, not direct
-- table access. A null auth.uid() condition would let any anonymous caller
-- insert messages into any conversation whose UUID they obtained.
DROP POLICY IF EXISTS "Users can create chat conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can update own chat conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can insert messages to their conversations" ON public.chat_messages;
CREATE POLICY "Authenticated users create own chat conversations"
  ON public.chat_conversations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);
CREATE POLICY "Authenticated users update own chat conversations"
  ON public.chat_conversations FOR UPDATE
  USING (auth.uid() = user_id OR public.is_staff())
  WITH CHECK (auth.uid() = user_id OR public.is_staff());
CREATE POLICY "Authenticated users insert messages to own conversations"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_conversations cc
      WHERE cc.id = conversation_id
        AND (cc.user_id = auth.uid() OR public.is_staff())
    )
  );

-- Bound public media uploads even if an existing bucket was created by an
-- earlier migration with broader defaults.
UPDATE storage.buckets
SET file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
WHERE id = 'product-images';

