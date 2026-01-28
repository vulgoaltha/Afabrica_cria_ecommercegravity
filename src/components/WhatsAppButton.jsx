import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WhatsAppButton = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);

    // Configure seu número de WhatsApp aqui (formato: código do país + DDD + número)
    // Exemplo: 5511999999999 (55 = Brasil, 11 = DDD, 999999999 = número)
    const phoneNumber = '5511999999999'; // ALTERE ESTE NÚMERO
    const message = 'Olá! Vim do site A Fabrica Cria e gostaria de mais informações.';

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    const handleClick = () => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    const closeTooltip = (e) => {
        e.stopPropagation();
        setShowTooltip(false);
    };

    return (
        <>
            {/* Botão flutuante */}
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
                {/* Tooltip/Mensagem */}
                {showTooltip && (
                    <div className="hidden md:flex items-center gap-2 bg-white text-gray-800 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right duration-300">
                        <span className="text-sm font-medium">
                            Precisa de ajuda? Fale conosco!
                        </span>
                        <button
                            onClick={closeTooltip}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Fechar mensagem"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Botão do WhatsApp */}
                <button
                    onClick={handleClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="group relative bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95"
                    aria-label="Abrir WhatsApp"
                >
                    {/* Efeito de pulso */}
                    <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>

                    {/* Ícone do WhatsApp */}
                    <div className="relative">
                        <MessageCircle
                            size={28}
                            className={`transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`}
                            strokeWidth={2}
                        />
                    </div>

                    {/* Badge de notificação (opcional) */}
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        1
                    </span>
                </button>
            </div>

            {/* Estilos adicionais para animações */}
            {/* Removed invalid style tag. Animation relied on Tailwind built-ins or standard CSS */}
        </>
    );
};

export default WhatsAppButton;
