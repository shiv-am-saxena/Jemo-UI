import { Route, Routes } from "react-router-dom";
import App from "../App";
import Auth from "../features/auth/page/Auth";
import Register from "../features/auth/components/Register";
import Login from "../features/auth/components/Login";
import Callback from "../features/auth/page/Callback";
import useAuth from "../features/auth/hooks/useAuth";
import Verification from "../features/auth/page/Verification";
import ChatWrapper from "../features/chat/pages/ChatWrapper";
import NewChat from "../features/chat/pages/NewChat";
import ExistingChat from "../features/chat/pages/ExistingChat";
function AppRouter() {
    useAuth();
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/auth" element={<Auth />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="callback" element={<Callback />} />
            </Route>
            <Route path="/verify-email" element={<Verification />} />
            <Route element={<ChatWrapper />} >
                <Route path="/chat">
                    <Route path="" element={<NewChat />} />
                    <Route path=":chatId" element={<ExistingChat />} />
                </Route>
            </Route>
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    )
}

export default AppRouter