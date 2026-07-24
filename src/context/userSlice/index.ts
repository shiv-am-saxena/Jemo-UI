import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
	name: string;
	email: string;
	verified: boolean;
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
		verified: false,
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
		setUser: (state, action: PayloadAction<UserState>) => {
			state.user = action.payload;
			state.isAuthenticated = true;
            state.token = action.payload.token;
            state.isLoading = false;
		},
		clearUser: (state) => {
			state.user = null;
			state.isAuthenticated = false;
			state.token = "";
        },
        setLoading: (state) => {
			state.isLoading = true;
		},
	},
});
export default userSlice.reducer;
export const { setUser, clearUser, setLoading } = userSlice.actions;
