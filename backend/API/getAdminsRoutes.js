const express = require("express");
const adminModel = require("../models/adminModel"); // Adjust path as necessary
const router = express.Router();

// GET ALL ADMIN DATA
router.get("/", async (req, res) => {
  try {
    const admins = await adminModel.find(); // Use adminModel to find all admins
    res.status(200).json(admins); // Respond with the list of admins
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admins", error: error.message }); // Handle any errors
  }
});

module.exports = router;
