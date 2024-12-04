const mongoose = require("mongoose");

module.exports = async () => {
  process.env.MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/testdb";
};
