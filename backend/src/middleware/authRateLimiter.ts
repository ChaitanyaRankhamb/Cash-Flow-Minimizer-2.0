import { Request, Response, NextFunction } from "express";
import { RateLimiterRedis, RateLimiterRes } from "rate-limiter-flexible";
import redisClient from "../config/redis-connection";

const redisRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,  // connect with redis client
  useRedisPackage: true, // required for node-redis v4+
  keyPrefix: "auth_v2",
  points: 5, // 5 max request
  duration: 15 * 60, // 15 minutes in seconds
});

export const authRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const key = req.ip || "unknown";

  try {
    await redisRateLimiter.consume(key);
    next();
  } catch (error) {
    if (error instanceof RateLimiterRes) {
      return res.status(429).json({
        message: "Too many requests. Please try again later.",
      });
    }

    console.error("Auth rate limiter internal error:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};
