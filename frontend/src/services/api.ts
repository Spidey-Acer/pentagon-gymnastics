import axios from "axios";

// Use environment variable for API URL, fallback to proxy in development
const baseURL = import.meta.env.VITE_API_URL || "/api";

console.log("API Base URL:", baseURL); // Debug logging

const api = axios.create({
  baseURL,
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log("API Request:", config.method?.toUpperCase(), config.url); // Debug logging
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url); // Debug logging
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
