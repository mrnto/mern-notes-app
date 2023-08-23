import { useEffect, useState } from "react";
import * as NotesApi from "@api/notes";
import NoteModel from "@models/note";
import { NoteDialog } from "@components/Dialogs";
import Spinner from "@components/Spinner";
import Note from "@components/Note";
import styles from "./Notes.module.css";

const Notes = () => {
    const [notes, setNotes] = useState<NoteModel[]>([]);
    const [notesLoading, setNotesLoading] = useState(true);
    const [notesError, setNotesError] = useState(false);

    const [isNoteDialogOpen, setNoteDialogOpen] = useState(false);
    const [noteToUpdate, setNoteToUpdate] = useState<NoteModel | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setNotesError(false);
                setNotesLoading(true);
                const notes = await NotesApi.fetchNotes();
                setNotes(notes);
            } catch (notesError) {
                console.error(notesError);
                setNotesError(true);
            } finally {
                setNotesLoading(false);
            }
        })();
    }, []);

    const deleteNote = async (note: NoteModel) => {
        try {
            await NotesApi.deleteNote(note._id);
            setNotes(notes.filter(n => n._id !== note._id));
        } catch (notesError) {
            console.error(notesError);
            alert(notesError);
        }
    };

    const noteList = (
        <>
            {notes.map(note => (
                <Note
                    key={note._id}
                    note={note}
                    onUpdate={setNoteToUpdate}
                    onDelete={deleteNote}
                />
            ))}
        </>
    );

    return (
        <>
            {notesLoading && <Spinner />}
            {notesError &&
                <p className="text-center">Something wrong...</p>
            }
            {!notesLoading && !notesError &&
                <div>
                    <div
                        className={styles.note_add_btn}
                        onClick={() => setNoteDialogOpen(true)}
                    ></div>
                    {notes.length > 0
                        ? noteList
                        : (
                            <p className="text-center">
                                You don't have any notes!
                            </p>
                        )
                    }
                </div>
            }
            {isNoteDialogOpen &&
                <NoteDialog
                    onClose={() => setNoteDialogOpen(false)}
                    onSaved={(newNote) => {
                        setNotes([...notes, newNote]);
                        setNoteDialogOpen(false);
                    }}
                />
            }
            {noteToUpdate &&
                <NoteDialog
                    note={noteToUpdate}
                    onClose={() => setNoteToUpdate(null)}
                    onSaved={(updatedNote) => {
                        setNotes(
                            notes.map(n => n._id === updatedNote._id ? updatedNote : n)
                        );
                        setNoteToUpdate(null);
                    }}
                />
            }
        </>
    );
}

export default Notes;
