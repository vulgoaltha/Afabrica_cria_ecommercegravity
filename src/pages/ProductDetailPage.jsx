import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProduct, getProductQuantities } from '@/api/EcommerceApi';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, Loader2, ArrowLeft, CheckCircle, Minus, Plus, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null); // New state for size
    const [customization, setCustomization] = useState(''); // New state for customization
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { addToCart } = useCart();
    const { toast } = useToast();

    const handleAddToCart = useCallback(async () => {
        if (!selectedSize) {
            toast({
                variant: "destructive",
                title: "Selecione um tamanho",
                description: "Por favor, escolha um tamanho para continuar.",
            });
            return;
        }

        if (product && selectedVariant) {
            const availableQuantity = selectedVariant.inventory_quantity;
            try {
                // Pass size and customization to addToCart
                await addToCart(product, { ...selectedVariant, size: selectedSize, customization }, quantity, availableQuantity);
                toast({
                    title: "Adicionado ao Carrinho! 🛒",
                    description: `${quantity} x ${product.title} (Tam: ${selectedSize}) adicionado.`,
                });
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Ops! Algo deu errado.",
                    description: error.message,
                });
            }
        }
    }, [product, selectedVariant, selectedSize, customization, quantity, addToCart, toast]);

    const handleQuantityChange = useCallback((amount) => {
        setQuantity(prevQuantity => {
            const newQuantity = prevQuantity + amount;
            if (newQuantity < 1) return 1;
            return newQuantity;
        });
    }, []);

    const handlePrevImage = useCallback(() => {
        if (product?.images?.length > 1) {
            setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
        }
    }, [product?.images?.length]);

    const handleNextImage = useCallback(() => {
        if (product?.images?.length > 1) {
            setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1);
        }
    }, [product?.images?.length]);

    const handleVariantSelect = useCallback((variant) => {
        setSelectedVariant(variant);

        if (variant.image_url && product?.images?.length > 0) {
            const imageIndex = product.images.findIndex(image => image.url === variant.image_url);

            if (imageIndex !== -1) {
                setCurrentImageIndex(imageIndex);
            }
        }
    }, [product?.images]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                setError(null);
                const fetchedProduct = await getProduct(id);

                try {
                    const quantitiesResponse = await getProductQuantities({
                        fields: 'inventory_quantity',
                        product_ids: [fetchedProduct.id]
                    });

                    const variantQuantityMap = new Map();
                    quantitiesResponse.variants.forEach(variant => {
                        variantQuantityMap.set(variant.id, variant.inventory_quantity);
                    });

                    const productWithQuantities = {
                        ...fetchedProduct,
                        variants: fetchedProduct.variants.map(variant => ({
                            ...variant,
                            inventory_quantity: variantQuantityMap.get(variant.id) ?? variant.inventory_quantity
                        }))
                    };

                    setProduct(productWithQuantities);

                    if (productWithQuantities.variants && productWithQuantities.variants.length > 0) {
                        setSelectedVariant(productWithQuantities.variants[0]);
                    }
                } catch (quantityError) {
                    throw quantityError;
                }
            } catch (err) {
                setError(err.message || 'Falha ao carregar produto');
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh] bg-preto">
                <Loader2 className="h-16 w-16 text-dourado animate-spin" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-5xl mx-auto pt-24 px-4">
                <Link to="/catalogo" className="inline-flex items-center gap-2 text-white hover:text-dourado transition-colors mb-6">
                    <ArrowLeft size={16} />
                    Voltar ao Catálogo
                </Link>
                <div className="text-center text-red-400 p-8 border border-red-900/50 bg-gray-900/50 rounded-2xl">
                    <XCircle className="mx-auto h-16 w-16 mb-4" />
                    <p className="mb-6">Erro ao carregar produto: {error}</p>
                </div>
            </div>
        );
    }

    const price = selectedVariant?.sale_price_formatted ?? selectedVariant?.price_formatted;
    const originalPrice = selectedVariant?.price_formatted;
    const availableStock = selectedVariant ? selectedVariant.inventory_quantity : 0;
    const isStockManaged = selectedVariant?.manage_inventory ?? false;
    const canAddToCart = !isStockManaged || quantity <= availableStock;

    const currentImage = product.images[currentImageIndex];
    const hasMultipleImages = product.images.length > 1;

    return (
        <>
            <Helmet>
                <title>{product.title} - A Fabrica Cria</title>
                <meta name="description" content={product.description?.substring(0, 160) || product.title} />
            </Helmet>

            <div className="min-h-screen bg-preto pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-dourado transition-colors mb-8">
                        <ArrowLeft size={18} />
                        Voltar ao Início
                    </Link>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Gallery */}
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="space-y-4">
                            <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 aspect-square">
                                <img
                                    src={!currentImage?.url ? placeholderImage : currentImage.url}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />

                                {hasMultipleImages && (
                                    <>
                                        <button
                                            onClick={handlePrevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-dourado/80 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
                                            aria-label="Imagem anterior"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button
                                            onClick={handleNextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-dourado/80 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
                                            aria-label="Próxima imagem"
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    </>
                                )}


                            </div>

                            {hasMultipleImages && (
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${index === currentImageIndex ? 'border-dourado scale-105' : 'border-gray-800 hover:border-gray-600'
                                                }`}
                                        >
                                            <img
                                                src={!image.url ? placeholderImage : image.url}
                                                alt={`${product.title} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Info */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col">
                            <h1 className="text-4xl md:text-5xl font-poppins font-bold text-white mb-4 leading-tight">{product.title}</h1>
                            <p className="text-xl text-gray-300 mb-8 font-light">{product.subtitle}</p>

                            <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-gray-800">
                                <span className="text-4xl font-bold text-dourado">{price}</span>
                                {selectedVariant?.sale_price_in_cents && (
                                    <span className="text-2xl text-gray-500 line-through">{originalPrice}</span>
                                )}
                            </div>

                            <div className="prose prose-invert max-w-none text-gray-300 mb-8" dangerouslySetInnerHTML={{ __html: product.description }} />

                            {/* Size Selector */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Tamanho</h3>
                                <div className="flex flex-wrap gap-3">
                                    {(product.sizes && product.sizes.length > 0 ? product.sizes : ['P', 'M', 'G', 'GG']).map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-all ${selectedSize === size
                                                ? 'border-dourado bg-dourado text-black'
                                                : 'border-gray-700 text-gray-400 hover:border-dourado hover:text-dourado'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                                {!selectedSize && (
                                    <p className="text-red-400 text-xs mt-2">* Selecione um tamanho</p>
                                )}
                            </div>

                            {/* Customization (If applicable) */}
                            {product.customizable && (
                                <div className="mb-8 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                                    <h3 className="text-sm font-bold text-white mb-2">Personalização</h3>
                                    <p className="text-xs text-gray-400 mb-2">Este produto permite personalização.</p>
                                    <input
                                        type="text"
                                        placeholder="Nome ou Detalhes (Opcional)"
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-dourado"
                                        onChange={(e) => setCustomization(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-6 mb-8">
                                <div className="flex items-center border-2 border-gray-700 rounded-xl bg-gray-900/50 w-max">
                                    <button onClick={() => handleQuantityChange(-1)} className="p-4 text-gray-400 hover:text-white transition-colors">
                                        <Minus size={20} />
                                    </button>
                                    <span className="w-12 text-center text-xl font-bold text-white">{quantity}</span>
                                    <button onClick={() => handleQuantityChange(1)} className="p-4 text-gray-400 hover:text-white transition-colors">
                                        <Plus size={20} />
                                    </button>
                                </div>

                                <Button
                                    onClick={handleAddToCart}
                                    size="lg"
                                    className="flex-1 bg-dourado hover:bg-yellow-500 text-preto font-bold text-lg h-auto py-4 rounded-xl shadow-lg shadow-dourado/10 transition-all hover:scale-[1.02]"
                                    disabled={!canAddToCart || !product.purchasable}
                                >
                                    <ShoppingCart className="mr-2 h-6 w-6" />
                                    Adicionar ao Carrinho
                                </Button>
                            </div>

                            {isStockManaged && canAddToCart && product.purchasable && (
                                <p className="text-green-400 flex items-center gap-2 font-medium bg-green-900/20 py-2 px-4 rounded-lg w-max border border-green-900/50">
                                    <CheckCircle size={18} /> {availableStock} em estoque!
                                </p>
                            )}

                            {isStockManaged && !canAddToCart && product.purchasable && (
                                <p className="text-yellow-400 flex items-center gap-2 font-medium bg-yellow-900/20 py-2 px-4 rounded-lg w-max border border-yellow-900/50">
                                    <XCircle size={18} /> Estoque insuficiente. Apenas {availableStock} restantes.
                                </p>
                            )}

                            {!product.purchasable && (
                                <p className="text-red-400 flex items-center gap-2 font-medium bg-red-900/20 py-2 px-4 rounded-lg w-max border border-red-900/50">
                                    <XCircle size={18} /> Indisponível no momento
                                </p>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductDetailPage;
