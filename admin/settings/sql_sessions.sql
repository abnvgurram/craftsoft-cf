-- ============================================
-- USER SESSIONS TABLE
-- Tracks all active admin sessions
-- ============================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL,
    device_info TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Policies: Admins can only see/manage their own sessions
DROP POLICY IF EXISTS "Admins can read own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Admins can insert own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Admins can update own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Admins can delete own sessions" ON user_sessions;

CREATE POLICY "Admins can read own sessions" ON user_sessions
    FOR SELECT USING (admin_id = auth.uid());

CREATE POLICY "Admins can insert own sessions" ON user_sessions
    FOR INSERT WITH CHECK (admin_id = auth.uid());

CREATE POLICY "Admins can update own sessions" ON user_sessions
    FOR UPDATE USING (admin_id = auth.uid());

CREATE POLICY "Admins can delete own sessions" ON user_sessions
    FOR DELETE USING (admin_id = auth.uid());

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_sessions_admin_id ON user_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);

-- Function to clean up old sessions (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM user_sessions WHERE last_active < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
