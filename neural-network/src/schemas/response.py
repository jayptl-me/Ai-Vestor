from pydantic import BaseModel
from typing import List, Optional

class Response(BaseModel):
    ticker: str
    timeframe: str
    interval: str
    lstm_predictions: List[float]
    predicted_price_range: str
    current_price: float
    projected_change: str
    quantitative_analysis: str