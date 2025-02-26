import { useEffect } from "react"
import { useFeaturesContext } from "../hooks/useFeaturesContext";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import FeatureDetails from "../components/FeatureDetails"
import FeatureForm from "../components/FeatureForm"


const Home = () => {
    const { features, dispatch } = useFeaturesContext()
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchFeatures = async () => {
            const response = await fetch('/api/features', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatch({ type: 'SET_FEATURES', payload: json })
            }
        }
        if (user) {
            fetchFeatures()
        }


    }, [dispatch, user])

    return (
        <div className="home">
            <div className="features">
                {features && features.map(feature => (
                    <FeatureDetails feature={feature} key={feature._id} />
                ))}
            </div>
            <FeatureForm />
        </div>
    )
}

export default Home;