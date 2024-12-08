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

dotenv.config();

const PUBLIC_URL = process.env.PUBLIC_URL || "https://welearn-api.vercel.app";

// ----------------MODEL----------------------
// USER MODEL
const userModel = require("./models/userModel");
// ADMIN MODEL
const adminModel = require("./models/adminModel");
// --------------------------------------------

// ----------------MIDDLEWARE-----------------
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://welearngame.vercel.app",
    "http://localhost:5173",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
app.use(
  cors({
    origin: ["https://welearngame.vercel.app", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
  })
);
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
app.options("*", cors());

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
// for default profile picture
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.set({
        "Access-Control-Allow-Origin": "*",
        "Cross-Origin-Resource-Policy": "cross-origin",
      });
    },
    fallthrough: true, // Allow falling through if file not found
  })
);
// Add a fallback route for uploads in production
app.use("/uploads", (req, res) => {
  res.status(404).json({ message: "File not found" });
});
// ---------- LOGOUT ROUTE --------------------
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.status(200).json({ message: "Logged out successfully" });
  });
});
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// --------------------------------------
// Sample route - for testing
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// Only listen if not in serverless environment
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  startServer().then((app) => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

// For serverless deployment
module.exports = startServer();

// Add a catch-all route handler
app.use("*", (req, res) => {
  res.status(200).send("Hello from the backend!");
});

// Before setting up routes
const setupUploadsDirectory = async () => {
  if (process.env.NODE_ENV !== "production") {
    try {
      await fs.mkdir(path.join(__dirname, "uploads"), { recursive: true });
    } catch (error) {
      console.log("Uploads directory already exists or couldn't be created");
    }
  }
};
