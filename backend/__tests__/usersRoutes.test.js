const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const { MongoMemoryServer } = require("mongodb-memory-server");
const userRoutes = require("../API/usersRoutes");
const userModel = require("../models/userModel");

describe("User Controller Routes", () => {
  let app;
  let testUser;
  let testUserId;
  let mongoServer;

  // Setup before all tests
  beforeAll(async () => {
    // Create an instance of MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();

    // Connect to the in-memory database
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create Express app and use routes
    app = express();
    app.use(express.json());
    app.use("/api/users", userRoutes);
  });

  // Cleanup after all tests
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Reset database before each test
  beforeEach(async () => {
    // Clear existing users
    await userModel.deleteMany({});

    // Create a test user
    testUser = new userModel({
      username: "testuser",
      email: "test@example.com",
      password: await bcrypt.hash("password123", 10),
      fullName: "Test User",
      dob: new Date("1990-01-01"),
      coins: 600,
    });
    await testUser.save();
    testUserId = testUser._id.toString();
  });

  // GET All Users Test
  describe("GET /", () => {
    it("should retrieve all users", async () => {
      const response = await request(app).get("/api/users");

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].username).toBe("testuser");
    });

    it("should sort users", async () => {
      // Create another user for sorting test
      const secondUser = new userModel({
        username: "anotheruser",
        email: "another@example.com",
        password: await bcrypt.hash("password456", 10),
        fullName: "Another User",
        dob: new Date("1985-01-01"),
        coins: 300,
      });
      await secondUser.save();

      const response = await request(app)
        .get("/api/users")
        .query({ sortBy: "username", order: "desc" });

      expect(response.statusCode).toBe(200);
      expect(response.body[0].username).toBe("testuser");
    });
  });

  // GET Single User Test
  describe("GET /:id", () => {
    it("should retrieve a single user", async () => {
      const response = await request(app).get(`/api/users/${testUserId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.username).toBe("testuser");
    });

    it("should return 404 for non-existent user", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/users/${fakeId}`);

      expect(response.statusCode).toBe(404);
    });
  });

  // CREATE User Test
  describe("POST /", () => {
    it("should create a new user", async () => {
      const newUserData = {
        username: "newuser",
        email: "newuser@example.com",
        password: "newpassword123",
        fullName: "New User",
        dob: "1995-01-01",
      };

      const response = await request(app).post("/api/users").send(newUserData);

      expect(response.statusCode).toBe(201);
      expect(response.body.username).toBe("newuser");
      expect(response.body.coins).toBe(600);
    });

    it("should prevent creating a user with duplicate username/email", async () => {
      const duplicateUserData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        fullName: "Duplicate User",
        dob: "1990-01-01",
      };

      const response = await request(app)
        .post("/api/users")
        .send(duplicateUserData);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Username or email already exists");
    });
  });

  // UPDATE User Test
  describe("PUT /:id", () => {
    it("should update an existing user", async () => {
      const updateData = {
        username: "updateduser",
        email: "updated@example.com",
        fullName: "Updated User",
        dob: "1991-01-01",
      };

      const response = await request(app)
        .put(`/api/users/${testUserId}`)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body.username).toBe("updateduser");
      expect(response.body.email).toBe("updated@example.com");
    });
  });

  // UPDATE Coins Test
  describe("PUT /:id/coins", () => {
    it("should add coins to a user", async () => {
      const response = await request(app)
        .put(`/api/users/${testUserId}/coins`)
        .send({ coins: 100, operation: "add" });

      expect(response.statusCode).toBe(200);
      expect(response.body.coins).toBe(700);
    });

    it("should subtract coins from a user", async () => {
      const response = await request(app)
        .put(`/api/users/${testUserId}/coins`)
        .send({ coins: 100, operation: "subtract" });

      expect(response.statusCode).toBe(200);
      expect(response.body.coins).toBe(500);
    });
  });

  // DELETE User Test
  describe("DELETE /:id", () => {
    it("should delete a user", async () => {
      const response = await request(app).delete(`/api/users/${testUserId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("User deleted successfully");

      // Verify user is actually deleted
      const deletedUser = await userModel.findById(testUserId);
      expect(deletedUser).toBeNull();
    });
  });
});
