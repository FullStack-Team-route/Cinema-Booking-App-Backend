import { User } from "../models/User.js";
import { Otp } from "../models/Otp.js";
import { generateToken } from "../utils/generateToken.js";
import { sendOtpEmail } from "../utils/emailService.js";
export const registerUser = async (req, res, next) => {
    try {
        const { fullName, username, email, phoneNumber, birthDate, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing)
            return res
                .status(400)
                .json({ statusMsg: "fail", message: "Email is already in use" });
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
    }
    catch (error) {
        next(error);
    }
};
export const loginUser = async (req, res, next) => {
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
            sameSite: "strict",
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
    }
    catch (error) {
        next(error);
    }
};
export const logoutUser = async (req, res, next) => {
    try {
        // Clear the authentication cookie
        res.clearCookie("token");
        res
            .status(200)
            .json({ statusMsg: "success", message: "Logout successful" });
    }
    catch (error) {
        next(error);
    }
};
export const updatePassword = async (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
};
export const getCurrentUser = async (req, res, next) => {
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
    }
    catch (err) {
        next(err);
    }
};
export const updateUser = async (req, res, next) => {
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
        const filteredUpdates = {};
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
    }
    catch (error) {
        next(error);
    }
};
export const getUsers = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.page) || 20;
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
    }
    catch (error) {
        next(error);
    }
};
// Generate random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
// =============================
// Forgot Password - Send OTP
// =============================
export const forgotPassword = async (req, res, next) => {
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
        // Generate OTP
        const otp = generateOTP();
        // Save OTP to database (invalidate any existing unused OTPs for this email)
        await Otp.updateMany({ email, used: false }, { used: true });
        await Otp.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        });
        // Send OTP email
        try {
            await sendOtpEmail(email, otp);
        }
        catch (emailError) {
            console.error("Failed to send OTP email:", emailError);
            return res.status(500).json({
                statusMsg: "fail",
                message: "Failed to send OTP email. Please try again.",
            });
        }
        res.status(200).json({
            statusMsg: "success",
            message: "OTP sent to your email successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
// =============================
// Verify OTP
// =============================
export const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                statusMsg: "fail",
                message: "Email and OTP are required",
            });
        }
        // Find valid OTP
        const otpRecord = await Otp.findOne({
            email,
            otp,
            used: false,
            expiresAt: { $gt: new Date() },
        });
        if (!otpRecord) {
            return res.status(400).json({
                statusMsg: "fail",
                message: "Invalid or expired OTP",
            });
        }
        // Mark OTP as used
        otpRecord.used = true;
        await otpRecord.save();
        res.status(200).json({
            statusMsg: "success",
            message: "OTP verified successfully",
            email: email,
        });
    }
    catch (error) {
        next(error);
    }
};
// =============================
// Reset Password
// =============================
export const resetPassword = async (req, res, next) => {
    try {
        const { email, currentPassword, newPassword, otp } = req.body;
        if (!email || !currentPassword || !newPassword || !otp) {
            return res.status(400).json({
                statusMsg: "fail",
                message: "All fields are required",
            });
        }
        // Verify OTP is still valid (not expired and not used)
        const otpRecord = await Otp.findOne({
            email,
            otp,
            used: false,
            expiresAt: { $gt: new Date() },
        });
        if (!otpRecord) {
            return res.status(400).json({
                statusMsg: "fail",
                message: "Invalid or expired OTP",
            });
        }
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                statusMsg: "fail",
                message: "User not found",
            });
        }
        // Verify current password
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                statusMsg: "fail",
                message: "Current password is incorrect",
            });
        }
        // Check new password is different from current
        const isSamePassword = await user.comparePassword(newPassword);
        if (isSamePassword) {
            return res.status(400).json({
                statusMsg: "fail",
                message: "New password must be different from current password",
            });
        }
        // Check new password length
        if (newPassword.length < 6) {
            return res.status(400).json({
                statusMsg: "fail",
                message: "New password must be at least 6 characters long",
            });
        }
        // Update password (pre-save hook will hash it)
        user.password = newPassword;
        await user.save();
        // Mark OTP as used
        otpRecord.used = true;
        await otpRecord.save();
        res.status(200).json({
            statusMsg: "success",
            message: "Password reset successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=userController.js.map