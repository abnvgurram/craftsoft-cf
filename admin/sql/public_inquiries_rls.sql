-- Allow anonymous users (website visitors) to submit inquiries
-- They can ONLY insert, they cannot read, update, or delete anything.

DROP POLICY IF EXISTS "Allow public inquiry submission" ON inquiries;

CREATE POLICY "Allow public inquiry submission" ON inquiries
    FOR INSERT 
    TO anon
    WITH CHECK (true);
