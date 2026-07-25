import React, { useState, useRef, useEffect, type DragEvent, type ChangeEvent } from 'react';
import { FiPlus, FiSend, FiX, FiFile, FiImage } from 'react-icons/fi';

const GeminiInputBox: React.FC = () => {
    const [text, setText] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-resize the textarea based on content
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [text]);

    // --- Drag and Drop Handlers ---
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        // Only set dragging to false if we leave the actual container
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
        // Reset input so the same file can be selected again if removed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFiles = (newFiles: File[]) => {
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const removeFile = (indexToRemove: number) => {
        setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = () => {
        if (!text.trim() && files.length === 0) return;

        console.log("Submitting:", { text, files });

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

    return (
        <div className="w-full max-w-3xl mx-auto p-4 font-sans">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex flex-col rounded-4xl bg-zinc-100 dark:bg-[#1e1e20] transition-colors duration-200 border-2 ${isDragging
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
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
                    <div className="flex flex-wrap gap-3 px-4 pt-4 pb-2">
                        {files.map((file, index) => {
                            const isImage = file.type.startsWith('image/');
                            return (
                                <div
                                    key={index}
                                    className="group relative flex items-center gap-2 bg-white dark:bg-zinc-800 p-2 pr-8 rounded-xl border border-zinc-200 dark:border-zinc-700 max-w-50"
                                >
                                    <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900">
                                        {isImage ? (
                                            <FiImage className="w-4 h-4 text-zinc-500" />
                                        ) : (
                                            <FiFile className="w-4 h-4 text-zinc-500" />
                                        )}
                                    </div>
                                    <span className="text-sm truncate text-zinc-700 dark:text-zinc-300">
                                        {file.name}
                                    </span>

                                    <button
                                        onClick={() => removeFile(index)}
                                        className="absolute right-2 p-1 rounded-full bg-zinc-200/80 dark:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-300 dark:hover:bg-zinc-600"
                                    >
                                        <FiX className="w-3 h-3 text-zinc-700 dark:text-zinc-300" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Input Area */}
                <div className="flex items-end gap-2 p-2">
                    {/* Add File Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="shrink-0 p-3 rounded-full text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-300 transition-colors"
                        title="Upload file"
                    >
                        <FiPlus className="w-5 h-5" />
                    </button>

                    {/* Auto-resizing Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything..."
                        className="flex-1 max-h-50 bg-transparent py-3 px-2 text-zinc-800 dark:text-zinc-100 placeholder-zinc-500 outline-none resize-none overflow-y-auto"
                        rows={1}
                    />

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!text.trim() && files.length === 0}
                        className={`shrink-0 p-3 rounded-full transition-colors ${text.trim() || files.length > 0
                                ? 'text-zinc-800 bg-zinc-200 hover:bg-zinc-300 dark:text-zinc-100 dark:bg-zinc-700 dark:hover:bg-zinc-600'
                                : 'text-zinc-400 bg-transparent cursor-not-allowed dark:text-zinc-600'
                            }`}
                    >
                        <FiSend className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Footer Text (Optional) */}
            <div className="text-center text-xs text-zinc-500 mt-2">
                Jemo AI may display inaccurate info, including about people, so double-check its responses.
            </div>
        </div>
    );
};

export default GeminiInputBox;