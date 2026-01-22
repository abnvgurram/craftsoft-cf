-- ============================================
-- CraftSoft vHistory - Database Setup
-- Run this in your Supabase SQL Editor
-- ============================================

-- Create the version history table
CREATE TABLE IF NOT EXISTS version_history (
    id SERIAL PRIMARY KEY,
    version VARCHAR(10) NOT NULL UNIQUE,
    focus VARCHAR(255) NOT NULL,
    milestones TEXT NOT NULL,
    release_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE version_history ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON version_history
    FOR SELECT USING (true);

-- Allow authenticated admins to manage
CREATE POLICY "Allow admin manage" ON version_history
    FOR ALL USING (auth.role() = 'authenticated');

-- Comments
COMMENT ON TABLE version_history IS 'Tracking the evolution and roadmap of the CraftSoft platform';
