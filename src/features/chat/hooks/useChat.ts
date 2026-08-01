/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import initializeSocket from "../service/socket";
import { useAppDispatch, useAppSelector } from "../../../context/hooks";
import axiosInstance from "../../../utils/axiosConfig";
import { toast } from "sonner";
import { setChats } from "../../../context/chatSlice";
import { setChatId, setMessages as setMessageStore } from "../../../context/messageSlice";

const processingPhases = ["Assessing the user requirement", "Generating the response", "Validating the response"];

function useChat(initialChatId: string | null = null) {
	const dispatch = useAppDispatch();

	const { isAuthenticated } = useAppSelector((state) => state.auth);
	const { chats } = useAppSelector((state) => state.chats);

	// Socket instance (doesn't trigger renders)
	const socketRef = useRef<Socket | null>(null);

	const [activeChatId, setActiveChatId] = useState<string | null>(initialChatId);
	const [messages, setMessages] = useState<any[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [hasStreamStarted, setHasStreamStarted] = useState(false);
	const [processingPhaseIndex, setProcessingPhaseIndex] = useState(0);

	const currentStreamRef = useRef("");
	const hasStreamStartedRef = useRef(false);
	const pendingTokensRef = useRef<string[]>([]);
	const typingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const processingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const streamCompleteRef = useRef(false);

	const clearTypingTimer = useCallback(() => {
		if (typingTimerRef.current) {
			clearInterval(typingTimerRef.current);
			typingTimerRef.current = null;
		}
	}, []);

	const clearProcessingTimer = useCallback(() => {
		if (processingTimerRef.current) {
			clearInterval(processingTimerRef.current);
			processingTimerRef.current = null;
		}
	}, []);

	const syncMessagesToStore = useCallback(
		(nextMessages: any[]) => {
			dispatch(setMessageStore({ messages: nextMessages }));
		},
		[dispatch],
	);

	const resetStreamState = useCallback(() => {
		currentStreamRef.current = "";
		pendingTokensRef.current = [];
		streamCompleteRef.current = false;
		hasStreamStartedRef.current = false;
		setHasStreamStarted(false);
		setProcessingPhaseIndex(0);
		clearTypingTimer();
		clearProcessingTimer();
	}, [clearProcessingTimer, clearTypingTimer]);

	const finishStream = useCallback(() => {
		resetStreamState();
		setIsGenerating(false);
	}, [resetStreamState]);

	const tokenizeStreamChunk = useCallback((chunk: string) => {
		return chunk.match(/\S+\s*/g) ?? [chunk];
	}, []);

	const applyNextToken = useCallback(() => {
		const nextToken = pendingTokensRef.current.shift();

		if (!nextToken) {
			if (streamCompleteRef.current) {
				finishStream();
			}

			return;
		}

		currentStreamRef.current += nextToken;

		setMessages((prev) => {
			const lastIndex = prev.length - 1;

			if (lastIndex < 0) return prev;

			const last = prev[lastIndex];

			if (last.direction !== "outbound" && last.role !== "assistant") {
				return prev;
			}

			const updated = [...prev];
			updated[lastIndex] = {
				...last,
				content: {
					...last.content,
					text: currentStreamRef.current,
				},
			};

			syncMessagesToStore(updated);

			return updated;
		});
	}, [finishStream, syncMessagesToStore]);

	const startTypingStream = useCallback(() => {
		if (typingTimerRef.current) return;

		typingTimerRef.current = setInterval(() => {
			if (pendingTokensRef.current.length === 0) {
				if (streamCompleteRef.current) {
					finishStream();
				}

				return;
			}

			applyNextToken();
		}, 30);
	}, [applyNextToken, finishStream]);

	// -------------------------
	// Fetch Chats
	// -------------------------
	const fetchChats = useCallback(async () => {
		try {
			const response = await axiosInstance.get("/chats");
			dispatch(setChats(response.data.data));
		} catch (error) {
			console.error(error);
			toast.error("Failed to fetch chats.");
		}
	}, [dispatch]);

	// -------------------------
	// Fetch Messages
	// -------------------------
	const fetchMessages = useCallback(
		async (chatId: string) => {
			try {
				const response = await axiosInstance.get(`/chats/${chatId}/messages`);

				setMessages(response.data.data);
				syncMessagesToStore(response.data.data);
				setActiveChatId(chatId);
				dispatch(setChatId(chatId));

				return response.data.data;
			} catch (error) {
				console.error(error);
				toast.error("Failed to load chat history.");
				return [];
			}
		},
		[dispatch, syncMessagesToStore],
	);

	// -------------------------
	// Initialize Socket
	// -------------------------
	useEffect(() => {
		if (!isAuthenticated) {
			socketRef.current?.disconnect();
			socketRef.current = null;
			return;
		}

		if (!socketRef.current) {
			socketRef.current = initializeSocket();
		}
	}, [isAuthenticated]);

	// -------------------------
	// Initial Chat Fetch
	// -------------------------
	useEffect(() => {
		if (isAuthenticated && chats === null) {
			fetchChats();
		}
	}, [isAuthenticated, chats, fetchChats]);

	// -------------------------
	// Socket Listeners
	// -------------------------
	useEffect(() => {
		const socket = socketRef.current;

		if (!socket) return;

		if (activeChatId) {
			socket.emit("join_chat", activeChatId);
		}

		const handleStreamChunk = ({ chunk }: { chunk: string }) => {
			if (!hasStreamStartedRef.current) {
				hasStreamStartedRef.current = true;
				setHasStreamStarted(true);
				clearProcessingTimer();
			}

			pendingTokensRef.current.push(...tokenizeStreamChunk(chunk));
			startTypingStream();
		};

		const handleStreamComplete = () => {
			streamCompleteRef.current = true;
			if (pendingTokensRef.current.length === 0) {
				finishStream();
			}
		};

		const handleStreamError = ({ error }: { error: string }) => {
			resetStreamState();
			setIsGenerating(false);
			toast.error(error || "Generation failed.");
		};

		socket.on("stream_chunk", handleStreamChunk);
		socket.on("stream_complete", handleStreamComplete);
		socket.on("stream_error", handleStreamError);

		return () => {
			socket.off("stream_chunk", handleStreamChunk);
			socket.off("stream_complete", handleStreamComplete);
			socket.off("stream_error", handleStreamError);
			clearTypingTimer();
			clearProcessingTimer();

			if (activeChatId) {
				socket.emit("leave_chat", activeChatId);
			}
		};
	}, [activeChatId, clearProcessingTimer, clearTypingTimer, finishStream, resetStreamState, startTypingStream, tokenizeStreamChunk]);

	useEffect(() => {
		if (!isGenerating || hasStreamStarted) {
			clearProcessingTimer();
			return;
		}

		processingTimerRef.current = setInterval(() => {
			setProcessingPhaseIndex((index) => (index + 1) % processingPhases.length);
		}, 1400);

		return () => {
			clearProcessingTimer();
		};
	}, [clearProcessingTimer, hasStreamStarted, isGenerating]);

	// -------------------------
	// Upload File
	// -------------------------
	const uploadFile = async (file: File) => {
		setIsUploading(true);

		try {
			const formData = new FormData();
			formData.append("file", file);

			const response = await axiosInstance.post("/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			return response.data.data;
		} catch (error) {
			console.error(error);
			toast.error("Failed to upload file.");
			return null;
		} finally {
			setIsUploading(false);
		}
	};

	// -------------------------
	// Send Message
	// -------------------------
	const sendMessage = async (prompt: string, attachedFiles: any[] = [], selectedModel = "mistral") => {
		if (!prompt.trim() && attachedFiles.length === 0) return;

		const socket = socketRef.current;

		if (!socket) {
			toast.error("Socket not connected.");
			return;
		}

		resetStreamState();
		setIsGenerating(true);
		const now = new Date().toISOString();

		setMessages((prev) => {
			const nextMessages = [
				...prev,
				{
					direction: "inbound",
					role: "user",
					createdAt: now,
					content: {
						text: prompt,
						media: attachedFiles,
					},
				},
				{
					direction: "outbound",
					role: "assistant",
					createdAt: now,
					content: {
						text: "",
					},
				},
			];

			syncMessagesToStore(nextMessages);

			return nextMessages;
		});

		let currentChatId = activeChatId;

		try {
			if (!currentChatId) {
				const response = await axiosInstance.post("/chats/new", {
					message: prompt,
				});

				currentChatId = response.data.data.chatId;

				setActiveChatId(currentChatId);
				dispatch(setChatId(currentChatId));

				await fetchChats();

				socket.emit("join_chat", currentChatId);
			}

			socket.emit("generate_ai_response", {
				chatId: currentChatId,
				prompt,
				files: attachedFiles,
				model: selectedModel,
				webSearchEnabled: false,
			});
		} catch (error) {
			console.error(error);
			toast.error("Failed to send message.");
			finishStream();
		}
	};

	const generationStatus = isGenerating ? (hasStreamStarted ? "streaming" : "processing") : "idle";
	const processingLabel = processingPhases[processingPhaseIndex] ?? processingPhases[0];

	return {
		activeChatId,
		messages,
		isGenerating,
		isUploading,
		generationStatus,
		processingLabel,
		fetchMessages,
		uploadFile,
		sendMessage,
	};
}

export default useChat;
