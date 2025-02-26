import { useState } from "react"
import { useAuthContext } from "./useAuthContext";


export const useLogin = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { dispatch } = useAuthContext();


    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);


        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });


            const json = await response.json()

            // if (!response.ok) {
            //     const errorResponse = await response.json();
            //     throw new Error(errorResponse.error || "Login failed");
            // }
            // else {
            //     //save the user to local storage
            //     localStorage.setItem('user', JSON.stringify(json));

            //     dispatch({ type: 'LOGIN', payload: json });
            //     setIsLoading(false);
            // }

            if (!response.ok) {
                throw new Error(json.error || "Login failed");
            }

            if (!json.token) {
                throw new Error("Token not received. Authentication failed.");
            }



            localStorage.setItem("user", JSON.stringify(json));
            dispatch({ type: "LOGIN", payload: json });
        } catch (error) {
            setError(error.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return { login, isLoading, error };
}