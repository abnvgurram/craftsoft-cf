-- Update Service Management Table
-- Prefix: Serv-XXX
-- Added service_code
DROP TABLE IF EXISTS services;
CREATE TABLE services (
    id BIGSERIAL PRIMARY KEY,
    service_id TEXT UNIQUE, -- e.g. Serv-001
    service_code TEXT UNIQUE, -- e.g. GD, UXD
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read services" ON services;
CREATE POLICY "Allow public read services" ON services
    FOR SELECT
    TO anon
    USING (true);

DROP POLICY IF EXISTS "Allow admin all services" ON services;
CREATE POLICY "Allow admin all services" ON services
    FOR ALL
    TO authenticated
    USING (true);
