import 'dotenv/config';
import { Redis } from "ioredis"

const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log(`Redis connected`)
    return process.env.REDIS_URL
  }
  throw new Error("Redis connection failed")
}

export const redis = new Redis(redisClient())

redis.on("connect", () => {
  console.log("Conectado ao Redis com sucesso!");
});

redis.on("error", (err) => {
  console.error("Erro ao conectar ao Redis:", err);
});