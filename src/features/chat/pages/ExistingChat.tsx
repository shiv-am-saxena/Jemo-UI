import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import GeminiInputBox, { type AIModel } from '../../../components/ui/Input';

// --- Types ---
interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
}

// Ensure these match your NewChat models
const models: AIModel[] = [
    { name: "L-1", id: "mistral", description: "Fastest answers." },
    { name: "L-2", id: "gemini", description: "All-around help" },
    { name: "L-3", id: "nvidia", description: "Advance coding & maths." }
];

export default function ExistingChat() {
    const { chatId } = useParams<{ chatId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);

    // Reference to automatically scroll to the bottom
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. Simulate fetching chat history
    useEffect(() => {
        if (chatId) {
            console.log(`Fetching history for chat: ${chatId}`);

            const mockHistory: Message[] = [
                { id: '1', role: 'user', content: 'Can you help me understand React hooks?' },
                { id: '2', role: 'ai', content: 'Of course! React Hooks are functions that let you "hook into" React state and lifecycle features from function components. The most common ones are `useState` and `useEffect`.' },
            ];

            setMessages(mockHistory);
        }
    }, [chatId]);

    // 2. Auto-scroll to the bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 3. Handle new message submissions
    const handleChatSubmit = (data: { text: string; files: File[]; modelId?: string }) => {
        if (!data.text.trim() && data.files.length === 0) return;

        // Add user message to UI immediately
        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: data.text
        };
        setMessages((prev) => [...prev, newUserMsg]);

        // Simulate AI thinking and responding
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: `This is a simulated response from the ${data.modelId} model.`
            };
            setMessages((prev) => [...prev, aiResponse]);
        }, 1000);
    };

    return (
        // Changed to flex-1 h-full to perfectly fill the Outlet in the Dashboard
        <div className="flex flex-col flex-1 h-full w-full overflow-hidden relative">
            {/* --- MAIN CHAT HISTORY AREA --- */}
            <main className="flex-1 overflow-y-auto w-full flex flex-col scrollbar-none">
                {messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-zinc-500 text-center px-4">
                        Loading messages...
                    </div>
                ) : (
                    // Centered max-width container prevents 4K screens from stretching bubbles too wide
                    <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 pt-6 pb-10">
                        {messages.map((msg) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={msg.id}
                                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    // Max widths handle 320px up to 4K safely. break-words prevents overflow on tiny screens.
                                    className={`px-4 md:px-5 py-3 md:py-3.5 rounded-3xl max-w-[90%] md:max-w-[80%] lg:max-w-[75%] leading-relaxed wrap-break-word text-[15px] md:text-base ${msg.role === 'user'
                                            ? 'bg-zinc-800 text-white rounded-br-sm'
                                            : 'bg-transparent text-zinc-200'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}
                        {/* Invisible div to target for auto-scrolling */}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </main>

            {/* --- INPUT AREA WRAPPER --- */}
            {/* shrink-0 keeps it anchored to the bottom. Gradient fade covers the chat scroll seamlessly. */}
            <div className="shrink-0 pt-2 w-full mt-auto bg-linear-to-t from-[#0e0e0e] via-[#0e0e0e] to-transparent">
                <div className="max-w-4xl mx-auto w-full">
                    <GeminiInputBox
                        models={models}
                        defaultModelId="mistral"
                        onSubmit={handleChatSubmit}
                    />
                </div>
            </div>

        </div>
    );
}