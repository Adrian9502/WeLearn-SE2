const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables in development
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

let gfs;
let isConnected = false;

// Set strictQuery to false to prepare for Mongoose 7
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Don't exit in production
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
};

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error: ", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// Function to get GridFS instance
const getGfs = () => gfs;

module.exports = {
  connectDB,
  getGfs,
};
