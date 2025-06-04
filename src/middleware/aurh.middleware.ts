import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret-key";

export const authenticateToken = (
  req: Request,
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
    console.log("Decoded payload:", payload);
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
    return;
  }
};
