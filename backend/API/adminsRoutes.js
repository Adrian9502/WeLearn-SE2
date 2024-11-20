const express = require("express");
const adminModel = require("../models/adminModel");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
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
// Helper functions
const deleteOldProfilePicture = async (profilePictureUrl) => {
  if (!profilePictureUrl || profilePictureUrl.startsWith("https://")) return;

  try {
    const relativePath = profilePictureUrl.startsWith("/")
      ? profilePictureUrl.slice(1)
      : profilePictureUrl;
    const fullPath = path.join(process.cwd(), relativePath);
    await fs.access(fullPath);
    await fs.unlink(fullPath);
    console.log("Successfully deleted old profile picture:", fullPath);
  } catch (error) {
    console.error("Error deleting old profile picture:", error);
  }
};

const createUploadDirs = async () => {
  const uploadPath = path.join(
    process.cwd(),
    "uploads",
    "profile-pictures",
    "admin"
  );
  try {
    await fs.access(uploadPath);
  } catch {
    await fs.mkdir(uploadPath, { recursive: true });
    console.log("Created upload directories");
  }
};

// Initialize upload directories
createUploadDirs();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile-pictures/admin");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `admin-${req.params.id}-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Invalid file type. Only JPEG, PNG and GIF are allowed."),
        false
      );
    }
    cb(null, true);
  },
});

// Routes
router.get("/:id/profile-picture", async (req, res) => {
  try {
    const admin = await adminModel
      .findById(req.params.id)
      .select("profilePicture");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (!admin.profilePicture) {
      return res.status(404).json({ message: "No profile picture found" });
    }

    // Handle external URLs
    if (admin.profilePicture.startsWith("https://")) {
      return res.json({ profilePicture: admin.profilePicture });
    }

    // Verify local file exists
    const relativePath = admin.profilePicture.startsWith("/")
      ? admin.profilePicture.slice(1)
      : admin.profilePicture;
    const fullPath = path.join(process.cwd(), relativePath);

    try {
      await fs.access(fullPath);
      return res.json({
        profilePicture: admin.profilePicture,
        message: "Profile picture retrieved successfully",
      });
    } catch {
      // Return default picture if file doesn't exist
      const defaultPicture =
        "https://cdn-icons-png.freepik.com/512/6858/6858441.png";
      await adminModel.findByIdAndUpdate(req.params.id, {
        profilePicture: defaultPicture,
      });
      return res.json({
        profilePicture: defaultPicture,
        message: "File not found, returned default picture",
      });
    }
  } catch (error) {
    console.error("Error retrieving profile picture:", error);
    return res.status(500).json({
      message: "Error retrieving profile picture",
      error: error.message,
    });
  }
});

router.put(
  "/:id/profile-picture",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const admin = await adminModel.findById(req.params.id);
      if (!admin) {
        await fs.unlink(req.file.path);
        return res.status(404).json({ message: "Admin not found" });
      }

      const oldProfilePicture = admin.profilePicture;
      const profilePicture = `/uploads/profile-pictures/admin/${req.file.filename}`;

      const updatedAdmin = await adminModel
        .findByIdAndUpdate(req.params.id, { profilePicture }, { new: true })
        .select("profilePicture");

      if (!updatedAdmin) {
        await fs.unlink(req.file.path);
        return res.status(404).json({ message: "Admin update failed" });
      }

      await deleteOldProfilePicture(oldProfilePicture);

      res.status(200).json({
        profilePicture: updatedAdmin.profilePicture,
        message: "Profile picture updated successfully",
      });
    } catch (error) {
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error("Error deleting uploaded file:", unlinkError);
        }
      }

      res.status(500).json({
        message: "Error updating profile picture",
        error: error.message,
      });
    }
  }
);

module.exports = router;
