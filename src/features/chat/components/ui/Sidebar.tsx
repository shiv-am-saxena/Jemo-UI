import { cn } from "../../../../utils";
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TbMenu, TbX } from "react-icons/tb";
import { SidebarContext, useSidebar } from "../../hooks/useSidebar";
import { Link } from "react-router-dom";

interface Links {
    label: string;
    href: string;
    icon?: React.JSX.Element | React.ReactNode;
}

export const SidebarProvider = ({
    children,
    open: openProp,
    setOpen: setOpenProp,
    animate = true,
}: {
    children: React.ReactNode;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    animate?: boolean;
}) => {
    const [openState, setOpenState] = useState(false);

    const open = openProp !== undefined ? openProp : openState;
    const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

    return (
        <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const Sidebar = ({
    children,
    open,
    setOpen,
    animate,
}: {
    children: React.ReactNode;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    animate?: boolean;
}) => {
    return (
        <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
            {children}
        </SidebarProvider>
    );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
    return (
        <>
            <DesktopSidebar {...props} />
            <MobileSidebar {...(props as React.ComponentProps<"div">)} />
        </>
    );
};

export const DesktopSidebar = ({
    className,
    children,
    ...props
}: React.ComponentProps<typeof motion.div>) => {
    const { open, animate } = useSidebar();
    return (
        <>
            <motion.div
                className={cn(
                    "h-full px-4 py-4 hidden  md:flex md:flex-col bg-[#0e0e0e] w-75 shrink-0",
                    className
                )}
                animate={{
                    width: animate ? (open ? "250px" : "70px") : "250px",
                }}
                {...props}
            >
                {children}
            </motion.div>
        </>
    );
};

export const MobileSidebar = ({
    className,
    children,
    title = "Here goes the sample title",
    ...props
}: React.ComponentProps<"div">) => {
    const { open, setOpen } = useSidebar();
    return (
        <>
            <div
                className={cn(
                    "h-10 px-4 py-7 flex flex-row md:hidden items-center bg-[#0e0e0e] w-screen"
                )}
                {...props}
            >
                <div className="z-20 flex gap-5 pr-5">
                    <TbMenu
                        className="text-md text-neutral-200 cursor-pointer"
                        onClick={() => setOpen(!open)}
                        size={24}
                    />
                    <p className="max-w-70 sm:max-w-full overflow-hidden text-md text-ellipsis whitespace-nowrap text-white pr-10 truncate">
                        {title}
                    </p>
                </div>
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ x: "-100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "-100%", opacity: 0 }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                            }}
                            className={cn(
                                "fixed h-full w-full inset-0 bg-[#0e0e0e] p-10 z-100 flex flex-col justify-between",
                                className
                            )}
                        >
                            <div
                                className="absolute right-5 top-5 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                                onClick={() => setOpen(!open)}
                            >
                                <TbX size={24} />
                            </div>
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export const SidebarLink = ({
    link,
    className,
    ...props
}: {
    link: Links;
    className?: string;
}) => {
    const { open, setOpen, animate } = useSidebar();
    return (
        <Link
            to={link.href}
            className={cn(
                "flex items-center justify-start gap-2  group/sidebar py-2",
                className
            )}
            {...props}
            onClick={() => {
                    setOpen(!open);
                }
            }
        >
            {link.icon}

            <motion.span
                animate={{
                    display: animate ? (open ? "inline-block" : "none") : "inline-block",
                    opacity: animate ? (open ? 1 : 0) : 1,
                }}
                className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block p-0! m-0!"
            >
                {link.label}
            </motion.span>
        </Link>
    );
};