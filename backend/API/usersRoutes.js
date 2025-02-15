const express = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const userModel = require("../models/userModel");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const crypto = require("crypto");
const { getGfs } = require("../db");
const upload = require("../config/storage");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const cloudinary = require("../config/cloudinary");

// Constants
const SALT_ROUNDS = 10;

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI must be defined in environment variables");
}

// GET ALL USERS DATA
router.get("/", async (req, res) => {
  try {
    const { sortBy = "username", order = "asc" } = req.query;
    const sortOrder = order === "desc" ? -1 : 1;

    const validSortFields = ["username", "email", "coins", "createdAt"];
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ message: "Invalid sort field" });
    }

    const users = await userModel.find().sort({ [sortBy]: sortOrder });
    const formattedUsers = users.map((user) => ({
      ...user.toObject(),
      createdAt: user.createdAt.toISOString(),
    }));
    res.status(200).json(formattedUsers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

// GET A SINGLE USER BY ID
router.get("/:id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admin", error: error.message });
  }
});

// CREATE A NEW USER
router.post(
  "/",
  [
    body("username")
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage("Username is required"),
    body("email")
      .trim()
      .escape()
      .isEmail()
      .withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("fullName")
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage("Full name is required"),
    body("dob")
      .isISO8601()
      .toDate()
      .withMessage("Valid date of birth is required"),
    body("isAdmin")
      .optional()
      .isBoolean()
      .withMessage("isAdmin must be a boolean"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, fullName, dob, isAdmin } = req.body;

    try {
      const existingUser = await userModel.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        return res.status(400).json({
          message: "Username or email already exists",
        });
      }

      const newUser = new userModel({
        username,
        email,
        password,
        fullName,
        dob,
        isAdmin: isAdmin || false,
        coins: 600,
        // createdAt will be set automatically
      });

      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        message: "Error creating user",
        error: error.message,
      });
    }
  }
);

// UPDATE A USER BY ID
router.put(
  "/:id",
  [
    body("username")
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage("Username is required"),
    body("email")
      .trim()
      .escape()
      .isEmail()
      .withMessage("Valid email is required"),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    // Validate and sanitize input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, username, email, password, dob, isAdmin } = req.body;
    const userId = req.params.id;

    try {
      // Check if the username or email already exists, excluding the current user
      const existingUser = await userModel.findOne({
        $or: [{ username }, { email }],
        _id: { $ne: userId }, // Exclude the current user from the check
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Username or email already exists",
        });
      }

      // Prepare updated data
      const updatedData = { fullName, username, email, dob, isAdmin }; // Include fullName, dob, and isAdmin
      if (password) {
        updatedData.password = await bcrypt.hash(password, SALT_ROUNDS); // Hash the new password if provided
      }

      // Update the user
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        updatedData,
        {
          new: true, // Return the updated document
        }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  }
);

// DELETE A USER BY ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id); // Delete the user by ID
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" }); // Handle case where user is not found
    }
    res.status(200).json({ message: "User deleted successfully" }); // Respond with success message
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message }); // Handle any errors
  }
});
// UPDATE USER COINS
router.put("/:id/coins", async (req, res) => {
  const userId = req.params.id;
  const { coins, operation = "add" } = req.body; // Add operation parameter

  try {
    // Find the user first
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let updatedCoins;
    if (operation === "add") {
      updatedCoins = user.coins + coins;
    } else if (operation === "subtract") {
      updatedCoins = user.coins - coins;
    }

    // Update with the new coin value directly
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { coins: updatedCoins },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: "Error updating user coins",
      error: error.message,
    });
  }
});

// ------------------ PROFILE PICTURE ------------
router.post("/profile-picture/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const base64Image = req.body.image;

    if (!base64Image) {
      return res.status(400).json({ message: "No image data provided" });
    }

    // Validate user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log Cloudinary configuration status
    const cloudinaryConfig = cloudinary.config();
    console.log("Cloudinary Config Status:", {
      hasCloudName: !!cloudinaryConfig.cloud_name,
      hasApiKey: !!cloudinaryConfig.api_key,
      hasApiSecret: !!cloudinaryConfig.api_secret,
    });

    try {
      // Validate base64 image
      if (!base64Image.startsWith("data:image")) {
        throw new Error("Invalid image format");
      }

      // Upload to Cloudinary with proper error handling
      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "profile-pictures",
        public_id: `user_${userId}_profile_pic_${Date.now()}`,
        overwrite: true,
        resource_type: "auto",
        transformation: [
          { width: 400, height: 400, crop: "limit" },
          { quality: "auto:good" },
        ],
      });

      if (!uploadResponse || !uploadResponse.secure_url) {
        throw new Error("Failed to get secure URL from Cloudinary");
      }

      // Update user's profile picture URL
      user.profilePicture = uploadResponse.secure_url;
      await user.save();

      res.json({
        success: true,
        profilePicture: uploadResponse.secure_url,
        message: "Profile picture updated successfully",
      });
    } catch (cloudinaryError) {
      console.error("Cloudinary upload error:", cloudinaryError);
      return res.status(500).json({
        message: "Failed to upload to cloud storage",
        error: cloudinaryError.message,
        config: {
          cloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
          apiKey: !!process.env.CLOUDINARY_API_KEY,
          apiSecret: !!process.env.CLOUDINARY_API_SECRET,
        },
      });
    }
  } catch (error) {
    console.error("Profile picture upload error:", error);
    res.status(500).json({
      message: "Failed to upload profile picture",
      error: error.message,
    });
  }
});

// GET route for profile picture
router.get("/:id/profile-picture", async (req, res) => {
  const defaultPicture =
    "https://cdn-icons-png.freepik.com/512/6858/6858441.png";

  try {
    const user = await userModel.findById(req.params.id);

    if (!user || !user.profilePicture) {
      return res.json({
        profilePicture: defaultPicture,
        message: "Using default picture",
      });
    }

    return res.json({
      profilePicture: user.profilePicture,
      message: "Profile picture URL retrieved",
    });
  } catch (error) {
    console.error("Profile picture error:", error);
    return res.json({
      profilePicture: defaultPicture,
      message: "Error retrieving picture, using default",
    });
  }
});

module.exports = router;
