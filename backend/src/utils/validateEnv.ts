import { cleanEnv, port, str } from "envalid";


export default cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
    SESSION_SECRET: str(),
    BACKEND_SITE_URL: str(),
    FRONTEND_SITE_URL: str(),
    NODE_ENV: str(),
    ELASTICSEARCH_URL: str(),
    LOG_LEVEL: str(),
    REDIS_URL: str(),
})