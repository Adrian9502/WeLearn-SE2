const express = require("express");
const adminModel = require("../models/adminModel");
const router = express.Router();

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

module.exports = router;
