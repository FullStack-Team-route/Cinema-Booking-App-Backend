import type { Request, Response } from "express";
export declare const createBooking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllBookings: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUserBookings: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateBooking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const saveTicketPrice: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const confirmBooking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const cancelBooking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=BookingController.d.ts.map