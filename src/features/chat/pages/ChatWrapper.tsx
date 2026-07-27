import { useAppSelector } from '../../../context/hooks';
import { Navigate, Outlet } from 'react-router-dom';
import { SidebarBody, SidebarLink, SidebarProvider } from '../components/ui/Sidebar';
import { useState } from 'react';
import { cn } from '../../../utils';
import { TextRoll } from '../../../components/ui/TextRoll';
import { AnimatePresence, motion } from 'motion/react';
import { TbLayoutSidebarRightCollapse, TbLayoutSidebarRightExpand } from 'react-icons/tb';
const links = [
    {
        label: "New Chat",
        href: "#",
    },
    {
        label: "Profile",
        href: "#",
    },
    {
        label: "Settings",
        href: "#",
    },
    {
        label: "Logout",
        href: "#",
    },
];
function ChatWrapper() {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    if (isAuthenticated) {
        return (
            <Navigate to="/auth/login" replace />
        );
    }
    return (
        <div
            className={cn(
                "flex overflow-hidden bg-[#0e0e0e] flex-col md:flex-row h-screen", // for your use case, use `h-screen` instead of `h-[60vh]`
            )}
        >
            <SidebarProvider open={sidebarOpen} setOpen={setSidebarOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        {sidebarOpen ? <Logo onClick={() => setSidebarOpen(!sidebarOpen)} /> : <LogoIcon onClick={() => setSidebarOpen(!sidebarOpen)} />}
                        {/* {sidebarOpen ? <div className="px-3 py-1 bg-zinc-800 border border-white rounded-xl text-center text-white text-lg font-mono">J</div> : <TextRoll center className="text-white uppercase text-lg md:text-2xl font-bold">
                            Jemo
                        </TextRoll>} */}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: "Manu Arora",
                                href: "#",
                                icon: (
                                    <img
                                        src="https://assets.aceternity.com/manu.png"
                                        className="h-7 w-7 shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ),
                            }}
                        />
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

            </div>
        </div>
    );
};

export const Logo = ({ onClick }: { onClick: () => void }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <a
            href="#"
            className="relative w-full z-20 flex items-center space-x-2 py-1 font-normal text-black"

            onClick={onClick}
        >
            <motion.div
                className="size-9 mt-1 bg-zinc-800 border border-white rounded-xl flex items-center justify-center text-white text-lg font-mono cursor-pointer"
                onClick={onClick}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <AnimatePresence mode="wait">
                    {isHovered ? (
                        <motion.div
                            key="icon"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center justify-center"
                        >
                            <TbLayoutSidebarRightExpand size={20} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="text"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                        >
                            J
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>                <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium whitespace-pre text-black dark:text-white"
            >
                <TextRoll center className="text-white uppercase text-lg md:text-2xl font-bold">
                    Jemo
                </TextRoll>
            </motion.span>
        </a>
    );
};
export const LogoIcon = ({ onClick }: { onClick: () => void }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="size-9 mt-1 bg-zinc-800 border border-white rounded-xl flex items-center justify-center text-white text-lg font-mono cursor-pointer"
            onClick={onClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <AnimatePresence mode="wait">
                {isHovered ? (
                    <motion.div
                        key="icon"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center justify-center"
                    >
                        <TbLayoutSidebarRightCollapse size={20} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="text"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                    >
                        J
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
