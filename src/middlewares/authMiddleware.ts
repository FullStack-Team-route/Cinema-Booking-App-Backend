import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import type mongoose from "mongoose";

interface JwtPayload {
  id: string;
  role?: string;
  iat?: number;
  exp?: number;
}

// Extend Express Request to include authenticated user
export interface AuthenticatedRequest extends Request {
  user?:
    | {
        id: string | mongoose.Types.ObjectId;
        role?: string | undefined;
      }
    | undefined;
  file?: Express.Multer.File | undefined;
  files?:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;

    // If no token found in cookies
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    // Get user from token (exclude password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request object
    req.user = {
      id: user._id,
      ...(user.role && { role: user.role }),
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Not authorized" });
  }
};

export const adminOnly = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // First, ensure user is authenticated
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    // Check if user has admin role
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied - Admin role required" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error during admin check" });
  }
};
