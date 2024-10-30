const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("./db");
// Initialize express app
const app = express();

dotenv.config();
// ----------------MODEL----------------------
// USER MODEL
const userModel = require("./models/userModel");
// ADMIN MODEL
const adminModel = require("./models/adminModel");
// --------------------------------------------
// ----------------MIDDLEWARE-----------------
app.use(cors());
app.use(express.json());

// ---------MONGODB CONNECTION----------------
connectDB();

// ---------- IMPORT ROUTES ------------------
const registerRoutes = require("./API/registerRoutes");
const loginRoutes = require("./API/loginRoutes");
const userRoutes = require("./API/usersRoutes");
const adminRoutes = require("./API/adminsRoutes");
const quizRoutes = require("./API/quizRoutes");
const userProgressRoutes = require("./API/userProgressRoutes");
// ---------- API ROUTING --------------------
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/progress", userProgressRoutes);

// --------------------------------------
// Sample route - for testing
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
