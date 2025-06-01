import express from "express";

const app = express();
const tasks = require("./data/task");

app.get("/tasks", async (_, res) => {
  try {
    res.send(tasks);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = app;
