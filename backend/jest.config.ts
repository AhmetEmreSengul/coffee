export default {
  testEnvironment: "node",

  testMatch: ["**/**/*.test.ts"],

  clearMocks: true,
  restoreMocks: true,

  testTimeout: 15000,
  maxWorkers: 1,

  extensionsToTreatAsEsm: [".ts"],

  transform: {
    "^.+\\.tsx?$": [
      "@swc/jest",
      {
        jsc: {
          target: "es2022",
        },
        module: {
          type: "es6",
        },
      },
    ],
  },

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};