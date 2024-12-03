const request = require("supertest");
const mongoose = require("mongoose");
const express = require("express");
const analyticsRoutes = require("../API/analyticsRoute");
const UserProgress = require("../models/userProgressModel");
const Quiz = require("../models/quizModel");

// Mock the models to control test data
jest.mock("../models/userProgressModel");
jest.mock("../models/quizModel");

describe("Analytics Routes", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/analytics", analyticsRoutes);
  });

  describe("GET /user-activity", () => {
    it("should return user activity data for the default week range", async () => {
      // Mock aggregation result
      const mockUserActivity = [
        {
          date: "2024-01-01",
          activeUsers: 5,
          attempts: 10,
        },
        {
          date: "2024-01-02",
          activeUsers: 7,
          attempts: 15,
        },
      ];

      UserProgress.aggregate.mockResolvedValue(mockUserActivity);

      const res = await request(app).get("/api/analytics/user-activity");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockUserActivity);

      // Verify the aggregate method was called
      expect(UserProgress.aggregate).toHaveBeenCalledTimes(1);

      // Check the aggregation pipeline has the correct stages
      const aggregationCall = UserProgress.aggregate.mock.calls[0][0];

      // Check $match stage
      expect(aggregationCall[0].$match).toBeDefined();
      expect(aggregationCall[0].$match.lastAttemptDate).toBeDefined();

      // Check $group stage
      expect(aggregationCall[1].$group).toBeDefined();
      expect(aggregationCall[1].$group._id).toBeDefined();
      expect(aggregationCall[1].$group.activeUsers).toBeDefined();
      expect(aggregationCall[1].$group.totalAttempts).toBeDefined();

      // Check $project stage
      expect(aggregationCall[2].$project).toBeDefined();

      // Check $sort stage
      expect(aggregationCall[3].$sort).toBeDefined();
    });

    it("should handle different time ranges", async () => {
      // Test month range
      UserProgress.aggregate.mockResolvedValue([]);

      const res = await request(app).get(
        "/api/analytics/user-activity?range=month"
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should handle server errors", async () => {
      UserProgress.aggregate.mockRejectedValue(new Error("Database error"));

      const res = await request(app).get("/api/analytics/user-activity");

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe("Database error");
    });
  });

  describe("GET /quiz-stats", () => {
    it("should return comprehensive quiz statistics", async () => {
      // Mock aggregation results
      const mockCompletionData = [
        {
          category: "JavaScript",
          completionRate: 75.5,
        },
      ];

      const mockCategoryData = [
        {
          name: "JavaScript",
          value: 10,
        },
      ];

      const mockDifficultyData = [
        {
          difficulty: "Easy",
          count: 5,
        },
      ];

      UserProgress.aggregate.mockResolvedValueOnce(mockCompletionData);
      Quiz.aggregate.mockResolvedValueOnce(mockCategoryData);
      Quiz.aggregate.mockResolvedValueOnce(mockDifficultyData);

      const res = await request(app).get("/api/analytics/quiz-stats");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.completionData).toEqual(mockCompletionData);
      expect(res.body.categoryData).toEqual(mockCategoryData);
      expect(res.body.difficultyData).toEqual(mockDifficultyData);
    });

    it("should handle server errors in quiz stats", async () => {
      UserProgress.aggregate.mockRejectedValue(new Error("Quiz stats error"));

      const res = await request(app).get("/api/analytics/quiz-stats");

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe("Quiz stats error");
    });
  });

  describe("GET /time-stats", () => {
    it("should return time-based quiz statistics", async () => {
      // Mock time statistics
      const mockTimeStats = [
        {
          _id: "quiz123",
          quizTitle: "JavaScript Basics",
          avgTime: 300,
          minTime: 150,
          maxTime: 600,
        },
      ];

      UserProgress.aggregate.mockResolvedValue(mockTimeStats);

      const res = await request(app).get("/api/analytics/time-stats");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockTimeStats);
    });

    it("should handle server errors in time stats", async () => {
      UserProgress.aggregate.mockRejectedValue(new Error("Time stats error"));

      const res = await request(app).get("/api/analytics/time-stats");

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe("Time stats error");
    });
  });
});
