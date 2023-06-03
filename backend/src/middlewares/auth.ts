import createHttpError from 'http-errors';
import asyncHandler from './asyncHandler';

export default asyncHandler(async (req, res, next) => {
    if (!req.session.userId) {
        throw createHttpError(401, 'User not authenticated');
    }
    next();
});
