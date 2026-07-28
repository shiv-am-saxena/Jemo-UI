import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TbLayoutSidebarRightCollapse, TbLayoutSidebarRightExpand } from "react-icons/tb";
import { TextRoll } from "../../../components/ui/TextRoll";

export const Logo = ({ onClick }: { onClick: () => void }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div
            className="relative w-fit z-20 flex items-center space-x-2 py-1 font-normal text-black"

            onClick={onClick}
        >
            <motion.div
                className="size-9 bg-zinc-800 border border-white rounded-xl flex items-center justify-center text-white text-lg font-mono cursor-pointer"
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
            </motion.div>
            <motion.a
                href="/"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium whitespace-pre text-black dark:text-white"
            >
                <TextRoll center className="text-white uppercase text-lg md:text-2xl font-bold">
                    Jemo
                </TextRoll>
            </motion.a>
        </div>
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
