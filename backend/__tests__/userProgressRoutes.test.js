const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const express = require("express");
const UserProgress = require("../models/userProgressModel");
const userProgressRoutes = require("../API/userProgressRoutes");

jest.setTimeout(10000);

// Mock the Quiz model
jest.mock("../models/quizModel", () => {
  return {
    schema: {
      path: jest.fn(),
    },
  };
});
describe("User Progress Routes", () => {
  let app;
  let mongoServer;
  let testUserId;
  let testQuizId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app = express();
    app.use(express.json());
    app.use("/api/progress", userProgressRoutes);

    testUserId = new mongoose.Types.ObjectId();
    testQuizId = new mongoose.Types.ObjectId();
  });

  beforeEach(async () => {
    await UserProgress.deleteMany({});
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("GET /user/:userId/summary", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("should return empty array when no progress exists", async () => {
      // Mock the chain for empty results
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };

      const findSpy = jest
        .spyOn(UserProgress, "find")
        .mockImplementation(() => mockChain);

      try {
        const response = await request(app).get(
          `/api/progress/user/${testUserId}/summary`
        );

        // Add error logging
        if (response.status !== 200) {
          console.error("Empty summary test failed:", response.body);
        }

        expect(response.status).toBe(200);
        expect(response.body.quizzes).toEqual([]);
      } finally {
        findSpy.mockRestore();
      }
    });

    it("should return user progress summary", async () => {
      const mockQuiz = {
        _id: testQuizId,
        title: "Test Quiz",
        totalExercises: 10,
        completed: false,
      };

      const testProgress = {
        _id: new mongoose.Types.ObjectId(),
        userId: testUserId,
        quizId: mockQuiz,
        totalExercises: 10,
        exercisesCompleted: 5,
        completed: false,
        totalTimeSpent: 300,
        attemptTimes: [],
      };

      // Mock the chain with populated data
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([testProgress]),
      };

      const findSpy = jest
        .spyOn(UserProgress, "find")
        .mockImplementation(() => mockChain);

      try {
        const response = await request(app).get(
          `/api/progress/user/${testUserId}/summary`
        );

        // Add error logging
        if (response.status !== 200) {
          console.error("Summary test failed:", response.body);
          console.error("Mock data:", testProgress);
        }

        expect(response.status).toBe(200);
        expect(response.body.quizzes).toHaveLength(1);
        expect(response.body.quizzes[0]).toMatchObject({
          quizId: expect.objectContaining({
            title: "Test Quiz",
            totalExercises: 10,
          }),
          exercisesCompleted: 5,
          totalTimeSpent: 300,
        });
      } finally {
        findSpy.mockRestore();
      }
    });
  });

  describe("GET /:userId/:quizId", () => {
    it("should return 404 when progress not found", async () => {
      const response = await request(app).get(
        `/api/progress/${testUserId}/${testQuizId}`
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Progress not found");
    });

    it("should return progress for specific quiz", async () => {
      const testProgress = new UserProgress({
        userId: testUserId,
        quizId: testQuizId,
        totalExercises: 10,
        exercisesCompleted: 5,
        completed: false,
        totalTimeSpent: 300,
      });
      await testProgress.save();

      const response = await request(app).get(
        `/api/progress/${testUserId}/${testQuizId}`
      );

      expect(response.status).toBe(200);
      expect(response.body.progress.userId.toString()).toBe(
        testUserId.toString()
      );
      expect(response.body.progress.quizId.toString()).toBe(
        testQuizId.toString()
      );
    });
  });

  describe("POST /:userId/:quizId/answer", () => {
    it("should create new progress when none exists", async () => {
      // Mock findOne to return null (no existing progress)
      const findOneMock = jest
        .spyOn(UserProgress, "findOne")
        .mockResolvedValue(null);

      // Mock save to return the new progress
      const mockProgress = {
        _id: new mongoose.Types.ObjectId(),
        userId: testUserId,
        quizId: testQuizId,
        totalExercises: 1,
        exercisesCompleted: 1,
        totalTimeSpent: 60,
        completed: true,
        attemptTimes: [
          {
            questionId: expect.any(mongoose.Types.ObjectId),
            timeSpent: 60,
            attemptDate: expect.any(Date),
          },
        ],
      };

      // Mock the save method
      jest
        .spyOn(UserProgress.prototype, "save")
        .mockResolvedValue(mockProgress);

      // Mock findById for the final population
      jest.spyOn(UserProgress, "findById").mockImplementation(() => ({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProgress),
      }));

      const response = await request(app)
        .post(`/api/progress/${testUserId}/${testQuizId}/answer`)
        .send({
          questionId: new mongoose.Types.ObjectId(),
          userAnswer: "test answer",
          isCorrect: true,
          timeSpent: 60,
        });

      if (response.status !== 200) {
        console.error("Test failed with response:", response.body);
      }

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.progress.exercisesCompleted).toBe(1);
      expect(response.body.progress.totalTimeSpent).toBe(60);

      findOneMock.mockRestore();
    });

    it("should update existing progress", async () => {
      const existingProgress = {
        _id: new mongoose.Types.ObjectId(),
        userId: testUserId,
        quizId: testQuizId,
        totalExercises: 10,
        exercisesCompleted: 0,
        totalTimeSpent: 0,
        completed: false,
        attemptTimes: [],
        save: jest.fn(),
      };

      // Mock findOne to return existing progress
      const findOneMock = jest
        .spyOn(UserProgress, "findOne")
        .mockResolvedValue(existingProgress);

      // Mock the updated progress
      const updatedProgress = {
        ...existingProgress,
        exercisesCompleted: 1,
        totalTimeSpent: 60,
        attemptTimes: [
          {
            questionId: expect.any(mongoose.Types.ObjectId),
            timeSpent: 60,
            attemptDate: expect.any(Date),
          },
        ],
      };

      existingProgress.save.mockResolvedValue(updatedProgress);

      // Mock findById for the final population
      jest.spyOn(UserProgress, "findById").mockImplementation(() => ({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(updatedProgress),
      }));

      const response = await request(app)
        .post(`/api/progress/${testUserId}/${testQuizId}/answer`)
        .send({
          questionId: new mongoose.Types.ObjectId(),
          userAnswer: "test answer",
          isCorrect: true,
          timeSpent: 60,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.progress.exercisesCompleted).toBe(1);
      expect(response.body.progress.totalTimeSpent).toBe(60);

      findOneMock.mockRestore();
    });
  });

  describe("GET /:userId/:quizId/time-analytics", () => {
    it("should return 404 when no progress exists", async () => {
      const response = await request(app).get(
        `/api/progress/${testUserId}/${testQuizId}/time-analytics`
      );

      expect(response.status).toBe(404);
    });

    it("should return time analytics", async () => {
      const testProgress = new UserProgress({
        userId: testUserId,
        quizId: testQuizId,
        totalExercises: 10,
        exercisesCompleted: 2,
        completed: false,
        totalTimeSpent: 120,
        attemptTimes: [
          {
            questionId: new mongoose.Types.ObjectId(),
            timeSpent: 60,
            attemptDate: new Date(),
          },
          {
            questionId: new mongoose.Types.ObjectId(),
            timeSpent: 60,
            attemptDate: new Date(),
          },
        ],
      });
      await testProgress.save();

      const response = await request(app).get(
        `/api/progress/${testUserId}/${testQuizId}/time-analytics`
      );

      expect(response.status).toBe(200);
      expect(response.body.totalTimeSpent).toBe(120);
      expect(response.body.averageTimePerQuestion).toBe(60);
      expect(response.body.attemptTimes).toHaveLength(2);
    });
  });

  describe("GET /rankings", () => {
    it("should return rankings when there is progress data", async () => {
      const testProgress = new UserProgress({
        userId: testUserId,
        quizId: testQuizId,
        totalExercises: 10,
        exercisesCompleted: 5,
        completed: true,
        totalTimeSpent: 300,
        attemptTimes: [
          {
            questionId: new mongoose.Types.ObjectId(),
            timeSpent: 60,
            attemptDate: new Date(),
          },
        ],
      });
      await testProgress.save();

      // Create mock populated data
      const mockPopulatedData = {
        _id: testProgress._id,
        userId: {
          _id: testUserId,
          username: "testuser",
          coins: 100,
        },
        quizId: {
          _id: testQuizId,
          title: "Test Quiz",
        },
        totalExercises: 10,
        exercisesCompleted: 5,
        completed: true,
        totalTimeSpent: 300,
        attemptTimes: testProgress.attemptTimes,
      };

      // Mock the mongoose chain
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
      };
      mockChain.populate.mockReturnValueOnce(mockChain);
      mockChain.populate.mockResolvedValueOnce([mockPopulatedData]);

      jest.spyOn(UserProgress, "find").mockImplementation(() => mockChain);

      try {
        const response = await request(app).get("/api/progress/rankings");

        // Add error logging
        if (response.status !== 200) {
          console.error("Rankings test failed with response:", response.body);
          console.error("Mock data:", mockPopulatedData);
        }

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("completionRankings");
        expect(response.body.completionRankings).toBeInstanceOf(Array);
        expect(response.body.completionRankings).toHaveLength(1);
        expect(response.body.completionRankings[0]).toMatchObject({
          username: "testuser",
          completedQuizzes: 1,
          totalTime: 300,
        });
      } finally {
        jest.restoreAllMocks();
      }
    });

    it("should handle empty progress data", async () => {
      // Mock the mongoose chain for empty results
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
      };
      mockChain.populate.mockReturnValueOnce(mockChain);
      mockChain.populate.mockResolvedValueOnce([]);

      jest.spyOn(UserProgress, "find").mockImplementation(() => mockChain);

      try {
        const response = await request(app).get("/api/progress/rankings");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          completionRankings: [],
          timeRankings: [],
          coinRankings: [],
          consistencyRankings: [],
          efficiencyRankings: [],
        });
      } finally {
        jest.restoreAllMocks();
      }
    });
  });

  describe("GET /completion-stats", () => {
    beforeEach(() => {
      // Reset all mocks before each test
      jest.resetAllMocks();
    });

    it("should return zero stats when no progress exists", async () => {
      // Create a mock query chain
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };

      // Mock the find method
      jest.spyOn(UserProgress, "find").mockReturnValue(mockQuery);

      try {
        const response = await request(app).get(
          "/api/progress/completion-stats"
        );

        // Add error logging
        if (response.status !== 200) {
          console.error("Zero stats test failed with response:", response.body);
        }

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          completionRate: 0,
          totalQuizzes: 0,
          completedQuizzes: 0,
          trend: 0,
        });
      } finally {
        jest.restoreAllMocks();
      }
    });

    it("should return completion statistics", async () => {
      const testProgress = new UserProgress({
        userId: testUserId,
        quizId: testQuizId,
        totalExercises: 10,
        exercisesCompleted: 10,
        completed: true,
        totalTimeSpent: 300,
        lastAttemptDate: new Date(),
      });

      // Create mock populated data
      const mockPopulatedData = {
        ...testProgress.toObject(),
        quizId: {
          _id: testQuizId,
          title: "Test Quiz",
          totalExercises: 10,
        },
      };

      // Create a mock query chain
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockPopulatedData]),
      };

      // Mock the find method
      jest.spyOn(UserProgress, "find").mockReturnValue(mockQuery);

      try {
        const response = await request(app).get(
          "/api/progress/completion-stats"
        );

        // Add error logging
        if (response.status !== 200) {
          console.error(
            "Completion stats test failed with response:",
            response.body
          );
          console.error("Mock data:", mockPopulatedData);
        }

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("completionRate");
        expect(response.body).toHaveProperty("totalQuizzes");
        expect(response.body).toHaveProperty("completedQuizzes");
        expect(response.body.completionRate).toBe(100);
        expect(response.body.totalQuizzes).toBe(1);
        expect(response.body.completedQuizzes).toBe(1);
        expect(response.body).toHaveProperty("trend");
      } finally {
        jest.restoreAllMocks();
      }
    });
  });
});
