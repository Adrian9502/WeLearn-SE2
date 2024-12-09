const express = require("express");
const adminModel = require("../models/adminModel");
const router = express.Router();
const upload = require("../config/storage");
const cloudinary = require("../config/cloudinary");
const path = require("path");

// GET ALL ADMIN DATA
router.get("/", async (req, res) => {
  try {
    const admins = await adminModel.find();
    res.status(200).json(admins);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admins", error: error.message });
  }
});

// GET A SINGLE ADMIN BY ID
router.get("/:id", async (req, res) => {
  try {
    const admin = await adminModel.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admin", error: error.message });
  }
});

// CREATE A NEW ADMIN
router.post("/", async (req, res) => {
  const { username, email } = req.body;

  try {
    // Check if the username or email already exists
    const existingUser = await adminModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username or email already exists",
      });
    }

    // If the username and email are unique, proceed with creating the new user
    const newUser = new adminModel(req.body);
    const savedUser = await newUser.save();

    res.status(201).json(savedUser); // Respond with the created user
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message }); // Handle any other errors
  }
});

// UPDATE AN ADMIN BY ID
router.put("/:id", async (req, res) => {
  const { username, email } = req.body; // Destructure username and email from the request body
  const userId = req.params.id;

  try {
    // Check if the username or email already exists, excluding the current user
    const existingUser = await adminModel.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: userId }, // Exclude the current user from the check
    });

    if (existingUser) {
      // If another user with the same username or email is found, return an error
      return res.status(400).json({
        message: "Username or email already exists",
      });
    }

    // If no conflict is found, proceed with updating the user
    const updatedUser = await adminModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" }); // Handle case where user is not found
    }

    res.status(200).json(updatedUser); // Respond with the updated user
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message }); // Handle any other errors
  }
});

// DELETE AN ADMIN BY ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedAdmin = await adminModel.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting admin", error: error.message });
  }
});

// ------------------ PROFILE PICTURE ------------
router.put(
  "/:id/profile-picture",
  upload.single("profilePicture"),
  async (req, res) => {
    // Set CORS headers explicitly
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Credentials", "true");

    try {
      console.log(
        "Profile picture upload request received for admin:",
        req.params.id
      );
      console.log("File received:", req.file);

      // File validation
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
          error: "File is required",
        });
      }

      // File type validation
      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          message: "Invalid file type",
          allowedTypes: allowedMimeTypes,
        });
      }

      // File size validation
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (req.file.buffer.length > MAX_FILE_SIZE) {
        return res.status(400).json({
          message: "File size exceeds 5MB limit",
          maxSize: MAX_FILE_SIZE,
        });
      }

      // Validate admin exists
      const admin = await adminModel.findById(req.params.id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      try {
        // Upload to Cloudinary with additional error handling
        const result = await uploadToCloudinary(req.file.buffer);
        console.log("Cloudinary upload result:", {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
        });

        if (!result || !result.secure_url) {
          throw new Error("Failed to get secure URL from Cloudinary");
        }

        // Update admin's profile picture URL in database
        const updatedAdmin = await adminModel.findByIdAndUpdate(
          req.params.id,
          {
            profilePicture: result.secure_url,
          },
          { new: true }
        );

        if (!updatedAdmin) {
          throw new Error("Failed to update admin profile picture");
        }

        res.json({
          message: "Profile picture updated successfully",
          profilePicture: result.secure_url,
          admin: {
            _id: updatedAdmin._id,
            name: updatedAdmin.name,
            profilePicture: updatedAdmin.profilePicture,
          },
        });
      } catch (uploadError) {
        console.error("Error during upload process:", {
          message: uploadError.message,
          stack: uploadError.stack,
        });
        return res.status(500).json({
          message: "Error processing upload",
          error:
            process.env.NODE_ENV === "production"
              ? "Upload failed"
              : uploadError.message,
        });
      }
    } catch (error) {
      console.error("Error in profile picture upload:", {
        message: error.message,
        stack: error.stack,
      });
      res.status(500).json({
        message: "Error updating profile picture",
        error: process.env.NODE_ENV === "production" ? null : error.message,
      });
    }
  }
);

// GET route for profile picture
router.get("/:id/profile-picture", async (req, res) => {
  const defaultPicture =
    "https://cdn-icons-png.freepik.com/512/6858/6858441.png";

  try {
    const admin = await adminModel.findById(req.params.id);

    if (!admin || !admin.profilePicture) {
      return res.json({
        profilePicture: defaultPicture,
        message: "Using default picture",
      });
    }

    return res.json({
      profilePicture: admin.profilePicture,
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

// Profile picture upload route
router.post("/profile-picture/:id", async (req, res) => {
  try {
    const adminId = req.params.id;
    const base64Image = req.body.image;

    if (!base64Image) {
      return res.status(400).json({ message: "No image data provided" });
    }

    const admin = await adminModel.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Upload to Cloudinary with proper error handling
    try {
      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "admin-profile-pictures",
        public_id: `${adminId}_profile_pic`,
        overwrite: true,
        transformation: [
          { width: 400, height: 400, crop: "limit" },
          { quality: "auto:low" },
        ],
      });

      // Update admin's profile picture URL
      admin.profilePicture = uploadResponse.secure_url;
      await admin.save();

      res.json({
        profilePicture: uploadResponse.secure_url,
        message: "Profile picture updated successfully",
      });
    } catch (cloudinaryError) {
      console.error("Cloudinary upload error:", cloudinaryError);
      return res.status(500).json({
        message: "Failed to upload to cloud storage",
        error: cloudinaryError.message,
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

// Add OPTIONS route for preflight requests
router.options("/:id/profile-picture", (req, res) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(204).send();
});

module.exports = router;
