const express = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const userModel = require("../models/userModel");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const { getGfs } = require("../db");
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
// Storage configuration
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
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
router.post(
  "/:id/profile-picture",
  upload.single("profilePicture"),
  async (req, res) => {
    console.log("\n=== PROFILE PICTURE UPLOAD ===");

    try {
      // Validate user ID
      if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      if (!req.file) {
        console.log("No file received");
        return res.status(400).json({
          success: false,
          message: "Please upload a file",
        });
      }

      console.log("File received:", {
        id: req.file.id,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });

      const user = await userModel.findById(req.params.id);
      if (!user) {
        console.log("User not found:", req.params.id);
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Delete old profile picture if it exists
      if (
        user.profilePicture &&
        mongoose.Types.ObjectId.isValid(user.profilePicture)
      ) {
        try {
          const oldFileId = new mongoose.Types.ObjectId(user.profilePicture);
          const gfs = getGfs();

          if (gfs) {
            const existingFile = await mongoose.connection.db
              .collection("uploads.files")
              .findOne({ _id: oldFileId });

            if (existingFile) {
              await gfs.delete(oldFileId);
              console.log("Old profile picture deleted:", oldFileId);
            } else {
              console.log("Old profile picture not found in GridFS");
            }
          }
        } catch (error) {
          console.error("Error processing old file:", error);
        }
      }

      // Update user with new file id
      user.profilePicture = req.file.id;
      await user.save();
      console.log("User profile updated with new picture ID:", req.file.id);

      res.status(200).json({
        success: true,
        message: "Profile picture updated successfully",
        profilePicture: `/api/users/${user._id}/profile-picture`,
        profilePictureId: req.file.id,
      });
    } catch (error) {
      console.error("Upload processing error:", error);
      res.status(500).json({
        success: false,
        message: "Error processing upload",
      });
    }
  }
);

// GET route
router.get("/:id/profile-picture", async (req, res) => {
  console.log("\n=== PROFILE PICTURE REQUEST ===");
  try {
    // Validate user ID
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log("Invalid user ID:", req.params.id);
      return res.sendFile(
        path.join(__dirname, "../uploads/default-profile.png")
      );
    }

    const user = await userModel.findById(req.params.id);
    console.log("User found:", user?._id);
    console.log("Profile picture ID:", user?.profilePicture);

    if (!user || !user.profilePicture) {
      console.log("No user or profile picture found, sending default");
      return res.sendFile(
        path.join(__dirname, "../uploads/default-profile.png")
      );
    }

    // Validate profile picture ID
    if (!mongoose.Types.ObjectId.isValid(user.profilePicture)) {
      console.log("Invalid profile picture ID:", user.profilePicture);
      return res.sendFile(
        path.join(__dirname, "../uploads/default-profile.png")
      );
    }

    const fileId = new mongoose.Types.ObjectId(user.profilePicture);

    const gfs = getGfs();
    if (!gfs) {
      console.log("GridFS not initialized, sending default");
      return res.sendFile(
        path.join(__dirname, "../uploads/default-profile.png")
      );
    }

    // Check if file exists in GridFS
    const file = await mongoose.connection.db
      .collection("uploads.files")
      .findOne({ _id: fileId });

    if (!file) {
      console.log("No GridFS file found, sending default");
      // Update user to remove invalid profile picture reference
      await userModel.findByIdAndUpdate(user._id, {
        $unset: { profilePicture: 1 },
      });
      return res.sendFile(
        path.join(__dirname, "../uploads/default-profile.png")
      );
    }

    // Set proper content type
    res.set({
      "Access-Control-Allow-Origin": req.headers.origin || "*",
      "Access-Control-Allow-Credentials": "true",
      "Cross-Origin-Resource-Policy": "cross-origin",
      "Content-Type": file.contentType || "image/jpeg",
    });
    // Stream the file
    const downloadStream = gfs.openDownloadStream(fileId);
    downloadStream.pipe(res);

    downloadStream.on("error", (error) => {
      console.error("Stream error:", error);
      res.set({
        "Access-Control-Allow-Origin": req.headers.origin || "*",
        "Access-Control-Allow-Credentials": "true",
        "Cross-Origin-Resource-Policy": "cross-origin",
        "Content-Type": "image/png",
      });
      res.sendFile(path.join(__dirname, "../uploads/default-profile.png"));
    });
  } catch (error) {
    console.error("Profile picture error:", error);
    res.set({
      "Access-Control-Allow-Origin": req.headers.origin || "*",
      "Access-Control-Allow-Credentials": "true",
      "Cross-Origin-Resource-Policy": "cross-origin",
      "Content-Type": "image/png",
    });
    res.sendFile(path.join(__dirname, "../uploads/default-profile.png"));
  }
});

module.exports = router;
