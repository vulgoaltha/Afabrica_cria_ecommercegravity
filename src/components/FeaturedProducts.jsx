import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { getProducts } from '@/api/EcommerceApi';

const FeaturedProducts = () => {
    const { addToCart } = useCart();
    const { toast } = useToast();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                // Take first 3 products for featured section
                setProducts(response.products.slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch featured products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = async (product) => {
        if (!product.variants || product.variants.length === 0) return;

        const variant = product.variants[0];

        try {
            await addToCart(product, variant, 1);
            toast({
                title: 'Produto adicionado!',
                description: `${product.title} foi adicionado ao carrinho.`,
            });
        } catch (error) {
            toast({
                title: 'Erro ao adicionar',
                description: error.message,
                variant: 'destructive'
            });
        }
    };

    if (loading) return null;

    return (
        <section className="py-16 md:py-24 bg-black">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-poppins text-4xl md:text-5xl font-bold mb-4">
                        Produtos em <span className="text-gradient">Destaque</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Descubra nossos uniformes mais populares e exclusivos
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, index) => {
                        const variant = product.variants[0];
                        const price = variant?.sale_price_formatted || variant?.price_formatted;

                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group"
                            >
                                <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden hover:border-[var(--color-gold)]/50 hover:shadow-2xl transition-all duration-300">
                                    {/* Image */}
                                    <Link to={`/produto/${product.id}`} className="relative block overflow-hidden aspect-square">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />

                                    </Link>

                                    {/* Content */}
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <Link to={`/produto/${product.id}`}>
                                                <h3 className="font-bold text-xl font-semibold hover:text-[var(--color-gold)] transition-colors uppercase">
                                                    {product.title}
                                                </h3>
                                            </Link>
                                            <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                                                {product.subtitle || product.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                            <div>
                                                <span className="text-2xl font-bold text-[var(--color-gold)]">
                                                    {price}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-black"
                                                >
                                                    <Link to={`/produto/${product.id}`}>Ver Detalhes</Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-[var(--color-gold)] hover:bg-yellow-500 text-black border-none"
                                                    onClick={() => handleAddToCart(product)}
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center mt-12"
                >
                    <Button
                        asChild
                        size="lg"
                        className="bg-[var(--color-gold)] hover:bg-yellow-500 text-black font-bold"
                    >
                        <Link to="/catalogo">Ver Catálogo Completo</Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
