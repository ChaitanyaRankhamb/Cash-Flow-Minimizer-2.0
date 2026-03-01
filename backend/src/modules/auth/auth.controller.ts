import { Request, Response } from "express";
import {
  registerService,
  loginService,
  logoutService,
  userToResponse,
} from "./auth.service";
import { User } from "../../entities/user/User";
import { userRegistrationValidation } from "../../validation/userRegistrationValidation";
import { userLoginValidation } from "../../validation/userLoginValidation";
import { AuthRequest } from "../../middleware/authMiddleware";
import { UserId } from "../../entities/user/UserId";

interface loginReturn {
  user: User;
  token: string;
  message: string;
  cookie: string;
}

export const registerController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: "Credentials not found!" });
      return;
    }

    // check user registration data validation
    const isValidated = await userRegistrationValidation(
      username,
      email,
      password,
    );

    // if there is any inconsistency in user registration data, return an error
    if (isValidated instanceof Error) {
      res.status(400).json({ message: isValidated.message });
      return;
    }

    /// call the registration service
    const userData = await registerService(username, email, password);

    res
      .status(201)
      .json({ message: "User registered successfully", userData: userData });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const loginController = async (
  req: AuthRequest,
  res: Response,
): Promise<loginReturn | void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Credentials not found!" });
    return;
  }

  try {
    // check user login data validation
    const isValidated = await userLoginValidation(email, password);

    // if there is any inconsistency in user login data, return an error
    if (isValidated instanceof Error) {
      res.status(400).json({ message: isValidated.message });
      return;
    }

    const result = await loginService(email, password, req, res);

    if (!result) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    res.status(200).json({
      message: result.message,
      user: userToResponse(result.user),
      token: result.token,
      cookie: req.cookies.token,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
    return;
  }
};

export const logoutController = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const result = await logoutService(new UserId(userId));

    res.status(result.status).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.error("Logout Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
