import axios from "axios";

// Use environment variable for API URL, fallback to proxy in development
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
