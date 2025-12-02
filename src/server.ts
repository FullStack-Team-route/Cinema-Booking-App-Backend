import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import movieRoutes from "./routes/movieRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import cookieParser from "cookie-parser";

import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT;

dotenv.config();

app.use(
  cors({
    // Allow frontend URL from env, fallback to localhost:3000
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to db
await connectDB();

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/movies", movieRoutes);

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
