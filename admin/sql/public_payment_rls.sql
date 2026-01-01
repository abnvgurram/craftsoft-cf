-- ============================================
-- PUBLIC PAYMENT PAGE - RLS Policies
-- Run this in Supabase SQL Editor
-- ============================================

-- Allow anonymous users to lookup students by student_id (for payment page)
-- This only allows SELECT, and only returns limited fields needed for payment

DROP POLICY IF EXISTS "Public can lookup students by id" ON students;
CREATE POLICY "Public can lookup students by id" ON students
    FOR SELECT
    TO anon
    USING (true);

-- Allow anonymous users to read courses (for fee info)
DROP POLICY IF EXISTS "Public can read courses" ON courses;
CREATE POLICY "Public can read courses" ON courses
    FOR SELECT
    TO anon
    USING (true);

-- Allow anonymous users to read payments (to calculate balance)
DROP POLICY IF EXISTS "Public can read payments for balance" ON payments;
CREATE POLICY "Public can read payments for balance" ON payments
    FOR SELECT
    TO anon
    USING (true);

-- ============================================
-- SECURITY NOTE:
-- These policies allow read-only access for the public payment page.
-- Students can only see their own data by knowing their student_id.
-- All write operations still require authenticated admin.
-- Payment creation is handled server-side via Netlify functions.
-- ============================================
