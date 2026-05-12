import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const timeout = Number(process.env.NEXT_PUBLIC_TIMEOUT) || 10000;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout,
});

// 🔥 IMPORTANT FIX
axiosInstance.interceptors.request.use(
  (config) => {

    if (typeof window !== "undefined") {

      // ✅ try both keys (safe)
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("tokenId");

  

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);