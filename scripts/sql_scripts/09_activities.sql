-- ================================================================================
-- 09. ACTIVITIES - Audit Log
-- Description: Audit log for admin actions
-- Dependencies: admins
-- ================================================================================

-- ============================================
-- TABLE DEFINITION
-- ============================================
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_type TEXT NOT NULL,                -- e.g. 'CREATE', 'UPDATE', 'DELETE'
    activity_name TEXT NOT NULL,                -- e.g. 'Added new student'
    activity_link TEXT,                         -- Optional link to related record
    admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',                -- Additional context
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Active admins can read activities" ON activities;
DROP POLICY IF EXISTS "Active admins can insert activities" ON activities;
DROP POLICY IF EXISTS "Active admins can delete activities" ON activities;

-- POLICY: Active admins can manage activities (Full access for logging/auditing)
CREATE POLICY "admin_manage_activities" ON activities
    FOR ALL 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE id = (select auth.uid()) AND status = 'ACTIVE'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE id = (select auth.uid()) AND status = 'ACTIVE'
        )
    );

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_activities_admin ON activities(admin_id);
