'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Truck, MapPin, User, FileText, Smartphone, Mail, CreditCard as IconCard, QrCode, Barcode } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

const CheckoutPage = () => {
    const router = useRouter();
    const { cartItems, getCartTotal, getRawTotal, clearCart } = useCart();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        cpf: '',
        phone: '',
        email: '',
        cep: '',
        street: '',
        number: '',
        complement: '',
        city: '',
        state: '',
        paymentMethod: 'pix',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const subtotal = getRawTotal() / 100;
    const shipping: number = 0;
    const grandTotal = subtotal + shipping;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleCepBlur = async () => {
        const cep = formData.cep.replace(/\D/g, '');
        if (cep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        street: data.logradouro,
                        city: data.localidade,
                        state: data.uf
                    }));
                } else {
                    toast({ title: 'CEP não encontrado', variant: 'destructive' });
                }
            } catch (error) {
                console.error("Erro ViaCEP", error);
            }
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Nome completo é obrigatório';
        if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
        if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
        if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
        if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
        if (!formData.street.trim()) newErrors.street = 'Endereço é obrigatório';
        if (!formData.number.trim()) newErrors.number = 'Número é obrigatório';
        if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
        if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
            const cleanItems = cartItems.map(item => ({
                productId: String(item.product.id || 'N/A'),
                title: String(item.product.title || 'Produto Sem Nome'),
                price: (item.variant.sale_price_in_cents ?? item.variant.price_in_cents) / 100,
                quantity: Number(item.quantity) || 1,
                size: 'U',
                image: String(item.product.images[0] || '')
            }));

            const orderData = {
                customer_name: formData.fullName,
                customer_email: formData.email,
                customer_phone: formData.phone,
                address: {
                    street: formData.street,
                    number: formData.number,
                    complement: formData.complement,
                    city: formData.city,
                    state: formData.state,
                    cep: formData.cep,
                    cpf: formData.cpf
                },
                items: cleanItems,
                payment_method: formData.paymentMethod,
                total_in_cents: Math.round(grandTotal * 100),
                status: 'Aguardando Pagamento'
            };

            const { data, error } = await supabase
                .from('orders')
                .insert([orderData])
                .select()
                .single();

            if (error) throw error;

            const orderId = data.id;

            // For now, simulate success and clear cart
            toast({
                title: 'Pedido realizado!',
                description: 'Seu pedido foi registrado com sucesso.',
            });

            clearCart();
            router.push(`/success?orderId=${orderId}`);

        } catch (error) {
            console.error("Erro geral no checkout:", error);
            setIsProcessing(false);
            toast({
                title: 'Erro ao processar pedido',
                description: 'Verifique sua conexão e tente novamente.',
                variant: 'destructive',
            });
        }
    };

    if (cartItems.length === 0) {
        router.push('/carrinho');
        return null;
    }

    return (
        <div className="min-h-screen bg-black pt-24 pb-16 text-white">
            <div className="container mx-auto px-4 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">
                        Finalizar <span className="text-[var(--color-gold)]">Compra</span>
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 uppercase tracking-wide">
                                <User className="text-[var(--color-gold)]" size={20} /> Dados Pessoais
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Nome Completo</label>
                                    <Input
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="bg-gray-800 border-gray-700 text-white"
                                        placeholder="Ex: João da Silva"
                                    />
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">CPF</label>
                                    <Input
                                        name="cpf"
                                        value={formData.cpf}
                                        onChange={handleChange}
                                        className="bg-gray-800 border-gray-700 text-white"
                                        placeholder="000.000.000-00"
                                    />
                                    {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>}
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Telefone / WhatsApp</label>
                                    <Input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="bg-gray-800 border-gray-700 text-white"
                                        placeholder="(11) 99999-9999"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Email</label>
                                    <Input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="bg-gray-800 border-gray-700 text-white"
                                        placeholder="joao@email.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 uppercase tracking-wide">
                                <MapPin className="text-[var(--color-gold)]" size={20} /> Endereço de Entrega
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">CEP</label>
                                    <Input
                                        name="cep"
                                        value={formData.cep}
                                        onChange={handleChange}
                                        onBlur={handleCepBlur}
                                        className="bg-gray-800 border-gray-700 text-white"
                                        placeholder="00000-000"
                                    />
                                    {errors.cep && <p className="text-red-500 text-xs mt-1">{errors.cep}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Rua / Logradouro</label>
                                    <Input
                                        name="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        className="bg-gray-800 border-gray-700 text-white"
                                    />
                                    {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Número</label>
                                    <Input
                                        name="number"
                                        value={formData.number}
                                        onChange={handleChange}
                                        className="bg-gray-800 border-gray-700 text-white"
                                    />
                                    {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Complemento</label>
                                    <Input
                                        name="complement"
                                        value={formData.complement}
                                        onChange={handleChange}
                                        className="bg-gray-800 border-gray-700 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Cidade</label>
                                    <Input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="bg-gray-800 border-gray-700 text-white"
                                    />
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Estado</label>
                                    <Input
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="bg-gray-800 border-gray-700 text-white"
                                        maxLength={2}
                                    />
                                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 uppercase tracking-wide">
                                <CreditCard className="text-[var(--color-gold)]" size={20} /> Pagamento
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, paymentMethod: 'pix' }))}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.paymentMethod === 'pix'
                                        ? 'bg-[var(--color-gold)] text-black border-[var(--color-gold)] font-bold'
                                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    <QrCode size={24} />
                                    <span>PIX</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, paymentMethod: 'card' }))}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.paymentMethod === 'card'
                                        ? 'bg-[var(--color-gold)] text-black border-[var(--color-gold)] font-bold'
                                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    <IconCard size={24} />
                                    <span>Cartão</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, paymentMethod: 'boleto' }))}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.paymentMethod === 'boleto'
                                        ? 'bg-[var(--color-gold)] text-black border-[var(--color-gold)] font-bold'
                                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    <FileText size={24} />
                                    <span>Boleto</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-24 space-y-6">
                            <h2 className="text-xl font-bold uppercase tracking-wide">Resumo</h2>

                            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.variant.id} className="flex gap-3 pb-3 border-b border-gray-800 last:border-0">
                                        <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.product.images[0] || ''}
                                                alt={item.product.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-xs uppercase line-clamp-1">{item.product.title}</p>
                                            <p className="text-gray-400 text-[10px] uppercase">
                                                {item.variant.title} x {item.quantity}
                                            </p>
                                            <p className="text-[var(--color-gold)] text-xs font-bold mt-1">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((item.variant.sale_price_in_cents ?? item.variant.price_in_cents) / 100)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2 pt-4 border-t border-gray-800 text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Frete</span>
                                    <span>{shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-gray-800 mt-2">
                                    <span>Total</span>
                                    <span className="text-[var(--color-gold)]">R$ {grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleSubmit}
                                disabled={isProcessing}
                                className="w-full bg-[var(--color-gold)] hover:bg-yellow-500 text-black font-black py-6 text-lg rounded-xl uppercase tracking-wider"
                            >
                                {isProcessing ? 'Processando...' : 'Finalizar Pedido'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
