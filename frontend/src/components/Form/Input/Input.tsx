import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import styles from "./Input.module.css";

interface InputProps {
    name: string;
    as?: "textarea";
    register: UseFormRegister<any>;
    registerOptions?: RegisterOptions;
    error?: FieldError;
    [x: string]: any;
}

const Input = ({
    name,
    as,
    register,
    registerOptions,
    error,
    ...props
}: InputProps) => (
    <div className={styles.form_input}>
        { as === "textarea" ? (
            <textarea
                {...props}
                {...register(name, registerOptions)}
            ></textarea>
        ) : (
            <input {...props} {...register(name, registerOptions)} />
        )}
        <p>{error?.message}</p>
    </div>
);

export default Input;
