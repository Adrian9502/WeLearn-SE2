const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// ---------- Import the models -----------------
const userModel = require("../models/userModel");
const adminModel = require("../models/adminModel");

// Middleware to verify JWT token (Optional)
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Token sent as "Bearer <token>"
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add decoded user data to the request
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Route for user login
router.post("/user", async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.body.username });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      console.log("Invalid password");
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create a JWT token with a 1-hour expiry
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, user }); // Send back the token and user info
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Route for admin login
router.post("/admin", async (req, res) => {
  try {
    const admin = await adminModel.findOne({ username: req.body.username });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(req.body.password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create a JWT token with a 1-hour expiry
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, admin }); // Send back the token and admin info
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Sample protected route (to check if the JWT is working)
router.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "Access granted to user profile", user: req.user });
});

module.exports = router;
