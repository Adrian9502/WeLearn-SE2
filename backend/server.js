const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Initialize express app
const app = express();
dotenv.config();
// ----------------MODEL----------------------
// USER MODEL
const userModel = require("./models/User");
// ADMIN MODEL
const adminModel = require("./models/Admin");
// --------------------------------------------
// ----------------MIDDLEWARE-----------------
app.use(cors());
app.use(express.json());

// ---------MONGODB CONNECTION----------------
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// ---------- API ROUTING --------------------

// Route for user registration
app.post("/register/user", (req, res) => {
  userModel
    .create(req.body) // Create a new user using the request body
    .then((User) => res.json(User)) // Respond with the created user data
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Error registering user", error: err.message })
    ); // Handle errors
});

// Route for admin registration
app.post("/register/admin", (req, res) => {
  adminModel
    .create(req.body) // Create a new admin using the request body
    .then((Admin) => res.json(Admin)) // Respond with the created admin data
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Error registering admin", error: err.message })
    ); // Handle errors
});

// Route for user login
app.post("/login/user", async (req, res) => {
  try {
    // Find user by username
    const user = await userModel.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json({ message: "User not found" }); // Handle user not found
    }

    // Compare password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" }); // Handle invalid password
    }

    // Create a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, user }); // Respond with token and user data
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message }); // Handle errors
  }
});

// Route for admin login
app.post("/login/admin", async (req, res) => {
  try {
    // Find admin by username
    const admin = await adminModel.findOne({ username: req.body.username });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" }); // Handle admin not found
    }

    // Compare password
    const isMatch = await bcrypt.compare(req.body.password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" }); // Handle invalid password
    }

    // Create a token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, admin }); // Respond with token and admin data
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message }); // Handle errors
  }
});

// Sample route - for testing
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// GET ALL USERS DATA
app.get("/api/users", async (req, res) => {
  try {
    const users = await userModel.find(); // Use userModel to find all users
    res.status(200).json(users); // Respond with the list of users
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message }); // Handle any errors
  }
});
// GET ALL ADMIN DATA
app.get("/api/admins", async (req, res) => {
  try {
    const admins = await adminModel.find(); // Use userModel to find all users
    res.status(200).json(admins); // Respond with the list of users
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message }); // Handle any errors
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
