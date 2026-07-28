import { useAppSelector } from '../../../context/hooks';
import { Navigate, Outlet } from 'react-router-dom';
import { SidebarBody, SidebarLink, SidebarProvider } from '../components/ui/Sidebar';
import { useState } from 'react';
import { cn } from '../../../utils';
import { Logo, LogoIcon } from '../components/Logo';
import { TbEdit } from 'react-icons/tb';
import { VscLibrary } from 'react-icons/vsc';
import { CiSearch } from 'react-icons/ci';
import { motion } from 'motion/react';

const links = [
    {
        label: "New Chat",
        href: "/",
        icon: (<TbEdit size={20} color="white" />)
    },
    {
        label: "Search",
        href: "#",
        icon: (< CiSearch size={20} color="white" />)
    },
    {
        label: "Settings",
        href: "#",
        icon: (<VscLibrary size={20} color="white" />)
    }
];
function ChatWrapper() {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    if (!isAuthenticated) {
        return (
            <Navigate to="/auth/login" replace />
        );
    }
    return (
        <div
            className={cn(
                "flex overflow-hidden bg-[#0e0e0e] flex-col md:flex-row h-screen",
            )}
        >
            <SidebarProvider open={sidebarOpen} setOpen={setSidebarOpen}>
                <SidebarBody className="justify-between gap-10 pb-5">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        {sidebarOpen ? <Logo onClick={() => setSidebarOpen(!sidebarOpen)} /> : <LogoIcon onClick={() => setSidebarOpen(!sidebarOpen)} />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div className="relative w-full">
                        {!sidebarOpen ?
                            <motion.div
                                className="size-9 mt-1 bg-zinc-800 border border-white rounded-full flex items-center justify-center text-white text-lg font-mono cursor-pointer"
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
                                className="relative w-fit z-20 flex items-center gap-2 font-normal text-black"
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
                    </div>
                </SidebarBody>
            </SidebarProvider>
            <Dashboard />
        </div>
    );
}

export default ChatWrapper


export const Dashboard = () => {
    return (
        <div className="flex flex-1">
            <div className="flex h-full w-full flex-1 flex-col gap-2 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
                <Outlet />
            </div>
        </div>
    );
};
