import User from "@models/user";
import { fetchData } from "@utils/fetchData";

export interface SignUpCredentials {
    username: string;
    email: string;
    password: string;
}

export interface SignInCredentials {
    username: string;
    password: string;
}

export const getSignedInUser = async (): Promise<User> => {
    const response = await fetchData("api/users", { method: "GET" });
    return response.json();
};

export const signUp = async (credentials: SignUpCredentials): Promise<User> => {
    const response = await fetchData("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    return response.json();
};

export const signIn = async (credentials: SignInCredentials): Promise<User> => {
    const response = await fetchData("/api/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    return response.json();
};

export const signOut = async () => {
    await fetchData("/api/users/signout", { method: "POST" });
};
