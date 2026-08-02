import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../context/hooks";
import { clearUser, setLoading, setToken, setUser } from "../../../context/userSlice";
import axiosInstance from "../../../utils/axiosConfig";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function useAuth() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleRegister = async (data: { name: string; email: string; password: string }) => {
		const response = await axiosInstance.post("/auth/register", data);
		return response.data.message;
	};

	const handleLogin = async (data: { email: string; password: string }) => {
		const response = await axiosInstance.post("/auth/login", data);
		return await response.data.data;
	};

	const handleLogout = useCallback(() => {
		localStorage.removeItem("token");
		dispatch(clearUser());
		navigate("/auth/login", { replace: true });
		return true;
	}, [dispatch, navigate]);

	// 1. Accept token as an argument so we don't rely on stale local variables
	const handleGetProfile = useCallback(
		async (tokenToUse?: string) => {
			// Use the passed token, OR grab the freshest one from local storage
			const currentToken = tokenToUse || localStorage.getItem("token");

			if (!currentToken || currentToken === "null" || currentToken === "undefined") {
				return null;
			}

			try {
				dispatch(setLoading());
				// 2. Pass token directly in headers to guarantee Axios uses the freshest one
				const response = await axiosInstance.get("/auth/me", {
					headers: {
						Authorization: `Bearer ${currentToken}`,
					},
				});

				const res = response.data.data;
				dispatch(setUser({ user: res, token: currentToken }));
			} catch (error) {
				if (error instanceof AxiosError) {
					console.error("Failed to fetch user profile:", error.response?.data.message || error.message);
					toast.error("Failed to fetch user profile. Please log in again.");
					handleLogout();
				}
			}
		},
		[dispatch, handleLogout],
	);

	const handleOAuthCallback = useCallback(() => {
		const token = new URLSearchParams(window.location.search).get("token");

		// 3. Fix logical operator (use || instead of &&)
		if (!token || token === "null" || token === "undefined") {
			toast.error("Invalid token received from OAuth callback.");
			navigate("/auth/login", { replace: true });
			return;
		}

		// 5. Actually save it to local storage so interceptors and refreshes work!
		localStorage.setItem("token", token);
		dispatch(setToken(token));

		// Optional: Clean up the URL bar so the token isn't visible to the user
		window.history.replaceState({}, document.title, window.location.pathname);

		// 6. Pass the fresh token directly to handleGetProfile
		handleGetProfile(token);
		navigate("/chat", { replace: true });
	}, [dispatch, handleGetProfile, navigate]);


	const { user } = useAppSelector((state) => state.auth);


	useEffect(() => {
		// Only run on initial mount if a token already exists
		const initialToken = localStorage.getItem("token");
		if (initialToken && initialToken !== "null" && initialToken !== "undefined") {
			if(user === null) {
				handleGetProfile(initialToken);
			}
		}
	}, [handleGetProfile, user]);

	return {
		handleRegister,
		handleLogin,
		handleLogout,
		handleGetProfile,
		handleOAuthCallback,
	};
}
