module.exports = {
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  globalSetup: "<rootDir>/jest.setup.js",
  globalTeardown: "<rootDir>/jest.teardown.js",
};
