import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { prisma } from "../config/db";
import { AppError } from "../utils/AppError";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret-key";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new AppError("Email and Password are required.", 400));
    return;
  }

  try {
    const isExist = await prisma.user.findUnique({ where: { email } });

    if (isExist) {
      next(new AppError("User already exists.", 409));
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email: email, password: hashedPassword },
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.log("Login error:", error);
    next(new AppError("Internal server error.", 500));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new AppError("Email and Password are required.", 400));
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      next(new AppError("Invalid email or password.", 401));
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      next(new AppError("Invalid email or password.", 401));
      return;
    }

    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful.", token: jwtToken });
  } catch (error) {
    console.log("Login error:", error);
    next(new AppError("Internal server error.", 500));
  }
};
