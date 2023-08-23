import { cleanEnv, port, str } from "envalid";

export default cleanEnv(process.env, {
    PORT: port({ default: 3001 }),
    MONGO_CONNECTION_STRING: str(),
    SESSION_SECRET: str(),
});
