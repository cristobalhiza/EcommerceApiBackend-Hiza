export default {
  transform: {
    '^.+\\.js$': 'babel-jest', 
  },
  testEnvironment: 'node',
  testMatch: ["<rootDir>/tests/**/*.test.js"], 
};