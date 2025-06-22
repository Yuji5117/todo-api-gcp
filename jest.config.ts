// jest.config.ts
import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  verbose: true,
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.json",
    },
  },
};

export default config;
