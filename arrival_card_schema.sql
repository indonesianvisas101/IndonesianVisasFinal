
-- Create Enum Types for cleaner data
CREATE TYPE transport_mode AS ENUM ('Air', 'Sea');
CREATE TYPE accommodation_type AS ENUM ('House', 'Hotel', 'Other');
CREATE TYPE gender_type AS ENUM ('Male', 'Female');

-- Create the arrival_cards table
CREATE TABLE IF NOT EXISTS public.arrival_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Step 1: Personal Information
    nationality TEXT NOT NULL,
    full_name TEXT NOT NULL,
    dob DATE,
    gender gender_type,
    passport_number TEXT NOT NULL,
    passport_expiry DATE,
    phone_code TEXT,
    phone_number TEXT,
    email TEXT,
    
    -- Step 2: Travel Details
    arrival_date DATE,
    departure_date DATE,
    has_visa BOOLEAN DEFAULT false,
    kitas_number TEXT,
    
    -- Step 3: Transport & Address
    transport_type transport_mode DEFAULT 'Air',
    arrival_port TEXT,
    flight_number TEXT,
    accommodation_type accommodation_type DEFAULT 'Hotel',
    hotel_name TEXT,
    address TEXT,
    
    -- Step 4: Declaration (JSONB for complex nested data)
    symptoms JSONB DEFAULT '{}'::jsonb,
    travel_history TEXT[], -- Array of strings
    quarantine_data JSONB DEFAULT '{}'::jsonb,
    customs_data JSONB DEFAULT '{}'::jsonb,
    
    agreed BOOLEAN DEFAULT false
);

-- RLS Policies (Security)
ALTER TABLE public.arrival_cards ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form submission)
CREATE POLICY "Enable insert for everyone" ON public.arrival_cards
    FOR INSERT WITH CHECK (true);

-- Only admins can view
CREATE POLICY "Enable read for authenticated users only" ON public.arrival_cards
    FOR SELECT USING (auth.role() = 'authenticated');
