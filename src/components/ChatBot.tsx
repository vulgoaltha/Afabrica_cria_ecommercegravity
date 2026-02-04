import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, ChevronDown, ShoppingBag, Truck, Edit3 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: 'Olá! Sou o assistente virtual da A Fabricah Cria. Como posso ajudar você hoje?',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (text: string) => {
        if (!text.trim()) return;

        const newUserMessage: Message = {
            id: Date.now(),
            text: text,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate Bot Response
        setTimeout(() => {
            let botResponse = "Desculpe, não entendi. Você gostaria de falar sobre orçamentos, prazos de entrega ou personalização?";

            const lowerText = text.toLowerCase();
            if (lowerText.includes('orçamento') || lowerText.includes('preço') || lowerText.includes('quanto custa')) {
                botResponse = "Para orçamentos, você pode preencher nosso formulário na página de Contato ou me dizer quais itens você precisa e a quantidade!";
            } else if (lowerText.includes('prazo') || lowerText.includes('entrega') || lowerText.includes('frete')) {
                botResponse = "Nosso prazo médio de produção é de 10 a 15 dias úteis, mais o tempo de frete que você pode calcular diretamente na página de cada produto!";
            } else if (lowerText.includes('personaliza') || lowerText.includes('logo') || lowerText.includes('arte')) {
                botResponse = "Trabalhamos com personalização total! Você pode enviar sua logo e nós criamos o layout para você sem custo adicional.";
            } else if (lowerText.includes('olá') || lowerText.includes('oi')) {
                botResponse = "Olá! É um prazer atender você. Em que posso ser útil hoje?";
            }

            const newBotMessage: Message = {
                id: Date.now() + 1,
                text: botResponse,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, newBotMessage]);
            setIsTyping(false);
        }, 1000);
    };

    const quickActions = [
        { icon: Truck, label: 'Prazos e Frete', text: 'Quais os prazos de entrega?' },
        { icon: ShoppingBag, label: 'Orçamentos', text: 'Como solicitar um orçamento?' },
        { icon: Edit3, label: 'Personalização', text: 'Como funciona a personalização?' },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] md:h-[600px] bg-black border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-dourado/10 flex items-center justify-center border border-dourado/20">
                                    <Bot size={24} className="text-dourado" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">Cria Assistente</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border ${msg.sender === 'user' ? 'bg-gray-800 border-gray-700' : 'bg-dourado/10 border-dourado/20'
                                            }`}>
                                            {msg.sender === 'user' ? <User size={14} className="text-gray-400" /> : <Bot size={16} className="text-dourado" />}
                                        </div>
                                        <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                                ? 'bg-dourado text-black font-medium rounded-tr-none'
                                                : 'bg-gray-900 text-gray-200 border border-gray-800 rounded-tl-none'
                                            }`}>
                                            {msg.text}
                                            <p className={`text-[9px] mt-1 ${msg.sender === 'user' ? 'text-black/60' : 'text-gray-500'}`}>
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-900 border border-gray-800 p-3 rounded-2xl rounded-tl-none flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions Panel (if no messages from user yet or always available) */}
                        <div className="px-4 py-2 border-t border-gray-800 overflow-x-auto whitespace-nowrap bg-black/50 backdrop-blur-sm">
                            <div className="flex gap-2">
                                {quickActions.map((action, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSend(action.text)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-800 bg-gray-900/50 hover:border-dourado/50 hover:text-dourado transition-all text-[10px] text-gray-400 font-bold uppercase"
                                    >
                                        <action.icon size={12} />
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-black border-t border-gray-800">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
                                className="flex gap-2"
                            >
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Digite sua dúvida..."
                                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 h-11"
                                />
                                <Button
                                    type="submit"
                                    className="bg-dourado hover:bg-yellow-500 text-black px-4 h-11"
                                >
                                    <Send size={18} />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-red-500 rotate-90' : 'bg-dourado'
                    }`}
            >
                {isOpen ? <X size={28} className="text-white" /> : <MessageSquare size={28} className="text-black" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-black flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    </span>
                )}
            </motion.button>
        </div>
    );
};

export default ChatBot;
