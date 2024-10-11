const express = require("express");
const quizModel = require("../models/quizModel");

const router = express.Router();

// POST route to create a new quiz
router.post("/", async (req, res) => {
  try {
    const { title, instruction, question, answer } = req.body;

    // Validation check
    if (!title || !instruction || !question || !answer) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newQuiz = new quizModel({
      title,
      instruction,
      question,
      answer,
    });

    await newQuiz.save();

    res.status(201).json({
      message: "Quiz created successfully",
      quiz: {
        _id: newQuiz._id,
        title: newQuiz.title,
        instruction: newQuiz.instruction,
        question: newQuiz.question,
        answer: newQuiz.answer,
      },
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET route to fetch all quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await quizModel.find();

    // Format the response
    const formattedQuizzes = quizzes.map((quiz) => ({
      _id: quiz._id,
      title: quiz.title,
      instruction: quiz.instruction,
      question: quiz.question,
      answer: quiz.answer,
    }));

    res.status(200).json(formattedQuizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET route to fetch a quiz by ID
router.get("/:id", async (req, res) => {
  try {
    const quiz = await quizModel.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({
      _id: quiz._id,
      title: quiz.title,
      instruction: quiz.instruction,
      question: quiz.question,
      answer: quiz.answer,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT route to update a quiz by ID
router.put("/:id", async (req, res) => {
  try {
    const { title, instruction, question, answer } = req.body;

    // Check if at least one field is provided
    if (!title && !instruction && !question && !answer) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updatedQuiz = await quizModel.findByIdAndUpdate(
      req.params.id,
      { title, instruction, question, answer },
      { new: true } // Return the updated document
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({
      message: "Quiz updated successfully",
      quiz: {
        _id: updatedQuiz._id,
        title: updatedQuiz.title,
        instruction: updatedQuiz.instruction,
        question: updatedQuiz.question,
        answer: updatedQuiz.answer,
      },
    });
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE route to delete a quiz by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedQuiz = await quizModel.findByIdAndDelete(req.params.id);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Invalid ID" });
  }
});

module.exports = router;
