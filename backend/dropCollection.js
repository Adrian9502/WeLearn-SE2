const mongoose = require("mongoose");

async function dropCollection() {
  try {
    // Connect to MongoDB using your connection string
    await mongoose.connect(
      "mongodb+srv://bontojohnadrian:gVg7dBEvHgjqzL4g@cluster0.izrdc.mongodb.net/tests-db?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    // Drop the collection
    await mongoose.connection.dropCollection("your_collection_name");
    console.log("Collection dropped successfully.");
  } catch (error) {
    console.error("Error dropping collection:", error.message);
  } finally {
    // Close the connection
    await mongoose.connection.close();
  }
}

dropCollection();
