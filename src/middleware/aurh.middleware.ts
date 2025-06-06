import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { AuthenticatedRequest } from "../types";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret-key";

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token" });
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
      res.status(403).json({ message: "Invalid token payload" });
    }
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
    return;
  }
};
