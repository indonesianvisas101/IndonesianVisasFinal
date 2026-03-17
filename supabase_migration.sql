-- MASTER MIGRATION SCRIPT
-- This script does 3 things:
-- 1. CLEANS up your database (Deletes old tables).
-- 2. CREATES all tables correctly (matching your website code).
-- 3. SECURES everything (Enables RLS policies).

-- STEP 0: CLEANUP (DISABLED FOR SAFETY - Do not drop tables in production)
-- DROP TABLE IF EXISTS public.notifications CASCADE;
-- DROP TABLE IF EXISTS public.faqs CASCADE;
-- DROP TABLE IF EXISTS public.content_blocks CASCADE;
-- DROP TABLE IF EXISTS public.application_documents CASCADE;
-- DROP TABLE IF EXISTS public.user_documents CASCADE;
-- DROP TABLE IF EXISTS public.payments CASCADE;
-- DROP TABLE IF EXISTS public.visa_applications CASCADE;
-- DROP TABLE IF EXISTS public.visa_requirements CASCADE;
-- DROP TABLE IF EXISTS public.visa_pricing_options CASCADE;
-- DROP TABLE IF EXISTS public.visas CASCADE;
-- DROP TABLE IF EXISTS public.users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- STEP 1: CREATE TABLES

-- 1. USERS (Profile synced with Supabase Auth)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  whatsapp TEXT,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  avatar TEXT,
  address TEXT,
  bio TEXT,
  socials JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. VISAS & PRODUCTS
CREATE TABLE public.visas (
  id TEXT PRIMARY KEY, -- e.g. 'B211A'
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  fee TEXT NOT NULL,
  validity TEXT NOT NULL,
  extendable BOOLEAN NOT NULL DEFAULT FALSE,
  requirements TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.visa_pricing_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_id TEXT NOT NULL REFERENCES public.visas(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  currency TEXT DEFAULT 'IDR',
  amount NUMERIC(12, 2) NOT NULL,
  agent_fee NUMERIC(12, 2) DEFAULT 0,
  gov_fee NUMERIC(12, 2) DEFAULT 0,
  is_discounted BOOLEAN DEFAULT FALSE,
  discount_amount NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.visa_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_id TEXT NOT NULL REFERENCES public.visas(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  is_mandatory BOOLEAN DEFAULT TRUE
);

-- 3. APPLICATIONS & PAYMENTS
CREATE TABLE public.visa_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  visa_id TEXT NOT NULL REFERENCES public.visas(id),
  visa_name TEXT NOT NULL,
  status TEXT DEFAULT 'Pending', -- Draft, Pending, Paid, etc.
  
  -- Snapshots
  visa_snapshot JSONB,
  pricing_snapshot JSONB,
  
  -- Applicant Details
  applicant_name TEXT,
  passport_number TEXT,
  nationality TEXT,
  arrival_date TIMESTAMP WITH TIME ZONE,
  
  expires_at TIMESTAMP WITH TIME ZONE,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.visa_applications(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'IDR',
  provider TEXT NOT NULL, -- STRIPE, XENDIT
  status TEXT DEFAULT 'PENDING',
  metadata JSONB,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. DOCUMENTS
CREATE TABLE public.user_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.application_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.visa_applications(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CONTENT & SYSTEM
CREATE TABLE public.content_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id TEXT NOT NULL,
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  visa_id TEXT REFERENCES public.visas(id),
  display_order INTEGER DEFAULT 0
);

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- STEP 2: ENABLE RLS & SECURITY POLICIES (Fixes 'RLS Disabled' Errors)

-- A. PUBLIC READ Tables (Everyone can see)
ALTER TABLE public.visas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read visas" ON public.visas FOR SELECT USING (true);

ALTER TABLE public.visa_pricing_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read pricing" ON public.visa_pricing_options FOR SELECT USING (true);

ALTER TABLE public.visa_requirements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read requirements" ON public.visa_requirements FOR SELECT USING (true);

ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read content" ON public.content_blocks FOR SELECT USING (true);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read faqs" ON public.faqs FOR SELECT USING (true);


-- B. USER PRIVATE Tables (Only Owner can see/edit)

-- Users (Profile)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Visa Applications
ALTER TABLE public.visa_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own apps" ON public.visa_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create apps" ON public.visa_applications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own payments" ON public.payments 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.visa_applications WHERE id = payments.application_id AND user_id = auth.uid())
  );

-- Documents
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own docs" ON public.user_documents FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access app docs" ON public.application_documents 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.visa_applications WHERE id = application_documents.application_id AND user_id = auth.uid())
  );

-- Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

