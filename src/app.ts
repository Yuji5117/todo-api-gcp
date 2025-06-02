import express, { Request, Response } from "express";
import bcrypt from "bcrypt";

const app = express();
const tasks = require("./data/task");

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

app.use(express.json());

app.post("/register", async (req: Request, res: Response) => {
  // extract  email and password from request
  const { email, password } = req.body;
  // check if the email already exists or not
  const isExist = users.some((user) => user.email === email);
  // if exists then throw err
  if (isExist) {
    res.status(409).json({ message: "User already exists." });
  }
  // if not,
  // Hash the email address
  const hashedPassword = await bcrypt.hash(password, 10);
  // store them into database
  const newUser = {
    id: users.length + 1,
    email: email,
    password: hashedPassword,
  };
  users.push(newUser);
  // return  email and password
  res.status(201).json({
    message: "User registered successfully.",
    user: { id: newUser.id, email: newUser.email },
  });
});

app.post("/login", async (req: Request, res: Response) => {
  // Extract email and password from req
  const { email, password } = req.body;
  // return 400 bad request if either email or password is missing
  if (!email || !password) {
    res.status(400).json({ message: "Email and Password are required." });
    return;
  }
  // search user by email
  try {
    const user = users.find((user) => user.email === email);
    if (!user) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }
    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }
    // response 200 with message
    res.status(200).json({ message: "Login successful." });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/tasks", async (_, res) => {
  try {
    res.send(tasks);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = app;
