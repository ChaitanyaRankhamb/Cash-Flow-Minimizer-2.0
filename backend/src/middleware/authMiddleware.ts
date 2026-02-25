import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt";
import redisClient from "../config/redis-connection";


export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token as string);

    if (typeof payload === "string" || !payload.userId) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // OPTIONAL: Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);

    if (isBlacklisted) {
      return res.status(401).json({ message: "Token invalidated" });
    }

    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};