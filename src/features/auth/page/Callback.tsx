import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

function Callback() {
    const { handleOAuthCallback } = useAuth();
    useEffect(() => {
        handleOAuthCallback();
    }, [handleOAuthCallback]);

    return (
        <div className="flex h-screen items-center justify-center">
            <h1 className="text-xl animate-pulse">Completing authentication...</h1>
        </div>
    );
}

export default Callback;