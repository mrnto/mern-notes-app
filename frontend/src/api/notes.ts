import Note from "@models/note";
import { fetchData } from "@utils/fetchData";

export interface NoteInput {
    title: string;
    text?: string;
}

export const fetchNotes = async (): Promise<Note[]> => {
    const response = await fetchData("/api/notes", { method: "GET" });
    return response.json();
};

export const createNote = async (note: NoteInput): Promise<Note> => {
    const response = await fetchData("/api/notes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
    });
    return response.json();
};

export const updateNote = async (
    noteId: string,
    note: NoteInput,
): Promise<Note> => {
    const response = await fetchData("/api/notes/" + noteId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
    });
    return response.json();
};

export const deleteNote = async (noteId: string) => {
    await fetchData("/api/notes/" + noteId, { method: "DELETE" });
};
