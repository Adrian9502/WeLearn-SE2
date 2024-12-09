const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

// Load environment variables in development
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Check if required environment variables are present
const requiredVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Verify configuration
const verifyConfig = () => {
  try {
    const config = cloudinary.config();
    const isConfigValid =
      config.cloud_name && config.api_key && config.api_secret;

    if (!isConfigValid) {
      throw new Error("Invalid Cloudinary configuration");
    }

    console.log("Cloudinary Configuration:", {
      hasCloudName: !!config.cloud_name,
      hasApiKey: !!config.api_key,
      hasApiSecret: !!config.api_secret,
    });
    return true;
  } catch (error) {
    console.error("Cloudinary Configuration Error:", error);
    throw error;
  }
};

verifyConfig();

module.exports = cloudinary;
