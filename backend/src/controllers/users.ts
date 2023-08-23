import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import UserModel, { User } from "../models/user";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserModel
            .findById(req.session.userId)
            .select("+email")
            .exec();
        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        next(error);
    }
};

export const signUp: RequestHandler<
    unknown, unknown, User, unknown
> = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
        if (!username || !email || !passwordRaw) {
            throw createHttpError(
                StatusCodes.BAD_REQUEST,
                ReasonPhrases.BAD_REQUEST + ": ALL PARAMS REQUIRED"
            );
        }

        const existingUsername = await UserModel.findOne({ username: username }).exec();

        if (existingUsername) {
            throw createHttpError(
                StatusCodes.CONFLICT,
                ReasonPhrases.CONFLICT + ": USERNAME ALREADY USED"
            );
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();

        if (existingEmail) {
            throw createHttpError(
                StatusCodes.CONFLICT,
                ReasonPhrases.CONFLICT + ": EMAIL ALREADY USED"
            );
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed,
        })
        req.session.userId = newUser._id;
        res.status(StatusCodes.CREATED).json(newUser);
    } catch (error) {
        next(error);
    }
};

interface SignInBody {
    username: string;
    password: string;
}

export const signIn: RequestHandler<
    unknown, unknown, SignInBody, unknown
> = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (!username || !password) {
            throw createHttpError(
                StatusCodes.BAD_REQUEST,
                ReasonPhrases.BAD_REQUEST + ": ALL PARAMS REQUIRED"
            );
        }

        const user = await UserModel
            .findOne({ username: username })
            .select("+password +email")
            .exec();

        if (!user) {
            throw createHttpError(
                StatusCodes.UNAUTHORIZED,
                ReasonPhrases.UNAUTHORIZED + ": INVALID CREDENTIALS"
            );
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw createHttpError(
                StatusCodes.UNAUTHORIZED,
                ReasonPhrases.UNAUTHORIZED + ": INVALID CREDENTIALS"
            );
        }

        req.session.userId = user._id;
        res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
        next(error);
    }
};

export const signOut: RequestHandler = async (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(StatusCodes.OK);
        }
    });
};
