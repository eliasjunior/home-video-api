module.exports = {
  setupFiles: ["<rootDir>/src/test/setupEnv.js"],
  setupFilesAfterEnv: ["<rootDir>/src/test/setupJest.js"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/*.test.js",
    "!src/test/**",
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 30,
      lines: 30,
      statements: 30,
    },
    "src/common/Util.js": {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  coveragePathIgnorePatterns: [
    "/src/common/MessageUtil.js",
    "/src/libs/HttpLib.js",
    "/src/routers/CaptionsRouter.js",
    "/src/routers/ImagesRouter.js",
    "/src/domain/fileUseCases/index.js",
  ],
};
