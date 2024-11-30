const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    quizId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    questions: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "Bubble Sort",
        "Insertion Sort",
        "Merge Sort",
        "Selection Sort",
        "Addition",
        "Subtraction",
        "Multiplication",
        "Alphabet",
      ],
    },
    category: {
      type: String,
      required: true,
      enum: ["Sorting Algorithms", "Binary Operations"],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Auto-generate quizId before saving
quizSchema.pre("save", async function (next) {
  if (!this.quizId) {
    // Generate a unique ID with prefix QZ and random numbers
    const count = await mongoose.model("Quiz").countDocuments();
    this.quizId = `QZ${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// Create indexes for better query performance
quizSchema.index({ quizId: 1 });
quizSchema.index({ category: 1 });
quizSchema.index({ difficulty: 1 });
quizSchema.index({ type: 1 });

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
