module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: {
    '^@job-hunter/domain/(.*)$': '<rootDir>/../../libs/domain/$1',
    '^@job-hunter/db$': '<rootDir>/../../libs/db/src/index.ts'
  }
};
