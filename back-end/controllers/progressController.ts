import { Hono } from 'hono';
import { ProgressService } from '../services/progressServices';
import { getCookie } from 'hono/cookie';
import jwt from 'jsonwebtoken';

const progressRoutes = new Hono();
const progressService = new ProgressService();
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

progressRoutes.get('/', async (c) => {
    const token = getCookie(c, 'token');
    if (!token) return c.json({ success: false, error: 'Unauthorized' }, 401);

    try {
        const { userId } = jwt.verify(token, SECRET_KEY) as { userId: string };
        const progress = await progressService.getUserProgress(userId);
        return c.json({ success: true, data: progress });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to get progress' }, 500);
    }
});

export default progressRoutes;