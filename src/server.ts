import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT;

// Connect to db
await connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
