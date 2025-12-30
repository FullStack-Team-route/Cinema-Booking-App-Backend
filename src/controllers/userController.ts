import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User.js";
import { Otp } from "../models/Otp.js";
import { generateToken } from "../utils/generateToken.js";
import { sendOtpEmail } from "../utils/emailService.js";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import {
  validateRegister,
  validateLogin,
  validateResetPassword,
} from "../middlewares/validationMiddleware.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fullName, username, email, phoneNumber, birthDate, password } =
      req.body;

    // Check for email uniqueness
    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res
        .status(400)
        .json({ statusMsg: "fail", message: "Email is already in use" });

    // Check for username uniqueness
    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res
        .status(400)
        .json({ statusMsg: "fail", message: "Username is already taken" });

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
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      statusMsg: "success",
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
    if (!user)
      return res
        .status(401)
        .json({ statusMsg: "fail", message: "Invalid credentials" });

    // check password
    const isPasswordMatching = await user.comparePassword(password);
    if (!isPasswordMatching)
      return res
        .status(401)
        .json({ statusMsg: "fail", message: "Invalid credentials" });

    const token = generateToken({ id: user._id, role: user.role }, "7d");

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      statusMsg: "success",
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

    res
      .status(200)
      .json({ statusMsg: "success", message: "Logout successful" });
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
      return res
        .status(401)
        .json({ statusMsg: "fail", message: "Unauthorized" });
    }

    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Current password and new password are required",
      });
    }

    // Check new password length (minimum 6 characters)
    if (newPassword.length < 6) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "New password must be at least 6 characters long",
      });
    }

    // Find user with password field
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ statusMsg: "fail", message: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ statusMsg: "fail", message: "Current password is incorrect" });
    }

    // Check if new password is different from current password
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "New password must be different from current password",
      });
    }

    // Update password (pre-save hook will hash it automatically)
    user.password = newPassword;
    await user.save();

    res
      .status(200)
      .json({ statusMsg: "success", message: "Password updated successfully" });
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
      return res
        .status(401)
        .json({ statusMsg: "fail", message: "Unauthorized" });
    }

    // Get user data (exclude password)
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ statusMsg: "fail", message: "User not found" });
    }

    res.status(200).json({
      statusMsg: "success",
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
      return res
        .status(401)
        .json({ statusMsg: "fail", message: "Unauthorized" });
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
      return res
        .status(400)
        .json({ statusMsg: "fail", message: "No valid fields to update" });
    }

    // Check for email uniqueness if email is being updated
    if (filteredUpdates.email) {
      const existingUser = await User.findOne({
        email: filteredUpdates.email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ statusMsg: "fail", message: "Email is already in use" });
      }
    }

    // Check for username uniqueness if username is being updated
    if (filteredUpdates.username) {
      const existingUser = await User.findOne({
        username: filteredUpdates.username,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ statusMsg: "fail", message: "Username is already taken" });
      }
    }

    // Update user
    const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ statusMsg: "fail", message: "User not found" });
    }

    res.status(200).json({
      statusMsg: "success",
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
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select("-password").skip(skip).limit(limit).lean(),
      User.countDocuments(),
    ]);

    res.status(200).json({
      statusMsg: "success",
      data: users,
      page,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// Generate random OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// =============================
// Forgot Password - Send OTP
// =============================
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ statusMsg: "fail", message: "Email is required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        statusMsg: "fail",
        message: "No account found with this email address",
      });
    }

    // Rate limiting - prevent spam (max 3 OTP requests per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOtps = await Otp.find({
      email,
      createdAt: { $gte: oneHourAgo },
    });

    if (recentOtps.length >= 3) {
      return res.status(429).json({
        statusMsg: "fail",
        message:
          "Too many OTP requests. Please wait 1 hour before requesting another OTP.",
      });
    }

    // Check if there's a verified but unused OTP (user verified but hasn't reset password yet)
    const verifiedUnusedOtp = await Otp.findOne({
      email,
      verified: true,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (verifiedUnusedOtp) {
      return res.status(400).json({
        statusMsg: "fail",
        message:
          "You have already verified an OTP. Please complete the password reset.",
      });
    }

    // Check if there's a valid unused OTP sent in the last 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const recentValidOtp = await Otp.findOne({
      email,
      used: false,
      verified: false,
      expiresAt: { $gt: new Date() },
      createdAt: { $gte: twoMinutesAgo },
    });

    if (recentValidOtp) {
      return res.status(429).json({
        statusMsg: "fail",
        message:
          "OTP already sent recently. Please wait 2 minutes before requesting another.",
      });
    }

    // Generate OTP and verification token
    const otp = generateOTP();
    const verificationToken = crypto.randomUUID();

    // Save OTP to database (invalidate any existing unused OTPs for this email)
    await Otp.updateMany({ email, used: false }, { used: true });

    await Otp.create({
      email,
      otp,
      verificationToken,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send OTP email
    try {
      await sendOtpEmail(email, otp);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return res.status(500).json({
        statusMsg: "fail",
        message: "Failed to send OTP email. Please try again.",
      });
    }

    // Set verification token in httpOnly cookie
    res.cookie("verification_token", verificationToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 60 * 1000, // 10 minutes (same as OTP expiry)
    });

    res.status(200).json({
      statusMsg: "success",
      message: "OTP sent to your email successfully",
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Verify OTP
// =============================
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const verificationToken = req.cookies.verification_token;

    const { otp } = req.body;

    if (!verificationToken || !otp) {
      return res.status(400).json({
        statusMsg: "fail",
        message: verificationToken
          ? "OTP is required"
          : "No verification session found. Please request a new OTP.",
      });
    }

    // Find the OTP by verification token
    const otpRecord = await Otp.findOne({
      verificationToken,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "No valid OTP found. Please request a new one.",
      });
    }

    // Check if OTP matches
    if (otpRecord.otp !== otp) {
      // Increment attempts
      otpRecord.attempts += 1;
      otpRecord.lastAttemptAt = new Date();

      // If too many attempts, mark as used to prevent further attempts
      if (otpRecord.attempts >= 3) {
        otpRecord.used = true;
        await otpRecord.save();
        return res.status(429).json({
          statusMsg: "fail",
          message: "Too many failed attempts. Please request a new OTP.",
        });
      }

      await otpRecord.save();
      return res.status(400).json({
        statusMsg: "fail",
        message: `Invalid OTP. ${3 - otpRecord.attempts} attempts remaining.`,
      });
    }

    // OTP is correct - mark as verified
    otpRecord.verified = true;
    await otpRecord.save();

    res.status(200).json({
      statusMsg: "success",
      message: "OTP verified successfully",
      email: otpRecord.email,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Reset Password
// =============================
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const verificationToken = req.cookies.verification_token;
    const { newPassword } = req.body;

    if (!verificationToken || !newPassword) {
      return res.status(400).json({
        statusMsg: "fail",
        message: verificationToken
          ? "New password is required"
          : "No verification session found. Please verify your OTP first.",
      });
    }

    // Find a verified but unused OTP by verification token
    const otpRecord = await Otp.findOne({
      verificationToken,
      verified: true,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "No verified OTP found. Please verify your OTP first.",
      });
    }

    // Find user
    const user = await User.findOne({ email: otpRecord.email });
    if (!user) {
      return res.status(404).json({
        statusMsg: "fail",
        message: "User not found",
      });
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    // Mark OTP as used (prevent reuse)
    otpRecord.used = true;
    await otpRecord.save();

    res.status(200).json({
      statusMsg: "success",
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Admin User Management
// =============================

// Delete user (Admin only)
export const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "User ID is required",
      });
    }

    // Prevent admin from deleting themselves
    if (id === req.user?.id) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Cannot delete your own account",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        statusMsg: "fail",
        message: "User not found",
      });
    }

    // Prevent deleting other admins (optional security)
    if (user.role === "admin") {
      return res.status(403).json({
        statusMsg: "fail",
        message: "Cannot delete admin accounts",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      statusMsg: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update user role (Admin only)
export const updateUserRole = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!id) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "User ID is required",
      });
    }

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Valid role (user or admin) is required",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        statusMsg: "fail",
        message: "User not found",
      });
    }

    // Prevent changing own role
    if (id === req.user?.id) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Cannot change your own role",
      });
    }

    user.role = role;
    if (req.user?.id) {
      user.updatedBy = req.user.id as any;
    }
    await user.save();

    res.status(200).json({
      statusMsg: "success",
      message: "User role updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Toggle user status (Admin only)
export const toggleUserStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "User ID is required",
      });
    }

    // Prevent admin from deactivating themselves
    if (id === req.user?.id) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Cannot deactivate your own account",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        statusMsg: "fail",
        message: "User not found",
      });
    }

    user.isActive = !user.isActive;
    if (req.user?.id) {
      user.updatedBy = req.user.id as any;
    }
    await user.save();

    res.status(200).json({
      statusMsg: "success",
      message: `User ${
        user.isActive ? "activated" : "deactivated"
      } successfully`,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Search and filter users (Admin only)
export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      isActive,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter: any = {};

    // Search filter
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Role filter
    if (role && ["user", "admin"].includes(role as string)) {
      filter.role = role;
    }

    // Active status filter
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === "asc" ? 1 : -1;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      statusMsg: "success",
      data: users,

      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1,

      filters: {
        search: search || null,
        role: role || null,
        isActive: isActive ? isActive === "true" : null,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get users statistics (Admin only)
export const getUsersStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      adminUsers,
      regularUsers,
      newUsersLast30Days,
      newUsersLast7Days,
      usersByRole,
      registrationTrends,
      recentUsers,
    ] = await Promise.all([
      // Total users
      User.countDocuments(),

      // Active users
      User.countDocuments({ isActive: true }),

      // Inactive users
      User.countDocuments({ isActive: false }),

      // Admin users
      User.countDocuments({ role: "admin" }),

      // Regular users
      User.countDocuments({ role: "user" }),

      // New users last 30 days
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),

      // New users last 7 days
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),

      // Users by role
      User.aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
            active: { $sum: { $cond: ["$isActive", 1, 0] } },
            inactive: { $sum: { $cond: ["$isActive", 0, 1] } },
          },
        },
        {
          $project: {
            role: "$_id",
            count: 1,
            active: 1,
            inactive: 1,
            _id: 0,
          },
        },
      ]),

      // Registration trends (last 12 months)
      User.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            month: {
              $concat: [
                { $toString: "$_id.year" },
                "-",
                {
                  $cond: {
                    if: { $lt: ["$_id.month", 10] },
                    then: { $concat: ["0", { $toString: "$_id.month" }] },
                    else: { $toString: "$_id.month" },
                  },
                },
              ],
            },
            count: 1,
          },
        },
        { $sort: { month: 1 } },
      ]),

      // Recent users (last 10)
      User.find()
        .select("fullName username email role isActive createdAt")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    const stats = {
      overview: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        adminUsers,
        regularUsers,
      },
      growth: {
        newUsersLast7Days,
        newUsersLast30Days,
        growthRate:
          totalUsers > 0
            ? ((newUsersLast30Days / totalUsers) * 100).toFixed(2)
            : 0,
      },
      usersByRole,
      registrationTrends,
      recentUsers,
    };

    res.status(200).json({
      statusMsg: "success",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
