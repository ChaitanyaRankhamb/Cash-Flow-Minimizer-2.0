import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import connectDB from "./lib/connection";
import { Request, Response } from "express";
import groupRoutes from "./modules/group/group.routes"
import expenseRoutes from "./modules/expense/expense.routes"
import balanceRoutes from "./modules/balance/balance.route"
import minimizationRoutes from "./modules/minimization/minimization.route"
import suggestionRoutes from "./modules/suggestion/suggestion.route"
import meRoutes from "./modules/me/me.routes"
import cookieParser from "cookie-parser";
import client, { redisConnection } from "./config/redis-connection";

// Connect to database before setting up routes (top-level await runs on import)
await connectDB();

// Connect to redis with node 
await redisConnection();

const app = express();

app.use(cookieParser());  // cookie configuration in the app

// cross origin resources sharable
app.use(cors({ 
  origin: "http://localhost:3000",
  credentials: true
 }));

app.use(express.json());  // express middleware

app.get("/health", async (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

// route to check does redis work well?
app.get("/redis-test", async (req, res) => {
  await client.set("testKey", "Hello Chaitanya");
  const value = await client.get("testKey");

  res.json({ value });
});

app.use("/users", meRoutes);
app.use("/auth", authRoutes);
app.use("/groups", groupRoutes);
app.use("/groups", expenseRoutes);
app.use("/groups", balanceRoutes);
app.use("/groups/", minimizationRoutes);
app.use("/groups", suggestionRoutes);

export default app;
