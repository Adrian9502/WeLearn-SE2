const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// ---------- Import the models -----------------
const userModel = require("../models/userModel");
const adminModel = require("../models/adminModel");

// Route for user login
router.post("/user", async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log request body
    const user = await userModel.findOne({ username: req.body.username });
    if (!user) {
      console.log("User not found"); // Log if user is not found
      return res.status(404).json({ message: "User not found" }); // Handle user not found
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      console.log("Invalid password"); // Log if password doesn't match
      return res.status(400).json({ message: "Invalid password" }); // Handle invalid password
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, user }); // Respond with token and user data
  } catch (error) {
    console.error("Error logging in:", error); // Log any errors
    res.status(500).json({ message: "Error logging in", error: error.message }); // Handle errors
  }
});

// Route for admin login
router.post("/admin", async (req, res) => {
  try {
    // Find admin by username
    const admin = await adminModel.findOne({ username: req.body.username });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" }); // Handle admin not found
    }

    // Compare password
    const isMatch = await bcrypt.compare(req.body.password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" }); // Handle invalid password
    }

    // Create a token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, admin }); // Respond with token and admin data
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message }); // Handle errors
  }
});

module.exports = router;
