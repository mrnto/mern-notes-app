import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export const requiresAuth: RequestHandler = (req, _res, next) => {
    if (req.session.userId) {
        next();
    } else {
        next(createHttpError(
            StatusCodes.UNAUTHORIZED,
            ReasonPhrases.UNAUTHORIZED
        ));
    }
};
