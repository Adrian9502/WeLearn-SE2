const request = require("supertest");
const mongoose = require("mongoose");
const express = require("express");
const QuizRoute = require("../API/quizRoutes");
const Quiz = require("../models/quizModel");

// Mock the Quiz model
jest.mock("../models/quizModel");

let app;

beforeEach(() => {
  app = express();
  app.use(express.json());
  app.use("/api/quizzes", QuizRoute);
});

// Test Data
const validQuizData = {
  title: "Sorting Algorithms Quiz",
  instructions: "Complete the sorting algorithm",
  questions: ["Sort this array"],
  answer: ["Sorted Array"],
  type: "Bubble Sort",
  difficulty: "Easy",
  category: "Sorting Algorithms",
};

const invalidQuizData = {
  title: "Invalid Quiz",
  type: "Invalid Type",
};
describe("Quiz Routes", () => {
  describe("POST /quizzes", () => {
    it("should create a new quiz successfully", async () => {
      // Create a mock quiz with an ID
      const mockSavedQuiz = {
        ...validQuizData,
        _id: new mongoose.Types.ObjectId().toString(),
        toJSON: function () {
          return {
            ...this,
            _id: this._id.toString(),
          };
        },
        toObject: function () {
          return {
            ...this,
            _id: this._id.toString(),
          };
        },
      };

      // Set up the mock implementation
      Quiz.mockImplementation(() => ({
        ...mockSavedQuiz,
        save: jest.fn().mockResolvedValue(mockSavedQuiz),
      }));

      const res = await request(app).post("/api/quizzes").send(validQuizData);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Quiz created successfully");
      expect(res.body.quiz).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          title: validQuizData.title,
          instructions: validQuizData.instructions,
          questions: validQuizData.questions,
          answer: validQuizData.answer,
          type: validQuizData.type,
          difficulty: validQuizData.difficulty,
          category: validQuizData.category,
        })
      );

      // Verify the Quiz constructor was called with the correct data
      expect(Quiz).toHaveBeenCalledWith(validQuizData);
    });

    it("should return 400 for missing required fields", async () => {
      const res = await request(app).post("/api/quizzes").send(invalidQuizData);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Missing required fields");
    });

    it("should return 400 for invalid quiz type", async () => {
      const invalidTypeQuiz = {
        ...validQuizData,
        type: "Invalid Type",
      };

      const res = await request(app).post("/api/quizzes").send(invalidTypeQuiz);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid quiz type");
    });
  });

  describe("GET /quizzes", () => {
    it("should fetch all quizzes", async () => {
      const mockQuizzes = [
        { ...validQuizData, _id: new mongoose.Types.ObjectId() },
        { ...validQuizData, _id: new mongoose.Types.ObjectId() },
      ];

      Quiz.find = jest.fn().mockResolvedValue(mockQuizzes);

      const res = await request(app).get("/api/quizzes");

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it("should fetch quizzes by category", async () => {
      const mockQuizzes = [
        { ...validQuizData, _id: new mongoose.Types.ObjectId() },
      ];

      Quiz.find = jest.fn().mockResolvedValue(mockQuizzes);

      const res = await request(app).get(
        "/api/quizzes?category=Sorting Algorithms"
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe("GET /quizzes/:id", () => {
    it("should fetch a single quiz by ID", async () => {
      const mockQuizId = new mongoose.Types.ObjectId().toString();
      const mockQuiz = {
        ...validQuizData,
        _id: mockQuizId,
      };

      Quiz.findById = jest.fn().mockResolvedValue(mockQuiz);

      const res = await request(app).get(`/api/quizzes/${mockQuizId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.objectContaining(validQuizData));
    });

    it("should return 404 if quiz is not found", async () => {
      const mockQuizId = new mongoose.Types.ObjectId().toString();

      Quiz.findById = jest.fn().mockResolvedValue(null);

      const res = await request(app).get(`/api/quizzes/${mockQuizId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Quiz not found");
    });
  });

  it("should return 404 if quiz is not found", async () => {
    Quiz.findById = jest.fn().mockResolvedValue(null);

    const res = await request(app).get("/api/quizzes/invalidId");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Quiz not found");
  });
});

describe("PUT /quizzes/:id", () => {
  it("should update a quiz successfully", async () => {
    const mockQuizId = new mongoose.Types.ObjectId();
    const updateData = {
      title: "Updated Quiz Title",
    };

    const mockUpdatedQuiz = {
      ...validQuizData,
      ...updateData,
      _id: mockQuizId,
    };

    Quiz.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedQuiz);

    const res = await request(app)
      .put(`/api/quizzes/${mockQuizId}`)
      .send(updateData);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Quiz updated successfully");
    expect(res.body.quiz.title).toBe("Updated Quiz Title");
  });

  it("should return 400 if no fields to update", async () => {
    const mockQuizId = new mongoose.Types.ObjectId();

    const res = await request(app).put(`/api/quizzes/${mockQuizId}`).send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("No fields to update");
  });

  it("should return 400 for invalid quiz type", async () => {
    const mockQuizId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .put(`/api/quizzes/${mockQuizId}`)
      .send({ type: "Invalid Type" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid quiz type");
  });
});

describe("DELETE /quizzes/:id", () => {
  it("should delete a quiz successfully", async () => {
    const mockQuizId = new mongoose.Types.ObjectId();
    const mockQuiz = { ...validQuizData, _id: mockQuizId };

    Quiz.findByIdAndDelete = jest.fn().mockResolvedValue(mockQuiz);

    const res = await request(app).delete(`/api/quizzes/${mockQuizId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Quiz deleted successfully");
  });

  it("should return 404 if quiz does not exist", async () => {
    const mockQuizId = new mongoose.Types.ObjectId();

    Quiz.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    const res = await request(app).delete(`/api/quizzes/${mockQuizId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Quiz ID does not exist");
  });

  it("should return 400 for invalid quiz ID format", async () => {
    const res = await request(app).delete("/api/quizzes/invalidId");

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid quiz ID format");
  });
});
