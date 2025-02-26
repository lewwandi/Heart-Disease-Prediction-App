import { FeatureContext } from "../context/FeatureContext"
import { useContext } from "react"

export const useFeaturesContext = () => {
    const context = useContext(FeatureContext)

    if (!context) {
        throw Error('useFeaturesContext must be used inside an FeaturesContextProvider')
    }

    return context
}

