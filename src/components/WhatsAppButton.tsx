'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WhatsAppButton = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);

    const phoneNumber = '551125067087';
    const message = 'Olá! Vim do site A Fabrica Cria e gostaria de mais informações.';

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    const handleClick = () => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    const closeTooltip = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowTooltip(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
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

            <button
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95"
                aria-label="Abrir WhatsApp"
            >
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>

                <div className="relative">
                    <MessageCircle
                        size={28}
                        className={`transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`}
                        strokeWidth={2}
                    />
                </div>

                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    1
                </span>
            </button>
        </div>
    );
};

export default WhatsAppButton;
