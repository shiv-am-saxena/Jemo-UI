import { Route, Routes } from "react-router-dom";
import App from "../App";
import Auth from "../features/auth/page/Auth";
import Register from "../features/auth/components/Register";
import Login from "../features/auth/components/Login";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/auth" element={<Auth />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    )
}

export default AppRouter