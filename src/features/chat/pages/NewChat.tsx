import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import GeminiInputBox from '../../../components/ui/Input';
import { models } from '../../../utils/inputUtils'; // Adjust path if needed
import useChat from '../hooks/useChat'; // Import the custom hook

function NewChat() {
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Destructure the required functions and state from the hook
    const { sendMessage, uploadFile, activeChatId, isUploading, generationStatus, processingLabel } = useChat();

    // Automatically navigate to the new chat route once the backend sets the activeChatId
    useEffect(() => {
        if (activeChatId) {
            navigate(`/chat/${activeChatId}`);
        }
    }, [activeChatId, navigate]);

    const handleChatSubmit = async (data: { text: string; files: File[]; modelId?: string; webSearch: boolean }) => {
        if (!data.text.trim() && data.files.length === 0) return;

        setIsSubmitted(true); // Trigger the UI slide-down animation[cite: 11]

        // 1. Process and upload files first (if any)
        const uploadedFiles = [];
        if (data.files && data.files.length > 0) {
            for (const file of data.files) {
                const uploadedData = await uploadFile(file);
                if (uploadedData) {
                    uploadedFiles.push(uploadedData); // Push the { url, imagekitId } object
                }
            }
        }

        // 2. Send the message to trigger chat creation and AI stream
        // The hook will handle the REST call and socket emission
        await sendMessage(data.text, uploadedFiles, data.modelId);
    };

    return (
        <div className="min-h-[calc(100vh-40px)] md:min-h-screen bg-[#0e0e0e] flex flex-col overflow-hidden">
            {isSubmitted && (
                <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-white">
                    <div className="text-center text-zinc-500 mt-10">
                        {isUploading
                            ? "Uploading files..."
                            : generationStatus === "processing"
                                ? processingLabel
                                : "Starting chat..."}
                    </div>
                </main>
            )}

            <div className={`flex flex-col w-full ${!isSubmitted ? 'flex-1 justify-center' : 'shrink-0 pb-6 pt-2 bg-linear-to-t from-[#0e0e0e] to-transparent'}`}>
                <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    className="w-full flex flex-col items-center"
                >
                    {!isSubmitted && (
                        <motion.h2
                            layout
                            className="text-3xl md:text-5xl font-semibold mb-8 text-transparent bg-clip-text bg-linear-to-r from-zinc-300 to-zinc-600 px-4 text-center"
                        >
                            What can I help you with?
                        </motion.h2>
                    )}

                    <div className="w-full">
                        <GeminiInputBox
                            models={models}
                            defaultModelId="mistral"
                            onSubmit={handleChatSubmit} // Triggers the updated submit function[cite: 11]
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default NewChat;