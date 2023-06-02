import { NextFunction, Request, Response, RequestHandler } from 'express';

export default (fn: RequestHandler) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
