import { Route, Routes } from "react-router-dom";
import App from "../App";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<App/>} />
        </Routes>
    )
}

export default AppRouter