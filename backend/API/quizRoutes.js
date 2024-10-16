const express = require("express");
const Quiz = require("../models/quizModel");
const mongoose = require("mongoose");

const router = express.Router();

// Helper function to validate required fields
const validateQuizFields = (title, instruction, question, answer, category) => {
  return title && instruction && question && answer && category;
};

// POST route to create a new quiz
router.post("/", async (req, res) => {
  try {
    const { title, instruction, question, answer, category } = req.body;

    // Validation check
    if (!validateQuizFields(title, instruction, question, answer, category)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newQuiz = new Quiz({
      title,
      instruction,
      question,
      answer,
      category,
    });

    await newQuiz.save();

    res.status(201).json({
      message: "Quiz created successfully",
      quiz: newQuiz,
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET route to fetch all quizzes (optionally filter by category)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const quizzes = await Quiz.find(query);
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET route to fetch a quiz by ID
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT route to update a quiz by ID
router.put("/:id", async (req, res) => {
  try {
    const { title, instruction, question, answer, category } = req.body;

    if (!title && !instruction && !question && !answer && !category) {
      return res.status(400).json({ message: "No fields to update" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid quiz ID format" });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { title, instruction, question, answer, category },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz ID does not exist" });
    }

    res.status(200).json({
      message: "Quiz updated successfully",
      quiz: updatedQuiz,
    });
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE route to delete a quiz by ID
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid quiz ID format" });
    }

    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz ID does not exist" });
    }

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
