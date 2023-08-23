import { useForm } from "react-hook-form";
import * as NotesApi from "@api/notes";
import { NoteInput } from "@api/notes";
import Note from "@models/note";
import Input from "@components/Form/Input";
import styles from "./Dialog.module.css";
import formStyles from "../Form/Form.module.css";

interface NoteDialogProps {
    note?: Note;
    onClose: () => void;
    onSaved: (note: Note) => void;
}

const NoteDialog = ({ note, onClose, onSaved }: NoteDialogProps) => {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<NoteInput>({
        defaultValues: {
            title: note?.title || "",
            text: note?.text || "",
        }
    });

    const onSubmit = async (input: NoteInput) => {
        try {
            let noteResponse: Note;

            if (note) {
                noteResponse = await NotesApi.updateNote(note._id, input);
            } else {
                noteResponse = await NotesApi.createNote(input);
            }

            onSaved(noteResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    };

    return (
        <div className={styles.dialog}>
            <div className={styles.dialog_header}>
                <span
                    className={styles.dialog_close_btn}
                    onClick={onClose}
                ></span>
            </div>
            <div className={styles.dialog_content}>
                <form
                    className={formStyles.form}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <p className={formStyles.form_title}>
                        {note ? "Edit note" : "Add note"}
                    </p>
                    <Input
                        name="title"
                        type="text"
                        placeholder="title"
                        register={register}
                        registerOptions={{ required: "Title is required" }}
                        error={errors.title}
                    />
                    <Input
                        name="text"
                        as="textarea"
                        placeholder="note text..."
                        rows={5}
                        register={register}
                    />
                    <button
                        type="submit"
                        className={formStyles.form_btn}
                        disabled={isSubmitting}
                    >Save</button>
                </form>
            </div>
        </div>
    );
}

export default NoteDialog;
