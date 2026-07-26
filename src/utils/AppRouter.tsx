import { Route, Routes } from "react-router-dom";
import App from "../App";
import Auth from "../features/auth/page/Auth";
import Register from "../features/auth/components/Register";
import Login from "../features/auth/components/Login";
import Callback from "../features/auth/page/Callback";
import { useAuth } from "../hooks/useAuth";
import Verification from "../features/auth/page/Verification";

function AppRouter() {
    const user = useAuth();
    console.log("AppRouter user:", user);
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/auth" element={<Auth />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="callback" element={<Callback />} />
            </Route>
            <Route path="/verify-email" element={<Verification />} />
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    )
}

export default AppRouter