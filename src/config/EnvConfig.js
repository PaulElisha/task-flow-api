
import { config } from "dotenv";
config({ path: ".env" });

const EnvConfig = {
    PORT: process.env.PORT,
    HOST_NAME: process.env.HOST_NAME,
    MONGODB_URI: process.env.MONGO_URI,
    SESSION_SECRET: process.env.SESSION_SECRET,
    NODE_ENV: process.env.NODE_ENV,
};

export { EnvConfig };
