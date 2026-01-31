import type { Request, Response, NextFunction } from "express";

/**
 * Custom operational error class for expected errors
 * These errors are safe to show to users
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 * Handles all errors and prevents sensitive information leakage
 */
export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Log error for debugging
  console.error("Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    ip: req.ip,
  });

  // Check if it's an operational error (safe to show to users)
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      statusMsg: "fail",
      message: err.message,
    });
  }

  // Handle MongoDB duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue || {})[0];
    return res.status(400).json({
      statusMsg: "fail",
      message: `${field ? field.charAt(0).toUpperCase() + field.slice(1) : "Value"} already exists`,
    });
  }

  // Handle MongoDB validation error
  if (err.name === "ValidationError") {
    const messages = Object.values((err as any).errors || {}).map(
      (e: any) => e.message,
    );
    return res.status(400).json({
      statusMsg: "fail",
      message: messages.join(", "),
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      statusMsg: "fail",
      message: "Invalid token. Please log in again.",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      statusMsg: "fail",
      message: "Token expired. Please log in again.",
    });
  }

  // Handle CastError (invalid MongoDB ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      statusMsg: "fail",
      message: "Invalid ID format",
    });
  }

  // Programming or unknown errors - don't leak error details in production
  if (process.env.NODE_ENV === "production") {
    return res.status(500).json({
      statusMsg: "error",
      message: "Something went wrong. Please try again later.",
    });
  }

  // Development mode - show full error for debugging
  return res.status(500).json({
    statusMsg: "error",
    message: err.message,
    stack: err.stack,
  });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    statusMsg: "fail",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Async error wrapper - catches async errors and passes them to error handler
 */
export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
