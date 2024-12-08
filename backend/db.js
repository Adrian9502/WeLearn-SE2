const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

let gfs;
let isConnected = false;
const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

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
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
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
