const express = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const userModel = require("../models/userModel");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const crypto = require("crypto");
// Constants
const SALT_ROUNDS = 10; // Number of rounds to use when generating a salt

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
// GridFS setup
// Create MongoDB connection
let gfs;
const conn = mongoose.connection;

conn.once("open", () => {
  // Initialize GridFS stream with the proper configuration
  gfs = new Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// Storage configuration
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI || "mongodb://localhost:27017/your_database",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);

        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
          metadata: {
            userId: req.params.id,
            contentType: file.mimetype,
          },
        };
        resolve(fileInfo);
      });
    });
  },
});

// Initialize upload middleware
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error(
        "Invalid file type. Only JPEG, PNG and GIF are allowed."
      );
      error.code = "INVALID_FILE_TYPE";
      return cb(error, false);
    }
    cb(null, true);
  },
});

// Upload route
router.post("/:id/profile-picture", (req, res) => {
  upload.single("profilePicture")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Delete old profile picture if exists
      if (user.profilePicture) {
        try {
          const oldFileId = new mongoose.Types.ObjectId(user.profilePicture);
          await gfs.files.deleteOne({ _id: oldFileId });
        } catch (error) {
          console.error("Error deleting old file:", error);
        }
      }

      // Update user with new file id
      user.profilePicture = req.file.id;
      await user.save();

      res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        profilePicture: `/api/users/${user._id}/profile-picture`,
      });
    } catch (error) {
      console.error("Error in upload route:", error);
      res.status(500).json({
        success: false,
        message: "Error uploading file",
      });
    }
  });
});

// GET route - update the content type header
router.get("/:id/profile-picture", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user || !user.profilePicture) {
      return res.status(404).json({
        success: false,
        message: "No profile picture found",
      });
    }

    const file = await gfs.files.findOne({
      _id: new mongoose.Types.ObjectId(user.profilePicture),
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "No file exists",
      });
    }

    // Set proper content type
    res.set("Content-Type", file.metadata.contentType);

    // Create read stream using the filename
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: "uploads",
    });

    const downloadStream = bucket.openDownloadStreamByName(file.filename);
    downloadStream.pipe(res);

    downloadStream.on("error", (error) => {
      console.error("Error streaming file:", error);
      res.status(500).json({
        success: false,
        message: "Error streaming file",
      });
    });
  } catch (error) {
    console.error("Error serving file:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving file",
    });
  }
});
module.exports = router;
