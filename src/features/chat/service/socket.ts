import { io } from "socket.io-client";

const initializeSocket = () => {
	const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
		withCredentials: true,
	});

	socket.on("connect", () => {
		console.log("Connected to the server");
	});

	socket.on("disconnect", () => {
		console.log("Disconnected from the server");
	});
};

export default initializeSocket;
