import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { config } from './utils/config.ts';
import predictionRoutes from './controllers/prediction.ts';

const app = new Hono();

// Middleware
app.use('*', cors()); // Enable CORS

// Health check endpoint
app.get('/health', (c) => c.text('Healthy'));

// Routes
app.route('/predict', predictionRoutes);

// Start the server
const port = config.PORT;
console.log(`Server is running on http://localhost:${port}`);
export default {
    port,
    fetch: app.fetch,
};