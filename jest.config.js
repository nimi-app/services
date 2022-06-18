const { defaults } = require('jest-config');

// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
  testTimeout: 30000,
  setupFiles: ['<rootDir>/jest/setEnvVars.js'],
  collectCoverage: true,
  verbose: true,
};

