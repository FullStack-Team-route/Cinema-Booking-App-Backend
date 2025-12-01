import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import movieRoutes from "./routes/movieRoutes.ts";
import userRoutes from "./routes/userRoutes.js";

export const app = express();
const PORT = process.env.PORT;

import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT;

dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to db
await connectDB();

// Routes
app.use("/api/auth", userRoutes);
app.use("/movies", movieRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});



app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);

});
