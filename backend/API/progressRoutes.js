const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Progress = require("../models/progressModel");
const Quiz = require("../models/quizModel");

router.get("/user/:userId/summary", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all progress records for the user with populated quiz data
    const progress = await Progress.find({ userId })
      .populate("quizId", "title category")
      .lean();

    // Transform the data for frontend consumption
    const quizzes = progress.map((p) => ({
      _id: p.quizId._id,
      title: p.quizId.title,
      category: p.quizId.category,
      exercisesCompleted: p.exercisesCompleted,
      totalExercises: p.totalExercises,
      completed: p.completed,
      lastAttemptDate: p.lastAttemptDate,
    }));

    res.json({
      success: true,
      quizzes,
      message: "Progress summary retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching progress summary:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Add route to save answer and update progress
router.post("/:userId/:quizId/answer", async (req, res) => {
  try {
    const { userId, quizId } = req.params;
    const { questionId, userAnswer, isCorrect } = req.body;

    console.log("Received request:", {
      userId,
      quizId,
      questionId,
      userAnswer,
      isCorrect,
    });

    // Validate MongoDB ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(quizId) ||
      !mongoose.Types.ObjectId.isValid(questionId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    let progress = await Progress.findOne({
      userId: mongoose.Types.ObjectId(userId),
      quizId: mongoose.Types.ObjectId(quizId),
    });

    if (!progress) {
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({
          success: false,
          message: "Quiz not found",
        });
      }

      progress = new Progress({
        userId: mongoose.Types.ObjectId(userId),
        quizId: mongoose.Types.ObjectId(quizId),
        totalExercises: quiz.totalExercises || 1, // Fallback to 1 if not specified
      });
    }

    // Add the answer to the answers array
    progress.answers.push({
      questionId: mongoose.Types.ObjectId(questionId),
      userAnswer,
      isCorrect,
    });

    // Update progress counts
    progress.exercisesCompleted = progress.answers.filter(
      (a) => a.isCorrect
    ).length;
    progress.completed = progress.exercisesCompleted >= progress.totalExercises;
    progress.lastAttemptDate = Date.now();

    await progress.save();

    res.json({
      success: true,
      progress,
      message: "Answer recorded and progress updated",
    });
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update progress",
      error: error.message,
    });
  }
});

// DELETE progress for a specific user and quiz
router.delete("/:userId/:quizId", async (req, res) => {
  try {
    const { userId, quizId } = req.params;
    const result = await Progress.findOneAndDelete({ userId, quizId });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "No progress found to delete",
      });
    }

    res.json({
      success: true,
      message: "Progress deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting progress:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
