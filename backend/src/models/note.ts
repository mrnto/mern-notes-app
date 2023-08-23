import mongoose, { Schema, model } from "mongoose";

export interface Note {
    userId: mongoose.Types.ObjectId;
    title: string;
    text?: string;
}

const noteSchema = new Schema<Note>({
    userId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    text: { type: String },
}, { timestamps: true });

export default model<Note>("Note", noteSchema);
