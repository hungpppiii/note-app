import NoteModel from '../models/note';
import asyncHandler from '../middlewares/asyncHandler';
import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const getNotes: RequestHandler = asyncHandler(async (req, res, next) => {
    const notes = await NoteModel.find().exec();
    res.status(200).json({ success: true, data: notes });
});

export const getNote: RequestHandler = asyncHandler(async (req, res, next) => {
    const noteId = req.params.id;

    if (!mongoose.isValidObjectId(noteId)) {
        throw createHttpError(400, 'Invalid note id');
    }

    const note = await NoteModel.findById(noteId);

    if (!note) {
        throw createHttpError(403, 'Note not found');
    }

    res.status(200).json({ success: true, data: note });
});

interface CreateNoteBody {
    title?: string;
    text?: string;
}

export const createNote: RequestHandler = asyncHandler(
    async (req, res, next) => {
        const { title, text }: CreateNoteBody = req.body;

        if (!title) {
            throw createHttpError(400, 'Note need a title');
        }

        const newNote = await NoteModel.create({ title, text });

        console.log(newNote);

        res.status(201).json({ success: true, data: newNote });
    },
);

export const updateNode: RequestHandler = asyncHandler(
    async (req, res, next) => {
        const noteId = req.params.id;
        const { title, text } = req.body;

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, 'Invalid note id');
        }

        const note = await NoteModel.findById(noteId);

        if (!note) {
            throw createHttpError('403', 'Note not found');
        }

        note.title = title || note.title;
        note.text = text || note.text;

        const updatedNote = await note.save();

        // if (!updatedNote) {
        //   throw createHttpError('400', '');
        // }

        res.status(201).json({ success: true, data: updatedNote });
    },
);

export const deleteNote: RequestHandler = asyncHandler(
    async (req, res, next) => {
        const noteId = req.params.id;

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, 'Invalid note id');
        }

        const note = await NoteModel.findById(noteId);

        if (!note) {
            throw createHttpError('403', 'Note not found');
        }

        const oldNote = await note.deleteOne();

        res.status(201).json({ success: true, data: oldNote });
    },
);
