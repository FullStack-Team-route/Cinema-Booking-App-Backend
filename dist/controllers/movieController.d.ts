import type { Request, Response } from "express";
export declare const addMovie: (req: Request, res: Response) => Promise<void>;
export declare const getAllMovies: (req: Request, res: Response) => Promise<void>;
export declare const updateMovie: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteMovie: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=movieController.d.ts.map