const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  exercisesCompleted: {
    type: Number,
    default: 0,
  },
  totalExercises: {
    type: Number,
    required: true,
  },
  lastAttemptDate: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  // Add new fields for time tracking
  totalTimeSpent: {
    type: Number,
    default: 0, // Total time spent in seconds
  },
  attemptTimes: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      timeSpent: {
        type: Number,
        required: true, // Time spent in seconds
      },
      attemptDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const UserProgress = mongoose.model("UserProgress", userProgressSchema);

module.exports = UserProgress;
