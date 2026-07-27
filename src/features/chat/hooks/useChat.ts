import { useEffect } from "react"
import initializeSocket from "../service/socket"
import { useAppSelector } from "../../../context/hooks"
import axiosInstance from "../../../utils/axiosConfig"


function useChat() {
    const { isAuthenticated } = useAppSelector((state) => state.auth)
    const fetchChats = async () => {
        const response = await axiosInstance.get(`/chats`);
        return await response.data;
    }
    const fetchMessages = async (chatId: string) => {
        const response = await axiosInstance.get(`/chats/${chatId}/messages`);
        return await response.data;
    }
    useEffect(() => {
        if (isAuthenticated) {
            initializeSocket()
        };
    }, [isAuthenticated])
    return { fetchChats, fetchMessages }
}

export default useChat