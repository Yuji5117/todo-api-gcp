import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { AuthenticatedRequest } from "../types";
import { AppError } from "../utils/AppError";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret-key";

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    next(new AppError("No token", 401));
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (
      typeof payload === "object" &&
      payload !== null &&
      "userId" in payload
    ) {
      req.userId = payload.userId as string;
      next();
    } else {
      next(new AppError("Invalid token payload, 403"));
      return;
    }
  } catch (error) {
    next(new AppError("Invalid token", 403));
    return;
  }
};
