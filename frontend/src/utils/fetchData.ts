import { ConflictError, UnauthorizedError } from "../errors/HttpErrors";

export const fetchData = async (input: RequestInfo, init?: RequestInit) => {
    const response = await fetch(input, init);

    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;

        switch (response.status) {
            case 401:
                throw new UnauthorizedError(errorMessage);
            case 409:
                throw new ConflictError(errorMessage);
            default:
                throw Error("Failed with status " + response.status + ": " + errorMessage);
        }
    }
};
