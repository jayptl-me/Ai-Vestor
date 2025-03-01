def get_training_period(interval):
    """Determine the training period based on the interval."""
    if interval == '1m':
        return '8d'
    elif interval in ['5m', '15m', '30m', '60m']:
        return '60d'
    elif interval == '1d':
        return '5y'
    else:
        return '60d'

def get_prediction_period(interval):
    """Determine the period for fetching prediction data."""
    if interval in ['1m', '5m', '15m', '30m', '60m']:
        return '1d'
    elif interval == '1d':
        return '1y'
    else:
        return '1y'
    
def calculate_steps(interval, timeframe):
    """Calculate the number of prediction steps."""
    interval_minutes = {'1m': 1, '5m': 5, '15m': 15, '30m': 30, '60m': 60, '1d': 1440}.get(interval, 1)
    timeframe_value, timeframe_unit = timeframe.split()
    timeframe_value = int(timeframe_value)
    if timeframe_unit.startswith('minute'):
        timeframe_minutes = timeframe_value
    elif timeframe_unit.startswith('hour'):
        timeframe_minutes = timeframe_value * 60
    elif timeframe_unit.startswith('day'):
        timeframe_minutes = timeframe_value * 1440
    else:
        return 1
    steps = timeframe_minutes // interval_minutes
    return steps if steps > 0 else 1