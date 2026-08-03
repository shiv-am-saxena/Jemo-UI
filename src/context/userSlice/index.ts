import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
	name: string;
	email: string;
	isVerified: boolean;
	token: string;
}

type initialStateType = {
	user: UserState | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	token: string | null;
};

const initialState: initialStateType = {
	user: {
		name: "",
		email: "",
		isVerified: false,
		token: "",
	},
	isAuthenticated: false,
	isLoading: false,
	token: "",
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<{user: UserState, token: string}>) => {
			state.user = action.payload.user;
			state.isAuthenticated = true;
            state.token = action.payload.token;
            state.isLoading = false;
		},
		clearUser: (state) => {
			state.user = null;
			state.isAuthenticated = false;
			state.token = "";
		},
		setToken: (state, action: PayloadAction<string>) => {
			state.token = action.payload;
		},
        setLoading: (state) => {
			state.isLoading = true;
		},
	},
});
export default userSlice.reducer;
export const { setUser, clearUser, setLoading, setToken } = userSlice.actions;
