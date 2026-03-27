import axios from "axios";

// Environment Variables (Next.js)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const timeout = Number(process.env.NEXT_PUBLIC_TIMEOUT) || 10000;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

const authExcludedPaths = ["/api/admin/login"];

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {

    const isExcluded = authExcludedPaths.some((path) =>
      config.url?.includes(path)
    );

    if (!isExcluded) {

      // Next.js me localStorage check
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("tokenId");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

    }

    return config;
  },
  (error) => Promise.reject(error)
);