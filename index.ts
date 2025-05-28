import express from "express";
import { pool } from "./config/db";

const port = 8080;
const app = express();

app.get("/todos", async (_, res) => {
  try {
    // const result = await pool.query("SELECT * FROM todo");
    // res.json(result.rows);
    res.send("Change Again to test the deployment");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
