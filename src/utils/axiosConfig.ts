import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.env.API || "http://localhost:3000", // Replace with your backend API URL
	headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    // withCredentials: true,
});

export default axiosInstance;