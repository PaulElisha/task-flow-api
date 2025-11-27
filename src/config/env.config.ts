/** @format */

import { config } from "dotenv";
config({ path: ".env" });

import type { EnvConfig } from "../types/config/envconfig.types.ts";

const getEnvConfig = (): EnvConfig => {
  const getEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  };

  return {
    PORT: getEnv("PORT"),
    HOST_NAME: getEnv("HOST_NAME"),
    MONGODB_URI: getEnv("MONGODB_URI"),
    SESSION_SECRET: getEnv("SESSION_SECRET"),
    NODE_ENV: getEnv("NODE_ENV"),
  };
};

const envconfig = getEnvConfig();

export { envconfig };
