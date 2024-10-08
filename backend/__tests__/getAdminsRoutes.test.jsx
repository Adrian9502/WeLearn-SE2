const request = require("supertest");
const app = require("../server"); // Adjust the path as necessary
const adminModel = require("../models/adminModel"); // Adjust the path as necessary
const mongoose = require("mongoose");

beforeEach(async () => {
  // Clear the database before each test
  await adminModel.deleteMany({}); // Clean the database

  // Add test users if needed
  await adminModel.insertMany([
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

describe("GET /api/admins", () => {
  it("should return all ADMIN", async () => {
    const response = await request(app).get("/api/admins");

    expect(response.statusCode).toBe(200); // Expect status code 200
    expect(response.body).toHaveLength(2); // Expect two users in the response
    expect(response.body[0]).toHaveProperty("fullName", "User One"); // Check for specific user data
    expect(response.body[1]).toHaveProperty("fullName", "User Two");
  });

  it("should handle errors gracefully in ADMIN", async () => {
    // Optionally, you could mock a failure scenario (if you have middleware or other logic that could throw)
    jest.spyOn(adminModel, "find").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app).get("/api/admins");
    expect(response.statusCode).toBe(500); // Expect status code 500
    expect(response.body).toHaveProperty("message", "Error fetching admins"); // Check for error message
  });
});
