import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import GeminiInputBox from '../../../components/ui/Input';
import { models } from '../../../utils/inputUtils';


function NewChat() {
    const navigate = useNavigate();

    // State to track if the user has started a chat
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Handle the submit event
    const handleChatSubmit = (data: { text: string; files: File[]; modelId?: string }) => {
        console.log('--- New Message Submitted ---');
        console.log('Text:', data.text);
        console.log('Files:', data.files);
        console.log('Selected Model ID:', data.modelId);

        // 1. Immediately trigger the animation to push the input to the bottom
        setIsSubmitted(true);

        // 2. Simulate API Call & Navigation
        // In a real scenario, you would send data to your backend here,
        // get the new chat ID, and navigate to the new URL.
        setTimeout(() => {
            const newChatId = `chat_${Date.now()}`;
            navigate(`/chat/${newChatId}`);
        }, 500); // Slight delay ensures the slide-down animation finishes before the page routes
    };

    return (
        <div className="min-h-[calc(100vh-40px)] md:min-h-screen bg-[#0e0e0e] flex flex-col overflow-hidden">

            {/* --- MAIN CHAT AREA --- */}
            {/* Only renders after submission to push the input box down */}
            {isSubmitted && (
                <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-white">
                    <div className="text-center text-zinc-500 mt-10">
                        Chat history will appear here...
                    </div>
                </main>
            )}

            {/* --- INPUT AREA WRAPPER --- */}
            <div className={`flex flex-col w-full ${!isSubmitted ? 'flex-1 justify-center' : 'shrink-0 pb-6 pt-2 bg-linear-to-t from-[#0e0e0e] to-transparent'}`}>

                {/*
                  The layout prop from Framer Motion automatically animates the transition
                  when the parent's flex-direction/alignment changes.
                */}
                <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    className="w-full flex flex-col items-center"
                >
                    {/* Optional: Greeting text that disappears upon submission */}
                    {!isSubmitted && (
                        <motion.h2
                            layout
                            className="text-3xl md:text-5xl font-semibold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-600 px-4 text-center"
                        >
                            What can I help you with?
                        </motion.h2>
                    )}

                    <div className="w-full">
                        <GeminiInputBox
                            models={models}
                            defaultModelId="mistral"
                            onSubmit={handleChatSubmit}
                        />
                    </div>
                </motion.div>

            </div>
        </div>
    );
}

export default NewChat;