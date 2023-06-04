"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = require("http-errors");
const errorHandler = (error, req, res, next) => {
    console.log(error);
    let statusCode = 500;
    let message = 'An unknown error occurred';
    // Mongoose duplicate key
    if (error.code === 11000) {
        statusCode = 400;
        message = `Duplicate field value entered`;
    }
    if ((0, http_errors_1.isHttpError)(error)) {
        statusCode = error.status;
        message = error.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
    });
};
exports.default = errorHandler;
