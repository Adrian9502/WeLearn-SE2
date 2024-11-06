const express = require("express");
const router = express.Router();
const UserProgress = require("../models/userProgressModel");

// Get user's progress summary
router.get("/user/:userId/summary", async (req, res) => {
  try {
    const { userId } = req.params;
    const quizzes = await UserProgress.find({ userId })
      .populate("quizId", "title totalExercises completed")
      .select("-__v");
    res.json({ quizzes });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    // Update attempt times and total time
    progress.attemptTimes.push({
      questionId,
      timeSpent,
      attemptDate: new Date(),
    });

    progress.totalTimeSpent += timeSpent;
    progress.exercisesCompleted += 1;
    progress.lastAttemptDate = new Date();

    // Important: Set completed to true if answer is correct
    if (isCorrect) {
      progress.completed = true;
    }

    await progress.save();

    // Return the full progress object
    const updatedProgress = await UserProgress.findById(progress._id)
      .populate("quizId", "title totalExercises")
      .exec();

    res.json({
      success: true,
      progress: updatedProgress,
      message: isCorrect ? "Quiz completed successfully!" : "Answer recorded",
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({
      success: false,
      message: error.message,
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
    // Get all users' progress
    const allProgress = await UserProgress.find()
      .populate("userId", "username coins")
      .populate("quizId", "title");

    // Group progress by user
    const userProgressMap = new Map();

    allProgress.forEach((progress) => {
      const userId = progress.userId._id.toString();
      if (!userProgressMap.has(userId)) {
        userProgressMap.set(userId, {
          userId,
          username: progress.userId.username,
          coins: progress.userId.coins,
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

      userStats.totalTime += progress.totalTimeSpent;
      userStats.totalAttempts += progress.exercisesCompleted;

      // Calculate success rate
      userStats.successRate =
        userStats.completedQuizzes / userStats.totalAttempts;

      // Calculate average time per completed quiz
      userStats.averageTime = userStats.totalTime / userStats.completedQuizzes;

      // Calculate consecutive days (simplified version)
      const attempts = progress.attemptTimes.map((at) =>
        new Date(at.attemptDate).toDateString()
      );
      const uniqueDays = new Set(attempts).size;
      userStats.consecutiveDays = Math.max(
        userStats.consecutiveDays,
        uniqueDays
      );
    });

    // Convert map to array and sort for different rankings
    const users = Array.from(userProgressMap.values());

    const rankings = {
      completionRankings: [...users].sort(
        (a, b) => b.completedQuizzes - a.completedQuizzes
      ),
      timeRankings: [...users].sort((a, b) => a.averageTime - b.averageTime),
      coinRankings: [...users].sort((a, b) => b.coins - a.coins),
      consistencyRankings: [...users].sort(
        (a, b) => b.consecutiveDays - a.consecutiveDays
      ),
      efficiencyRankings: [...users].sort(
        (a, b) => b.successRate - a.successRate
      ),
    };

    res.json(rankings);
  } catch (error) {
    console.error("Error fetching rankings:", error);
    res.status(500).json({ message: error.message });
  }
});
// Route for getting the completion rate of users
router.get("/completion-stats", async (req, res) => {
  try {
    // Get all progress records
    const allProgress = await UserProgress.find().populate(
      "quizId",
      "totalExercises"
    );

    if (allProgress.length === 0) {
      return res.json({
        completionRate: 0,
        totalQuizzes: 0,
        completedQuizzes: 0,
      });
    }

    // Count completed quizzes
    const completedQuizzes = allProgress.filter(
      (progress) => progress.completed
    ).length;
    const totalQuizzes = allProgress.length;

    // Calculate completion rate as a percentage
    const completionRate = (completedQuizzes / totalQuizzes) * 100;

    res.json({
      completionRate,
      totalQuizzes,
      completedQuizzes,
      trend: calculateTrend(allProgress), // Optional: calculate trend
    });
  } catch (error) {
    console.error("Error calculating completion rate:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Helper function to calculate trend (optional)
function calculateTrend(allProgress) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentProgress = allProgress.filter(
    (p) => new Date(p.lastAttemptDate) > thirtyDaysAgo
  );

  const previousProgress = allProgress.filter(
    (p) => new Date(p.lastAttemptDate) <= thirtyDaysAgo
  );

  const recentRate =
    (recentProgress.filter((p) => p.completed).length / recentProgress.length) *
    100;
  const previousRate =
    (previousProgress.filter((p) => p.completed).length /
      previousProgress.length) *
    100;

  return recentRate - previousRate;
}
module.exports = router;
