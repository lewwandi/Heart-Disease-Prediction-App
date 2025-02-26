import { useAuthContext } from "./useAuthContext"
import { useFeaturesContext } from "./useFeaturesContext"


export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: featuresDispatch } = useFeaturesContext();

    const logout = () => {
        //remove user from local storage
        localStorage.removeItem('user')

        //dispatch logout action
        dispatch({ type: 'LOGOUT' })
        if (featuresDispatch) {
            featuresDispatch({ type: 'SET_FEATURES', payload: null })
        }
        window.location.href = "/login";
    }
    return { logout };
}

