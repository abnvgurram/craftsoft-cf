-- ============================================
-- SUPABASE DATABASE SETUP
-- Run this in Supabase SQL Editor
-- ============================================

-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    admin_id VARCHAR(10) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on admin_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_admin_id ON public.admins(admin_id);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read their own data
CREATE POLICY "Users can view own admin data" ON public.admins
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: Allow inserts during signup (service role or authenticated)
CREATE POLICY "Enable insert for authenticated users" ON public.admins
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy: Allow users to update their own data
CREATE POLICY "Users can update own admin data" ON public.admins
    FOR UPDATE
    USING (auth.uid() = id);

-- Policy: Allow anon to read admin_id and email for login
CREATE POLICY "Allow anon to read admin lookup data" ON public.admins
    FOR SELECT
    TO anon
    USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_admins_updated_at ON public.admins;
CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON public.admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT SELECT ON public.admins TO anon;
GRANT ALL ON public.admins TO authenticated;
