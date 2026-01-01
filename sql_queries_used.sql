/* 
================================================================================
CRAFTSOFT - CONSOLIDATED SQL QUERIES
This file contains all database schemas, RLS policies, functions, and triggers 
used in the Abhi's Craftsoft website and admin dashboard.
================================================================================
*/

-- ================================================================================
-- 1. DATABASE SETUP & GENERAL (Supabase Configuration)
-- ================================================================================

-- Enable Supabase Realtime for core tables
-- This allows the admin dashboard to update instantly when data changes.
ALTER PUBLICATION supabase_realtime ADD TABLE activities;
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
ALTER PUBLICATION supabase_realtime ADD TABLE receipts;
ALTER PUBLICATION supabase_realtime ADD TABLE user_sessions;

-- ================================================================================
-- 2. PERFORMANCE & SECURITY (RLS Global Fixes)
-- Source: admin/sql/fix_rls_performance.sql
-- Description: Optimizes RLS evaluation by wrapping auth calls in subqueries 
-- and fixing policy performance.
-- ================================================================================

-- Fix: Consolidate policies on 'admins' table
-- Restores admin lookup and profile management functionality.
DROP POLICY IF EXISTS "Allow lookup by admin_id" ON admins;
DROP POLICY IF EXISTS "Allow read own record" ON admins;
DROP POLICY IF EXISTS "admins_select" ON admins;
DROP POLICY IF EXISTS "Admins can read own record" ON admins;
DROP POLICY IF EXISTS "Allow public lookup" ON admins;
DROP POLICY IF EXISTS "Enable public lookup by admin_id" ON admins;

-- Policy for login lookup (allows anon to resolve admin_id -> email)
CREATE POLICY "Allow login lookup" ON admins
    FOR SELECT TO anon
    USING (true);

-- Policy for logged-in admins (allows reading own full record)
CREATE POLICY "Admins can read own record" ON admins
    FOR SELECT TO authenticated
    USING (id = (select auth.uid()));

-- Consolidate UPDATE policies
DROP POLICY IF EXISTS "Allow update own record" ON admins;
DROP POLICY IF EXISTS "admins_update" ON admins;
DROP POLICY IF EXISTS "Admins can update own record" ON admins;

CREATE POLICY "Admins can update own record" ON admins
    FOR UPDATE TO authenticated
    USING (id = (select auth.uid()))
    WITH CHECK (id = (select auth.uid()));

-- ================================================================================
-- 3. CORE ENTITY: SERVICES
-- Source: admin/acs_services/sql_acs_services.sql
-- Description: Manages specialized services offered by the institute.
-- ================================================================================

DROP TABLE IF EXISTS services CASCADE;
CREATE TABLE services (
    id BIGSERIAL PRIMARY KEY,
    service_id TEXT UNIQUE, -- e.g. Serv-001
    service_code TEXT UNIQUE, -- e.g. GD, UXD
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read services" ON services;
CREATE POLICY "Allow public read services" ON services
    FOR SELECT TO anon
    USING (true);

DROP POLICY IF EXISTS "Allow admin all services" ON services;
CREATE POLICY "Allow admin all services" ON services
    FOR ALL TO authenticated
    USING (true);

-- ================================================================================
-- 4. CORE ENTITY: COURSES
-- Source: admin/courses/sql_courses.sql
-- Description: Defines the training programs available.
-- ================================================================================

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id TEXT UNIQUE NOT NULL,
    course_code TEXT UNIQUE NOT NULL,
    course_name TEXT NOT NULL,
    fee DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    synced_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active admins can read courses" ON courses;
DROP POLICY IF EXISTS "Active admins can insert courses" ON courses;
DROP POLICY IF EXISTS "Active admins can update courses" ON courses;

CREATE POLICY "Active admins can read courses" ON courses
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

CREATE POLICY "Active admins can insert courses" ON courses
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

CREATE POLICY "Active admins can update courses" ON courses
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(course_code);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);

CREATE OR REPLACE FUNCTION update_courses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS courses_updated_at ON courses;
CREATE TRIGGER courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_courses_updated_at();

-- ================================================================================
-- 5. CORE ENTITY: TUTORS
-- Source: admin/tutors/sql_tutors.sql
-- Description: Manages trainer profiles and their assigned courses.
-- ================================================================================

CREATE TABLE IF NOT EXISTS tutors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    linkedin_url TEXT,
    courses TEXT[],
    notes TEXT,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active admins can read tutors" ON tutors;
DROP POLICY IF EXISTS "Active admins can insert tutors" ON tutors;
DROP POLICY IF EXISTS "Active admins can update tutors" ON tutors;
DROP POLICY IF EXISTS "Active admins can delete tutors" ON tutors;

CREATE POLICY "Active admins can read tutors" ON tutors
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

CREATE POLICY "Active admins can insert tutors" ON tutors
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

CREATE POLICY "Active admins can update tutors" ON tutors
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

CREATE POLICY "Active admins can delete tutors" ON tutors
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

CREATE INDEX IF NOT EXISTS idx_tutors_status ON tutors(status);

CREATE OR REPLACE FUNCTION update_tutors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tutors_updated_at ON tutors;
CREATE TRIGGER tutors_updated_at
    BEFORE UPDATE ON tutors
    FOR EACH ROW EXECUTE FUNCTION update_tutors_updated_at();

-- ================================================================================
-- 6. CORE ENTITY: STUDENTS
-- Source: admin/students/sql_students.sql
-- Description: Central student record management.
-- ================================================================================

CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    courses TEXT[],
    tutors TEXT[],
    demo_scheduled BOOLEAN DEFAULT false,
    demo_date DATE,
    demo_time TEXT,
    joining_date DATE,
    batch_time TEXT,
    fee DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    final_fee DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    course_tutors JSONB DEFAULT '{}',
    course_discounts JSONB DEFAULT '{}',
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active admins can read students" ON students;
DROP POLICY IF EXISTS "Active admins can insert students" ON students;
DROP POLICY IF EXISTS "Active admins can update students" ON students;
DROP POLICY IF EXISTS "Active admins can delete students" ON students;

CREATE POLICY "Active admins can read students" ON students
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

CREATE POLICY "Active admins can insert students" ON students
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

CREATE POLICY "Active admins can update students" ON students
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

CREATE POLICY "Active admins can delete students" ON students
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

-- Payment Page Policy (anon access)
DROP POLICY IF EXISTS "Public can lookup students by id" ON students;
CREATE POLICY "Public can lookup students by id" ON students
    FOR SELECT TO anon
    USING (true);

CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_demo_date ON students(demo_date);

CREATE OR REPLACE FUNCTION update_students_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS students_updated_at ON students;
CREATE TRIGGER students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_students_updated_at();

-- ================================================================================
-- 7. INTERACTIONS: INQUIRIES
-- Source: admin/inquiries/sql_inquiries.sql, admin/sql/public_inquiries_rls.sql
-- Description: Leads and inquiries from website and walk-ins.
-- ================================================================================

CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    courses TEXT[],
    source TEXT DEFAULT 'Walk-in' CHECK (source IN ('Walk-in', 'Website', 'Call', 'WhatsApp', 'Instagram')),
    demo_required BOOLEAN DEFAULT false,
    demo_date DATE,
    demo_time TEXT,
    status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Demo Scheduled', 'Converted', 'Closed')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active admins can read inquiries" ON inquiries;
DROP POLICY IF EXISTS "Active admins can insert inquiries" ON inquiries;
DROP POLICY IF EXISTS "Active admins can update inquiries" ON inquiries;
DROP POLICY IF EXISTS "Active admins can delete inquiries" ON inquiries;

CREATE POLICY "Active admins can read inquiries" ON inquiries
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

CREATE POLICY "Active admins can insert inquiries" ON inquiries
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

CREATE POLICY "Active admins can update inquiries" ON inquiries
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

CREATE POLICY "Active admins can delete inquiries" ON inquiries
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

-- Website Submission Policy
DROP POLICY IF EXISTS "Allow public inquiry submission" ON inquiries;
CREATE POLICY "Allow public inquiry submission" ON inquiries
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);

CREATE OR REPLACE FUNCTION update_inquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS inquiries_updated_at ON inquiries;
CREATE TRIGGER inquiries_updated_at
    BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_inquiries_updated_at();

-- ================================================================================
-- 8. TRANSACTIONS: PAYMENTS & RECEIPTS
-- Source: admin/payments/sql_payments.sql, admin/payments/sql_update_services.sql
-- Description: Financial tracking for student course fees.
-- ================================================================================

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE, -- Nullable to support Services
    service_id BIGINT REFERENCES services(id) ON DELETE SET NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_mode TEXT NOT NULL CHECK (payment_mode IN ('CASH', 'ONLINE')),
    reference_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'SUCCESS',
    payment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for authenticated users" ON payments;
CREATE POLICY "Allow all for authenticated users" ON payments
    FOR ALL USING ((select auth.role()) = 'authenticated');

-- Public Payment Page Policy
DROP POLICY IF EXISTS "Public can read payments for balance" ON payments;
CREATE POLICY "Public can read payments for balance" ON payments
    FOR SELECT TO anon
    USING (true);

CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_course ON payments(course_id);
CREATE INDEX IF NOT EXISTS idx_payments_service ON payments(service_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_payments_created ON payments(created_at DESC);

-- Receipts Table
CREATE TABLE IF NOT EXISTS receipts (
    receipt_id TEXT PRIMARY KEY,
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE, -- Nullable to support Services
    service_id BIGINT REFERENCES services(id) ON DELETE SET NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_mode TEXT NOT NULL,
    reference_id TEXT NOT NULL,
    balance_due DECIMAL(10,2) DEFAULT 0,
    payment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for authenticated users" ON receipts;
CREATE POLICY "Allow all for authenticated users" ON receipts
    FOR ALL USING ((select auth.role()) = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_receipts_student ON receipts(student_id);
CREATE INDEX IF NOT EXISTS idx_receipts_course ON receipts(course_id);
CREATE INDEX IF NOT EXISTS idx_receipts_service ON receipts(service_id);
CREATE INDEX IF NOT EXISTS idx_receipts_date ON receipts(payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_receipts_created ON receipts(created_at DESC);

-- Function: Generate Receipt ID
CREATE OR REPLACE FUNCTION generate_receipt_id(
    p_student_name TEXT,
    p_course_name TEXT
) RETURNS TEXT AS $$
DECLARE
    v_seq INT;
    v_initials TEXT;
    v_course_code TEXT;
    v_words TEXT[];
    v_word TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(receipt_id FROM 1 FOR 3) AS INT)), 0) + 1
    INTO v_seq
    FROM receipts;
    
    v_initials := '';
    v_words := string_to_array(UPPER(p_student_name), ' ');
    FOREACH v_word IN ARRAY v_words LOOP
        v_initials := v_initials || SUBSTRING(v_word FROM 1 FOR 1);
    END LOOP;
    
    v_course_code := UPPER(SUBSTRING(REGEXP_REPLACE(COALESCE(p_course_name, 'SERV'), '[^a-zA-Z0-9]', '', 'g') FROM 1 FOR 3));
    
    RETURN LPAD(v_seq::TEXT, 3, '0') || '-ACS-' || v_initials || '-' || v_course_code;
END;
$$ LANGUAGE plpgsql;

-- ================================================================================
-- 9. LOGGING: ACTIVITIES
-- Source: admin/sql/sql_activities.sql
-- Description: Audit log for admin actions.
-- ================================================================================

CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_type TEXT NOT NULL,
    activity_name TEXT NOT NULL,
    activity_link TEXT,
    admin_id UUID REFERENCES admins(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active admins can read activities" ON activities;
DROP POLICY IF EXISTS "Active admins can insert activities" ON activities;
DROP POLICY IF EXISTS "Active admins can delete activities" ON activities;

CREATE POLICY "Active admins can read activities" ON activities
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

CREATE POLICY "Active admins can insert activities" ON activities
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

CREATE POLICY "Active admins can delete activities" ON activities
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(created_at DESC);

-- ================================================================================
-- 10. SYSTEM: SETTINGS & SESSIONS
-- Source: admin/settings/sql_settings.sql, admin/settings/sql_sessions.sql
-- Description: Global institute settings and multi-tab session management.
-- ================================================================================

CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active admins can read settings" ON settings;
DROP POLICY IF EXISTS "Active admins can insert settings" ON settings;
DROP POLICY IF EXISTS "Active admins can update settings" ON settings;

CREATE POLICY "Active admins can read settings" ON settings
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

CREATE POLICY "Active admins can insert settings" ON settings
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

CREATE POLICY "Active admins can update settings" ON settings
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM admins WHERE id = (select auth.uid()) AND status = 'ACTIVE')
    );

INSERT INTO settings (setting_key, setting_value) VALUES
    ('institute_name', 'Abhi''s Craftsoft'),
    ('country', 'India'),
    ('inactivity_timeout', '30')
ON CONFLICT (setting_key) DO NOTHING;

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL, -- TAB_ID
    device_info TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_admin_tab UNIQUE (admin_id, session_token)
);

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Admins can insert own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Admins can update own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Admins can delete own sessions" ON user_sessions;

CREATE POLICY "Admins can read own sessions" ON user_sessions FOR SELECT USING (admin_id = (select auth.uid()));
CREATE POLICY "Admins can insert own sessions" ON user_sessions FOR INSERT WITH CHECK (admin_id = (select auth.uid()));
CREATE POLICY "Admins can update own sessions" ON user_sessions FOR UPDATE USING (admin_id = (select auth.uid()));
CREATE POLICY "Admins can delete own sessions" ON user_sessions FOR DELETE USING (admin_id = (select auth.uid()));

CREATE INDEX IF NOT EXISTS idx_sessions_admin_tab ON user_sessions(admin_id, session_token);

CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM user_sessions WHERE last_active < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
