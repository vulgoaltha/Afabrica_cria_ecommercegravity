import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { initializeCheckout } from '@/api/EcommerceApi';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    const [formData, setFormData] = useState({
        cep: '',
        street: '',
        number: '',
        complement: '',
        city: '',
        state: '',
        paymentMethod: 'credit-card',
    });

    const [errors, setErrors] = useState({});

    const total = getCartTotal();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        // Basic validation for demo purposes
        if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
        if (!formData.street.trim()) newErrors.street = 'Rua é obrigatória';
        if (!formData.number.trim()) newErrors.number = 'Número é obrigatório';
        if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
        if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast({
                title: 'Erro no formulário',
                description: 'Por favor, preencha todos os campos obrigatórios.',
                variant: 'destructive',
            });
            return;
        }

        setIsProcessing(true);

        try {
            const items = cartItems.map(item => ({
                variant_id: item.variant.id,
                quantity: item.quantity,
            }));

            const successUrl = `${window.location.origin}/success`;
            const cancelUrl = window.location.href;

            const { url } = await initializeCheckout({ items, successUrl, cancelUrl });

            clearCart();
            window.location.href = url;
        } catch (error) {
            setIsProcessing(false);
            toast({
                title: 'Erro no Checkout',
                description: 'Houve um problema ao iniciar o checkout. Por favor, tente novamente.',
                variant: 'destructive',
            });
        }
    };

    if (cartItems.length === 0) {
        navigate('/carrinho');
        return null;
    }

    return (
        <>
            <Helmet>
                <title>Finalizar Compra - A Fabrica Cria</title>
            </Helmet>

            <div className="min-h-screen bg-preto pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <h1 className="font-poppins text-4xl md:text-5xl font-bold">
                            Finalizar <span className="text-gradient">Compra</span>
                        </h1>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Shipping Address */}
                                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-6">
                                    <h2 className="font-poppins text-2xl font-semibold">Endereço de Entrega</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="cep" className="block font-semibold mb-2">
                                                CEP *
                                            </label>
                                            <Input
                                                id="cep"
                                                name="cep"
                                                value={formData.cep}
                                                onChange={handleChange}
                                                error={errors.cep}
                                                placeholder="12345-678"
                                            />
                                            {errors.cep && (
                                                <p className="text-red-500 text-sm mt-1">{errors.cep}</p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="street" className="block font-semibold mb-2">
                                                Rua *
                                            </label>
                                            <Input
                                                id="street"
                                                name="street"
                                                value={formData.street}
                                                onChange={handleChange}
                                                error={errors.street}
                                                placeholder="Rua Exemplo"
                                            />
                                            {errors.street && (
                                                <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="number" className="block font-semibold mb-2">
                                                Número *
                                            </label>
                                            <Input
                                                id="number"
                                                name="number"
                                                value={formData.number}
                                                onChange={handleChange}
                                                error={errors.number}
                                                placeholder="123"
                                            />
                                            {errors.number && (
                                                <p className="text-red-500 text-sm mt-1">{errors.number}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="complement" className="block font-semibold mb-2">
                                                Complemento
                                            </label>
                                            <Input
                                                id="complement"
                                                name="complement"
                                                value={formData.complement}
                                                onChange={handleChange}
                                                placeholder="Apto 45"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="city" className="block font-semibold mb-2">
                                                Cidade *
                                            </label>
                                            <Input
                                                id="city"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                error={errors.city}
                                                placeholder="São Paulo"
                                            />
                                            {errors.city && (
                                                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="state" className="block font-semibold mb-2">
                                                Estado *
                                            </label>
                                            <Input
                                                id="state"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                error={errors.state}
                                                placeholder="SP"
                                                maxLength={2}
                                            />
                                            {errors.state && (
                                                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-6">
                                    <h2 className="font-poppins text-2xl font-semibold">Forma de Pagamento</h2>
                                    <p className="text-gray-400">Você será redirecionado para um ambiente seguro para concluir o pagamento.</p>
                                </div>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 sticky top-24 space-y-6">
                                <h2 className="font-poppins text-2xl font-semibold">Resumo do Pedido</h2>

                                {/* Products */}
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.variant.id}
                                            className="flex gap-3 pb-3 border-b border-gray-800"
                                        >
                                            <img
                                                src={item.product.image}
                                                alt={item.product.title}
                                                className="w-16 h-16 rounded object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm">{item.product.title}</p>
                                                <p className="text-gray-400 text-xs">
                                                    {item.variant.title} x {item.quantity}
                                                </p>
                                            </div>
                                            <span className="text-dourado font-semibold">
                                                {item.variant.sale_price_formatted || item.variant.price_formatted}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="space-y-3 py-4 border-y border-gray-800">
                                    <div className="flex justify-between text-2xl font-bold">
                                        <span>Total</span>
                                        <span className="text-dourado">{total}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={isProcessing}
                                    size="lg"
                                    className="w-full bg-dourado hover:bg-yellow-500 text-preto font-semibold text-lg py-6"
                                >
                                    {isProcessing ? 'Processando...' : 'Confirmar Pedido'}
                                </Button>

                                <p className="text-sm text-gray-500 text-center">
                                    * Campos obrigatórios
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;
