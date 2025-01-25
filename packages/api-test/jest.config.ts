import { Config } from "jest";


const config:Config={
  preset:'ts-jest',
  testEnvironment:'node',
  verbose:true,
  rootDir:'.',
  testMatch:['<rootDir>/tests/**/*.test.ts'],
}

export default config;