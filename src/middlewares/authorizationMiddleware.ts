import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "./authMiddleware.js";

/**
 * Middleware to ensure users can only access their own bookings
 * Admin users can access any user's bookings
 */
export const authorizeBookingAccess = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  const currentUserId = req.user?.id?.toString();
  const userRole = req.user?.role;

  // Allow admin to access any user's bookings
  if (userRole === "admin") {
    return next();
  }

  // Regular users can only access their own bookings
  if (userId !== currentUserId) {
    return res.status(403).json({
      statusMsg: "fail",
      message: "Access denied. You can only view your own bookings.",
    });
  }

  next();
};

/**
 * Generic resource ownership check middleware factory
 * @param paramName - The name of the route parameter containing the resource owner ID
 */
export const authorizeResourceAccess = (paramName: string = "id") => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const resourceOwnerId = req.params[paramName];
    const currentUserId = req.user?.id?.toString();
    const userRole = req.user?.role;

    // Admin can access any resource
    if (userRole === "admin") return next();

    // Regular users can only access their own resources
    if (resourceOwnerId !== currentUserId) {
      return res.status(403).json({
        statusMsg: "fail",
        message: "Access denied. You can only access your own resources.",
      });
    }

    next();
  };
};

/**
 * Middleware to verify booking ownership for operations like update/cancel
 */
export const authorizeBookingOperation = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { bookingId } = req.params;
  const currentUserId = req.user?.id?.toString();
  const userRole = req.user?.role;

  // Admin can perform any operation
  if (userRole === "admin") {
    return next();
  }

  // For regular users, we need to verify ownership in the controller
  // This middleware just ensures the user is authenticated
  if (!currentUserId) {
    return res.status(401).json({
      statusMsg: "fail",
      message: "Authentication required",
    });
  }

  next();
};
