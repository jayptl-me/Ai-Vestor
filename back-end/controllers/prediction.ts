import { Hono } from 'hono';
import { fetchPredictionFromModel } from '../services/predictionServices';

const prediction = new Hono();

// Prediction endpoint
prediction.get('/:ticker', async (c) => {
    const ticker = c.req.param('ticker');
    const timeframe = c.req.query('timeframe');
    const interval = c.req.query('interval');

    if (!timeframe || !interval) {
        return c.json({ error: 'Missing timeframe or interval query parameters' }, 400);
    }

    try {
        const predictionData = await fetchPredictionFromModel(ticker, timeframe, interval);
        return c.json(predictionData);
    } catch (error) {
        return c.json({ error: 'Failed to fetch prediction' }, 500);
    }
});

export default prediction;