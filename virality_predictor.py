import pandas as pd
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib

def train_virality_model():
    try:
        df = pd.read_csv('final_features.csv')
    except FileNotFoundError:
        print("Error: final_features.csv not found. Please ensure the feature extraction scripts have been run and the final CSV has been created.")
        return

    X = df.drop('view_count', axis=1)
    y = df['view_count']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = XGBRegressor(objective='reg:squarederror', n_estimators=1000, learning_rate=0.05, max_depth=5, subsample=0.8)
    model.fit(X_train, y_train, 
              early_stopping_rounds=50, 
              eval_set=[(X_test, y_test)], 
              verbose=False)

    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    print(f"Model training complete. Mean Absolute Error: {mae}")

    joblib.dump(model, 'virality_predictor.pkl')
    print("Model saved to virality_predictor.pkl")

if __name__ == "__main__":
    train_virality_model()