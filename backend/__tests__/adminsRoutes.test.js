const request = require("supertest");
const mongoose = require("mongoose");
const express = require("express");
const { MongoMemoryServer } = require("mongodb-memory-server");
const adminRoutes = require("../API/adminsRoutes");
const adminModel = require("../models/adminModel");
const path = require("path");
const fs = require("fs").promises;
const bcrypt = require("bcryptjs");

describe("Admin Routes", () => {
  let app;
  let mongoServer;
  let testAdmin;
  let testAdminId;

  beforeAll(async () => {
    // Create MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();

    await mongoose.connect(mongoUri);

    // Setup Express app
    app = express();
    app.use(express.json());
    app.use("/api/admins", adminRoutes);

    // Create uploads directory
    const uploadPath = path.join(
      process.cwd(),
      "uploads",
      "profile-pictures",
      "admin"
    );
    await fs.mkdir(uploadPath, { recursive: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();

    // Cleanup uploads directory
    try {
      await fs.rm(path.join(process.cwd(), "uploads"), { recursive: true });
    } catch (error) {
      console.error("Error cleaning up uploads directory:", error);
    }
  });

  beforeEach(async () => {
    await adminModel.deleteMany({});

    // Create test admin with all required fields
    testAdmin = new adminModel({
      username: "testadmin",
      email: "test@admin.com",
      password: "password123",
      fullName: "Test Admin",
      dob: new Date("1990-01-01"),
      isAdmin: true,
    });
    await testAdmin.save();
    testAdminId = testAdmin._id.toString();
  });

  describe("GET /", () => {
    it("should retrieve all admins", async () => {
      const response = await request(app).get("/api/admins");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].username).toBe("testadmin");
      expect(response.body[0].isAdmin).toBe(true);
    });
  });

  describe("GET /:id", () => {
    it("should retrieve a single admin", async () => {
      const response = await request(app).get(`/api/admins/${testAdminId}`);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe("testadmin");
      expect(response.body.fullName).toBe("Test Admin");
      expect(new Date(response.body.dob)).toEqual(new Date("1990-01-01"));
    });

    it("should return 404 for non-existent admin", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/admins/${fakeId}`);

      expect(response.status).toBe(404);
    });
  });

  describe("POST /", () => {
    it("should create a new admin", async () => {
      const newAdminData = {
        username: "newadmin",
        email: "new@admin.com",
        password: "newpassword123",
        fullName: "New Admin",
        dob: "1995-01-01",
        isAdmin: true,
      };

      const response = await request(app)
        .post("/api/admins")
        .send(newAdminData);

      expect(response.status).toBe(201);
      expect(response.body.username).toBe("newadmin");
      expect(response.body.fullName).toBe("New Admin");
      expect(response.body.isAdmin).toBe(true);

      // Verify password was hashed
      const savedAdmin = await adminModel.findById(response.body._id);
      expect(await savedAdmin.matchPassword("newpassword123")).toBe(true);
    });

    it("should prevent creating admin with duplicate username/email", async () => {
      const duplicateData = {
        username: "testadmin",
        email: "test@admin.com",
        password: "password123",
        fullName: "Duplicate Admin",
        dob: "1990-01-01",
      };

      const response = await request(app)
        .post("/api/admins")
        .send(duplicateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Username or email already exists");
    });

    it("should require all necessary fields", async () => {
      const incompleteData = {
        username: "incomplete",
        email: "incomplete@admin.com",
        // Missing required fields
      };

      const response = await request(app)
        .post("/api/admins")
        .send(incompleteData);

      expect(response.status).toBe(500);
      expect(response.body.error).toContain("validation failed");
    });
  });

  describe("PUT /:id", () => {
    it("should update an existing admin", async () => {
      const updateData = {
        username: "updatedadmin",
        email: "updated@admin.com",
        fullName: "Updated Admin",
        dob: "1991-01-01",
      };

      const response = await request(app)
        .put(`/api/admins/${testAdminId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe("updatedadmin");
      expect(response.body.fullName).toBe("Updated Admin");
      expect(new Date(response.body.dob)).toEqual(new Date("1991-01-01"));
      expect(response.body.updatedAt).not.toBe(response.body.createdAt);
    });

    it("should prevent updating to existing username/email", async () => {
      // Create another admin first
      const anotherAdmin = new adminModel({
        username: "another",
        email: "another@admin.com",
        password: "password123",
        fullName: "Another Admin",
        dob: new Date("1990-01-01"),
      });
      await anotherAdmin.save();

      const updateData = {
        username: "another",
        email: "another@admin.com",
      };

      const response = await request(app)
        .put(`/api/admins/${testAdminId}`)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Username or email already exists");
    });
  });

  describe("Profile Picture Routes", () => {
    describe("GET /:id/profile-picture", () => {
      it("should return default picture for new admin", async () => {
        const response = await request(app).get(
          `/api/admins/${testAdminId}/profile-picture`
        );

        expect(response.status).toBe(200);
        // Update the expected default picture URL to match the API response
        expect(response.body.profilePicture).toBe(
          "https://cdn-icons-png.freepik.com/512/6858/6858441.png"
        );
      });
    });

    describe("PUT /:id/profile-picture", () => {
      it("should upload and update profile picture", async () => {
        // Create test image
        const testImagePath = path.join(
          __dirname,
          "test-files",
          "test-image.jpg"
        );
        await fs.mkdir(path.dirname(testImagePath), { recursive: true });
        const testImageBuffer = Buffer.from(
          "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
          "base64"
        );
        await fs.writeFile(testImagePath, testImageBuffer);

        const response = await request(app)
          .put(`/api/admins/${testAdminId}/profile-picture`)
          .attach("profilePicture", testImagePath);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(
          "Profile picture updated successfully"
        );
        expect(response.body.profilePicture).toMatch(
          /\/uploads\/profile-pictures\/admin\/.+/
        );

        // Verify the admin was updated
        const updatedAdmin = await adminModel.findById(testAdminId);
        expect(updatedAdmin.profilePicture).toBe(response.body.profilePicture);

        // Cleanup
        await fs.unlink(testImagePath);
      });

      it("should handle invalid file types", async () => {
        const testFilePath = path.join(__dirname, "test-files", "test.txt");
        await fs.mkdir(path.dirname(testFilePath), { recursive: true });
        await fs.writeFile(testFilePath, "test content");

        const response = await request(app)
          .put(`/api/admins/${testAdminId}/profile-picture`)
          .attach("profilePicture", testFilePath);

        expect(response.status).toBe(400); // Changed from 500 to 400
        expect(response.body).toEqual({
          success: false,
          message: "Invalid file type. Only JPEG, PNG and GIF are allowed.",
        });

        // Cleanup
        await fs.unlink(testFilePath);
      });

      // Add a test for missing file
      it("should handle missing file", async () => {
        const response = await request(app).put(
          `/api/admins/${testAdminId}/profile-picture`
        );

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("No file uploaded");
      });
    });
  });

  describe("Password Hashing", () => {
    it("should hash password on admin creation", async () => {
      const plainPassword = "testpassword123";
      const newAdmin = new adminModel({
        username: "passwordtest",
        email: "password@test.com",
        password: plainPassword,
        fullName: "Password Test",
        dob: new Date("1990-01-01"),
      });

      await newAdmin.save();

      // Verify password was hashed
      expect(newAdmin.password).not.toBe(plainPassword);
      expect(await newAdmin.matchPassword(plainPassword)).toBe(true);
    });

    it("should correctly match passwords", async () => {
      expect(await testAdmin.matchPassword("password123")).toBe(true);
      expect(await testAdmin.matchPassword("wrongpassword")).toBe(false);
    });
  });
});
