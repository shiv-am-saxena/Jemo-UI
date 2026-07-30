import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface IMessage {
	_id: string;
	chatId: string;
	content: {
		text: string;
		media?: string[];
    };
    direction: "inbound" | "outbound";
    aiModel: string;
    createdAt: string;
    updatedAt: string;
}

interface MessageState {
    chatId: string | null;
    messages: IMessage[] | null;
    loading: boolean;
    error: string | null;
}

const initialState: MessageState = {
    chatId: null,
    messages: null,
    loading: false,
    error: null,
};

const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setMessages(state, action: PayloadAction<{ messages: IMessage[] | null }>) {
            state.messages = action.payload.messages;
            state.loading = false;
            state.error = null;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        clearMessages(state) {
            state.messages = null;
            state.loading = false;
            state.error = null;
        },
        clearError(state) {
            state.error = null;
        },
        setChatId(state, action: PayloadAction<string | null>) {
            state.chatId = action.payload;
        },
        appendMessage(state, action: PayloadAction<IMessage>) {
            if (state.messages) {
                state.messages.push(action.payload);
            } else {
                state.messages = [action.payload];
            }
        }
    }
});

export const { setMessages, setLoading, setError, clearMessages, clearError, setChatId, appendMessage } = messageSlice.actions;
export default messageSlice.reducer;