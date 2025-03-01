// index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import courseRoutes from './controllers/courseController';
import lessonRoutes from './controllers/lessonController';
import { errorHandler } from './utils/errorHandler';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());
app.use('*', errorHandler());

// Routes
app.route('/api/courses', courseRoutes);
app.route('/api/lessons', lessonRoutes);

// Root route
app.get('/', (c) => {
    return c.json({ message: 'API is running' });
});

// Start server
const PORT = process.env.PORT || 3001;
console.log(`Server is running on port ${PORT}`);

export default app;