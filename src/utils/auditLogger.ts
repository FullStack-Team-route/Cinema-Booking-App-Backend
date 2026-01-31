import { promises as fs } from "fs";
import { join } from "path";
import type { Request } from "express";

interface AuditEvent {
  timestamp: string;
  action: string;
  userId?: string | undefined;
  userEmail?: string | undefined;
  ip: string;
  userAgent: string;
  details?: Record<string, unknown> | undefined;
  success: boolean;
}

/**
 * Get client IP address from request
 * Handles proxies and load balancers
 */
export const getClientIp = (req: Request): string => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return (
    req.headers["x-real-ip"]?.toString() ||
    req.socket?.remoteAddress ||
    req.ip ||
    "unknown"
  );
};

/**
 * Log a security-relevant event to the audit log
 * Events are stored in daily log files in the logs directory
 */
export const logSecurityEvent = async (event: AuditEvent): Promise<void> => {
  const logDir = join(process.cwd(), "logs");
  const today = new Date().toISOString().split("T")[0];
  const logFile = join(logDir, `security-${today}.log`);

  try {
    await fs.mkdir(logDir, { recursive: true });
    const logEntry = JSON.stringify(event) + "\n";
    await fs.appendFile(logFile, logEntry, "utf-8");
  } catch (error) {
    console.error("Failed to write security log:", error);
  }
};

/**
 * Pre-configured audit event loggers for common security events
 */
export const AuditEvents = {
  /**
   * Log a login attempt
   */
  loginAttempt: async (
    req: Request,
    email: string,
    success: boolean,
    reason?: string,
  ) => {
    await logSecurityEvent({
      timestamp: new Date().toISOString(),
      action: "LOGIN_ATTEMPT",
      userEmail: email,
      ip: getClientIp(req),
      userAgent: req.headers["user-agent"] || "unknown",
      success,
      details: reason ? { reason } : undefined,
    });
  },

  /**
   * Log a password reset request
   */
  passwordResetRequest: async (req: Request, email: string) => {
    await logSecurityEvent({
      timestamp: new Date().toISOString(),
      action: "PASSWORD_RESET_REQUEST",
      userEmail: email,
      ip: getClientIp(req),
      userAgent: req.headers["user-agent"] || "unknown",
      success: true,
    });
  },

  /**
   * Log a password change
   */
  passwordChanged: async (req: Request, userId: string) => {
    await logSecurityEvent({
      timestamp: new Date().toISOString(),
      action: "PASSWORD_CHANGED",
      userId,
      ip: getClientIp(req),
      userAgent: req.headers["user-agent"] || "unknown",
      success: true,
    });
  },

  /**
   * Log an unauthorized access attempt
   */
  unauthorizedAccess: async (
    req: Request,
    userId: string | undefined,
    resource: string,
  ) => {
    await logSecurityEvent({
      timestamp: new Date().toISOString(),
      action: "UNAUTHORIZED_ACCESS",
      userId,
      ip: getClientIp(req),
      userAgent: req.headers["user-agent"] || "unknown",
      success: false,
      details: { resource, method: req.method },
    });
  },

  /**
   * Log a user role change (admin action)
   */
  roleChanged: async (
    req: Request,
    adminId: string,
    targetUserId: string,
    newRole: string,
  ) => {
    await logSecurityEvent({
      timestamp: new Date().toISOString(),
      action: "ROLE_CHANGED",
      userId: adminId,
      ip: getClientIp(req),
      userAgent: req.headers["user-agent"] || "unknown",
      success: true,
      details: { targetUserId, newRole },
    });
  },

  /**
   * Log a user deletion (admin action)
   */
  userDeleted: async (
    req: Request,
    adminId: string,
    targetUserId: string,
    targetEmail: string,
  ) => {
    await logSecurityEvent({
      timestamp: new Date().toISOString(),
      action: "USER_DELETED",
      userId: adminId,
      ip: getClientIp(req),
      userAgent: req.headers["user-agent"] || "unknown",
      success: true,
      details: { targetUserId, targetEmail },
    });
  },

  /**
   * Log rate limit exceeded
   */
  rateLimitExceeded: async (req: Request, endpoint: string) => {
    await logSecurityEvent({
      timestamp: new Date().toISOString(),
      action: "RATE_LIMIT_EXCEEDED",
      ip: getClientIp(req),
      userAgent: req.headers["user-agent"] || "unknown",
      success: false,
      details: { endpoint },
    });
  },

  /**
   * Log suspicious activity (potential attack)
   */
  suspiciousActivity: async (
    req: Request,
    type: string,
    details: Record<string, unknown>,
  ) => {
    await logSecurityEvent({
      timestamp: new Date().toISOString(),
      action: "SUSPICIOUS_ACTIVITY",
      ip: getClientIp(req),
      userAgent: req.headers["user-agent"] || "unknown",
      success: false,
      details: { type, ...details },
    });
  },
};
