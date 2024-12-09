import axios from "axios";

const isDevelopment = import.meta.env.MODE === "development";
const baseURL = isDevelopment
  ? "http://localhost:5000"
  : "https://welearn-api.vercel.app";

console.log("Current environment:", import.meta.env.MODE);
console.log("Using baseURL:", baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Add error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      console.error("Resource not found:", error.config.url);
    } else if (error.code === "ERR_NETWORK") {
      console.error("Network error - API might be down");
    }
    return Promise.reject(error);
  }
);

export default api;
