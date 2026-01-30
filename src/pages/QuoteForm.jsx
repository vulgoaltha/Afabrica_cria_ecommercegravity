import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Send, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const QuoteForm = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        uniformType: '',
        quantity: '',
        description: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
        if (!formData.uniformType.trim()) newErrors.uniformType = 'Tipo de uniforme é obrigatório';
        if (!formData.quantity.trim()) newErrors.quantity = 'Quantidade é obrigatória';

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

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            toast({
                title: 'Orçamento enviado com sucesso!',
                description: 'Entraremos em contato em breve com sua proposta personalizada.',
            });

            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                uniformType: '',
                quantity: '',
                description: '',
            });

            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <>
            <Helmet>
                <title>Solicitar Orçamento - A Fabricah Cria</title>
                <meta
                    name="description"
                    content="Solicite um orçamento personalizado para seus uniformes. Nossa equipe está pronta para atendê-lo."
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
                            Solicite um <span className="text-gradient">Orçamento</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Preencha o formulário abaixo e nossa equipe entrará em contato com uma proposta personalizada
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
                            <div>
                                <label htmlFor="name" className="block font-semibold mb-2">
                                    Nome Completo *
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={errors.name}
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
                                    error={errors.email}
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
                                    error={errors.phone}
                                    placeholder="(11) 98765-4321"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>

                            {/* Company */}
                            <div>
                                <label htmlFor="company" className="block font-semibold mb-2">
                                    Empresa/Time
                                </label>
                                <Input
                                    id="company"
                                    name="company"
                                    type="text"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="Nome da empresa ou time"
                                />
                            </div>

                            {/* Uniform Type */}
                            <div>
                                <label htmlFor="uniformType" className="block font-semibold mb-2">
                                    Tipo de Uniforme *
                                </label>
                                <select
                                    id="uniformType"
                                    name="uniformType"
                                    value={formData.uniformType}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border bg-gray-900/50 text-white focus:outline-none focus:ring-2 transition-all duration-300 ${errors.uniformType
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                                        : 'border-gray-700 focus:border-dourado focus:ring-dourado/50'
                                        }`}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Camisetas">Camisetas</option>
                                    <option value="Calções">Calções</option>
                                    <option value="Meias">Meias</option>
                                    <option value="Bonés">Bonés</option>
                                    <option value="Jaquetas">Jaquetas</option>
                                    <option value="Polos">Polos</option>
                                    <option value="Kit Completo">Kit Completo</option>
                                </select>
                                {errors.uniformType && (
                                    <p className="text-red-500 text-sm mt-1">{errors.uniformType}</p>
                                )}
                            </div>

                            {/* Quantity */}
                            <div>
                                <label htmlFor="quantity" className="block font-semibold mb-2">
                                    Quantidade *
                                </label>
                                <Input
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    error={errors.quantity}
                                    placeholder="Ex: 50"
                                    min="1"
                                />
                                {errors.quantity && (
                                    <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block font-semibold mb-2">
                                Descrição da Personalização
                            </label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Descreva detalhes sobre cores, logos, tamanhos, prazos e qualquer outra informação relevante..."
                                rows={5}
                            />
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block font-semibold mb-2">
                                Enviar Logo/Design (Opcional)
                            </label>
                            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-dourado/50 transition-colors cursor-pointer">
                                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                                <p className="text-gray-400 mb-2">
                                    Clique para selecionar ou arraste arquivos aqui
                                </p>
                                <p className="text-sm text-gray-500">
                                    PNG, JPG, SVG até 10MB
                                </p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={() => {
                                        toast({
                                            title: '🚧 Upload de arquivos',
                                            description: 'Esta funcionalidade estará disponível em breve!',
                                        });
                                    }}
                                />
                            </div>
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
                                    Solicitar Orçamento
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
