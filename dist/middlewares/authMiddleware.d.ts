import type { NextFunction, Request, Response } from "express";
import type mongoose from "mongoose";
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string | mongoose.Types.ObjectId;
        role?: string;
    };
}
export declare const protect: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const adminOnly: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=authMiddleware.d.ts.map