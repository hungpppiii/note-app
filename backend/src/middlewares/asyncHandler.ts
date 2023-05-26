import { NextFunction, Request, Response, RequestHandler } from 'express';

export default (fn: RequestHandler): RequestHandler =>
    (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
