const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserProgress = require("../models/userProgressModel");

// Get user's progress summary
router.get("/user/:userId/summary", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    let quizzes;
    try {
      quizzes = await UserProgress.find({ userId })
        .populate({
          path: "quizId",
          select: "title totalExercises completed",
        })
        .select("-__v")
        .lean()
        .exec();
    } catch (dbError) {
      console.error("Database query error:", dbError);
      throw new Error("Failed to fetch user progress");
    }

    // Ensure quizzes is always an array
    const safeQuizzes = Array.isArray(quizzes) ? quizzes : [];

    // Transform the data if needed
    const transformedQuizzes = safeQuizzes.map((quiz) => ({
      ...quiz,
      quizId: quiz.quizId || null,
      exercisesCompleted: Number(quiz.exercisesCompleted) || 0,
      totalTimeSpent: Number(quiz.totalTimeSpent) || 0,
      completed: Boolean(quiz.completed),
    }));

    return res.status(200).json({
      success: true,
      quizzes: transformedQuizzes,
    });
  } catch (error) {
    console.error("Error in progress summary:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching progress summary",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Get user's progress for a specific quiz
router.get("/:userId/:quizId", async (req, res) => {
  try {
    const { userId, quizId } = req.params;
    const progress = await UserProgress.findOne({ userId, quizId });
    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }
    res.json({ progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user's progress for a specific quiz
router.post("/:userId/:quizId/answer", async (req, res) => {
  try {
    const { userId, quizId } = req.params;
    const { questionId, userAnswer, isCorrect, timeSpent } = req.body;

    // Validate input
    if (!userId || !quizId || !questionId || typeof timeSpent !== "number") {
      return res.status(400).json({
        success: false,
        message: "Invalid input parameters",
      });
    }

    let progress = await UserProgress.findOne({ userId, quizId });

    if (!progress) {
      progress = new UserProgress({
        userId,
        quizId,
        totalExercises: 1,
        totalTimeSpent: 0,
        exercisesCompleted: 0,
        completed: false,
        attemptTimes: [],
      });
    }

    // Update attempt times
    progress.attemptTimes.push({
      questionId,
      timeSpent,
      attemptDate: new Date(),
    });

    // Update progress
    progress.totalTimeSpent += timeSpent;
    progress.exercisesCompleted += 1;
    progress.lastAttemptDate = new Date();

    if (isCorrect) {
      progress.completed = true;
    }

    await progress.save();

    // Fetch updated progress with populated fields
    const updatedProgress = await UserProgress.findById(progress._id)
      .populate("quizId", "title totalExercises")
      .exec();

    return res.status(200).json({
      success: true,
      progress: updatedProgress,
      message: isCorrect ? "Quiz completed successfully!" : "Answer recorded",
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating progress",
      error: error.message,
    });
  }
});

// Add a new route to get time analytics
router.get("/:userId/:quizId/time-analytics", async (req, res) => {
  try {
    const { userId, quizId } = req.params;
    const progress = await UserProgress.findOne({ userId, quizId });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    const analytics = {
      totalTimeSpent: progress.totalTimeSpent,
      averageTimePerQuestion:
        progress.totalTimeSpent / progress.exercisesCompleted,
      attemptTimes: progress.attemptTimes,
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Add a route to check completion status
router.get("/:userId/:quizId/completion", async (req, res) => {
  try {
    const { userId, quizId } = req.params;
    const progress = await UserProgress.findOne({ userId, quizId })
      .populate("quizId", "title")
      .select("completed exercisesCompleted totalTimeSpent lastAttemptDate");

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "No progress found for this quiz",
      });
    }

    res.json({
      success: true,
      completion: {
        completed: progress.completed,
        exercisesCompleted: progress.exercisesCompleted,
        totalTimeSpent: progress.totalTimeSpent,
        lastAttemptDate: progress.lastAttemptDate,
        quizTitle: progress.quizId.title,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// Ranking route
router.get("/rankings", async (req, res) => {
  try {
    const allProgress = await UserProgress.find()
      .populate("userId", "username coins")
      .populate("quizId", "title");

    // Ensure allProgress is an array
    const progressArray = Array.isArray(allProgress) ? allProgress : [];

    // Group progress by user
    const userProgressMap = new Map();

    progressArray.forEach((progress) => {
      try {
        // Skip if userId is not properly populated
        if (!progress?.userId?._id) return;

        const userId = progress.userId._id.toString();
        if (!userProgressMap.has(userId)) {
          userProgressMap.set(userId, {
            userId,
            username: progress.userId.username || "Unknown",
            coins: progress.userId.coins || 0,
            completedQuizzes: 0,
            totalTime: 0,
            totalAttempts: 0,
            successRate: 0,
            consecutiveDays: 0,
            averageTime: 0,
          });
        }

        const userStats = userProgressMap.get(userId);

        if (progress.completed) {
          userStats.completedQuizzes++;
        }

        userStats.totalTime += Number(progress.totalTimeSpent) || 0;
        userStats.totalAttempts += Number(progress.exercisesCompleted) || 0;

        // Safe calculations with Number conversion
        userStats.successRate =
          userStats.totalAttempts > 0
            ? Number(userStats.completedQuizzes) /
              Number(userStats.totalAttempts)
            : 0;

        userStats.averageTime =
          userStats.completedQuizzes > 0
            ? Number(userStats.totalTime) / Number(userStats.completedQuizzes)
            : 0;

        const attempts = Array.isArray(progress.attemptTimes)
          ? progress.attemptTimes.map((at) =>
              new Date(at.attemptDate).toDateString()
            )
          : [];
        userStats.consecutiveDays = Math.max(
          userStats.consecutiveDays,
          new Set(attempts).size
        );
      } catch (err) {
        console.error("Error processing progress:", err);
      }
    });

    const users = Array.from(userProgressMap.values());

    return res.status(200).json({
      completionRankings: [...users]
        .filter((user) => user.completedQuizzes > 0) // Only include users who completed at least one quiz
        .sort((a, b) => b.completedQuizzes - a.completedQuizzes),
      timeRankings: [...users]
        .filter((user) => user.completedQuizzes > 0) // Only include users who completed quizzes
        .sort((a, b) => a.averageTime - b.averageTime),
      coinRankings: [...users].sort((a, b) => b.coins - a.coins),
      consistencyRankings: [...users].sort(
        (a, b) => b.consecutiveDays - a.consecutiveDays
      ),
      efficiencyRankings: [...users].sort(
        (a, b) => b.successRate - a.successRate
      ),
    });
  } catch (error) {
    console.error("Error in rankings:", error);
    return res.status(500).json({
      message: "Error fetching rankings",
      error: error.message,
    });
  }
});
//  Completion stats
router.get("/completion-stats", async (req, res) => {
  try {
    // Get all progress records with proper chaining
    const allProgress = await UserProgress.find()
      .populate("quizId", "totalExercises")
      .lean()
      .exec();

    // Ensure allProgress is an array and handle null/undefined
    const progressArray = Array.isArray(allProgress) ? allProgress : [];

    if (progressArray.length === 0) {
      return res.status(200).json({
        completionRate: 0,
        totalQuizzes: 0,
        completedQuizzes: 0,
        trend: 0,
      });
    }

    // Count completed quizzes with safe checks
    const completedQuizzes = progressArray.filter(
      (progress) => progress && progress.completed === true
    ).length;
    const totalQuizzes = progressArray.length;

    // Calculate completion rate as a percentage with safe division
    const completionRate =
      totalQuizzes > 0
        ? Math.round((completedQuizzes / totalQuizzes) * 100)
        : 0;

    // Calculate trend with safe function call
    const trend = calculateTrend(progressArray);

    return res.status(200).json({
      completionRate,
      totalQuizzes,
      completedQuizzes,
      trend,
    });
  } catch (error) {
    console.error("Error calculating completion rate:", error);
    return res.status(500).json({
      success: false,
      message: "Error calculating completion rate",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Helper function to calculate trend with safe operations
function calculateTrend(allProgress) {
  if (!Array.isArray(allProgress) || allProgress.length === 0) {
    return 0;
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentProgress = allProgress.filter(
      (p) => p?.lastAttemptDate && new Date(p.lastAttemptDate) > thirtyDaysAgo
    );

    const previousProgress = allProgress.filter(
      (p) => p?.lastAttemptDate && new Date(p.lastAttemptDate) <= thirtyDaysAgo
    );

    const recentRate =
      recentProgress.length > 0
        ? Math.round(
            (recentProgress.filter((p) => p.completed === true).length /
              recentProgress.length) *
              100
          )
        : 0;

    const previousRate =
      previousProgress.length > 0
        ? Math.round(
            (previousProgress.filter((p) => p.completed === true).length /
              previousProgress.length) *
              100
          )
        : 0;

    return recentRate - previousRate;
  } catch (error) {
    console.error("Error calculating trend:", error);
    return 0;
  }
}

module.exports = router;
