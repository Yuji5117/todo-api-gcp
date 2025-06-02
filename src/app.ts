import express from "express";
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

app.post("/register", async (req, res) => {
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

app.get("/tasks", async (_, res) => {
  try {
    res.send(tasks);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = app;
