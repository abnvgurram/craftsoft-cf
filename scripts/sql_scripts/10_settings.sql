-- ================================================================================
-- 10. SETTINGS - Global Institute Settings
-- Description: Global institute settings and configuration
-- ================================================================================

-- ============================================
-- TABLE DEFINITION
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,                           -- Optional description of setting
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Active admins can read settings" ON settings;
DROP POLICY IF EXISTS "Active admins can insert settings" ON settings;
DROP POLICY IF EXISTS "Active admins can update settings" ON settings;

-- POLICY: Active admins can read settings
CREATE POLICY "admin_read_settings" ON settings
    FOR SELECT 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE id = auth.uid() AND status = 'ACTIVE'
        )
    );

-- POLICY: Active admins can insert settings
CREATE POLICY "admin_insert_settings" ON settings
    FOR INSERT 
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE id = auth.uid() AND status = 'ACTIVE'
        )
    );

-- POLICY: Active admins can update settings
CREATE POLICY "admin_update_settings" ON settings
    FOR UPDATE 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE id = auth.uid() AND status = 'ACTIVE'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE id = auth.uid() AND status = 'ACTIVE'
        )
    );

-- ============================================
-- DEFAULT SETTINGS
-- ============================================
INSERT INTO settings (setting_key, setting_value, description) VALUES
    ('institute_name', 'Abhi''s Craftsoft', 'Name of the institute'),
    ('country', 'India', 'Country of operation'),
    ('inactivity_timeout', '30', 'Session timeout in minutes')
ON CONFLICT (setting_key) DO NOTHING;
