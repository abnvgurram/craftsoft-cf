-- ============================================
-- USER SESSIONS TABLE (Multi-Tab Support)
-- Tracks all active admin sessions per tab
-- Each tab has a unique session_token (TAB_ID)
-- ============================================
--
-- ⚠️  WARNING: DROP TABLE is for INITIAL SETUP ONLY!
-- ⚠️  NEVER run DROP TABLE in production after go-live
-- ⚠️  For changes, use ALTER TABLE instead
--
-- ============================================

-- Drop existing table and recreate fresh (SETUP ONLY!)
DROP TABLE IF EXISTS user_sessions CASCADE;

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL,  -- This is the TAB_ID (unique per browser tab)
    device_info TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ DEFAULT NOW(),

    -- CRITICAL: Unique constraint on (admin_id, session_token)
    -- This ensures one row per tab per admin
    -- Prevents duplicate sessions and enables proper multi-tab management
    CONSTRAINT unique_admin_tab UNIQUE (admin_id, session_token)
);

-- Enable Row Level Security
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- Admins can only see/manage their own sessions
-- ============================================
DROP POLICY IF EXISTS "Admins can read own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Admins can insert own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Admins can update own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Admins can delete own sessions" ON user_sessions;

CREATE POLICY "Admins can read own sessions" ON user_sessions
    FOR SELECT USING (admin_id = (select auth.uid()));

CREATE POLICY "Admins can insert own sessions" ON user_sessions
    FOR INSERT WITH CHECK (admin_id = (select auth.uid()));

CREATE POLICY "Admins can update own sessions" ON user_sessions
    FOR UPDATE USING (admin_id = (select auth.uid()));

CREATE POLICY "Admins can delete own sessions" ON user_sessions
    FOR DELETE USING (admin_id = (select auth.uid()));

-- ============================================
-- INDEXES
-- Optimized for multi-tab session lookups
-- ============================================

-- Primary lookup index: (admin_id + session_token)
-- Used by: deleteCurrentSession, isCurrentSessionValid, createSession, updateSessionActivity
CREATE INDEX idx_sessions_admin_tab ON user_sessions(admin_id, session_token);

-- Secondary index for admin-only queries
-- Used by: deleteAllSessions, loadSessions
CREATE INDEX idx_sessions_admin_id ON user_sessions(admin_id);

-- ============================================
-- ENABLE REALTIME
-- Required for instant logout detection
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE user_sessions;

-- ============================================
-- CLEANUP FUNCTION
-- Removes sessions older than 30 days
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM user_sessions WHERE last_active < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SCHEDULED CLEANUP (pg_cron)
-- Runs daily at 3:00 AM UTC
-- 
-- To enable: Run this in Supabase SQL Editor:
-- 
-- SELECT cron.schedule(
--     'cleanup-old-sessions',
--     '0 3 * * *',  -- Every day at 3:00 AM UTC
--     'SELECT cleanup_old_sessions()'
-- );
--
-- To verify it's scheduled:
-- SELECT * FROM cron.job;
--
-- To unschedule:
-- SELECT cron.unschedule('cleanup-old-sessions');
-- ============================================

-- ============================================
-- LAST_ACTIVE UPDATE
-- Called automatically by the app on:
--   - User activity (mouse, keyboard, scroll)
--   - Page focus events
--   - Every few minutes during inactivity check
--
-- This keeps last_active current so cleanup
-- doesn't accidentally delete active sessions.
-- ============================================

-- ============================================
-- USAGE NOTES
-- ============================================
-- 
-- Normal Logout (single tab):
--   DELETE FROM user_sessions 
--   WHERE admin_id = ? AND session_token = ?
--   (Deletes only THIS tab's session)
--
-- Hard Logout (all sessions):
--   DELETE FROM user_sessions WHERE admin_id = ?
--   (Deletes ALL sessions for this admin)
--
-- Session Check:
--   SELECT id FROM user_sessions 
--   WHERE admin_id = ? AND session_token = ?
--   (Validates this specific tab's session exists)
--
-- Update Activity:
--   UPDATE user_sessions 
--   SET last_active = NOW()
--   WHERE admin_id = ? AND session_token = ?
--   (Called on user activity to prevent cleanup)
--
