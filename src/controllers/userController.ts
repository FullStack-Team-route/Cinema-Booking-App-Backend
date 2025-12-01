import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fullName, username, email, phoneNumber, birthDate, password } =
      req.body;

    const existing = await User.findOne({ email });

    if (existing)
      return res.status(400).json({ message: "Email is already in use" });

    const user = new User({
      fullName,
      username,
      email,
      phoneNumber,
      birthDate,
      password,
    });

    await user.save();
    const token = generateToken({ id: user._id, role: user.role }, "7d");

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // check if user exist
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // check password
    const isPasswordMatching = await user.comparePassword(password);
    if (!isPasswordMatching)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken({ id: user._id, role: user.role }, "7d");

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Clear the authentication cookie
    res.clearCookie("token");

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }

    // Check new password length (minimum 6 characters)
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters long" });
    }

    // Find user with password field
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Check if new password is different from current password
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    // Update password (pre-save hook will hash it automatically)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get user data (exclude password)
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        birthDate: user.birthDate,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fields allowed to be updated (excluding password and role)
    const allowedFields = [
      "fullName",
      "username",
      "email",
      "phoneNumber",
      "birthDate",
    ];
    const { password, role, ...updates } = req.body;

    // Filter only allowed fields
    const filteredUpdates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in updates && updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    // Check if there are any valid updates
    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Check for email uniqueness if email is being updated
    if (filteredUpdates.email) {
      const existingUser = await User.findOne({
        email: filteredUpdates.email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }

    // Check for username uniqueness if username is being updated
    if (filteredUpdates.username) {
      const existingUser = await User.findOne({
        username: filteredUpdates.username,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Username is already taken" });
      }
    }

    // Update user
    const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        birthDate: user.birthDate,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.page) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select("-password").skip(skip).limit(limit).lean(),
      User.countDocuments(),
    ]);

    res
      .status(200)
      .json({ data: users, page, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};
