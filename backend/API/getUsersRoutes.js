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

module.exports = router;
