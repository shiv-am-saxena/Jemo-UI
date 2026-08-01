import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Chat {
	_id: string;
	userId: string;
	title: string;
	visibility: string;
	createdAt: string;
	updatedAt: string;
}

interface ChatState {
	chats: Chat[] | null;
	loading: boolean;
	error: string | null;
}

const initialState: ChatState = {
	chats: null,
	loading: false,
	error: null,
};

const chatSlice = createSlice({
	name: "chats",
	initialState,
	reducers: {
		setChats(state, action: PayloadAction<Chat[]>) {
			state.chats = action.payload;
			state.loading = false;
			state.error = null;
		},
		removeChat(state, action: PayloadAction<string>) {
			if (state.chats) {
				state.chats = state.chats.filter((chat) => chat._id !== action.payload);
			}
		},
		appendChat(state, action: PayloadAction<Chat>) {
			if (state.chats) {
				state.chats.push(action.payload);
			} else {
				state.chats = [action.payload];
			}
		},
		setLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
		setError(state, action: PayloadAction<string | null>) {
			state.error = action.payload;
		},
		clearChats(state) {
			state.chats = null;
			state.loading = false;
			state.error = null;
		},
		clearError(state) {
			state.error = null;
		},
	},
});

export const { setChats, removeChat, setLoading, setError, clearChats, clearError } = chatSlice.actions;
export default chatSlice.reducer;
