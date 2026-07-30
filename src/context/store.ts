/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import chatSlice from "./chatSlice";
import messageReducer from "./messageSlice";
const safeStorage = (storage as any).default || storage;

const userConfig = {
	key: "user",
	storage: safeStorage,
};

const userReducer = persistReducer(userConfig, userSlice);

const chatConfig = {
	key: "chat",
	storage: safeStorage,
};
const chatReducer = persistReducer(chatConfig, chatSlice);

const store = configureStore({
	reducer: {
		auth: userReducer,
		chats: chatReducer,
		messages: messageReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
export const persistor = persistStore(store);