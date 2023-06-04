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
exports.deleteNote = exports.updateNode = exports.createNote = exports.getNote = exports.getNotes = void 0;
const note_1 = __importDefault(require("../models/note"));
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = __importDefault(require("mongoose"));
const assertIsDefined_1 = require("../utils/assertIsDefined");
exports.getNotes = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authenticatedUserId = req.session.userId;
    (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
    const notes = yield note_1.default.find({ userId: authenticatedUserId }).exec();
    res.status(200).json({ success: true, data: notes });
}));
exports.getNote = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const noteId = req.params.id;
    const authenticatedUserId = req.session.userId;
    (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
    if (!mongoose_1.default.isValidObjectId(noteId)) {
        throw (0, http_errors_1.default)(400, 'Invalid note id');
    }
    const note = yield note_1.default.findById(noteId);
    if (!note) {
        throw (0, http_errors_1.default)(404, 'Note not found');
    }
    if (!note.userId.equals(authenticatedUserId)) {
        throw (0, http_errors_1.default)(401, "You don'n have permission to access this note");
    }
    res.status(200).json({ success: true, data: note });
}));
exports.createNote = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, text } = req.body;
    const authenticatedUserId = req.session.userId;
    (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
    if (!title) {
        throw (0, http_errors_1.default)(400, 'Note need a title');
    }
    const newNote = yield note_1.default.create({
        userId: authenticatedUserId,
        title,
        text,
    });
    res.status(201).json({ success: true, data: newNote });
}));
exports.updateNode = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const noteId = req.params.id;
    const { title, text } = req.body;
    const authenticatedUserId = req.session.userId;
    (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
    if (!mongoose_1.default.isValidObjectId(noteId)) {
        throw (0, http_errors_1.default)(400, 'Invalid note id');
    }
    const note = yield note_1.default.findById(noteId);
    if (!note) {
        throw (0, http_errors_1.default)(404, 'Note not found');
    }
    if (!note.userId.equals(authenticatedUserId)) {
        throw (0, http_errors_1.default)(401, "You don'n have permission to access this note");
    }
    note.title = title || note.title;
    note.text = text || note.text;
    const updatedNote = yield note.save();
    res.status(201).json({ success: true, data: updatedNote });
}));
exports.deleteNote = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const noteId = req.params.id;
    const authenticatedUserId = req.session.userId;
    (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
    if (!mongoose_1.default.isValidObjectId(noteId)) {
        throw (0, http_errors_1.default)(400, 'Invalid note id');
    }
    const note = yield note_1.default.findById(noteId);
    if (!note) {
        throw (0, http_errors_1.default)(404, 'Note not found');
    }
    if (!note.userId.equals(authenticatedUserId)) {
        throw (0, http_errors_1.default)(401, "You don'n have permission to access this note");
    }
    const oldNote = yield note.deleteOne();
    res.status(201).json({ success: true, data: oldNote });
}));
