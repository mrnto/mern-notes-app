import { useState } from "react";
import { useForm } from "react-hook-form";
import * as UsersApi from "@api/users";
import { SignInCredentials } from "@api/users";
import User from "@models/user";
import Input from "@components/Form/Input";
import { UnauthorizedError } from "../../errors/HttpErrors";
import styles from "./Dialog.module.css";
import formStyles from "../Form/Form.module.css";

interface SignInDialogProps {
    onClose: () => void;
    onSuccess: (user: User) => void;
}

const SignInDialog = ({ onSuccess, onClose }: SignInDialogProps) => {
    const [errorText, setErrorText] = useState<string|null>(null);
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInCredentials>();
    
    const onSubmit = async (credentials: SignInCredentials) => {
        try {
            const user = await UsersApi.signIn(credentials);
            onSuccess(user);
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                setErrorText(error.message);
            } else {
                alert(error);
            }

            console.error(error);
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
                        Sign In
                    </p>
                    {errorText &&
                        <p className={formStyles.form_error}>{errorText}</p>
                    }
                    <Input
                        name="username"
                        type="text"
                        placeholder="username"
                        register={register}
                        registerOptions={{ required: "Username is required" }}
                        error={errors.username}
                    />
                    <Input
                        name="password"
                        type="password"
                        placeholder="password"
                        register={register}
                        registerOptions={{ required: "Password is required" }}
                        error={errors.password}
                    />
                    <button
                        type="submit"
                        className={formStyles.form_btn}
                        disabled={isSubmitting}
                    >Submit</button>
                </form>
            </div>
        </div>
    );
}

export default SignInDialog;
