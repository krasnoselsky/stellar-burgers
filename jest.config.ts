import type { Config } from 'jest';
// import type { JestConfigWithTsJest } from 'ts-jest';

const config: Config = {
  preset: 'ts-jest',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleNameMapper: {
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@utils-types$': '<rootDir>/src/utils/types.ts'
  }
};

export default config;
