-- Disable RLS temporarily to allow seeding products without authentication
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Note: In a production environment, you should handle this via proper roles/authentication 
-- or by enabling RLS again after seeding.
