-- ============================================
-- SINGLE SESSION ENFORCEMENT
-- Run this in Supabase SQL Editor
-- ============================================

-- Add session_token column to admins table
ALTER TABLE public.admins 
ADD COLUMN IF NOT EXISTS session_token VARCHAR(64) DEFAULT NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_session_token ON public.admins(session_token);

-- Done! Now admins table can track active session tokens
