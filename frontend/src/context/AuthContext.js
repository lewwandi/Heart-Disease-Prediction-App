import { createContext, useReducer, useEffect } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        default:
            return state;
    }
}


export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const user = JSON.parse(storedUser);
                dispatch({ type: "LOGIN", payload: user });
            }

        } catch (error) {
            console.error("Failed to parse user data:", error);
            localStorage.removeItem('user');
        }

    }, [])



    console.log('AuthContext state:', state)

    return (
        < AuthContext.Provider value={{ ...state, dispatch }} >
            {children}
        </AuthContext.Provider>
    )
}

















