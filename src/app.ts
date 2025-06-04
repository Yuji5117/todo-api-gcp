import express, { Request, Response } from "express";
import authRouter from "./route/auth.route";
import { authenticateToken } from "./middleware/aurh.middleware";

const app = express();
const tasks = require("./data/task");

app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/tasks", authenticateToken, async (_, res) => {
  try {
    res.send(tasks);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = app;
