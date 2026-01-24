import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import movieRoutes from "./routes/movieRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import auditoriumRoutes from "./routes/auditoriumRoutes.js";
import slotRoutes from "./routes/slotRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const API_RATE_WINDOW_MS = toNumber(
  process.env.RATE_LIMIT_WINDOW_MS,
  15 * 60 * 1000
); // default 15m
const API_RATE_MAX = toNumber(process.env.RATE_LIMIT_MAX, 300);

const LOGIN_RATE_WINDOW_MS = toNumber(
  process.env.LOGIN_RATE_LIMIT_WINDOW_MS,
  15 * 60 * 1000
);
const LOGIN_RATE_MAX = toNumber(process.env.LOGIN_RATE_LIMIT_MAX, 10);
const FORGOT_RATE_WINDOW_MS = toNumber(
  process.env.FORGOT_RATE_LIMIT_WINDOW_MS,
  60 * 60 * 1000
); // default 1h
const FORGOT_RATE_MAX = toNumber(process.env.FORGOT_RATE_LIMIT_MAX, 10);

const apiLimiter = rateLimit({
  windowMs: API_RATE_WINDOW_MS,
  max: API_RATE_MAX,
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: LOGIN_RATE_WINDOW_MS,
  max: LOGIN_RATE_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many login attempts, please try again later.",
});

const forgotLimiter = rateLimit({
  windowMs: FORGOT_RATE_WINDOW_MS,
  max: FORGOT_RATE_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many password reset requests, please try again later.",
});

// respect proxy headers (needed if behind nginx/Cloudflare/Render/etc.)
app.set("trust proxy", 1);

// Global rate limit for API routes
app.use("/api", apiLimiter);
// Tighter limit for login endpoint
app.use("/api/auth/login", loginLimiter);
// Limit forgot-password to reduce abuse
app.use("/api/auth/forgot-password", forgotLimiter);

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
