import yfinance as yf
import numpy as np
from keras.models import load_model
import os
import pickle

from src.utils import calculate_steps, get_prediction_period

class PredictionPipeline:
    def __init__(self):
        pass

    def predict(self, ticker, timeframe, interval, look_back=60):
        """Predict future Close prices using Open, Close, and Volume."""
        # Paths to saved model and scalers
        model_path = f'models/models_{interval}/{ticker}/model.h5'
        scaler_open_path = f'models/models_{interval}/{ticker}/scaler_open.pkl'
        scaler_close_path = f'models/models_{interval}/{ticker}/scaler_close.pkl'
        scaler_volume_path = f'models/models_{interval}/{ticker}/scaler_volume.pkl'

        # Check if model and scaler files exist
        if not all(os.path.exists(path) for path in [model_path, scaler_open_path, scaler_close_path, scaler_volume_path]):
            return {"error": f"No model or scalers found for {ticker} at interval {interval}"}

        # Load the pre-trained model and scalers
        model = load_model(model_path)
        with open(scaler_open_path, 'rb') as f:
            scaler_open = pickle.load(f)
        with open(scaler_close_path, 'rb') as f:
            scaler_close = pickle.load(f)
        with open(scaler_volume_path, 'rb') as f:
            scaler_volume = pickle.load(f)

        # Fetch the latest data from Yahoo Finance
        data = yf.download(ticker, period=get_prediction_period(interval), interval=interval)
        if data.empty:
            return {"error": "No data fetched"}
        if len(data) < look_back:
            return {"error": "Not enough data for prediction"}

        # Extract the last look_back periods of Open, Close, and Volume
        latest_data = data[['Open', 'Close', 'Volume']].tail(look_back)

        # Scale the input data
        scaled_open = scaler_open.transform(latest_data[['Open']])
        scaled_close = scaler_close.transform(latest_data[['Close']])
        scaled_volume = scaler_volume.transform(latest_data[['Volume']])

        # Prepare input for the model: shape (1, look_back, 3)
        X = np.column_stack((scaled_open, scaled_close, scaled_volume))
        X = X.reshape(1, look_back, 3)

        # Calculate the number of prediction steps based on timeframe and interval
        steps = calculate_steps(interval, timeframe)

        # Generate predictions
        predictions = []
        current_input = X.copy()
        for _ in range(steps):
            pred = model.predict(current_input, verbose=0)
            predictions.append(pred[0, 0])
            # Shift the input sequence and update with the new prediction
            current_input = np.roll(current_input, -1, axis=1)
            # Keep Open and Volume constant, update Close with the prediction
            last_open = current_input[0, -1, 0]
            last_volume = current_input[0, -1, 2]
            current_input[0, -1, 0] = last_open
            current_input[0, -1, 1] = pred[0, 0]
            current_input[0, -1, 2] = last_volume

        # Inverse transform predictions to the original price scale
        lstm_predictions = scaler_close.inverse_transform(np.array(predictions).reshape(-1, 1))
        lstm_predictions = lstm_predictions.flatten()  # Ensure 1D array

        # Get the current price (last closing price) as a scalar
        last_close_price = float(data['Close'].iloc[-1])  # Explicitly convert to float

        # Get the last predicted price as a scalar
        last_prediction = float(lstm_predictions[-1])  # Explicitly convert to float

        # Calculate projected change as a scalar
        projected_change = ((last_prediction / last_close_price) - 1) * 100
        projected_change_str = f"{projected_change:.2f}%"  # Format scalar value

        # Determine the trend direction
        trend = 'rise' if last_prediction > last_close_price else 'fall'

        # Construct the result dictionary
        combined_result = {
            "ticker": ticker,
            "timeframe": timeframe,
            "interval": interval,
            "lstm_predictions": lstm_predictions.tolist(),  # Convert to list for JSON compatibility
            "predicted_price_range": f"${min(lstm_predictions):.2f} - ${max(lstm_predictions):.2f}",
            "current_price": last_close_price,
            "projected_change": projected_change_str,
            "quantitative_analysis": f"LSTM model projects a {trend} to approximately ${last_prediction:.2f}",
        }

        return combined_result