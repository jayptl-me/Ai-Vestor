import numpy as np
from keras.models import Sequential
from keras.layers import LSTM, Dense
import os
import pickle
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from src.components.data_fetcher import fetch_training_data
from src.components.data_transformation import prepare_data_for_lstm


def build_lstm_model(look_back=60, n_features=3):
    """Build an LSTM model with 3 input features."""
    model = Sequential()
    # First LSTM layer with return_sequences=True to stack another LSTM
    model.add(LSTM(50, return_sequences=True, input_shape=(look_back, n_features)))
    # Second LSTM layer
    model.add(LSTM(50))
    # Output layer predicting the next Close price
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

def train_model(ticker, interval, look_back=60):
    """Train and evaluate the model for a given ticker and interval."""
    data = fetch_training_data(ticker, interval)
    X, y, scaler_open, scaler_close, scaler_volume = prepare_data_for_lstm(data, look_back)

    # Split data into training and testing sets (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

    # Build and train the model
    model = build_lstm_model(look_back, n_features=3)
    model.fit(X_train, y_train, epochs=200, batch_size=16, verbose=1)

    # Make predictions on the test set
    y_pred = model.predict(X_test)

    # Inverse transform the predictions and actual values to original scale
    y_test_original = scaler_close.inverse_transform(y_test.reshape(-1, 1))
    y_pred_original = scaler_close.inverse_transform(y_pred)

    # Calculate accuracy metrics
    mae = mean_absolute_error(y_test_original, y_pred_original)
    mse = mean_squared_error(y_test_original, y_pred_original)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test_original, y_pred_original)

    # Print the metrics
    print(f"Model Accuracy for {ticker} at interval {interval}:")
    print(f"MAE: {mae:.4f}")
    print(f"RMSE: {rmse:.4f}")
    print(f"R²: {r2:.4f}")

    # Save the model and scalers
    save_dir = f'models_{interval}/{ticker}'
    os.makedirs(save_dir, exist_ok=True)
    model.save(f'{save_dir}/model.h5')
    with open(f'{save_dir}/scaler_open.pkl', 'wb') as f:
        pickle.dump(scaler_open, f)
    with open(f'{save_dir}/scaler_close.pkl', 'wb') as f:
        pickle.dump(scaler_close, f)
    with open(f'{save_dir}/scaler_volume.pkl', 'wb') as f:
        pickle.dump(scaler_volume, f)