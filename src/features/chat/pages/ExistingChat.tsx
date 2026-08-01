/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import GeminiInputBox, { type AIModel } from "../../../components/ui/Input";
import useChat from "../hooks/useChat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { IoStopCircleOutline } from "react-icons/io5";
import { HiSpeakerWave } from "react-icons/hi2"
import { MdContentCopy } from "react-icons/md";

const models: AIModel[] = [
    { name: "L-1", id: "mistral", description: "Fastest answers." },
    { name: "L-2", id: "gemini", description: "All-around help" },
    { name: "L-3", id: "nvidia", description: "Advance coding & maths." },
];

export default function ExistingChat() {
    const { chatId } = useParams<{ chatId: string }>();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [speakingMessageId, setSpeakingMessageId] = useState<string | number | null>(null);

    const {
        messages,
        fetchMessages,
        sendMessage,
        uploadFile,
        isGenerating,
        isUploading,
        generationStatus,
        processingLabel,
    } = useChat(chatId || null);

    useEffect(() => {
        if (chatId) {
            fetchMessages(chatId);
        }
    }, [chatId, fetchMessages]);

    useLayoutEffect(() => {
        const container = scrollContainerRef.current;

        if (!container) return;

        container.scrollTop = container.scrollHeight;
    }, [messages]);

    useEffect(() => {
        return () => {
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const getMessageId = (msg: any, idx: number) => msg._id ?? idx;

    const handleReadAloud = (msg: any, idx: number) => {
        const text = msg.content?.text?.trim();

        if (!text) {
            toast.error("No text available to read aloud.");
            return;
        }

        if (typeof window === "undefined" || !("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
            toast.error("Text-to-speech is not supported in this browser.");
            return;
        }

        const currentId = getMessageId(msg, idx);

        if (speakingMessageId === currentId && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            setSpeakingMessageId(null);
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.onend = () => {
            setSpeakingMessageId((prev) => (prev === currentId ? null : prev));
        };
        utterance.onerror = () => {
            setSpeakingMessageId((prev) => (prev === currentId ? null : prev));
            toast.error("Unable to read this message aloud.");
        };

        setSpeakingMessageId(currentId);
        window.speechSynthesis.speak(utterance);
    };

    const handleCopy = async (msg: any) => {
        const text = msg.content?.text?.trim();

        if (!text) {
            toast.error("No text available to copy.");
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            toast.success("Message copied.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to copy message.");
        }
    };

    const handleChatSubmit = async (data: {
        text: string;
        files: File[];
        modelId?: string;
        webSearch: boolean;
    }) => {
        if (!data.text.trim() && data.files.length === 0) return;

        const uploadedFiles = [];

        for (const file of data.files) {
            const uploaded = await uploadFile(file);

            if (uploaded) {
                uploadedFiles.push(uploaded);
            }
        }

        await sendMessage(data.text, uploadedFiles, data.modelId);
    };

    return (
        <div className="flex flex-col flex-1 h-full w-full overflow-hidden relative">
            <main className="flex-1 overflow-y-auto scrollbar-none" ref={scrollContainerRef}>
                {messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-zinc-500 text-center px-4">
                        {generationStatus === "processing" ? processingLabel : "Loading messages..."}
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 pt-6 pb-10">
                        {messages.map((msg: any, idx: number) => (
                            <motion.div
                                key={msg._id ?? idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex w-full ${msg.direction === "inbound"
                                    ? "justify-end"
                                    : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`px-4 md:px-5 py-3 md:py-3.5 rounded-3xl max-w-[95%] md:max-w-[85%] lg:max-w-[80%] leading-relaxed wrap-break-word text-[15px] md:text-base ${msg.direction === "inbound"
                                        ? "bg-[#2f2f2f] text-zinc-100 rounded-br-sm"
                                        : "bg-transparent text-zinc-200"
                                        }`}
                                >
                                    <div
                                        className={`markdown-body ${msg.direction === "inbound"
                                            ? "text-zinc-100"
                                            : "text-zinc-200"
                                            } space-y-4`}
                                    >
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                ul: ({ node: _, ...props }) => (
                                                    <ul
                                                        className="list-disc ml-6 mt-2 space-y-1"
                                                        {...props}
                                                    />
                                                ),
                                                ol: ({ node: _, ...props }) => (
                                                    <ol
                                                        className="list-decimal ml-6 mt-2 space-y-1"
                                                        {...props}
                                                    />
                                                ),
                                                li: ({ node: _, ...props }) => (
                                                    <li
                                                        className="mb-1 marker:text-zinc-400"
                                                        {...props}
                                                    />
                                                ),
                                                a: ({ node: _, ...props }) => (
                                                    <a
                                                        className="text-blue-400 hover:underline"
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        {...props}
                                                    />
                                                ),
                                                p: ({ node: _, ...props }) => (
                                                    <p
                                                        className="leading-relaxed whitespace-pre-wrap"
                                                        {...props}
                                                    />
                                                ),
                                                strong: ({ node: _, ...props }) => (
                                                    <strong
                                                        className="font-semibold text-white"
                                                        {...props}
                                                    />
                                                ),
                                                code: ({ node: _, inline, ...props }: any) =>
                                                    inline ? (
                                                        <code
                                                            className="bg-zinc-700/50 px-1.5 py-0.5 rounded text-sm font-mono text-pink-300"
                                                            {...props}
                                                        />
                                                    ) : (
                                                        <pre className="bg-[#1e1e1e] p-4 rounded-xl overflow-x-auto text-sm font-mono text-zinc-300 mt-4 mb-4 border border-zinc-700/50 shadow-sm">
                                                            <code {...props} />
                                                        </pre>
                                                    ),
                                            }}
                                        >
                                            {msg.content?.text ?? ""}
                                        </ReactMarkdown>
                                        {msg.direction !== "inbound" && isGenerating && idx === messages.length - 1 && generationStatus === "streaming" ? (
                                            <span className="ml-1 inline-block align-middle animate-pulse text-zinc-100">|</span>
                                        ) : null}
                                    </div>

                                    {msg.direction !== "inbound" && !isGenerating && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleReadAloud(msg, idx)}
                                                className="text-md px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-200 hover:bg-zinc-800/70 transition-colors"
                                            >
                                                {speakingMessageId === getMessageId(msg, idx) ? <IoStopCircleOutline /> : <HiSpeakerWave />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    void handleCopy(msg);
                                                }}
                                                className="text-md px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-200 hover:bg-zinc-800/70 transition-colors"
                                            >
                                                <MdContentCopy />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        {generationStatus === "processing" && (
                            <div className="text-zinc-500 text-sm flex items-center gap-2 ml-4">
                                <span className="h-2 w-2 rounded-full bg-zinc-400 animate-pulse" />
                                <span>{processingLabel}</span>
                            </div>
                        )}

                        {isUploading && (
                            <div className="text-zinc-500 text-sm flex justify-end mr-4">
                                Uploading files...
                            </div>
                        )}

                        {/* {isGenerating && (
                            <div className="text-zinc-500 text-sm ml-4 flex gap-1 items-center">
                                <span className="animate-pulse">●</span>
                                <span
                                    className="animate-pulse"
                                    style={{ animationDelay: "150ms" }}
                                >
                                    ●
                                </span>
                                <span
                                    className="animate-pulse"
                                    style={{ animationDelay: "300ms" }}
                                >
                                    ●
                                </span>
                            </div>
                        )} */}

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </main>

            <div className="shrink-0 pt-2 w-full mt-auto">
                <div className="max-w-4xl mx-auto w-full px-4 md:px-0">
                    <GeminiInputBox
                        disabled={isGenerating}
                        models={models}
                        defaultModelId="mistral"
                        onSubmit={handleChatSubmit}
                    />
                </div>
            </div>
        </div>
    );
}