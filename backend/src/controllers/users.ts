import { RequestHandler } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import createHttpError from 'http-errors';
import UserModel from '../models/user';
import bcrypt from 'bcrypt';

interface SignUpBody {
    username?: string;
    email?: string;
    password?: string;
}

export const getAuthenticatedUser: RequestHandler = asyncHandler(
    async (req, res, next) => {
        if (!req.session.userId) {
            throw createHttpError(401, 'User not authenticated');
        }

        const existsUser = await UserModel.findById(req.session.userId).select(
            'username email',
        );

        if (!existsUser) {
            throw createHttpError(401, 'User not authenticated');
        }

        res.status(200).json({
            success: true,
            data: { username: existsUser.username, email: existsUser.email },
        });
    },
);

export const signUp: RequestHandler<any, any, SignUpBody, any> = asyncHandler(
    async (req, res, next) => {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            throw createHttpError(400, 'Parameters missing');
        }

        const existingUsername = await UserModel.findOne({ username });

        if (existingUsername) {
            throw createHttpError(409, 'Username already exists');
        }

        const existingEmail = await UserModel.findOne({ email });

        if (existingEmail) {
            throw createHttpError(409, 'Email already exists');
        }

        const passwordHashed = await bcrypt.hash(password, 15);

        const newUser = await UserModel.create({
            username,
            email,
            password: passwordHashed,
        });

        req.session.userId = newUser._id;

        res.status(201).json({
            success: true,
            data: { username: newUser.username, email: newUser.email },
        });
    },
);

interface SignInBody {
    username?: string;
    password?: string;
}

export const signIn: RequestHandler<any, any, SignInBody, any> = asyncHandler(
    async (req, res, next) => {
        const { username, password } = req.body;

        if (!username || !password) {
            throw createHttpError(400, 'Parameters missing');
        }

        const user = await UserModel.findOne({ username }).select(
            'username email password',
        );

        if (!user) {
            throw createHttpError(401, 'username not exists');
        }

        const confirmPassword = await bcrypt.compare(password, user.password);

        if (!confirmPassword) {
            throw createHttpError(401, 'you entered the wrong password');
        }

        req.session.userId = user._id;

        res.status(200).json({
            success: true,
            data: { username: user.username, email: user.email },
        });
    },
);

export const logout: RequestHandler = asyncHandler(async (req, res, next) => {
    req.session.userId = null;
    req.session.save(function (err) {
        if (err) next(err);

        req.session.regenerate(function (err) {
            if (err) next(err);
            res.sendStatus(200);
        });
    });
});
