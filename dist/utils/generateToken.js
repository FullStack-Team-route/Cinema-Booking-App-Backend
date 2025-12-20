import jwt from "jsonwebtoken";
export function generateToken(payload, expiresIn = "7d") {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn,
    });
}
//# sourceMappingURL=generateToken.js.map