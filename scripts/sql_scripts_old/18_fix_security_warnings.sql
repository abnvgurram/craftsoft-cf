-- ================================================================================
-- 18. FIX SECURITY WARNINGS - Supabase Linter Fixes
-- Description: Fixes all security warnings from Supabase linter
-- Run this in your Supabase SQL Editor
-- ================================================================================

-- ============================================
-- 1. FIX: Function Search Path Mutable
-- Problem: public.generate_inquiry_id has mutable search_path
-- ============================================

-- Ensure search_path is pinned to public (prevents search_path hijacking)
ALTER FUNCTION public.generate_inquiry_id() SET search_path = public;

-- ============================================
-- 2. FIX: RLS Policy Always True (Inquiries Table)
-- Problem: Overly permissive policies bypass row-level security
-- ============================================

-- First, drop ALL the insecure policies mentioned in linter warnings
DROP POLICY IF EXISTS "anon_insert_inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "auth_delete_inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "auth_update_inquiries" ON public.inquiries;

-- Also drop legacy policies that may exist from previous migrations
DROP POLICY IF EXISTS "Anyone can insert inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Authenticated users can view inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Authenticated users can update inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Authenticated users can delete inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Website can submit inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Active admins can manage inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Active admins can read inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Active admins can insert inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Active admins can update inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Active admins can delete inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "auth_select_inquiries" ON public.inquiries;

-- ============================================
-- 3. CREATE: Secure RLS Policies for Inquiries
-- ============================================

-- Enable RLS (in case it's not already)
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anonymous users can INSERT inquiries (website form submissions)
-- SECURE: Validates required fields are present
CREATE POLICY "anon_insert_inquiries" ON public.inquiries
    FOR INSERT 
    TO anon
    WITH CHECK (
        name IS NOT NULL AND 
        phone IS NOT NULL AND 
        length(name) > 0 AND 
        length(phone) > 0
    );

-- Policy 2: Active admins can SELECT all inquiries
CREATE POLICY "admin_select_inquiries" ON public.inquiries
    FOR SELECT 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE id = auth.uid() AND status = 'ACTIVE'
        )
    );

-- Policy 3: Active admins can INSERT inquiries (walk-ins, calls, etc.)
CREATE POLICY "admin_insert_inquiries" ON public.inquiries
    FOR INSERT 
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE id = auth.uid() AND status = 'ACTIVE'
        )
    );

-- Policy 4: Active admins can UPDATE inquiries
CREATE POLICY "admin_update_inquiries" ON public.inquiries
    FOR UPDATE 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE id = auth.uid() AND status = 'ACTIVE'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE id = auth.uid() AND status = 'ACTIVE'
        )
    );

-- Policy 5: Active admins can DELETE inquiries
CREATE POLICY "admin_delete_inquiries" ON public.inquiries
    FOR DELETE 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE id = auth.uid() AND status = 'ACTIVE'
        )
    );

-- ============================================
-- 4. VERIFY: Show current policies
-- ============================================

SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd,
    qual as "USING clause",
    with_check as "WITH CHECK clause"
FROM pg_policies 
WHERE tablename = 'inquiries'
ORDER BY policyname;

-- ============================================
-- NOTE: Leaked Password Protection
-- ============================================
-- The warning about "Leaked Password Protection Disabled" cannot be fixed via SQL.
-- You need to enable it in the Supabase Dashboard:
-- 1. Go to: Authentication > Settings > Security
-- 2. Enable "Leaked password protection"
-- This checks passwords against HaveIBeenPwned.org to prevent use of compromised passwords.
-- ============================================
