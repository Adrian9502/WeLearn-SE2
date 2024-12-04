const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
const { MongoMemoryServer } = require("mongodb-memory-server");
const userModel = require("../models/userModel");
const DailyReward = require("../models/dailyRewardModel");
const dailyRewardRoutes = require("../API/rewardsRoutes");

describe("Daily Reward Routes", () => {
  let app;
  let mongoServer;
  let testUser;
  let testUserId;

  // Add this helper function at the top of your test file
  const getRewardAmount = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6 ? 50 : 25;
  };

  beforeAll(async () => {
    jest.setTimeout(30000);

    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = await mongoServer.getUri();

      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      app = express();
      app.use(express.json());
      app.use("/daily-reward", dailyRewardRoutes);
    } catch (error) {
      console.error("Setup Error:", error);
      throw error;
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    // Clear collections
    await userModel.deleteMany({});
    await DailyReward.deleteMany({});

    // Create test user with all required fields based on your schema
    testUser = await userModel.create({
      fullName: "Test User",
      username: "testuser",
      email: "testuser@example.com",
      password: "testpassword123",
      dob: new Date("1990-01-01"),
      // Optional fields will use their defaults:
      // isAdmin: false (default)
      // coins: 600 (default)
      // profilePicture: null (default)
      // createdAt: Date.now() (default)
      // updatedAt: Date.now() (default)
      // lastRewardClaim: null (default)
    });
    testUserId = testUser._id;
  });
  // Invalid ObjectId Tests
  describe("ObjectId Validation", () => {
    it("should return 400 for invalid user ID", async () => {
      const invalidUserId = "invalidid";

      const getLastClaimResponse = await request(app).get(
        `/daily-reward/${invalidUserId}/last-claim`
      );

      expect(getLastClaimResponse.statusCode).toBe(400);
      expect(getLastClaimResponse.body.error).toBe("Invalid user ID");

      const claimRewardResponse = await request(app)
        .post(`/daily-reward/${invalidUserId}/claim`)
        .send({
          rewardAmount: 100,
          claimDate: new Date().toISOString(),
        });

      expect(claimRewardResponse.statusCode).toBe(400);
      expect(claimRewardResponse.body.error).toBe("Invalid user ID");
    });
  });

  // Last Claim Route Tests
  describe("GET /:userId/last-claim", () => {
    it("should return null for user with no previous claims", async () => {
      const response = await request(app).get(
        `/daily-reward/${testUserId}/last-claim`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.lastClaim).toBeNull();
    });

    it("should return last claim date for user with previous claims", async () => {
      // Create a daily reward record with some claimed dates
      const claimDates = [
        new Date("2023-01-01"),
        new Date("2023-01-02"),
        new Date("2023-01-03"),
      ];

      await DailyReward.create({
        userId: testUserId,
        claimedDates: claimDates.map((date) => ({ date, amount: 100 })),
      });

      const response = await request(app).get(
        `/daily-reward/${testUserId}/last-claim`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.lastClaim).toBe(claimDates[2].toISOString());
      expect(response.body.claimedDates).toHaveLength(3);
    });

    it("should return 404 for non-existent user", async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();

      const response = await request(app).get(
        `/daily-reward/${nonExistentUserId}/last-claim`
      );

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("User not found");
    });
  });

  // Claim Reward Route Tests
  describe("POST /:userId/claim", () => {
    it("should successfully claim a daily reward", async () => {
      const claimDate = new Date();
      const rewardAmount = getRewardAmount(claimDate); // Use the helper function

      // Add this for debugging
      console.log("Test date:", claimDate);
      console.log("Expected reward:", rewardAmount);

      const response = await request(app)
        .post(`/daily-reward/${testUserId}/claim`)
        .send({ rewardAmount, claimDate: claimDate.toISOString() });

      // Add this for debugging
      if (response.statusCode !== 200) {
        console.log("Error Response:", response.body);
      }

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.newCoins).toBe(rewardAmount + 600); // 600 is default starting coins
      expect(response.body.claimedDate).toBeTruthy();

      // Verify user coins updated
      const updatedUser = await userModel.findById(testUserId);
      expect(updatedUser.coins).toBe(rewardAmount + 600);
    });

    it("should prevent claiming reward twice on the same day", async () => {
      const claimDate = new Date();
      const rewardAmount = getRewardAmount(claimDate); // Use the helper function

      // First claim
      const firstResponse = await request(app)
        .post(`/daily-reward/${testUserId}/claim`)
        .send({ rewardAmount, claimDate: claimDate.toISOString() });

      expect(firstResponse.statusCode).toBe(200);

      // Second claim on the same day
      const secondResponse = await request(app)
        .post(`/daily-reward/${testUserId}/claim`)
        .send({ rewardAmount, claimDate: claimDate.toISOString() });

      expect(secondResponse.statusCode).toBe(400);
      expect(secondResponse.body.error).toBe(
        "Reward already claimed for this date"
      );
    });

    it("should handle missing required fields", async () => {
      const response = await request(app)
        .post(`/daily-reward/${testUserId}/claim`)
        .send({}); // Empty payload

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(
        "Missing required fields: rewardAmount and claimDate"
      );
    });

    it("should handle non-existent user", async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();
      const claimDate = new Date();
      const rewardAmount = getRewardAmount(claimDate); // Use the helper function

      const response = await request(app)
        .post(`/daily-reward/${nonExistentUserId}/claim`)
        .send({ rewardAmount, claimDate: claimDate.toISOString() });

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("User not found");
    });
  });
});
