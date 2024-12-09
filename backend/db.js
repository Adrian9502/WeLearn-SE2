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

const connectDB = async (retries = 5) => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  console.log("Environment:", process.env.NODE_ENV);
  console.log(
    "MongoDB URI status:",
    process.env.MONGODB_URI ? "Defined" : "Undefined"
  );

  if (!process.env.MONGODB_URI) {
    const error = new Error(
      "MongoDB URI is not configured. Check your environment variables."
    );
    console.error(error.message);
    if (process.env.NODE_ENV === "production") {
      return null;
    }
    throw error;
  }

  while (retries > 0) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      isConnected = true;
      console.log("Database connected successfully");
      // Initialize GridFS
      gfs = new mongoose.mongo.GridFSBucket(conn.connection.db, {
        bucketName: "uploads",
      });
      console.log("GridFS Bucket Initialized");
      return conn;
    } catch (error) {
      console.error(
        `MongoDB connection attempt failed (${retries} retries left):`,
        error.message
      );
      retries--;
      if (retries === 0) {
        if (process.env.NODE_ENV === "production") {
          console.error(
            "All connection attempts failed, but keeping process alive"
          );
          return null;
        } else {
          throw error;
        }
      }
      // Wait for 1 second before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
