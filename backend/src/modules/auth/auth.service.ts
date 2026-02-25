import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { userRepository } from "../../database/mongo/user/userRepository";
import { User } from "../../entities/user/User";
import type { UserResponse } from "./auth.types";
import { generateAccessToken, generateRefreshToken } from "../../lib/jwt";
import redisClient from "../../config/redis-connection";

export function userToResponse(user: User): UserResponse {
  return {
    id: user.id.toString(),
    username: user.username,
    email: user.email,
    emailVerified: user.emailVerified,
    ...(user.image !== undefined && { image: user.image }),
    isActive: user.isActive,
    ...(user.createdAt !== undefined && { createdAt: user.createdAt }),
    ...(user.updatedAt !== undefined && { updatedAt: user.updatedAt }),
  };
}

interface loginReturn {
  user: User;
  token: string;
  message: string;
}

export const registerService = async (
  username: string,
  email: string,
  password: string,
): Promise<UserResponse> => {
  const existingUsername = await userRepository.findUserByUsername(username);
  if (existingUsername) {
    throw new Error("Username already exists");
  }

  const existingEmail = await userRepository.findUserByEmail(email);
  if (existingEmail) {
    throw new Error("Email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userRepository.createUser({
    username,
    email,
    emailVerified: false,
    isActive: true,
    passwordHash: hashedPassword,
  });

  return userToResponse(user);
};

export const loginService = async (
  email: string,
  password: string,
  req: Request,
  res: Response,
): Promise<loginReturn | null> => {
  if (!email || !password) throw new Error("Credentials not received.");

  const user = await userRepository.findUserByEmailWithPassword(email);

  if (!user) {
    throw new Error("User not found!");
  }

  // check password
  const isMatch: boolean = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("User credentials are invalid!");
  }

  // token payload
  const payload = {
    userId: user.id.toString(),
    email: user.email,
  };

  // if user exist, issue the jwt tokens
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // store refresh token in redis
  redisClient.set(`refresh:${user.id}`, refreshToken, {
    EX: 7 * 24 * 60 * 60, // Expires in 7 days
  });

  /// Send refresh token as HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // true in production
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return {
    user,
    token: accessToken,
    message: "Login successful!",
  };
};