import { useEffect, useState } from "react";
import * as UsersApi from "@api/users";
import User from "@models/user";
import { SignInDialog, SignUpDialog } from "@components/Dialogs";
import Header from "@components/Header";
import Notes from "@components/Notes";

function App() {
    const [signedInUser, setSignedInUser] = useState<User|null>(null);
    const [isSignInDialogOpen, setSignInDialog] = useState(false);
    const [isSignUpDialogOpen, setSignUpDialog] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const user = await UsersApi.getSignedInUser();
                setSignedInUser(user);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    return (
        <>
            <Header
                signedInUser={signedInUser}
                onSignInClicked={() => {
                    setSignUpDialog(false);
                    setSignInDialog(true);
                }}
                onSignUpClicked={() => {
                    setSignInDialog(false);
                    setSignUpDialog(true);
                }}
                onSignOut={() => setSignedInUser(null)}
            />
            <main className="content_wrapper">
                {signedInUser
                    ? <Notes />
                    : <p className="text-center">Please, sign in</p>
                }
            </main>
            {isSignInDialogOpen &&
                <SignInDialog
                    onClose={() => setSignInDialog(false)}
                    onSuccess={(user) => {
                        setSignedInUser(user);
                        setSignInDialog(false);
                    }}
                />
            }
            {isSignUpDialogOpen &&
                <SignUpDialog
                    onClose={() => setSignUpDialog(false)}
                    onSuccess={(user) => { 
                        setSignedInUser(user);
                        setSignUpDialog(false);
                    }}
                />
            }
        </>
    );
}

export default App;
