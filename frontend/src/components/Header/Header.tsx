import * as UsersApi from "@api/users";
import User from "@models/user";
import noteLogo from "/note.svg";
import styles from "./Header.module.css";

interface HeaderProps {
    signedInUser: User | null;
    onSignInClicked: () => void;
    onSignUpClicked: () => void;
    onSignOut: () => void;
}

const Header = ({
    signedInUser,
    onSignInClicked,
    onSignUpClicked,
    onSignOut
}: HeaderProps) => {
    const signOut = async () => {
        try {
            await UsersApi.signOut();
            onSignOut();
        } catch (error) {
            console.error(error);
            alert(error);
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.header_container}>
                <div className={styles.header_logo}>
                    <img src={noteLogo} alt="logo" />
                    <h1>Notes</h1>
                </div>
                <div className={styles.header_menu}>
                    {signedInUser ? (
                        <a
                            className={styles.header_btn}
                            onClick={signOut}
                        >Sign Out</a>
                    ) : (
                        <>
                            <a 
                                className={styles.header_btn}
                                onClick={onSignUpClicked}
                            >Sign Up</a>
                            <a 
                                className={styles.header_btn}
                                onClick={onSignInClicked}
                            >Sign In</a>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
