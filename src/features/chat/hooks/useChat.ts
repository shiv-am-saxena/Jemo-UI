import { useCallback, useEffect } from "react"
import initializeSocket from "../service/socket"
import { useAppDispatch, useAppSelector } from "../../../context/hooks"
import axiosInstance from "../../../utils/axiosConfig"
import { toast } from "sonner"
import { setChats } from "../../../context/chatSlice"


function useChat() {
    const dispatch = useAppDispatch()
    const { isAuthenticated } = useAppSelector((state) => state.auth)
    const {chats} = useAppSelector((state) => state.chats)
    const fetchChats = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/chats`);
            const res = await response.data.data;
            console.log(res)
            dispatch(setChats(res));
        }
        catch (error) {
            console.error("Error fetching chats:", error);
            toast.error("Failed to fetch chats. Please try again later.");
        }
    }, [dispatch]);
    const fetchMessages = async (chatId: string) => {
        const response = await axiosInstance.get(`/chats/${chatId}/messages`);
        return await response.data.data;
    }
    useEffect(() => {
        if (isAuthenticated) {
            initializeSocket()
        };
        if(isAuthenticated && chats===null) {
            fetchChats();
        }
    }, [isAuthenticated, chats, fetchChats]);

    
    return { fetchMessages }
}

export default useChat