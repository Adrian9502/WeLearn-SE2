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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { rewardAmount, claimDate } = req.body;

    // Validate input
    if (!rewardAmount || !claimDate) {
      throw new Error("Missing required fields: rewardAmount and claimDate");
    }

    // Find the user with lean to minimize overhead
    const user = await userModel.findById(req.params.userId).lean();
    if (!user) {
      throw new Error("User not found");
    }

    // Find or create daily reward record
    let dailyReward = await DailyReward.findOne({ userId: user._id }).session(
      session
    );
    if (!dailyReward) {
      dailyReward = new DailyReward({ userId: user._id, claimedDates: [] });
    }

    const claimDateTime = new Date(claimDate);
    claimDateTime.setHours(0, 0, 0, 0);

    // Check if already claimed on this date
    const existingClaim = dailyReward.claimedDates.find((claim) => {
      const claimDate = new Date(claim.date);
      claimDate.setHours(0, 0, 0, 0);
      return claimDate.getTime() === claimDateTime.getTime();
    });

    if (existingClaim) {
      throw new Error("Reward already claimed for this date");
    }

    // Update user coins using findOneAndUpdate to avoid model validation
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: user._id },
      {
        $inc: { coins: rewardAmount },
        $set: { lastRewardClaim: claimDateTime },
      },
      {
        new: true,
        session,
        runValidators: false, // Bypass validation to handle default profile picture
      }
    );

    // Record the daily reward
    dailyReward.claimedDates.push({
      date: claimDateTime,
      amount: rewardAmount,
    });
    await dailyReward.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      newCoins: updatedUser.coins,
      claimedDate: claimDateTime,
    });
  } catch (error) {
    console.error("Full error details:", error); // Add detailed logging
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      error: error.message || "Unexpected error occurred",
      details: error.toString(),
    });
  }
});
module.exports = router;
