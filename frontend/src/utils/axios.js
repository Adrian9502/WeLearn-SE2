import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://welearn-api.vercel.app" // Production URL
    : "", // Empty for development (will use Vite proxy)
  withCredentials: true,
});

export default api;
