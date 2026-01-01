-- Create Service Management Table
CREATE TABLE IF NOT EXISTS services (
    id BIGSERIAL PRIMARY KEY,
    service_id TEXT UNIQUE, -- e.g. SRV-001
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add public read policy for website (if needed later)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read services" ON services;
CREATE POLICY "Allow public read services" ON services
    FOR SELECT
    TO anon
    USING (status = 'Active');

DROP POLICY IF EXISTS "Allow admin all services" ON services;
CREATE POLICY "Allow admin all services" ON services
    FOR ALL
    TO authenticated
    USING (true);
