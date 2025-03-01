import yfinance as yf
from src.utils import get_training_period

def fetch_training_data(ticker, interval):
    """Fetch Open, Close, and Volume data from Yahoo Finance."""
    period = get_training_period(interval)
    data = yf.download(ticker, period=period, interval=interval)
    return data[['Open', 'Close', 'Volume']]