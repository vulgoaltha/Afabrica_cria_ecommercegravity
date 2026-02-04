import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface QuoteFormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

interface QuoteErrors {
    [key: string]: string;
}

const QuoteForm = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<QuoteFormData>({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [errors, setErrors] = useState<QuoteErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: QuoteErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
        if (!formData.message.trim()) newErrors.message = 'A mensagem é obrigatória';

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

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            toast({
                title: 'Mensagem enviada com sucesso!',
                description: 'Entraremos em contato em breve.',
            });

            setFormData({
                name: '',
                email: '',
                phone: '',
                message: '',
            });

            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <>
            <Helmet>
                <title>Contato - A Fabricah Cria</title>
                <meta
                    name="description"
                    content="Entre em contato com a A Fabricah Cria. Nossa equipe está pronta para atendê-lo."
                />
            </Helmet>

            <div className="min-h-screen bg-preto pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h1 className="font-poppins text-4xl md:text-5xl font-bold mb-4">
                            Entre em <span className="text-gradient">Contato</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Preencha o formulário abaixo e nossa equipe retornará o mais breve possível
                        </p>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        onSubmit={handleSubmit}
                        className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="md:col-span-2">
                                <label htmlFor="name" className="block font-semibold mb-2">
                                    Nome Completo *
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Seu nome"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block font-semibold mb-2">
                                    Email *
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="seu@email.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block font-semibold mb-2">
                                    Telefone *
                                </label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="(11) 98765-4321"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label htmlFor="message" className="block font-semibold mb-2">
                                Mensagem *
                            </label>
                            <Textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Como podemos ajudar você hoje?"
                                rows={5}
                            />
                            {errors.message && (
                                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isSubmitting}
                            className="w-full bg-dourado hover:bg-yellow-500 text-preto font-semibold text-lg py-6"
                        >
                            {isSubmitting ? (
                                'Enviando...'
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" />
                                    Enviar Mensagem
                                </>
                            )}
                        </Button>

                        <p className="text-sm text-gray-500 text-center">
                            * Campos obrigatórios
                        </p>
                    </motion.form>
                </div>
            </div>
        </>
    );
};

export default QuoteForm;
