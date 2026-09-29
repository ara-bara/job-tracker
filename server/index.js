import express from "express";

const app = express();

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is working" });
});

app.listen(3000, () => {
  console.log("Server: http://localhost:3000");
});