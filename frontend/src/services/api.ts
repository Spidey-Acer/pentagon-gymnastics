import axios from "axios";

// Use environment variable for API URL, fallback to proxy in development
const baseURL = import.meta.env.VITE_API_URL || "/api";

console.log("API Base URL:", baseURL); // Debug logging
console.log("Environment:", import.meta.env.MODE); // Debug logging

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
    console.error("API Error Details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      baseURL: error.config?.baseURL,
      url: error.config?.url,
      fullURL: `${error.config?.baseURL}${error.config?.url}`
    });
    
    // Handle token expiration or unauthorized access
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // Redirect to login
    }
    
    return Promise.reject(error);
  }
);

export default api;
