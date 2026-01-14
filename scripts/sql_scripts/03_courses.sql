-- ================================================================================
-- 03. COURSES - Training Programs
-- Description: Defines the training programs available
-- ================================================================================

-- ============================================
-- TABLE DEFINITION
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id TEXT UNIQUE NOT NULL,             -- e.g. CRS-001
    course_code TEXT UNIQUE NOT NULL,           -- e.g. GRA, UIUX
    course_name TEXT NOT NULL,
    fee DECIMAL(10,2) DEFAULT 0,
    duration TEXT,                              -- e.g. "3 months"
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    synced_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Active admins can read courses" ON courses;
DROP POLICY IF EXISTS "Active admins can insert courses" ON courses;
DROP POLICY IF EXISTS "Active admins can update courses" ON courses;
DROP POLICY IF EXISTS "Allow anyone to read active courses" ON courses;
DROP POLICY IF EXISTS "Public can read courses" ON courses;

-- POLICY: Public read for website (active courses only)
CREATE POLICY "public_read_active_courses" ON courses
    FOR SELECT 
    TO anon, public
    USING (status = 'ACTIVE');

-- POLICY: Active admins can read all courses (including inactive)
CREATE POLICY "admin_read_courses" ON courses
    FOR SELECT 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE id = auth.uid() AND status = 'ACTIVE'
        )
    );

-- POLICY: Active admins can insert courses
CREATE POLICY "admin_insert_courses" ON courses
    FOR INSERT 
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE id = auth.uid() AND status = 'ACTIVE'
        )
    );

-- POLICY: Active admins can update courses
CREATE POLICY "admin_update_courses" ON courses
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

-- POLICY: Active admins can delete courses
CREATE POLICY "admin_delete_courses" ON courses
    FOR DELETE 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE id = auth.uid() AND status = 'ACTIVE'
        )
    );

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(course_code);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_courses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

DROP TRIGGER IF EXISTS courses_updated_at ON courses;
CREATE TRIGGER courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_courses_updated_at();
