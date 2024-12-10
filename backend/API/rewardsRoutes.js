const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const userModel = require("../models/userModel");
const DailyReward = require("../models/dailyRewardModel");

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      error: "Invalid user ID",
      details: "The provided user ID is not a valid MongoDB ObjectId",
    });
  }
  next();
};

// Comprehensive error handler
const handleError = (res, error, defaultMessage = "An error occurred") => {
  console.error("Detailed error:", error);

  // Check for specific error types and provide more detailed responses
  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation Error",
      details: Object.values(error.errors).map((err) => err.message),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      error: "Invalid Data Type",
      details: `${error.path}: ${error.message}`,
    });
  }

  // Generic error response
  res.status(500).json({
    error: defaultMessage,
    details: error.message,
  });
};
// Helper function to get the reward amount based on the day of the week
const getRewardAmount = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6 ? 50 : 25;
};
// Returns the last claim details for the user
router.get("/:userId/last-claim", validateObjectId, async (req, res) => {
  try {
    // First, verify the user exists
    const user = await userModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        details: "No user exists with the provided ID",
      });
    }

    const dailyReward = await DailyReward.findOne({
      userId: req.params.userId,
    });

    if (!dailyReward || dailyReward.claimedDates.length === 0) {
      return res.json({ lastClaim: null });
    }

    // Sort claimed dates in descending order and get the most recent
    const sortedClaims = dailyReward.claimedDates.sort(
      (a, b) => b.date - a.date
    );
    res.json({
      lastClaim: sortedClaims[0].date,
      claimedDates: sortedClaims.map((claim) => claim.date),
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch last claim date");
  }
});

// Claims the daily reward and updates user coins
router.post("/:userId/claim", validateObjectId, async (req, res) => {
  try {
    const { rewardAmount, claimDate } = req.body;

    // Validate required fields
    if (!rewardAmount || !claimDate) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: rewardAmount and claimDate",
      });
    }

    // Parse the date and set to midnight
    const claimDateTime = new Date(claimDate);
    claimDateTime.setHours(0, 0, 0, 0);

    // Validate the date is valid
    if (isNaN(claimDateTime.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid date format",
      });
    }

    const expectedReward = getRewardAmount(claimDateTime);

    // Validate reward amount matches day type
    if (rewardAmount !== expectedReward) {
      return res.status(400).json({
        success: false,
        error: "Invalid reward amount for this day",
        expected: expectedReward,
        received: rewardAmount,
      });
    }

    // Find user first
    const user = await userModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Find or create daily reward document
    let dailyReward = await DailyReward.findOne({ userId: user._id });
    if (!dailyReward) {
      dailyReward = new DailyReward({ userId: user._id, claimedDates: [] });
    }

    // Check if already claimed on this date
    const existingClaim = dailyReward.claimedDates.find((claim) => {
      const existingClaimDate = new Date(claim.date);
      existingClaimDate.setHours(0, 0, 0, 0);
      return existingClaimDate.getTime() === claimDateTime.getTime();
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        error: "Reward already claimed for this date",
      });
    }

    // Update user coins
    user.coins += rewardAmount;
    user.lastRewardClaim = claimDateTime;
    await user.save();

    // Record the daily reward
    dailyReward.claimedDates.push({
      date: claimDateTime,
      amount: rewardAmount,
    });
    await dailyReward.save();

    return res.json({
      success: true,
      newCoins: user.coins,
      claimedDate: claimDateTime,
    });
  } catch (error) {
    console.error("Error in claim reward:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "An unexpected error occurred",
    });
  }
});
module.exports = router;
