import NoteModel from "@models/note";
import { formatDate } from "@utils/formatDate";
import styles from "./Note.module.css";

interface NoteProps {
    note: NoteModel;
    onUpdate: (note: NoteModel) => void;
    onDelete: (note: NoteModel) => void;
}

const Note = ({ note, onUpdate, onDelete }: NoteProps) => (
    <details className={styles.note}>
        <summary className={styles.note_header}>
            {note.title}
            <div>
                <span
                    className={styles.note_btn_edit}
                    onClick={(e) => {
                        onUpdate(note);
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                ></span>
                <span
                    className={styles.note_btn_delete}
                    onClick={(e) => {
                        onDelete(note);
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                ></span>
            </div>
        </summary>
        <div className={styles.note_content}>
            <p>{note.text}</p>
            <p>Last updated: {formatDate(note.updatedAt)}</p>
        </div>
    </details>
);

export default Note;
