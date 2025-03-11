export default {
    preset: 'ts-jest',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
    testEnvironment: 'node',
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Use ts-jest for TypeScript files
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    transformIgnorePatterns: ['/node_modules/'], // Ignore node_modules by default
  };
  