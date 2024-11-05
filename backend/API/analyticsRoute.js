const express = require("express");
const router = express.Router();
const UserProgress = require("../models/userProgressModel");
const Quiz = require("../models/quizModel");
const User = require("../models/userModel");

// Get user activity data
router.get("/user-activity", async (req, res) => {
  try {
    const timeRange = req.query.range || "week";
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const userActivity = await UserProgress.aggregate([
      {
        $match: {
          lastAttemptDate: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$lastAttemptDate" },
          },
          activeUsers: { $addToSet: "$userId" },
          totalAttempts: { $sum: 1 },
        },
      },
      {
        $project: {
          date: "$_id",
          activeUsers: { $size: "$activeUsers" },
          attempts: "$totalAttempts",
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.json({ success: true, data: userActivity });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get quiz statistics
router.get("/quiz-stats", async (req, res) => {
  try {
    // Get completion rates by category
    const completionData = await UserProgress.aggregate([
      {
        $lookup: {
          from: "quizzes",
          localField: "quizId",
          foreignField: "_id",
          as: "quiz",
        },
      },
      {
        $unwind: "$quiz",
      },
      {
        $group: {
          _id: "$quiz.category",
          totalAttempts: { $sum: 1 },
          completions: {
            $sum: { $cond: ["$completed", 1, 0] },
          },
        },
      },
      {
        $project: {
          category: "$_id",
          completionRate: {
            $multiply: [{ $divide: ["$completions", "$totalAttempts"] }, 100],
          },
        },
      },
    ]);

    // Get category distribution
    const categoryData = await Quiz.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          value: "$count",
        },
      },
    ]);

    // Get difficulty distribution
    const difficultyData = await Quiz.aggregate([
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          difficulty: "$_id",
          count: 1,
        },
      },
    ]);

    res.json({
      success: true,
      completionData,
      categoryData,
      difficultyData,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get time-based statistics
router.get("/time-stats", async (req, res) => {
  try {
    const timeStats = await UserProgress.aggregate([
      {
        $lookup: {
          from: "quizzes",
          localField: "quizId",
          foreignField: "_id",
          as: "quiz",
        },
      },
      {
        $unwind: "$quiz",
      },
      {
        $group: {
          _id: "$quizId",
          quizTitle: { $first: "$quiz.title" },
          avgTime: { $avg: "$totalTimeSpent" },
          minTime: { $min: "$totalTimeSpent" },
          maxTime: { $max: "$totalTimeSpent" },
        },
      },
    ]);

    res.json({ success: true, data: timeStats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
