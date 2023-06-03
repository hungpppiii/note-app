import NoteModel from '../models/note';
import asyncHandler from '../middlewares/asyncHandler';
import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { assertIsDefined } from '../utils/assertIsDefined';

export const getNotes: RequestHandler = asyncHandler(async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    assertIsDefined(authenticatedUserId);

    const notes = await NoteModel.find({ userId: authenticatedUserId }).exec();
    res.status(200).json({ success: true, data: notes });
});

export const getNote: RequestHandler = asyncHandler(async (req, res, next) => {
    const noteId = req.params.id;
    const authenticatedUserId = req.session.userId;

    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(noteId)) {
        throw createHttpError(400, 'Invalid note id');
    }

    const note = await NoteModel.findById(noteId);

    if (!note) {
        throw createHttpError(404, 'Note not found');
    }

    if (!note.userId.equals(authenticatedUserId)) {
        throw createHttpError(
            401,
            "You don'n have permission to access this note",
        );
    }

    res.status(200).json({ success: true, data: note });
});

interface CreateNoteBody {
    title?: string;
    text?: string;
}

export const createNote: RequestHandler<any, any, CreateNoteBody, any> =
    asyncHandler(async (req, res, next) => {
        const { title, text } = req.body;
        const authenticatedUserId = req.session.userId;

        assertIsDefined(authenticatedUserId);

        if (!title) {
            throw createHttpError(400, 'Note need a title');
        }

        const newNote = await NoteModel.create({
            userId: authenticatedUserId,
            title,
            text,
        });

        res.status(201).json({ success: true, data: newNote });
    });

export const updateNode: RequestHandler<any, any, CreateNoteBody, any> =
    asyncHandler(async (req, res, next) => {
        const noteId = req.params.id;
        const { title, text } = req.body;
        const authenticatedUserId = req.session.userId;

        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, 'Invalid note id');
        }

        const note = await NoteModel.findById(noteId);

        if (!note) {
            throw createHttpError(404, 'Note not found');
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(
                401,
                "You don'n have permission to access this note",
            );
        }

        note.title = title || note.title;
        note.text = text || note.text;

        const updatedNote = await note.save();

        res.status(201).json({ success: true, data: updatedNote });
    });

export const deleteNote: RequestHandler = asyncHandler(
    async (req, res, next) => {
        const noteId = req.params.id;
        const authenticatedUserId = req.session.userId;

        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, 'Invalid note id');
        }

        const note = await NoteModel.findById(noteId);

        if (!note) {
            throw createHttpError(404, 'Note not found');
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(
                401,
                "You don'n have permission to access this note",
            );
        }

        const oldNote = await note.deleteOne();

        res.status(201).json({ success: true, data: oldNote });
    },
);
