import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../context/hooks"; // Adjust path

function Callback() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        // Once useAuth (running in AppRouter) finishes fetching the user, redirect them
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="flex h-screen items-center justify-center">
            <h1 className="text-xl animate-pulse">Completing authentication...</h1>
        </div>
    );
}

export default Callback;