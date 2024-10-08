const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// ---------- Import the models -----------------
const userModel = require("../models/userModel");
const adminModel = require("../models/adminModel");

// Route for user registration
router.post("/user", async (req, res) => {
  try {
    // Check if user already exists (by username or email)
    const existingUser = await userModel.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (existingUser) {
      const duplicateField =
        existingUser.username === req.body.username ? "Username" : "Email";
      return res.status(400).json({
        message: `${duplicateField} already exists`,
      });
    }

    // If user doesn't exist, create new user
    const user = await userModel.create(req.body);
    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    console.error("Error during registration:", err);
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        message: `${
          duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)
        } already exists`,
      });
    }
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
});

// Route for admin registration
router.post("/admin", async (req, res) => {
  try {
    console.log("Checking for existing admin with email:", req.body.email);
    const existingAdmin = await adminModel.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (existingAdmin) {
      console.log("Found existing admin:", existingAdmin);
      const duplicateField =
        existingAdmin.username === req.body.username ? "Username" : "Email";
      return res.status(400).json({
        message: `${duplicateField} already exists`,
      });
    }

    // If admin doesn't exist, create new admin
    const admin = await adminModel.create(req.body);
    res.status(201).json({
      message: "Admin registered successfully",
      admin,
    });
  } catch (err) {
    console.error("Error during admin registration:", err);
    res
      .status(500)
      .json({ message: "Error registering admin", error: err.message });
  }
});

module.exports = router;
