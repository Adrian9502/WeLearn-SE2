const config = {
  mongodb_uri: process.env.MONGODB_URI,
  node_env: process.env.NODE_ENV || "development",
  jwt_secret: process.env.JWT_SECRET,
  api_base_url: process.env.API_BASE_URL,
  public_url: process.env.PUBLIC_URL,
};

if (!config.mongodb_uri) {
  console.error("MONGODB_URI is not defined in environment variables");
  console.log("Available environment variables:", Object.keys(process.env));
}

module.exports = config;
