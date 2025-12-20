import type { Request, Response } from "express";
export declare const addAuditorium: (req: Request, res: Response) => Promise<void>;
export declare const getAllAuditoriums: (req: Request, res: Response) => Promise<void>;
export declare const getAuditorium: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateAuditorium: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteAuditorium: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const manageAuditoriumMovies: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auditoriumController.d.ts.map