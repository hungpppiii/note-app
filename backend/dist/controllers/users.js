"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.signIn = exports.signUp = exports.getAuthenticatedUser = void 0;
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const http_errors_1 = __importDefault(require("http-errors"));
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.getAuthenticatedUser = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session.userId) {
        throw (0, http_errors_1.default)(401, 'User not authenticated');
    }
    const existsUser = yield user_1.default.findById(req.session.userId).select('username email');
    if (!existsUser) {
        throw (0, http_errors_1.default)(401, 'User not authenticated');
    }
    res.status(200).json({
        success: true,
        data: { username: existsUser.username, email: existsUser.email },
    });
}));
exports.signUp = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        throw (0, http_errors_1.default)(400, 'Parameters missing');
    }
    const existingUsername = yield user_1.default.findOne({ username });
    if (existingUsername) {
        throw (0, http_errors_1.default)(409, 'Username already exists');
    }
    const existingEmail = yield user_1.default.findOne({ email });
    if (existingEmail) {
        throw (0, http_errors_1.default)(409, 'Email already exists');
    }
    const passwordHashed = yield bcrypt_1.default.hash(password, 15);
    const newUser = yield user_1.default.create({
        username,
        email,
        password: passwordHashed,
    });
    req.session.userId = newUser._id;
    res.status(201).json({
        success: true,
        data: { username: newUser.username, email: newUser.email },
    });
}));
exports.signIn = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        throw (0, http_errors_1.default)(400, 'Parameters missing');
    }
    const user = yield user_1.default.findOne({ username }).select('username email password');
    if (!user) {
        throw (0, http_errors_1.default)(401, 'username not exists');
    }
    const confirmPassword = yield bcrypt_1.default.compare(password, user.password);
    if (!confirmPassword) {
        throw (0, http_errors_1.default)(401, 'you entered the wrong password');
    }
    req.session.userId = user._id;
    res.status(200).json({
        success: true,
        data: { username: user.username, email: user.email },
    });
}));
exports.logout = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.userId = null;
    req.session.save(function (err) {
        if (err)
            next(err);
        req.session.regenerate(function (err) {
            if (err)
                next(err);
            res.sendStatus(200);
        });
    });
}));
