import type { Request, Response, NextFunction } from "express";

// Validation helper functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhoneNumber = (phone: string): boolean => {
  // Egyptian phone number validation
  const phoneRegex = /^(\+20|0)?1[0-2,5]\d{8}$/;
  return phoneRegex.test(phone);
};

const isValidUsername = (username: string): boolean => {
  // Alphanumeric, underscore, dash, min 3 chars, max 20 chars
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

const isValidPassword = (password: string): boolean => {
  // At least 6 chars, contains at least one letter and one number
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};

const isValidBirthDate = (birthDate: string): boolean => {
  const date = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    return age - 1 >= 13;
  }
  return age >= 13;
};

// Validation middleware for user registration
export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fullName, username, email, phoneNumber, birthDate, password } =
    req.body;
  const errors: string[] = [];

  // Validate fullName
  if (!fullName || typeof fullName !== "string") {
    errors.push("Full name is required");
  } else if (fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters long");
  } else if (fullName.trim().length > 50) {
    errors.push("Full name must not exceed 50 characters");
  }

  // Validate username
  if (!username || typeof username !== "string") {
    errors.push("Username is required");
  } else if (!isValidUsername(username)) {
    errors.push(
      "Username must be 3-20 characters long and contain only letters, numbers, underscores, or hyphens"
    );
  }

  // Validate email
  if (!email || typeof email !== "string") {
    errors.push("Email is required");
  } else if (!isValidEmail(email)) {
    errors.push("Please provide a valid email address");
  }

  // Validate phoneNumber
  if (!phoneNumber || typeof phoneNumber !== "string") {
    errors.push("Phone number is required");
  } else if (!isValidPhoneNumber(phoneNumber)) {
    errors.push("Please provide a valid Egyptian phone number");
  }

  // Validate birthDate
  if (!birthDate) {
    errors.push("Birth date is required");
  } else if (!isValidBirthDate(birthDate)) {
    errors.push("You must be at least 13 years old to register");
  }

  // Validate password
  if (!password || typeof password !== "string") {
    errors.push("Password is required");
  } else if (!isValidPassword(password)) {
    errors.push(
      "Password must be at least 6 characters long and contain at least one letter and one number"
    );
  }

  if (errors.length > 0) {
    return res.status(400).json({
      statusMsg: "fail",
      message: "Validation failed",
      errors,
    });
  }

  // Sanitize inputs
  req.body.fullName = fullName.trim();
  req.body.username = username.trim().toLowerCase();
  req.body.email = email.trim().toLowerCase();
  req.body.phoneNumber = phoneNumber.trim();

  next();
};

// Validation middleware for user login
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const errors: string[] = [];

  // Validate email
  if (!email || typeof email !== "string") {
    errors.push("Email is required");
  } else if (!isValidEmail(email)) {
    errors.push("Please provide a valid email address");
  }

  // Validate password
  if (!password || typeof password !== "string") {
    errors.push("Password is required");
  } else if (password.trim().length === 0) {
    errors.push("Password cannot be empty");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      statusMsg: "fail",
      message: "Validation failed",
      errors,
    });
  }

  // Sanitize inputs
  req.body.email = email.trim().toLowerCase();
  req.body.password = password.trim();

  next();
};

// Validation middleware for password reset
export const validateResetPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { newPassword } = req.body;
  const errors: string[] = [];

  // Validate newPassword
  if (!newPassword || typeof newPassword !== "string") {
    errors.push("New password is required");
  } else if (!isValidPassword(newPassword)) {
    errors.push(
      "Password must be at least 6 characters long and contain at least one letter and one number"
    );
  }

  if (errors.length > 0) {
    return res.status(400).json({
      statusMsg: "fail",
      message: "Validation failed",
      errors,
    });
  }

  // Sanitize inputs
  req.body.newPassword = newPassword.trim();

  next();
};

// Validation middleware for updating user role (Admin only)
export const validateUpdateUserRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { role } = req.body;
  const errors: string[] = [];

  // Validate role
  if (!role || typeof role !== "string") {
    errors.push("Role is required");
  } else if (!["user", "admin"].includes(role)) {
    errors.push("Role must be either 'user' or 'admin'");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      statusMsg: "fail",
      message: "Validation failed",
      errors,
    });
  }

  next();
};

// Validation middleware for updating user status (Admin only)
export const validateUpdateUserStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status } = req.body;
  const errors: string[] = [];

  // Validate status
  if (!status || typeof status !== "string") {
    errors.push("Status is required");
  } else if (!["active", "disabled", "offline"].includes(status)) {
    errors.push("Status must be one of: 'active', 'disabled', 'offline'");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      statusMsg: "fail",
      message: "Validation failed",
      errors,
    });
  }

  next();
};