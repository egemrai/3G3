import { createClient } from "redis";
import env from "../utils/validateEnv";

export const redisClient = createClient({
  url: env.REDIS_URL,
})

redisClient.on("ready", () => {
  console.log("Redis connected");
})

redisClient.on("error", (err) => {
  console.error("Redis error", err);
})

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}