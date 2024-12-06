const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

let gfs;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

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

// Function to get GridFS instance
const getGfs = () => gfs;

module.exports = {
  connectDB,
  getGfs,
};
