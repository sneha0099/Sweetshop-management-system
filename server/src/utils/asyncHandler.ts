import { Request, Response, NextFunction } from "express";

interface AsyncHandlerFunction {
    (req: Request, res: Response, next: NextFunction): Promise<void>;
}

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): AsyncHandlerFunction => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await fn(req, res, next);
        } catch (error: any) {
            console.log(error);
            res.status(error.code || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
                data: error.data
            });
        }
    };
};
export { asyncHandler }