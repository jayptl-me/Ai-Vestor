import { config } from '../utils/config';

export async function fetchPredictionFromModel(ticker: string, timeframe: string, interval: string) {
    const FASTAPI_URL = config.FASTAPI_URL || 'http://localhost:8000';
    const url = `${FASTAPI_URL}/predict/${ticker}?timeframe=${encodeURIComponent(timeframe)}&interval=${interval}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch prediction: ${response.statusText}`);
    }

    return response.json();
}


export default fetchPredictionFromModel;