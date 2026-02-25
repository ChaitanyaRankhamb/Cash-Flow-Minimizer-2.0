import { createClient } from "redis";

const client = createClient({
  url: "redis://localhost:6379",
  // url: "redis://redis-stack:6379"  for docker based redis connection
});


client.on("error", (err) =>
  console.log("Redis Client Error", err),
);

export const redisConnection = async () => {
  await client.connect();
  console.log("Redis connected successfully!");
};

export default client;