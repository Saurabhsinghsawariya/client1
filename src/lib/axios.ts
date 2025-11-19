import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://server-1s0l.onrender.com",
  withCredentials: true, // CRITICAL: Allows sending cookies to the backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;