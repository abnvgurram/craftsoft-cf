-- Update Payments and Receipts to support Services
-- 1. Make course_id nullable
ALTER TABLE payments ALTER COLUMN course_id DROP NOT NULL;
ALTER TABLE receipts ALTER COLUMN course_id DROP NOT NULL;

-- 2. Add service_id (referencing the BIGSERIAL id in services table)
-- Note: services.id is bigint
ALTER TABLE payments ADD COLUMN service_id BIGINT REFERENCES services(id) ON DELETE SET NULL;
ALTER TABLE receipts ADD COLUMN service_id BIGINT REFERENCES services(id) ON DELETE SET NULL;

-- 3. Update Indexes
CREATE INDEX IF NOT EXISTS idx_payments_service ON payments(service_id);
CREATE INDEX IF NOT EXISTS idx_receipts_service ON receipts(service_id);

-- 4. Update generate_receipt_id to handle potential NULL course names
-- (Will modify the JS logic to pass service name if course is null)
