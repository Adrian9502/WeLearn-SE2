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
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
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
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------MONGODB CONNECTION----------------
connectDB()
  .then(() => {
    console.log("MongoDB connection initialized");
  })
  .catch((err) => {
    console.error("Error initializing MongoDB:", err);
  });
// ----------------SESSION CONFIGURATION----------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something broke!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
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
  })
);
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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
