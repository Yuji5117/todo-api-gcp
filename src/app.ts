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

app.use(errorHandler);

module.exports = app;
