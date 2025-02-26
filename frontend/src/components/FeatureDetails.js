import { useFeaturesContext } from '../hooks/useFeaturesContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const FeatureDetails = ({ feature }) => {
    const { dispatch } = useFeaturesContext()
    const { user } = useAuthContext()

    const handleClick = async () => {
        if (!user) {
            return
        }

        const response = await fetch('/api/features/' + feature._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({ type: 'DELETE_FEATURE', payload: json })
        }
    }

    return (
        <div className="feature-details">
            <h4>{feature.title}</h4>
            <p><strong>Age : </strong>{feature.age}</p>
            <p><strong>Gender : </strong>{feature.gender}</p>
            <p><strong>Chest Pain Type : </strong>{feature.chestPainType}</p>
            <p><strong>BP Value : </strong>{feature.BPValue}</p>
            <p><strong>Cholesterol Levels : </strong>{feature.cholesterolLevels}</p>
            <p><strong>Fasting Blood Sugar : </strong>{feature.fastingBloodSugar}</p>
            <p><strong>Resting ECG : </strong>{feature.restingECG}</p>
            <p><strong>Max Heart Rate : </strong>{feature.maxHeartRate}</p>
            <p><strong>Exercise : </strong>{feature.exercise}</p>
            <p><strong>Old Peak : </strong>{feature.oldPeak}</p>
            <p><strong>STS Lope : </strong>{feature.STSLope}</p>
            <p>{formatDistanceToNow(new Date(feature.createdAt), { addSuffix: true })}</p>
            <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
        </div>
    )
}

export default FeatureDetails;