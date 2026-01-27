-- ================================================================================
-- 00. DATABASE SETUP & CONFIGURATION
-- Description: Extensions, Realtime, and shared utilities
-- Run this FIRST before any other scripts
-- ================================================================================

-- ============================================
-- EXTENSIONS
-- ============================================
-- Enable required extensions (Supabase usually has these, but just in case)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- REALTIME CONFIGURATION
-- ============================================
-- Enable Supabase Realtime for tables that need live updates
-- Note: Run these AFTER the tables are created

-- Core tables for admin dashboard live updates
DO $$
BEGIN
    -- Only add if table exists and not already in publication
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'activities') THEN
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE activities;
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') THEN
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE payments;
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'receipts') THEN
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE receipts;
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_sessions') THEN
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE user_sessions;
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'inquiries') THEN
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE inquiries;
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
    END IF;
END $$;

-- ============================================
-- HELPER: Check if user is an active admin
-- ============================================
-- This function can be used in RLS policies for cleaner syntax
CREATE OR REPLACE FUNCTION is_active_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admins 
        WHERE id = (select auth.uid()) AND status = 'ACTIVE'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- ============================================
-- NOTES
-- ============================================
-- Table execution order (respects foreign key dependencies):
-- 01_admins.sql      - No dependencies
-- 02_services.sql    - No dependencies
-- 03_courses.sql     - No dependencies
-- 04_tutors.sql      - No dependencies
-- 05_students.sql    - No dependencies
-- 06_inquiries.sql   - No dependencies
-- 07_payments.sql    - Depends on: students, courses, services
-- 08_receipts.sql    - Depends on: payments, students, clients, courses, services
-- 09_activities.sql  - Depends on: admins
-- 10_settings.sql    - No dependencies
-- 11_clients.sql     - No dependencies
-- 12_student_otps.sql - Depends on: students
-- 13_user_sessions.sql - Depends on: admins
