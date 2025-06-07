import express from "express";
import authRouter from "./route/auth.route";
import teamRouter from "./route/team.route";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

app.use("/api/teams", teamRouter);

app.use(errorHandler);

module.exports = app;
