const request = require("supertest");
const app = require("../../server");
const mongoose = require("mongoose");
const User = require("../../models/userModel");

let server;
beforeAll(async () => {
  server = app.listen(5000);
  await User.deleteMany({});
  if (mongoose.connection.readyState === 0) {
    // 0 means disconnected
    await mongoose.connect(
      "mongodb+srv://bontojohnadrian:gVg7dBEvHgjqzL4g@cluster0.izrdc.mongodb.net/tests-db?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase(); // Optional: Clear the test database
  server.close();
  await mongoose.disconnect(); // Disconnect from the database
});

describe("Authentication API For registration", () => {
  // USER
  describe("POST /api/register/user", () => {
    // TEST REGISTER
    it("should register a user successfully", async () => {
      const user = {
        fullName: "John Doe",
        username: "johndoe",
        email: "johndoe@example.com",
        password: "password123",
        dob: "2010-01-01",
      };

      const response = await request(app).post("/api/register/user").send(user);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "User registered successfully"
      );
    });
    // TEST DUPLICATE USERNAME
    test("should fail to register a user with existing email", async () => {
      const user1 = {
        fullName: "Test User",
        username: "testuser1",
        email: "test@example.com", // First username
        password: "password123",
        dob: "2000-01-01",
      };

      const user2 = {
        fullName: "Another User",
        username: "testuser1", // Same username as the first user
        email: "tes2t@example.com",
        password: "password456",
        dob: "2000-01-02",
      };

      // First registration (should succeed)
      await request(app).post("/api/register/user").send(user1);

      // Second registration (should fail)
      const response = await request(app)
        .post("/api/register/user")
        .send(user2);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Username already exists"
      );
    });
    // TEST DUPLICATE EMAIL
    test("should fail to register a user with existing email", async () => {
      const user1 = {
        fullName: "Test User",
        username: "testuser1",
        email: "test@example.com", // First user's email
        password: "password123",
        dob: "2000-01-01",
      };

      const user2 = {
        fullName: "Another User",
        username: "testuser2",
        email: "test@example.com", // Same email as the first user
        password: "password456",
        dob: "2000-01-02",
      };

      // First registration (should succeed)
      await request(app).post("/api/register/user").send(user1);

      // Second registration (should fail)
      const response = await request(app)
        .post("/api/register/user")
        .send(user2);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "Email already exists");
    });
  });
  // ------------------ ADMIN ------------------
  describe("POST /api/register/admin", () => {
    // TEST ADMIN REGISTER
    it("should register an admin successfully", async () => {
      const admin = {
        fullName: "Admin John",
        username: "adminjohn",
        email: "adminjohn@example.com",
        password: "adminpass123",
        dob: "2010-01-01",
      };
      const response = await request(app)
        .post("/api/register/admin")
        .send(admin);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "Admin registered successfully"
      );
    });
    // TEST DUPLICATE ADMIN USERNAME
    test("should fail to register an admin with existing username", async () => {
      const admin1 = {
        fullName: "Test Admin",
        username: "testadmin1",
        email: "testadmin1@example.com",
        password: "adminpass123",
        dob: "2010-01-01",
      };

      const admin2 = {
        fullName: "Another Admin",
        username: "testadmin1", // Same username as the first admin
        email: "testadmin2@example.com",
        password: "adminpass456",
        dob: "2010-01-01",
      };

      // First registration (should succeed)
      await request(app).post("/api/register/admin").send(admin1);

      // Second registration (should fail)
      const response = await request(app)
        .post("/api/register/admin")
        .send(admin2);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Username already exists"
      );
    });

    // TEST DUPLICATE ADMIN EMAIL
    test("should fail to register an admin with existing email", async () => {
      // --- THE EMAIL IS SAME AS THE TEST ON LINE 108 ----
      const admin2 = {
        fullName: "Another Admin",
        username: "testadmin2",
        email: "adminjohn@example.com", // Same email as the first test registration
        password: "adminpass456",
        dob: "2010-01-01",
      };

      // Second registration (should fail)
      const response = await request(app)
        .post("/api/register/admin")
        .send(admin2);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "Email already exists");
    });
  });
});
