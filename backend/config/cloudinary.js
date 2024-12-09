const cloudinary = require("cloudinary").v2;

// Check if required environment variables are present
const requiredVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
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
    console.log("Cloudinary Configuration:", {
      hasCloudName: !!config.cloud_name,
      hasApiKey: !!config.api_key,
      hasApiSecret: !!config.api_secret,
    });
    return true;
  } catch (error) {
    console.error("Cloudinary Configuration Error:", error);
    return false;
  }
};

verifyConfig();

module.exports = cloudinary;
