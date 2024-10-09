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
const userRoutes = require("./API/getUsersRoutes");
const adminRoutes = require("./API/getAdminsRoutes");
const quizRoutes = require("./API/quizRoutes");
// ---------- API ROUTING --------------------
// Use register routes
app.use("/register", registerRoutes);
// Use login routes
app.use("/login", loginRoutes);
// Use user routes --this route will get all the users data
app.use("/api/users", userRoutes);
// use admin routes --this route will get all the admins data
app.use("/api/admins", adminRoutes);
app.use("/api/create-quiz", quizRoutes);

// --------------------------------------
// Sample route - for testing
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
