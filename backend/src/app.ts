import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import createHttpError, { isHttpError } from "http-errors";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { requiresAuth } from "./middleware/auth";
import notesRoutes from "./routes/notes";
import usersRoutes from "./routes/users";
import env from "./utils/validateEnv";

const app = express();

app.use(express.json());

// Session
app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    rolling: true,
    store: MongoStore.create({ mongoUrl: env.MONGO_CONNECTION_STRING }),
}));

// Routes
app.use("/api/notes", requiresAuth, notesRoutes);
app.use("/api/users", usersRoutes);

// Error Handling
app.use((_req, _res, next) => {
    next(createHttpError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    let errCode = StatusCodes.INTERNAL_SERVER_ERROR;
    let errMsg = ReasonPhrases.INTERNAL_SERVER_ERROR as string;

    if (isHttpError(err)) {
        errCode = err.status;
        errMsg = err.message;
    }

    res.status(errCode).json({ error: errMsg });
});

export default app;
