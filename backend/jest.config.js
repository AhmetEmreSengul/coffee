export default {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  clearMocks: true,
  restoreMocks: true,
  testTimeout: 15000,
  maxWorkers: 1,
};
