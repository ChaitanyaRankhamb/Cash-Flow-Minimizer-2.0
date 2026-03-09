import jwt from "jsonwebtoken";
import redisClient from "../../config/redis-connection";
import { Response, Request } from "express";
import {
  JwtPayload,
  generateAccessToken,
  verifyRefreshToken,
} from "../../lib/jwt";

export const refreshTokenHandler = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const payload = verifyRefreshToken(token) as JwtPayload;

    // Check Redis
    const storedToken = await redisClient.get(`refresh:${payload.userId}`);

    if (!storedToken || storedToken !== token) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: payload.email,
    });

    return res.json({
      status: 201,
      message: "Access Token Issue Successfully!",
      accessToken: newAccessToken,
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};
