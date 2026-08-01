/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAppDispatch, useAppSelector } from '../../../context/hooks';
import { Link, Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';
import { SidebarBody, SidebarProvider } from '../components/ui/Sidebar';
import { useEffect, useState } from 'react';
import { cn } from '../../../utils';
import { Logo, LogoIcon } from '../components/Logo';
import { RiChatNewLine } from 'react-icons/ri';
import { VscLibrary } from 'react-icons/vsc';
import { IoSearch } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import { motion } from 'motion/react';
import useAuth from '../../auth/hooks/useAuth';
import useChat from '../hooks/useChat';
import axiosInstance from '../../../utils/axiosConfig';
import { removeChat } from '../../../context/chatSlice';
import { clearMessages, setChatId as setMessageChatId } from '../../../context/messageSlice';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const links = [
    {
        label: "New Chat",
        href: "/chat",
        icon: (<RiChatNewLine color="white" />)
    },
    {
        label: "Search",
        href: "#",
        icon: (< IoSearch color="white" />)
    },
    {
        label: "Settings",
        href: "#",
        icon: (<VscLibrary color="white" />)
    }
];
function ChatWrapper() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const { handleLogout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
    const { chatId } = useParams<{ chatId: string }>();
    const { chats } = useAppSelector((state) => state.chats);
    const [chatTitle, setChatTitle] = useState<string>("");
    useChat();

    useEffect(() => {
        const currentChat = chats?.find((chat) => chat._id === chatId);

        setChatTitle(currentChat?.title ?? "");
    }, [chatId, chats]);

    const handleDeleteChat = async (targetChatId: string) => {
        const shouldDelete = window.confirm("Delete this chat and its messages?");

        if (!shouldDelete) return;

        try {
            await axiosInstance.delete(`/chats/${targetChatId}`);
            dispatch(removeChat(targetChatId));

            if (chatId === targetChatId) {
                dispatch(clearMessages());
                dispatch(setMessageChatId(null));
                setChatTitle("");
                navigate("/chat");
            }

            toast.success("Chat deleted.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete chat.");
        }
    };

    const renderMarkdownTitle = (title: string) => (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                p: ({ node: _, ...props }) => <span {...props} />,
                strong: ({ node: _, ...props }) => <strong className="font-semibold text-white" {...props} />,
                em: ({ node: _, ...props }) => <em className="italic text-inherit" {...props} />,
                a: ({ node: _, ...props }) => <a className="text-blue-400 underline" {...props} />,
            }}
        >
            {title}
        </ReactMarkdown>
    );

    if (!isAuthenticated) {
        return (
            <Navigate to="/auth/login" replace />
        );
    }

    return (
        <div className={cn("flex overflow-hidden bg-[#0e0e0e] flex-col md:flex-row h-screen")}>
            <SidebarProvider open={sidebarOpen} setOpen={setSidebarOpen}>
                <SidebarBody title={chatTitle || "Jemo"} className={`justify-between gap-10 pb-5 ${sidebarOpen ? "bg-neutral-800" : "bg-[#0e0e0e]"} border-r border-neutral-700`}>
                    <div className="flex flex-1 flex-col h-5/6">
                        {sidebarOpen
                            ? <Logo onClick={() => setSidebarOpen(!sidebarOpen)} />
                            : <LogoIcon onClick={() => setSidebarOpen(!sidebarOpen)} />
                        }
                        <div className="my-4 flex flex-col gap-1">
                            {links.map((link, idx) => (
                                sidebarOpen ?
                                    (<motion.a
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                                        key={idx}
                                        href={link.href}
                                        className="flex items-center gap-0 hover:bg-zinc-900 rounded-lg">
                                        <motion.div
                                            className="size-7 flex items-center justify-center text-white"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            {link.icon}
                                        </motion.div>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="font-medium whitespace-pre text-black dark:text-white"
                                        >
                                            {link.label}
                                        </motion.p>
                                    </motion.a>)
                                    :
                                    (<motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                                        key={idx}
                                    >
                                        <Link to={link.href} className="size-7 hover:bg-zinc-800 rounded-xl mx-auto flex items-center justify-center cursor-pointer">{link.icon}</Link>
                                    </motion.div>)
                            ))}
                        </div>
                        {sidebarOpen && (
                            <div className="flex flex-col gap-1 overflow-hidden">
                                <h3 className="text-sm text-zinc-400 font-semibold px-2">Recents</h3>
                                {chats?.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, x: 0 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 0 }}
                                        transition={{ duration: 0.2, delay: 0.1 }}
                                        className="text-zinc-400 text-sm px-2"
                                    >
                                        No recent chats
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col gap-1 overflow-y-auto h-full scrollbar-none">
                                        {chats?.map((chat, idx) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2, delay: idx * 0.05 }}
                                                key={chat._id}
                                                onClick={() => setChatTitle(chat.title)}
                                            >
                                                <div className={`group flex items-center gap-1 rounded-xl px-2 py-1 hover:bg-zinc-900 ${chatId === chat._id ? "bg-zinc-900" : "bg-transparent"}`}>
                                                    <Link
                                                        to={`/chat/${chat._id}`}
                                                        className={` flex-1 min-w-0 rounded-xl block`}
                                                    >
                                                        <div className="text-white truncate min-w-0">
                                                            {renderMarkdownTitle(chat.title)}
                                                        </div>
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                            void handleDeleteChat(chat._id);
                                                        }}
                                                        className="text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-full p-2"
                                                        aria-label={`Delete ${chat.title}`}
                                                    >
                                                        <RiDeleteBinLine size={14} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="relative w-fit">
                        {!sidebarOpen ?
                            <motion.div
                                className="size-9 mt-1 bg-zinc-800 border border-white rounded-full flex items-center justify-center text-white text-lg font-mono cursor-pointer"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <motion.div
                                    key="icon"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.15 }}
                                    className="flex items-center justify-center"
                                >
                                    {user?.name[0] || "U"}
                                </motion.div>
                            </motion.div>
                            :
                            <div
                                className="relative w-fit z-20 flex items-center gap-2 font-normal text-black cursor-pointer" onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <motion.div
                                    className="size-9 bg-zinc-800 border border-white rounded-full flex items-center justify-center text-white text-lg font-mono cursor-pointer"
                                >
                                    <motion.div
                                        key="text"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        {user?.name[0] || "U"}
                                    </motion.div>
                                </motion.div>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="font-medium whitespace-pre text-black dark:text-white"
                                >
                                    {user?.name || "User"}
                                </motion.p>
                            </div>
                        }
                        {
                            isProfileOpen && (
                                <div className="absolute left-0 bottom-full mb-2 w-40 bg-zinc-800 border border-white rounded-md shadow-lg z-10 transition-all duration-300 ease-in-out">
                                    <Link to="/profile" className="block px-4 py-2 text-white hover:bg-zinc-700">Profile</Link>
                                    <Link to="/settings" className="block px-4 py-2 text-white hover:bg-zinc-700">Settings</Link>
                                    <Link to="#" className="block px-4 py-2 text-white hover:bg-zinc-700" onClick={(() => { setIsProfileOpen(false); handleLogout() })}>
                                        Logout
                                    </Link>
                                </div>
                            )
                        }
                    </div>
                </SidebarBody>
            </SidebarProvider>
            <Dashboard />
        </div>
    );
}

export default ChatWrapper

const Dashboard = () => {
    return (
        // Changed to overflow-hidden and flex-col
        <div className="flex flex-col flex-1 h-full overflow-hidden">
            <div className="flex flex-col h-full w-full flex-1 gap-2 py-2 px-5 md:p-5 bg-[#0e0e0e] overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
};
