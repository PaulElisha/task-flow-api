import { envconfig } from "../config/env.config.ts";

export const port: string = envconfig.PORT;
export const hostName: string = envconfig.HOST_NAME;
export const mongoUri: string = envconfig.MONGODB_URI;
export const sessionSecret: string = envconfig.SESSION_SECRET;
export const nodeEnv: string = envconfig.NODE_ENV;