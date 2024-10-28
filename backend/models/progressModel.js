const mongoose = require("mongoose");
const progressSchema = new mongoose.Schema({
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
  completed: {
    type: Boolean,
    default: false,
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
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
      userAnswer: String,
      isCorrect: Boolean,
      attemptDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});
