const express = require("express");
const router = express.Router();

// Import the models
const userModel = require("../models/userModel");

// Returns the last claim date for the user
router.get("/:userId/last-claim", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    res.json({ lastClaim: user.lastRewardClaim });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch last claim date" });
  }
});

// Claims the daily reward and updates user coins
router.post("/:userId/claim", async (req, res) => {
  try {
    const { rewardAmount } = req.body;
    const user = await userModel.findById(req.params.userId);

    user.coins += rewardAmount;
    user.lastRewardClaim = new Date();
    await user.save();

    res.json({
      success: true,
      newCoins: user.coins,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to claim reward" });
  }
});

// Make sure router is correctly exported
module.exports = router;
