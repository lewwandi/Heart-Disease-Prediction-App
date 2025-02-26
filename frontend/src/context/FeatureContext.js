import { createContext, useReducer } from 'react'

export const FeatureContext = createContext()

export const featuresReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FEATURES':
            return {
                features: action.payload
            }
        case 'CREATE_FEATURES':
            return {
                features: [action.payload, ...state.features]
            }
        case 'DELETE_FEATURES':
            return {
                features: state.feautres.filter(w => w._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const FeaturesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(featuresReducer, {
        features: null
    })

    return (
        <FeatureContext.Provider value={{ ...state, dispatch }}>
            {children}
        </FeatureContext.Provider>
    )
}