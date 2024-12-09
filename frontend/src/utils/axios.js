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
  timeout: 30000, // Increase timeout to 30 seconds for all requests
});

// Add a custom instance for file uploads with longer timeout
const uploadApi = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 60000, // 60 seconds timeout for uploads
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    // Ensure credentials are sent for your API routes
    if (
      config.url?.includes("/api/users/") &&
      (config.method === "get" || config.method === "put")
    ) {
      config.withCredentials = true;
    }

    // Don't send credentials for external URLs
    if (
      config.url?.startsWith("http://") ||
      (config.url?.startsWith("https://") && !config.url.includes(baseURL))
    ) {
      config.withCredentials = false;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error("Network Error - Is the backend server running?");
      console.error("Backend should be running at:", baseURL);
    }
    console.error("Response Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return Promise.reject(error);
  }
);

// Add a request interceptor to handle URLs
api.interceptors.request.use(
  (config) => {
    // Don't send credentials for external URLs (like Cloudinary)
    if (config.url?.startsWith("http") || config.url?.includes("cloudinary")) {
      config.withCredentials = false;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle image responses
api.interceptors.response.use(
  (response) => {
    // If the response is an image URL, return it directly
    if (response.data && response.data.profilePicture) {
      return response;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 404) {
      return {
        data: {
          profilePicture:
            "https://cdn-icons-png.freepik.com/512/6858/6858441.png",
        },
      };
    }
    return Promise.reject(error);
  }
);

export { api as default, uploadApi };
