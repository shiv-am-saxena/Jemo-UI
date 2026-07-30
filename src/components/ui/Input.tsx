/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect, type DragEvent, type ChangeEvent } from 'react';
import { FiPlus, FiSend, FiX, FiFile, FiImage, FiMic, FiChevronDown, FiCheck } from 'react-icons/fi';

// --- Types ---
export interface AIModel {
    id: string;
    name: string;
    description?: string;
}

export interface GeminiInputBoxProps {
    models?: AIModel[];
    defaultModelId?: string;
    onSubmit?: (data: { text: string; files: File[]; modelId?: string }) => void;
    onMicrophoneClick?: () => void;
}

const GeminiInputBox: React.FC<GeminiInputBoxProps> = ({
    models = [],
    defaultModelId,
    onSubmit,
    onMicrophoneClick
}) => {
    // --- State ---
    const [text, setText] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    // Model Selection State
    const [selectedModelId, setSelectedModelId] = useState<string | undefined>(
        defaultModelId || (models.length > 0 ? models[0].id : undefined)
    );
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

    // Microphone State
    const [isListening, setIsListening] = useState(false);

    // --- Refs ---
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null); // To store the speech recognition instance

    // Auto-resize the textarea based on content
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [text]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsModelDropdownOpen(false);
            }
        };
        if (isModelDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModelDropdownOpen]);

    // Cleanup speech recognition on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    // --- Drag and Drop Handlers ---
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    // --- File Management ---
    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(Array.from(e.target.files));
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFiles = (newFiles: File[]) => {
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const removeFile = (indexToRemove: number) => {
        setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    // --- Submissions & Actions ---
    const handleSubmit = () => {
        if (!text.trim() && files.length === 0) return;

        const payload = {
            text,
            files,
            modelId: selectedModelId
        };

        if (onSubmit) {
            onSubmit(payload);
        } else {
            console.log("Submitting:", payload);
        }

        // Reset state after submit
        setText('');
        setFiles([]);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // --- Speech to Text ---
    const handleMicToggle = () => {
        if (onMicrophoneClick) {
            onMicrophoneClick();
            return;
        }

        // Stop listening manually if it's currently active
        if (isListening) {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            setIsListening(false);
            return;
        }

        // @ts-expect-error - Vendor prefixes for browser compatibility
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        // Capture existing text to avoid interim overwrites
        const existingText = text;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const transcript = event.results[current][0].transcript;

            // Append the transcript to whatever text already existed
            setText(existingText ? `${existingText} ${transcript}` : transcript);
        };

        recognition.onerror = (event: any) => {
            console.error(event.error);
            setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    // Find the currently selected model object
    const selectedModel = models.find(m => m.id === selectedModelId);

    const hasContent = text.trim().length > 0 || files.length > 0;

    return (
        <div className="w-full max-w-3xl mx-auto p-4 font-sans">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex flex-col rounded-4xl bg-[#1e1e20] transition-colors duration-200 border-2 ${isDragging
                    ? 'border-blue-500/50 bg-[#252528]'
                    : 'border-transparent'
                    }`}
            >
                {/* Hidden File Input */}
                <input
                    type="file"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                />

                {/* File Previews Area */}
                {files.length > 0 && (
                    <div className="flex flex-wrap gap-3 px-6 pt-4 pb-1">
                        {files.map((file, index) => {
                            const isImage = file.type.startsWith('image/');
                            return (
                                <div
                                    key={index}
                                    className="group relative flex items-center gap-2 bg-[#2a2a2c] p-2 pr-8 rounded-xl border border-zinc-700 max-w-50"
                                >
                                    <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800">
                                        {isImage ? (
                                            <FiImage className="w-4 h-4 text-zinc-400" />
                                        ) : (
                                            <FiFile className="w-4 h-4 text-zinc-400" />
                                        )}
                                    </div>
                                    <span className="text-sm truncate text-zinc-300">
                                        {file.name}
                                    </span>

                                    <button
                                        onClick={() => removeFile(index)}
                                        className="absolute right-2 p-1 rounded-full bg-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-500"
                                    >
                                        <FiX className="w-3 h-3 text-zinc-200" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Input Area */}
                <div className="flex items-end gap-3 px-4 py-3 min-h-15">
                    {/* Add File Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="shrink-0 p-2 my-auto rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 transition-colors"
                        title="Upload file"
                    >
                        <FiPlus className="w-6 h-6" strokeWidth={1.5} />
                    </button>

                    {/* Auto-resizing Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask..."
                        className="flex-1 max-h-50 bg-transparent py-2.5 text-zinc-100 placeholder-zinc-400 text-lg outline-none resize-none overflow-y-auto self-center"
                        rows={1}
                    />

                    {/* Right Side Controls */}
                    <div className="flex items-center gap-1 shrink-0 mb-0.5 self-center">
                        {/* Inline Model Selector Dropdown */}
                        {models.length > 0 && (
                            <div className="relative flex items-center mr-2" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[15px] font-normal text-zinc-300 hover:bg-zinc-700/50 transition-colors"
                                >
                                    {selectedModel?.name || "Pro"}
                                    <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isModelDropdownOpen && (
                                    <div className="absolute bottom-full right-0 mb-3 w-56 bg-[#2a2a2c] border border-zinc-700 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden">
                                        {models.map((model) => (
                                            <button
                                                key={model.id}
                                                onClick={() => {
                                                    setSelectedModelId(model.id);
                                                    setIsModelDropdownOpen(false);
                                                }}
                                                className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-zinc-700/80 transition-colors"
                                            >
                                                <div className="flex flex-col">
                                                    <span className={`text-sm ${selectedModelId === model.id ? 'font-medium text-white' : 'text-zinc-300'}`}>
                                                        {model.name}
                                                    </span>
                                                    {model.description && (
                                                        <span className="text-xs text-zinc-400 mt-0.5">
                                                            {model.description}
                                                        </span>
                                                    )}
                                                </div>
                                                {selectedModelId === model.id && (
                                                    <FiCheck className="w-4 h-4 text-white shrink-0" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Microphone Button (Visible when empty or listening) */}
                        {(!hasContent || isListening) && (
                            <button
                                onClick={handleMicToggle}
                                className={`p-2.5 rounded-full transition-colors ${isListening
                                    ? 'text-red-400 bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50'
                                    }`}
                                title={isListening ? "Stop listening" : "Use microphone"}
                            >
                                <FiMic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} strokeWidth={1.5} />
                            </button>
                        )}

                        {/* Submit Button (Visible when typing/files added AND not listening) */}
                        {(hasContent && !isListening) && (
                            <button
                                onClick={handleSubmit}
                                className="p-2.5 rounded-full transition-colors text-black bg-white hover:bg-zinc-200"
                            >
                                <FiSend className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Text */}
            <div className="text-center text-xs text-zinc-500 mt-3">
                Jemo AI may display inaccurate info, including about people, so double-check its responses.
            </div>
        </div>
    );
};

export default GeminiInputBox;