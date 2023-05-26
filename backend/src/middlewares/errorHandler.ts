// import { NextFunction, Request, Response } from 'express';
import type { ErrorRequestHandler } from 'express';
import { isHttpError } from 'http-errors';

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.log(error);
    let statusCode = 500;
    let message = 'An unknown error occurred';

    // Mongoose duplicate key
    if (error.code === 11000) {
        statusCode = 400;
        message = `Duplicate field value entered`;
    }

    if (isHttpError(error)) {
        statusCode = error.status;
        message = error.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};

export default errorHandler;
