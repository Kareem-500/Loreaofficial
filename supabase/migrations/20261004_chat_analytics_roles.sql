-- ====================================================================
-- LORÉA LUXURY FASHION E-COMMERCE
-- MIGRATION: Customer Chat, Analytics Events, Storage & Enhanced Roles
-- ====================================================================

-- 1. ENHANCED ROLES & PROFILES
-- Expand role check constraint to support customer, staff, admin, and super_admin
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('customer', 'staff', 'admin', 'super_admin'));

-- Update public.is_admin() to include both admin and super_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  );
$$;

-- Function to check if authenticated user is staff, admin, or super_admin
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('staff', 'admin', 'super_admin')
  );
$$;

-- 2. CUSTOMER CHAT & CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  title TEXT DEFAULT 'Atelier Styling Consultation',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  last_message_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('customer', 'assistant', 'staff')),
  sender_name TEXT DEFAULT 'Atelier Concierge',
  content TEXT NOT NULL,
  metadata JSONB, -- Optional recommendations, product cards, or order references
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indexes for Chat
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user ON public.chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_session ON public.chat_conversations(session_token);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conv ON public.chat_messages(conversation_id, created_at ASC);

-- 3. ANALYTICS EVENTS (First-party privacy-preserving behavioral analytics)
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  path TEXT NOT NULL,
  properties JSONB,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indexes for Analytics
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON public.analytics_events(user_id);

-- 4. ROW LEVEL SECURITY (RLS) FOR NEW TABLES
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 4.1 Chat Conversations Policies
-- Customers can view their own conversations; Staff/Admin can view all
CREATE POLICY "Users can view own chat conversations"
  ON public.chat_conversations FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR public.is_staff()
  );

-- Customers can insert new conversations
CREATE POLICY "Users can create chat conversations"
  ON public.chat_conversations FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR auth.uid() IS NULL
  );

-- Customers can update their own conversations; Staff can update
CREATE POLICY "Users can update own chat conversations"
  ON public.chat_conversations FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR public.is_staff()
  );

-- 4.2 Chat Messages Policies
-- Users can view messages of conversations they own; Staff can view all
CREATE POLICY "Users can view messages of their conversations"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations cc
      WHERE cc.id = conversation_id
      AND (cc.user_id = auth.uid() OR public.is_staff())
    )
  );

-- Users can insert messages to their own conversations; Staff can reply
CREATE POLICY "Users can insert messages to their conversations"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_conversations cc
      WHERE cc.id = conversation_id
      AND (cc.user_id = auth.uid() OR auth.uid() IS NULL OR public.is_staff())
    )
  );

-- 4.3 Analytics Events Policies
-- Anyone can insert public analytics events (rate-limited via API)
CREATE POLICY "Allow public insert of analytics events"
  ON public.analytics_events FOR INSERT
  WITH CHECK (true);

-- Only Staff/Admin can query analytics events
CREATE POLICY "Only staff can query analytics events"
  ON public.analytics_events FOR SELECT
  USING (public.is_staff());

-- 5. STORAGE BUCKETS SETUP (Product Images & Client Avatars)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('product-images', 'product-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Public read access for product images
CREATE POLICY "Public read access for product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Admin write access for product images
CREATE POLICY "Admin write access for product-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin update access for product-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin delete access for product-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());
