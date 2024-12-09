const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./db");
const session = require("express-session");
const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs").promises;
const MongoStore = require("connect-mongo");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// Initialize express app
const app = express();

// Load environment variables
if (process.env.NODE_ENV !== "production") {
  const result = dotenv.config();
  if (result.error) {
    console.error("Error loading .env file:", result.error);
  }
}

// Add environment variable validation
const requiredEnvVars = [
  "MONGODB_URI",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
  }
});

const PUBLIC_URL = process.env.PUBLIC_URL || "https://welearn-api.vercel.app";

// ----------------MIDDLEWARE-----------------
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://welearngame.vercel.app",
    "http://localhost:5173",
    "https://res.cloudinary.com",
  ];
  const origin = req.headers.origin;

  // Special handling for Cloudinary requests
  if (req.url.includes("cloudinary.com")) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Vary", "Origin");
  } else if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Update CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://welearngame.vercel.app",
      "https://res.cloudinary.com",
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      origin.includes("localhost") ||
      origin.includes("cloudinary.com")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------MONGODB CONNECTION----------------
const startServer = async () => {
  try {
    // Initialize MongoDB connection
    await connectDB();
    console.log("MongoDB connection initialized");

    // Return the configured app
    return app;
  } catch (err) {
    console.error("Failed to initialize server:", err);
    // Don't exit the process in production
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
    return app; // Still return app, but in an error state
  }
};

// ----------------SESSION CONFIGURATION----------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 24 * 60 * 60, // Session TTL (1 day)
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);

  // Send a more graceful error response
  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "An error occurred, please try again later"
        : err.message,
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.stack,
  });
});

// ---------- IMPORT ROUTES ------------------
const registerRoutes = require("./API/registerRoutes");
const loginRoutes = require("./API/loginRoutes");
const userRoutes = require("./API/usersRoutes");
const adminRoutes = require("./API/adminsRoutes");
const quizRoutes = require("./API/quizRoutes");
const userProgressRoutes = require("./API/userProgressRoutes");
const analyticsRoutes = require("./API/analyticsRoute");
const rewardsRoutes = require("./API/rewardsRoutes");

// ---------- API ROUTING --------------------
app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/progress", userProgressRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/rewards", rewardsRoutes);

// ---------- LOGOUT ROUTE --------------------
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Update static files middleware
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://welearngame.vercel.app",
      ];
      res.set({
        "Access-Control-Allow-Origin": allowedOrigins[0],
        "Cross-Origin-Resource-Policy": "cross-origin",
        "Access-Control-Allow-Credentials": "true",
      });
    },
    fallthrough: true,
  })
);

// Add a fallback for default profile picture
app.get("/uploads/default-profile.png", (req, res) => {
  res.sendFile(path.join(__dirname, "uploads", "default-profile.png"));
});

// Fallback for uploads
app.use("/uploads", (req, res) => {
  res.status(404).json({ message: "File not found" });
});

// Basic route for health check
app.get("/", (req, res) => {
  res.send("API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production" ? "An error occurred" : err.message,
    error: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Catch-all route should be last

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// For serverless deployment
module.exports = startServer();

// Before setting up routes

// Add error handling for uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
});
