const request = require("supertest");
const app = require("../../server"); // Adjust the path as necessary
const userModel = require("../../models/userModel");
const adminModel = require("../../models/adminModel");

const bcrypt = require("bcryptjs");

beforeEach(async () => {
  // USER
  await userModel.deleteMany({}); // Clean the database

  const user = new userModel({
    fullName: "John Doe",
    username: "lorem123",
    password: "123123",
    email: "johndoe123123@example.com",
    dob: "2010-01-01",
  });
  await user.save(); // Save the user to the database

  // ADMIN
  await adminModel.deleteMany({}); // Clean the database

  const admin = new adminModel({
    fullName: "Jane Doe",
    username: "jane123",
    password: "123123",
    email: "janedoe123123@example.com",
    dob: "2010-03-01",
  });
  await admin.save(); // Save the user to the database
});

// USER
describe("POST /login/user", () => {
  it("should login a USER successfully", async () => {
    const credentials = {
      username: "lorem123",
      password: "123123",
    };

    const response = await request(app).post("/login/user").send(credentials);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token"); // Check for token instead of user directly
    expect(response.body).toHaveProperty("user"); // Also check for user
  });

  it("should fail to login USER with incorrect password", async () => {
    const credentials = {
      username: "lorem123",
      password: "wrongpassword",
    };

    const response = await request(app).post("/login/user").send(credentials);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid password"); // Update the expected message
  });

  it("should fail to login USER with non-existent username", async () => {
    const credentials = {
      username: "nonexistentuser",
      password: "password123",
    };

    const response = await request(app).post("/login/user").send(credentials);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });
});
// ADMIN
describe("POST /login/admin", () => {
  it("should login a ADMIN successfully", async () => {
    const credentials = {
      username: "jane123",
      password: "123123",
    };

    const response = await request(app).post("/login/admin").send(credentials);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token"); // Check for token instead of user directly
    expect(response.body).toHaveProperty("admin"); // Also check for user
  });

  it("should fail to login ADMIN with incorrect password", async () => {
    const credentials = {
      username: "jane123",
      password: "wrongpassword",
    };

    const response = await request(app).post("/login/admin").send(credentials);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid password"); // Update the expected message
  });

  it("should fail to login ADMIN with non-existent username", async () => {
    const credentials = {
      username: "nonexistentuser",
      password: "password123",
    };

    const response = await request(app).post("/login/admin").send(credentials);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("message", "Admin not found");
  });
});
