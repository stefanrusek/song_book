module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'utils/**/*.ts',
    '!utils/**/*.test.ts',
    '!**/__tests__/**'
  ],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }
  },
  moduleNameMapper: {
    '^@songbook/shared/(.*)$': '<rootDir>/$1'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        lib: ['ES2022'],
        types: ['node', 'jest']
      }
    }]
  }
}
