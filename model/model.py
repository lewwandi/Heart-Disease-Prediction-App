import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# Load the dataset
df = pd.read_csv('heart.csv')

# Define categorical variables for one-hot encoding
variables = ['Sex', 'ChestPainType',
             'RestingECG', 'ExerciseAngina', 'ST_Slope']
df = pd.get_dummies(data=df, prefix=variables, columns=variables)

# Set random state for reproducibility
RANDOM_STATE = 42

# Define features (all columns except the target)
features = [x for x in df.columns if x != 'HeartDisease']
X = df[features]
y = df['HeartDisease']

# Split the data into training and validation sets
X_train, X_val, y_train, y_val = train_test_split(
    X, y, train_size=0.8, random_state=RANDOM_STATE
)

print(f"Train samples: {len(X_train)}")
print(f"Validation samples: {len(X_val)}")
print(f"Target proportion in training set: {sum(y_train) / len(y_train):.4f}")

# Hyperparameter tuning for min_samples_split
min_samples_split_list = [2, 10, 30, 50, 100, 200, 300, 700]
accuracy_list_train = []
accuracy_list_val = []

for min_samples_split in min_samples_split_list:
    model = RandomForestClassifier(
        min_samples_split=min_samples_split, random_state=RANDOM_STATE
    ).fit(X_train, y_train)
    predictions_train = model.predict(X_train)
    predictions_val = model.predict(X_val)
    accuracy_train = accuracy_score(predictions_train, y_train)
    accuracy_val = accuracy_score(predictions_val, y_val)
    accuracy_list_train.append(accuracy_train)
    accuracy_list_val.append(accuracy_val)

# Hyperparameter tuning for max_depth
max_depth_list = [1, 2, 3, 4, 8, 16, 32, 64, None]
for max_depth in max_depth_list:
    model = RandomForestClassifier(
        max_depth=max_depth, random_state=RANDOM_STATE
    ).fit(X_train, y_train)
    predictions_train = model.predict(X_train)
    predictions_val = model.predict(X_val)
    accuracy_train = accuracy_score(predictions_train, y_train)
    accuracy_val = accuracy_score(predictions_val, y_val)
    accuracy_list_train.append(accuracy_train)
    accuracy_list_val.append(accuracy_val)

# Train final model with selected hyperparameters
random_forest_model = RandomForestClassifier(
    n_estimators=100, min_samples_split=16, max_depth=10, random_state=RANDOM_STATE
).fit(X_train, y_train)

# Print metrics for the final model
print(
    f"Metrics on training set\nAccuracy: {accuracy_score(random_forest_model.predict(X_train), y_train):.4f}"
)
print(
    f"Metrics on validation set\nAccuracy: {accuracy_score(random_forest_model.predict(X_val), y_val):.4f}"
)

# Save the model and feature names
joblib.dump({
    'model': random_forest_model,
    'feature_names': features
}, "model.pkl")
print("Model and feature names saved as model.pkl")
