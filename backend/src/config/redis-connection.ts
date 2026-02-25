import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://localhost:6379",
  // url: "redis://redis-stack:6379"  for docker based redis connection
});


redisClient.on("error", (err) =>
  console.log("Redis Client Error", err),
);

export const redisConnection = async () => {
  await redisClient.connect();
  console.log("Redis connected successfully!");
};

export default redisClient;