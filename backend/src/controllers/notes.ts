import { RequestHandler } from "express";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import NoteModel, { Note } from "../models/note";
import { assertIsDefined } from "../utils/assertIsDefined";

interface NoteParams {
    noteId: string;
}

export const getNotes: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);
        const notes = await NoteModel.find({userId: authenticatedUserId}).exec();
        res.status(StatusCodes.OK).json(notes);
    } catch (error) {
        next(error);
    }
};

export const getNote: RequestHandler<
    NoteParams, unknown, unknown, unknown
> = async (req, res, next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(
                StatusCodes.BAD_REQUEST,
                ReasonPhrases.BAD_REQUEST + ": INVALID ID"
            );
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
        }
        
        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED);
        }
        
        res.status(StatusCodes.OK).json(note);
    } catch (error) {
        next(error);
    }
};

export const createNote: RequestHandler<
    unknown, unknown, Note, unknown
> = async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!title) {
            throw createHttpError(
                StatusCodes.BAD_REQUEST,
                ReasonPhrases.BAD_REQUEST + ": TITLE REQUIRED"
            );
        }

        const newNote = await NoteModel.create({
            userId: authenticatedUserId,
            title: title,
            text: text,
        });
        res.status(StatusCodes.CREATED).json(newNote);
    } catch (error) {
        next(error);
    }
};

export const updateNote: RequestHandler<
    NoteParams, unknown, Note, unknown
> = async (req, res, next) => {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(
                StatusCodes.BAD_REQUEST,
                ReasonPhrases.BAD_REQUEST + ": INVALID ID"
            );
        }

        if (!newTitle) {
            throw createHttpError(
                StatusCodes.BAD_REQUEST,
                ReasonPhrases.BAD_REQUEST + ": TITLE REQUIRED"
            );
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
        }
        
        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED);
        }

        note.title = newTitle;
        note.text = newText;
        const updatedNote = await note.save();
        res.status(StatusCodes.OK).json(updatedNote);
    } catch (error) {
        next(error);
    }
};

export const deleteNote: RequestHandler<
    NoteParams, unknown, unknown, unknown
> = async (req, res, next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(
                StatusCodes.BAD_REQUEST,
                ReasonPhrases.BAD_REQUEST + ": INVALID ID"
            );
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
        }
        
        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED);
        }

        await note.deleteOne();
        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
        next(error);
    }
};
