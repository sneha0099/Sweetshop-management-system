import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiError } from '../utils/apiError';

const validate = (schema: z.ZodType<any, any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const parsedBody = schema.safeParse(req.body);

        if (!parsedBody.success) {
            next(
                new ApiError(
                    400,
                    parsedBody.error?.issues[0].message,
                    null,
                    parsedBody.error?.issues
                )
            );
            return;
        }

        next();
    };
};

export default validate;
