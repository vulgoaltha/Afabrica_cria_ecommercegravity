-- SQL Script to seed 10 Mangueira products
-- Run this in your Supabase SQL Editor to bypass RLS

-- 1. Ensure category exists
INSERT INTO public.categories (title, slug)
VALUES ('Mangueira', 'mangueira')
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert 10 example products
INSERT INTO public.products (
    title, 
    description, 
    preco_atual, 
    preco_antigo, 
    price_in_cents, 
    image, 
    gallery, 
    category, 
    stock, 
    sizes, 
    customizable, 
    created_at
)
VALUES 
('MANGUEIRA - Camisa Premium Modelo 1', 'Produto oficial Mangueira. Conforto e estilo para o seu dia a dia.', 119.90, 149.90, 11990, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', '{"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop"}', 'mangueira', 50, '{"P", "M", "G", "GG"}', false, NOW()),
('MANGUEIRA - Camisa Premium Modelo 2', 'Produto oficial Mangueira. Conforto e estilo para o seu dia a dia.', 119.90, 149.90, 11990, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', '{"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop"}', 'mangueira', 50, '{"P", "M", "G", "GG"}', false, NOW()),
('MANGUEIRA - Camisa Premium Modelo 3', 'Produto oficial Mangueira. Conforto e estilo para o seu dia a dia.', 139.90, 169.90, 13990, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', '{"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop"}', 'mangueira', 50, '{"P", "M", "G", "GG"}', false, NOW()),
('MANGUEIRA - Camisa Premium Modelo 4', 'Produto oficial Mangueira. Conforto e estilo para o seu dia a dia.', 119.90, 149.90, 11990, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', '{"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop"}', 'mangueira', 50, '{"P", "M", "G", "GG"}', false, NOW()),
('MANGUEIRA - Camisa Premium Modelo 5', 'Produto oficial Mangueira. Conforto e estilo para o seu dia a dia.', 119.90, 149.90, 11990, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', '{"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop"}', 'mangueira', 50, '{"P", "M", "G", "GG"}', false, NOW()),
('MANGUEIRA - Camisa Premium Modelo 6', 'Produto oficial Mangueira. Conforto e estilo para o seu dia a dia.', 119.90, 149.90, 11990, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', '{"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop"}', 'mangueira', 50, '{"P", "M", "G", "GG"}', false, NOW()),
('MANGUEIRA - Camisa Premium Modelo 7', 'Produto oficial Mangueira. Conforto e estilo para o seu dia a dia.', 119.90, 149.90, 11990, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', '{"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop"}', 'mangueira', 50, '{"P", "M", "G", "GG"}', false, NOW()),
('MANGUEIRA - Camisa Premium Modelo 8', 'Produto oficial Mangueira. Conforto e estilo para o seu dia a dia.', 119.90, 149.90, 11990, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', '{"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop"}', 'mangueira', 50, '{"P", "M", "G", "GG"}', false, NOW()),
('MANGUEIRA - Camisa Premium Modelo 9', 'Produto oficial Mangueira. Conforto e estilo para o seu dia a dia.', 119.90, 149.90, 11990, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', '{"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop"}', 'mangueira', 50, '{"P", "M", "G", "GG"}', false, NOW()),
('MANGUEIRA - Camisa Premium Modelo 10', 'Produto oficial Mangueira. Conforto e estilo para o seu dia a dia.', 119.90, 149.90, 11990, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', '{"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop"}', 'mangueira', 50, '{"P", "M", "G", "GG"}', false, NOW());
