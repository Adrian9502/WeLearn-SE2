const request = require("supertest");
const app = require("../server"); // Adjust the path as necessary
const userModel = require("../models/userModel"); // Adjust the path as necessary
const mongoose = require("mongoose");

beforeEach(async () => {
  // Clear the database before each test
  await userModel.deleteMany({}); // Clean the database

  // Add test users if needed
  await userModel.insertMany([
    {
      fullName: "User One",
      username: "userone",
      password: "hashedpassword1",
      email: "userone@example.com",
      dob: "2000-01-01",
    },
    {
      fullName: "User Two",
      username: "usertwo",
      password: "hashedpassword2",
      email: "usertwo@example.com",
      dob: "1999-02-02",
    },
  ]);
});

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.statusCode).toBe(200); // Expect status code 200
    expect(response.body).toHaveLength(2); // Expect two users in the response
    expect(response.body[0]).toHaveProperty("fullName", "User One"); // Check for specific user data
    expect(response.body[1]).toHaveProperty("fullName", "User Two");
  });

  it("should handle errors gracefully", async () => {
    // Optionally, you could mock a failure scenario (if you have middleware or other logic that could throw)
    jest.spyOn(userModel, "find").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app).get("/api/users");
    expect(response.statusCode).toBe(500); // Expect status code 500
    expect(response.body).toHaveProperty("message", "Error fetching users"); // Check for error message
  });
});
