import express from "express";
import authRouter from "./route/auth.route";
import teamRouter from "./route/team.route";
import { authenticateToken } from "./middleware/auth.middleware";
import { errorHandler } from "./middleware/errorHandler";
import { AppError } from "./utils/AppError";

const app = express();
const tasks = require("./data/task");

app.use(express.json());

app.use("/api/auth", authRouter);

app.use("/api/teams", teamRouter);

app.get("/tasks", async (req, res, next) => {
  try {
    console.log("erro");
    if (!req.params.userId) {
      next(new AppError("userId is required.", 400));
    }
    res.send(tasks);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.use(errorHandler);

module.exports = app;
