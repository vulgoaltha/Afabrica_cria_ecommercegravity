-- Enable Row Level Security (RLS) on all tables check
-- Create Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subtitle TEXT,
  price_in_cents INTEGER NOT NULL,
  sale_price_in_cents INTEGER,
  image TEXT,
  gallery TEXT[], -- Array of strings for additional images
  category TEXT,
  sizes TEXT[], -- Array of strings for sizes (P, M, G...)
  stock INTEGER DEFAULT 0,
  customizable BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  address JSONB, -- Store address as JSON
  items JSONB, -- Store cart items as JSON
  total_in_cents INTEGER,
  status TEXT DEFAULT 'Aguardando Pagamento',
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Reviews Table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT,
  rating INTEGER,
  comment TEXT,
  image_url TEXT,
  approved BOOLEAN DEFAULT FALSE,
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Storage Buckets (If they don't exist, this might error in SQL Editor, best to do manually or via policy)
-- Note: Creating buckets via SQL is strictly not standard, usually done via UI. 
-- We will define policies assuming buckets 'product-images' and 'review-images' exist.

-- RLS POLICIES ----------------------------

-- PRODUCTS: Public Read, Admin Write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Products"
ON products FOR SELECT
TO anon
USING (true);

CREATE POLICY "Admin Write Products"
ON products FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ORDERS: Public specific Create, Admin Read/Write
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Create Orders"
ON orders FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Admin Manage Orders"
ON orders FOR ALL
TO authenticated
USING (true);

-- REVIEWS: Public Read/Create, Admin Manage
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Approved Reviews"
ON reviews FOR SELECT
TO anon
USING (approved = true);

CREATE POLICY "Public Create Reviews"
ON reviews FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Admin Manage Reviews"
ON reviews FOR ALL
TO authenticated
USING (true);

-- STORAGE POLICIES (Simulated for SQL Editor context, usually done in Storage UI)
-- You typically need to set these in the Storage section of dashboard.
