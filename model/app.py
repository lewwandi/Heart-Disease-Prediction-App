from flask import Flask, jsonify, request
import pandas as pd
import joblib

app = Flask(__name__)

try:

    model_data = joblib.load("model.pkl")
    model = model_data['model']
    feature_names = model_data['feature_names']
    print("Model and feature names loaded successfully.")
    print("Model feature names:", feature_names)
except Exception as e:
    print(f"Error loading the model: {e}")
    model = None
    feature_names = None


@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None or feature_names is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        print(f"Data received: {data}")

        # Helper function to safely convert values
        def safe_convert(value, default, convert_type):
            try:
                if isinstance(value, bool):
                    return 1 if value else 0
                return convert_type(value) if value != '' else default
            except (ValueError, TypeError):
                return default

        # Extract numerical and categorical features from the input
        age = safe_convert(data.get('Age', 0), 0, int)
        BPValue = safe_convert(data.get('RestingBP', 0), 0, int)
        cholesterolLevels = safe_convert(data.get('Cholesterol', 0), 0, int)
        maxHeartRate = safe_convert(data.get('MaxHR', 0), 0, int)
        oldPeak = safe_convert(data.get('Oldpeak', 0), 0, float)

        sex = str(data.get('Sex', '')).upper()
        fastingBloodSugar = safe_convert(data.get('FastingBS', ''), 0, int)
        exercise = str(data.get('ExerciseAng', '')).upper()
        chestPainType = str(data.get('ChestPainType', ''))
        restingECG = str(data.get('RestingECG', '')).upper()
        STSlope = str(data.get('ST_Slope', ''))

        # Create feature dictionary with one-hot encoding
        features = {
            'Age': age,
            'RestingBP': BPValue,
            'Cholesterol': cholesterolLevels,
            'FastingBS': fastingBloodSugar,
            'MaxHR': maxHeartRate,
            'Oldpeak': oldPeak,

            'Sex_F': 1 if sex == 'F' else 0,
            'Sex_M': 1 if sex == 'M' else 0,
            # ChestPainType (one-hot encoding)
            'ChestPainType_ASY': 1 if chestPainType == 'ASY' else 0,
            'ChestPainType_ATA': 1 if chestPainType == 'ATA' else 0,
            'ChestPainType_NAP': 1 if chestPainType == 'NAP' else 0,
            'ChestPainType_TA': 1 if chestPainType == 'TA' else 0,
            # RestingECG (one-hot encoding)
            'RestingECG_LVH': 1 if restingECG == 'LVH' else 0,
            'RestingECG_Normal': 1 if restingECG == 'Normal' else 0,
            'RestingECG_ST': 1 if restingECG == 'ST' else 0,

            # ExerciseAngina (one-hot encoding as Y/N)
            'ExerciseAngina_N': 1 if exercise == 'N' else 0,
            'ExerciseAngina_Y': 1 if exercise == 'Y' else 0,
            # ST_Slope (one-hot encoding)
            'ST_Slope_Down': 1 if STSlope == 'Down' else 0,
            'ST_Slope_Up': 1 if STSlope == 'Up' else 0,
            'ST_Slope_Flat': 1 if STSlope == 'Flat' else 0,

        }

        features_df = pd.DataFrame([features])

        # Reorder and add missing columns to match the exact feature names and order from training
        features_df = features_df.reindex(columns=feature_names, fill_value=0)

        prediction = model.predict(features_df)[0]
        probability = model.predict_proba(features_df)[0][1]

        return jsonify({
            "message": "Heart disease prediction successful",
            "prediction": int(prediction),
            "probability": float(probability)
        })

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
