"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Message {
    id: string;
    role: 'user' | 'agent';
    text: string;
    timestamp: Date;
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Connect to WebSocket
        const clientId = Date.now();
        ws.current = new WebSocket(`ws://localhost:8004/ws/${clientId}`);

        ws.current.onopen = () => {
            setIsConnected(true);
            console.log('Connected to AI Service');
        };

        ws.current.onmessage = (event) => {
            const response = event.data;
            addMessage('agent', response);
        };

        ws.current.onclose = () => {
            setIsConnected(false);
            console.log('Disconnected from AI Service');
        };

        return () => {
            ws.current?.close();
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const addMessage = (role: 'user' | 'agent', text: string) => {
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                role,
                text,
                timestamp: new Date(),
            },
        ]);
    };

    const handleSend = () => {
        if (!input.trim() || !isConnected) return;

        addMessage('user', input);
        ws.current?.send(input);
        setInput('');
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white">
                    <Bot className="w-6 h-6" />
                    <h2 className="font-bold text-lg">Kayak AI Concierge</h2>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={cn("w-2 h-2 rounded-full", isConnected ? "bg-green-400" : "bg-red-400")} />
                    <span className="text-xs text-white/80">{isConnected ? 'Online' : 'Offline'}</span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={cn(
                                "flex w-full",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[80%] p-3 rounded-2xl text-sm shadow-sm",
                                    msg.role === 'user'
                                        ? "bg-orange-500 text-white rounded-tr-none"
                                        : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                                )}
                            >
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-gray-900"
                        disabled={!isConnected}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!isConnected || !input.trim()}
                        className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
