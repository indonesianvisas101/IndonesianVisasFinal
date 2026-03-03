-- Create google_reviews table for caching
CREATE TABLE IF NOT EXISTS public.google_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name TEXT,
  profile_photo_url TEXT,
  rating INTEGER,
  relative_time_description TEXT,
  text TEXT,
  time INTEGER, -- Unix timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS just in case (Public Read)
ALTER TABLE public.google_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read google_reviews" ON public.google_reviews FOR SELECT USING (true);
