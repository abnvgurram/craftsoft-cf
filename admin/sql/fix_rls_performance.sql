-- ============================================
-- Supabase RLS Performance Fixes
-- Run this in the Supabase SQL Editor to resolve performance warnings.
-- ============================================

-- 1. FIX: Consolidate policies on 'admins' table
-- This restores the "Login by Admin ID" functionality which was broken.

-- Drop all old/redundant policies
DROP POLICY IF EXISTS "Allow lookup by admin_id" ON admins;
DROP POLICY IF EXISTS "Allow read own record" ON admins;
DROP POLICY IF EXISTS "admins_select" ON admins;
DROP POLICY IF EXISTS "Admins can read own record" ON admins;
DROP POLICY IF EXISTS "Allow public lookup" ON admins;
DROP POLICY IF EXISTS "Enable public lookup by admin_id" ON admins;

-- Policy for login lookup (allows anon to resolve admin_id -> email)
CREATE POLICY "Allow login lookup" ON admins
    FOR SELECT
    TO anon
    USING (true);

-- Policy for logged-in admins (allows reading own full record)
CREATE POLICY "Admins can read own record" ON admins
    FOR SELECT
    TO authenticated
    USING (id = (select auth.uid()));

-- Consolidate UPDATE policies
DROP POLICY IF EXISTS "Allow update own record" ON admins;
DROP POLICY IF EXISTS "admins_update" ON admins;
DROP POLICY IF EXISTS "Admins can update own record" ON admins;

CREATE POLICY "Admins can update own record" ON admins
    FOR UPDATE 
    TO authenticated
    USING (id = (select auth.uid()))
    WITH CHECK (id = (select auth.uid()));


-- 2. FIX: Wrap auth.uid() and auth.role() in subqueries to prevent row-by-row re-evaluation
-- This provides a massive performance boost as it evaluates once per query instead of once per row.

-- Table: user_sessions
DROP POLICY IF EXISTS "Admins can read own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Admins can insert own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Admins can update own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Admins can delete own sessions" ON user_sessions;

CREATE POLICY "Admins can read own sessions" ON user_sessions FOR SELECT USING (admin_id = (select auth.uid()));
CREATE POLICY "Admins can insert own sessions" ON user_sessions FOR INSERT WITH CHECK (admin_id = (select auth.uid()));
CREATE POLICY "Admins can update own sessions" ON user_sessions FOR UPDATE USING (admin_id = (select auth.uid()));
CREATE POLICY "Admins can delete own sessions" ON user_sessions FOR DELETE USING (admin_id = (select auth.uid()));

-- Table: settings
DROP POLICY IF EXISTS "Active admins can read settings" ON settings;
DROP POLICY IF EXISTS "Active admins can insert settings" ON settings;
DROP POLICY IF EXISTS "Active admins can update settings" ON settings;

CREATE POLICY "Active admins can read settings" ON settings FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));
CREATE POLICY "Active admins can insert settings" ON settings FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));
CREATE POLICY "Active admins can update settings" ON settings FOR UPDATE USING (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));

-- Table: receipts
DROP POLICY IF EXISTS "Allow all for authenticated users" ON receipts;
CREATE POLICY "Allow all for authenticated users" ON receipts FOR ALL USING ((select auth.role()) = 'authenticated');

-- Table: payments
DROP POLICY IF EXISTS "Allow all for authenticated users" ON payments;
CREATE POLICY "Allow all for authenticated users" ON payments FOR ALL USING ((select auth.role()) = 'authenticated');

-- Table: courses
DROP POLICY IF EXISTS "Active admins can read courses" ON courses;
DROP POLICY IF EXISTS "Active admins can insert courses" ON courses;
DROP POLICY IF EXISTS "Active admins can update courses" ON courses;

CREATE POLICY "Active admins can read courses" ON courses FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));
CREATE POLICY "Active admins can insert courses" ON courses FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));
CREATE POLICY "Active admins can update courses" ON courses FOR UPDATE USING (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));

-- Table: activities
DROP POLICY IF EXISTS "Active admins can read activities" ON activities;
DROP POLICY IF EXISTS "Active admins can insert activities" ON activities;
DROP POLICY IF EXISTS "Active admins can delete activities" ON activities;

CREATE POLICY "Active admins can read activities" ON activities FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));
CREATE POLICY "Active admins can insert activities" ON activities FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));
CREATE POLICY "Active admins can delete activities" ON activities FOR DELETE USING (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));

-- Table: inquiries
DROP POLICY IF EXISTS "Active admins can read inquiries" ON inquiries;
DROP POLICY IF EXISTS "Active admins can insert inquiries" ON inquiries;
DROP POLICY IF EXISTS "Active admins can update inquiries" ON inquiries;
DROP POLICY IF EXISTS "Active admins can delete inquiries" ON inquiries;

CREATE POLICY "Active admins can read inquiries" ON inquiries FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));
CREATE POLICY "Active admins can insert inquiries" ON inquiries FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));
CREATE POLICY "Active admins can update inquiries" ON inquiries FOR UPDATE USING (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));
CREATE POLICY "Active admins can delete inquiries" ON inquiries FOR DELETE USING (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));

-- Table: students
DROP POLICY IF EXISTS "Active admins can read students" ON students;
DROP POLICY IF EXISTS "Active admins can insert students" ON students;
DROP POLICY IF EXISTS "Active admins can update students" ON students;
DROP POLICY IF EXISTS "Active admins can delete students" ON students;

CREATE POLICY "Active admins can read students" ON students FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));
CREATE POLICY "Active admins can insert students" ON students FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));
CREATE POLICY "Active admins can update students" ON students FOR UPDATE USING (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));
CREATE POLICY "Active admins can delete students" ON students FOR DELETE USING (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));

-- Table: tutors
DROP POLICY IF EXISTS "Active admins can read tutors" ON tutors;
DROP POLICY IF EXISTS "Active admins can insert tutors" ON tutors;
DROP POLICY IF EXISTS "Active admins can update tutors" ON tutors;
DROP POLICY IF EXISTS "Active admins can delete tutors" ON tutors;

CREATE POLICY "Active admins can read tutors" ON tutors FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));
CREATE POLICY "Active admins can insert tutors" ON tutors FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));
CREATE POLICY "Active admins can update tutors" ON tutors FOR UPDATE USING (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));
CREATE POLICY "Active admins can delete tutors" ON tutors FOR DELETE USING (EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE'));
