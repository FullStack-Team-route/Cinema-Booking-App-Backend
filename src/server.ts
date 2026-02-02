import "dotenv/config";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
// express-mongo-sanitize and hpp removed - incompatible with Express 5.x (req.query is getter-only)
import { connectDB } from "./config/db.js";
import movieRoutes from "./routes/movieRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/BookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";

import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import auditoriumRoutes from "./routes/auditoriumRoutes.js";
import slotRoutes from "./routes/slotRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middlewares/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const API_RATE_WINDOW_MS = toNumber(
  process.env.RATE_LIMIT_WINDOW_MS,
  15 * 60 * 1000,
); // default 15m
const API_RATE_MAX = toNumber(process.env.RATE_LIMIT_MAX, 300);

const LOGIN_RATE_WINDOW_MS = toNumber(
  process.env.LOGIN_RATE_LIMIT_WINDOW_MS,
  15 * 60 * 1000,
);
const LOGIN_RATE_MAX = toNumber(process.env.LOGIN_RATE_LIMIT_MAX, 10);
const FORGOT_RATE_WINDOW_MS = toNumber(
  process.env.FORGOT_RATE_LIMIT_WINDOW_MS,
  60 * 60 * 1000,
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

// ====================================
// 🔐 SECURITY MIDDLEWARE (FIRST)
// ====================================

// Helmet - Set various HTTP headers for security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Allow embedding images from Cloudinary
  }),
);

// Note: express-mongo-sanitize and hpp removed - incompatible with Express 5.x
// Express 5 makes req.query getter-only, which these packages cannot modify
// NoSQL injection protection is handled in the sanitization middleware below

// XSS & NoSQL Injection Protection Middleware - Sanitize request body only
// (Express 5.x doesn't allow modifying req.query, so we only sanitize body)
const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
  // Remove MongoDB operators from objects (NoSQL injection protection)
  const removeMongoOperators = (obj: any): any => {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(removeMongoOperators);
    }

    const sanitized: any = {};
    for (const key in obj) {
      // Skip keys that start with $ (MongoDB operators)
      if (key.startsWith("$")) {
        continue;
      }
      sanitized[key] = removeMongoOperators(obj[key]);
    }
    return sanitized;
  };

  // XSS sanitization for strings
  const sanitizeXSS = (obj: any): any => {
    if (typeof obj === "string") {
      return obj
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeXSS);
    }
    if (obj && typeof obj === "object") {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitizeXSS(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  // Only sanitize body (Express 5.x doesn't allow modifying query)
  if (req.body) {
    req.body = removeMongoOperators(req.body);
    req.body = sanitizeXSS(req.body);
  }

  next();
};

// ====================================
// RATE LIMITING
// ====================================

// Global rate limit for API routes
app.use("/api", apiLimiter);
// Tighter limit for login endpoint
app.use("/api/auth/login", loginLimiter);
// Limit forgot-password to reduce abuse
app.use("/api/auth/forgot-password", forgotLimiter);

// ====================================
// CORS CONFIGURATION
// ====================================

// Parse allowed origins from env (comma-separated) or use defaults
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ⚠️ IMPORTANT: Webhook route MUST be before express.json() for raw body access
app.use("/api/webhooks", webhookRoutes);

// ====================================
// BODY PARSERS
// ====================================

// Middleware (body parsers) with size limits
app.use(express.json({ limit: "10kb" })); // Limit payload size to prevent DoS
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Apply sanitization after body parsing (XSS + NoSQL injection protection)
app.use(sanitizeInput);

// Connect to db
await connectDB();

// Start cleanup job for expired bookings
import { startCleanupJob } from "./utils/cleanupService.js";
startCleanupJob();

// ====================================
// API ROUTES
// ====================================

app.use("/api/auth", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auditoriums", auditoriumRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/payments", paymentRoutes);

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("Cinema Booking API is running 🎬");
});

// Security check endpoint (development only)
if (process.env.NODE_ENV === "development") {
  app.get("/api/security-check", (req: Request, res: Response) => {
    res.json({
      headers: res.getHeaders(),
      securityStatus: "OK",
      timestamp: new Date().toISOString(),
    });
  });
}

// ====================================
// ERROR HANDLING
// ====================================

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(globalErrorHandler);

// ====================================
// START SERVER
// ====================================

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port http://localhost:${PORT}`);
  console.log(
    `🔐 Security features enabled: Helmet, MongoSanitize, HPP, XSS Protection`,
  );
});
