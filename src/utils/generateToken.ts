import jwt from "jsonwebtoken";

export function generateToken(
  payload: object,
  expiresIn: string = "7d"
): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  } as jwt.SignOptions);
}
