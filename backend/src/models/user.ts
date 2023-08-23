import { Schema, model } from "mongoose";

export interface User {
    username: string;
    email: string;
    password: string;
}

const userSchema = new Schema<User>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, select: false },
    password: { type: String, required: true, select: false },
});

export default model<User>("User", userSchema);
