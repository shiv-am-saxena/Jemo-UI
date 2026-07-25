import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../context/hooks";
import { clearUser } from "../context/userSlice";
import { TextRoll } from "./ui/TextRoll";

function Navbar() {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = React.useState(false);
    const { isAuthenticated, user } = useAppSelector(state => state.auth);
    const location = useNavigate();
    const handleLogout = () => {
        //TODO: Implement logout logic here
        dispatch(clearUser());
        location("/");
        setIsOpen(false);
    };
    return (
        <header className="bg-[#0e0e0e] px-2 py-4 md:px-4">
            <nav className="container mx-auto flex items-center justify-between">
                <div className="flex gap-2 md:gap-6 items-center justify-between">
                    <div className="px-3 py-1 bg-zinc-800 border border-white rounded-xl text-center text-white text-lg font-mono">J</div>
                    <TextRoll center className="text-white uppercase text-lg md:text-2xl font-bold">
                        Jemo
                    </TextRoll>
                </div>
                <div className="relative">
                    {isAuthenticated ? (
                        <div className="flex pr-4 gap-3 items-center rounded-3xl space-y-4 border border-white bg-zinc-800 text-white realtive" onClick={() => setIsOpen(!isOpen)}>
                            <span className="size-10 flex items-center justify-center rounded-full border border-white">{user?.name[0] || "U"}</span>{" "}{user?.name || "User"}
                        </div>
                    ) : (
                        <Link to="/login" className="px-3 py-1.5 border border-white rounded-md text-white hover:bg-zinc-700 transition-colors">Sign In</Link>
                    )}
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-zinc-800 border border-white rounded-md shadow-lg z-10 transition-all duration-300 ease-in-out">
                            <Link to="/profile" className="block px-4 py-2 text-white hover:bg-zinc-700">Profile</Link>
                            <Link to="/settings" className="block px-4 py-2 text-white hover:bg-zinc-700">Settings</Link>
                            <Link to="#" className="block px-4 py-2 text-white hover:bg-zinc-700" onClick={handleLogout}>
                                Logout
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar