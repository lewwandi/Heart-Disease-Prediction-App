import { useState } from "react"
import { useFeaturesContext } from "../hooks/useFeaturesContext"
import { useAuthContext } from '../hooks/useAuthContext'
import axios from 'axios'




const FeatureForm = () => {
    const { dispatch } = useFeaturesContext()
    const { user } = useAuthContext()

    const [title, setTitle] = useState('')
    const [age, setAge] = useState('')
    const [gender, setGender] = useState('')
    const [chestPainType, setChestPainType] = useState('')
    const [BPValue, setBPValue] = useState('')
    const [cholesterolLevels, setCholesterolLevels] = useState('')
    const [fastingBloodSugar, setFastingBloodSugar] = useState(null)
    const [restingECG, setRestingECG] = useState('')
    const [maxHeartRate, setMaxHeartRate] = useState('')
    const [exercise, setExercise] = useState(null)
    const [oldPeak, setOldPeak] = useState('')
    const [STSlope, setSTSlope] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])  // Always initialize as an array
    const [showSuccess, setShowSuccess] = useState(false)
    const [prediction, setPrediction] = useState(null)
    const [loading, setLoading] = useState(false)
    const [buttonText, setButtonText] = useState("Get Prediction")
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [result, setResult] = useState("");



    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(false);
        setError(null);
        setEmptyFields([]);
        setButtonText("Predicting...");
        setButtonDisabled(true);

        if (!user) {
            setError('You must be logged in')
            return
        }


        let missingFields = [];
        if (!title) missingFields.push('title');
        if (!age.trim()) missingFields.push('age');
        if (!gender.trim()) missingFields.push('gender');
        if (!chestPainType.trim()) missingFields.push('chestPainType');
        if (!BPValue.trim()) missingFields.push('BPValue');
        if (!cholesterolLevels.trim()) missingFields.push('cholesterolLevels');
        if (fastingBloodSugar === null) missingFields.push('fastingBloodSugar');
        if (!restingECG.trim()) missingFields.push('restingECG');
        if (!maxHeartRate.trim()) missingFields.push('maxHeartRate');
        if (exercise === null) missingFields.push('exercise');
        if (!oldPeak.trim()) missingFields.push('oldPeak');
        if (!STSlope.trim()) missingFields.push('STSlope');

        if (missingFields.length > 0) {
            setError("Please fill all the fields.");
            setEmptyFields(missingFields);
            return;
        }

        const feature = {
            title,
            Age: parseInt(age, 10), // Convert to integer
            Sex: gender === 'Male' ? 'M' : 'F', // Convert to 'M' or 'F' to match backend
            ChestPainType: chestPainType.toUpperCase(),
            RestingBP: parseInt(BPValue, 10), // Convert to integer
            Cholesterol: parseInt(cholesterolLevels, 10), // Convert to integer
            FastingBS: fastingBloodSugar ? 1 : 0, // Convert boolean to 0 or 1
            RestingECG: restingECG.toUpperCase(), // Convert to uppercase for consistency
            MaxHR: parseInt(maxHeartRate, 10), // Convert to integer
            ExerciseAng: exercise ? 'Y' : 'N', // Convert boolean to 'Y' or 'N' to match spreadsheet
            Oldpeak: parseFloat(oldPeak), // Convert to float
            ST_Slope: STSlope.toUpperCase() // Convert to uppercase for consistency
        };


        try {
            const response = await axios.post(
                'http://localhost:3001/api/predict',
                feature
            );

            if (response.status === 200) {
                setPrediction(response.data.data);
                dispatch({ type: 'CREATE_FEATURE', payload: response.data.data });
            }




            setTitle('');
            setAge('');
            setGender('');
            setChestPainType('');
            setBPValue('');
            setCholesterolLevels('');
            setFastingBloodSugar(null);
            setRestingECG('');
            setMaxHeartRate('');
            setExercise(null);
            setOldPeak('');
            setSTSlope('');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);



            console.log("Form Submitted:", feature);

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            setPrediction(response.data)
            setResult(`Prediction: ${response.data.prediction}, Probability: ${response.data.probability.toFixed(2)}`);
        } catch (err) {

            setError(err.response?.data?.error || 'Failed to get prediction');
        }
        setLoading(false);
        setButtonText("Predict");
        setButtonDisabled(false);
    }

    return (
        <div className="container">
            <div className="form-container">
                <form className="create" onSubmit={handleSubmit}>
                    <h3>Add Your Cardio Report Details</h3>

                    <label> Name :</label>
                    <input
                        type="text"
                        placeholder="Enter Name"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        className={emptyFields.includes('title') ? 'error' : ''}
                    />

                    <label>Age :</label>
                    <input
                        type="number"
                        placeholder="Enter your age"
                        onChange={(e) => setAge(e.target.value)}
                        value={age}
                        className={emptyFields.includes('age') ? 'error' : ''}
                    />

                    <label>Gender:</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                    </select>

                    <label>Chest Pain Type:</label>
                    <select value={chestPainType} onChange={(e) => setChestPainType(e.target.value)}>
                        <option value="">Select Chest Pain Type</option>
                        <option value="TA">Typical Angina (TA)</option>
                        <option value="ATA">Atypical Angina (ATA)</option>
                        <option value="NAP">Non-Anginal Pain (NAP)</option>
                        <option value="ASY">Asymptomatic (ASY)</option>
                    </select>

                    <label>BP Value :</label>
                    <input
                        type="number"
                        placeholder="Enter your BP value"
                        onChange={(e) => setBPValue(e.target.value)}
                        value={BPValue}
                        className={emptyFields.includes('BPValue') ? 'error' : ''}
                    />

                    <label>Cholesterol Levels :</label>
                    <input
                        type="number"
                        placeholder="Enter your cholesterol level"
                        onChange={(e) => setCholesterolLevels(e.target.value)}
                        value={cholesterolLevels}
                        className={emptyFields.includes('cholesterolLevels') ? 'error' : ''}
                    />

                    <label>Fasting Blood Sugar :</label>
                    <select value={fastingBloodSugar === true ? "true" : "false"} onChange={(e) => setFastingBloodSugar(e.target.value === "true")}>
                        <option value="">Select</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>

                    <label>Resting ECG :</label>
                    <select value={restingECG} onChange={(e) => setRestingECG(e.target.value)} required>
                        <option value="">Select Resting ECG</option>
                        <option value="Normal">Normal</option>
                        <option value="ST">T-T Wave Abnormality</option>
                        <option value="LVH">Left Ventricular Hypertrophy</option>
                    </select>


                    <label>Max Heart Rate :</label>
                    <input
                        type="number"
                        placeholder="Enter maximum heart rate"
                        onChange={(e) => setMaxHeartRate(e.target.value)}
                        value={maxHeartRate}
                        className={emptyFields.includes('maxHeartRate') ? 'error' : ''}
                    />

                    <label>Exercise :</label>
                    <select value={exercise === true ? "true" : "false"} onChange={(e) => setExercise(e.target.value === "true")}>
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>

                    <label>Old Peak :</label>
                    <input
                        type="number"
                        placeholder="Enter your old peak value"
                        onChange={(e) => setOldPeak(e.target.value)}
                        value={oldPeak}
                        className={emptyFields.includes('oldPeak') ? 'error' : ''}
                    />

                    <label>STS Slope :</label>
                    <select value={STSlope} onChange={(e) => setSTSlope(e.target.value)}>
                        <option value="">Select STS Slope</option>
                        <option value="Up">Upsloping</option>
                        <option value="Flat">Flat</option>
                        <option value="Down">Downsloping</option>
                    </select>

                    <button
                        type="submit"
                        disabled={buttonDisabled}
                        className="w-full bg-blue-500 text-white p-2 rounded"
                    >
                        {buttonText}
                    </button>




                    {error && (
                        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    {showSuccess && (
                        <div className="popup">
                            <p>Submitted successfully!</p>
                        </div>
                    )}
                </form>
                {prediction && (
                    <div className="mt-4 p-4 bg-gray-100 rounded">
                        <h3 className="font-bold">{prediction.message}</h3>
                        <p>Probability of having a heart diseace is :   {(prediction.probability * 100).toFixed(2)}%</p>
                    </div>
                )}
            </div>
        </div >
    )
}

export default FeatureForm;
