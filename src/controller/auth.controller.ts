import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { prisma } from "../config/db";
import { AppError } from "../utils/AppError";
import { sendSuccess } from "../utils/sendResponse";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret-key";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and Password are required.", 400);
  }

  const isExist = await prisma.user.findUnique({ where: { email } });

  if (isExist) {
    throw new AppError("User already exists.", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { email: email, password: hashedPassword },
  });

  sendSuccess(
    res,
    "User registered successfully.",
    {
      id: newUser.id,
      email: newUser.email,
    },
    201
  );
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and Password are required.", 400);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password.", 401);
  }

  const jwtToken = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET
    // { expiresIn: "1h" }
  );

  sendSuccess(res, "Login successful.", { token: jwtToken });
};
