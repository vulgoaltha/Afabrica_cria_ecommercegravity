-- 1. LIMPAR DADOS EXISTENTES (Opcional, mas garante limpeza)
TRUNCATE TABLE products CASCADE;

-- 2. DESABILITAR RLS TEMPORARIAMENTE
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- 3. INSERIR PRODUTOS ORIGINAIS
INSERT INTO products (title, description, price_in_cents, image, category, customizable, stock, sizes) VALUES
('Camiseta', 'Camiseta de alta qualidade com personalização.', 8990, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', 'Camisetas', true, 50, ARRAY['P', 'M', 'G', 'GG', 'XG']),
('Calção Esportivo', 'Calção leve e resistente.', 5990, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80', 'Calções', true, 50, ARRAY['P', 'M', 'G', 'GG']),
('Short Passeio', 'Conforto e lazer.', 2990, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80', 'Shorts', false, 50, ARRAY['P', 'M', 'G', 'GG']),
('Boné Trucker', 'Boné estilo trucker.', 4990, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80', 'Bonés', true, 50, ARRAY['U']),
('Jaqueta Corta-Vento', 'Leve e impermeável.', 18990, 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=800&q=80', 'Jaquetas', true, 20, ARRAY['P', 'M', 'G', 'GG']),
('Polo Casual', 'Clássica e moderna.', 7990, 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=800&q=80', 'Polos', true, 50, ARRAY['P', 'M', 'G', 'GG']);

-- 4. INSERIR 80 PRODUTOS DE EXEMPLO (Gerados em massa)
DO $$
BEGIN
    FOR i IN 1..80 LOOP
        INSERT INTO products (title, description, price_in_cents, image, category, customizable, stock, sizes)
        VALUES (
            'Produto Exemplo #' || i,
            'Descrição automática gerada pelo sistema.',
            floor(random() * 20000 + 5000)::int,
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
            'Geral',
            random() > 0.8,
            100,
            ARRAY['P', 'M', 'G']
        );
    END LOOP;
END;
$$;

-- 5. RE-HABILITAR RLS E GARANTIR POLÍTICAS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Garantir que todos possam ver os produtos
DROP POLICY IF EXISTS "Public Read Products" ON products;
CREATE POLICY "Public Read Products" ON products FOR SELECT TO anon USING (true);

-- Garantir que apenas admins autenticados possam alterar
DROP POLICY IF EXISTS "Admin Write Products" ON products;
CREATE POLICY "Admin Write Products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. DICA: RODAR ISSO NO SQL EDITOR DO SUPABASE
