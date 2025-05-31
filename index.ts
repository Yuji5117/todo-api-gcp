import express from "express";

const port = 8000;
const app = express();

app.get("/todos", async (_, res) => {
  try {
    res.send("Change Again to test the deployment");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
