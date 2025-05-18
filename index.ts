import express, { Express, Request, Response } from "express";

const port = 8000;

const app = express();

app.get("/", (req, res) => {
  res.send("Todo App");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
