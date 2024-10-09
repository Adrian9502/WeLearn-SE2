const express = require("express");
const quizModel = require("../models/quizModel");

const router = express.Router();

// POST route to create a new quiz
router.post("/", async (req, res) => {
  try {
    const { title, instruction, questions } = req.body;
    console.log(req.body);
    // Validation check
    if (!title || !instruction || questions.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new quiz using the data from the request body
    const newQuiz = new quizModel({
      title,
      instruction,
      questions,
    });

    // Save the quiz to the database
    await newQuiz.save();

    res
      .status(201)
      .json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (error) {
    console.error("Error creating quiz:", error); // Log error details
    res.status(500).json({ message: "Server error" });
  }
});

// GET route to fetch all quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await quizModel.find();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
