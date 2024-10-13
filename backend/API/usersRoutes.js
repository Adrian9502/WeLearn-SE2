const express = require("express");
const userModel = require("../models/userModel"); // Adjust path as necessary
const router = express.Router();

// GET ALL USERS DATA
router.get("/", async (req, res) => {
  try {
    const users = await userModel.find(); // Use userModel to find all users
    res.status(200).json(users); // Respond with the list of users
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message }); // Handle any errors
  }
});

// CREATE A NEW USER
router.post("/", async (req, res) => {
  const { username, email } = req.body; // Destructure username and email from the request body

  try {
    // Check if the username or email already exists
    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      // If a user with the same username or email is found, return an error
      return res.status(400).json({
        message: "Username or email already exists",
      });
    }

    // If the username and email are unique, proceed with creating the new user
    const newUser = new userModel(req.body);
    const savedUser = await newUser.save();

    res.status(201).json(savedUser); // Respond with the created user
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message }); // Handle any other errors
  }
});

// UPDATE A USER BY ID
router.put("/:id", async (req, res) => {
  const { username, email } = req.body; // Destructure username and email from the request body
  const userId = req.params.id;

  try {
    // Check if the username or email already exists, excluding the current user
    const existingUser = await userModel.findOne({
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
    const updatedUser = await userModel.findByIdAndUpdate(userId, req.body, {
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

module.exports = router;
