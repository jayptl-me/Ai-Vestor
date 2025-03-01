import numpy as np
from sklearn.preprocessing import MinMaxScaler

def prepare_data_for_lstm(data, look_back=60):
    """Prepare data with Open, Close, and Volume for LSTM input."""
    # Initialize separate scalers for each feature
    scaler_open = MinMaxScaler(feature_range=(0, 1))
    scaler_close = MinMaxScaler(feature_range=(0, 1))
    scaler_volume = MinMaxScaler(feature_range=(0, 1))

    # Scale each feature independently
    scaled_open = scaler_open.fit_transform(data[['Open']])
    scaled_close = scaler_close.fit_transform(data[['Close']])
    scaled_volume = scaler_volume.fit_transform(data[['Volume']])

    X, y = [], []
    # Create sequences with look_back timesteps
    for i in range(look_back, len(data)):
        open_seq = scaled_open[i - look_back:i, 0]
        close_seq = scaled_close[i - look_back:i, 0]
        volume_seq = scaled_volume[i - look_back:i, 0]
        # Stack the features horizontally: shape (look_back, 3)
        X.append(np.column_stack((open_seq, close_seq, volume_seq)))
        # Predict the next Close price
        y.append(scaled_close[i, 0])

    return np.array(X), np.array(y), scaler_open, scaler_close, scaler_volume