import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../context/hooks";
import { clearUser, setLoading, setToken, setUser } from "../context/userSlice";
import axiosInstance from "../utils/axiosConfig";

export const useAuth = () => {
	const dispatch = useAppDispatch();
	const { isAuthenticated, token, user } = useAppSelector((state) => state.auth);

	useEffect(() => {
		const initializeAuth = async () => {
			let currentToken = token;

			// 1. CHECK THE URL FIRST (Solves the OAuth Race Condition)
			const urlParams = new URLSearchParams(window.location.search);
			const urlToken = urlParams.get("token");

			if (urlToken && urlToken !== "null" && urlToken !== "undefined") {
				currentToken = urlToken;

				// Immediately save to localStorage and Redux
				localStorage.setItem("token", urlToken);
				dispatch(setToken(urlToken));
				// Optional but recommended: Remove the token from the browser's URL bar for cleanliness
				window.history.replaceState({}, document.title, window.location.pathname);
			}
			// 2. Fallback to localStorage if not in URL
			else if (!currentToken) {
				const localToken = localStorage.getItem("token");
				if (localToken && localToken !== "null" && localToken !== "undefined") {
					currentToken = localToken;
					dispatch(setToken(localToken));
				}
			}

			// 3. Fetch the user profile
			if (currentToken && !isAuthenticated) {
				dispatch(setLoading());
				try {
					// Explicitly pass the token in headers to bypass any Axios interceptor timing issues
					const response = await axiosInstance.get("/auth/me", {
						headers: {
							Authorization: `Bearer ${currentToken}`,
						},
					});

					const res = response.data.data;
					dispatch(setUser({ user: res, token: currentToken }));
				} catch (error) {
					console.error("Failed to fetch user profile:", error);
					localStorage.removeItem("token"); // Wipe invalid token
					dispatch(clearUser());
				}
			}
		};

		initializeAuth();
	}, [dispatch, token, isAuthenticated]);

	return user;
};