import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface User {
  id: number;
  email: string;
  password: string;
}

const users: User[] = [
  {
    id: 1,
    email: "1234yuji@gmail.com",
    password: "12345abcd",
  },
];

const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret-key";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and Password are required." });
    return;
  }

  const isExist = users.some((user) => user.email === email);

  if (isExist) {
    res.status(409).json({ message: "User already exists." });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    email: email,
    password: hashedPassword,
  };
  users.push(newUser);

  res.status(201).json({
    message: "User registered successfully.",
    user: { id: newUser.id, email: newUser.email },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and Password are required." });
    return;
  }

  try {
    const user = users.find((user) => user.email === email);
    if (!user) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password." });
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
    res.status(500).json({ message: "Internal server error." });
  }
};
