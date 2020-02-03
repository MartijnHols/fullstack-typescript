module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/src/tests/setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/build'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
}
