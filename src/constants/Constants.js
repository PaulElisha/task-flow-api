import { EnvConfig } from "../config/EnvConfig";

export const port = EnvConfig.PORT;
export const hostName = EnvConfig.HOST_NAME;
export const mongoUri = EnvConfig.MONGODB_URI;
export const sessionSecret = EnvConfig.SESSION_SECRET;
export const nodeEnv = EnvConfig.NODE_ENV;