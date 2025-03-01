import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { AuthService } from '../services/authServices';

const authRoutes = new Hono();
const authService = new AuthService();

const registerSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
});

const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

authRoutes.post('/register', zValidator('json', registerSchema), async (c) => {
    const { username, password } = await c.req.json();
    try {
        const user = await authService.register(username, password);
        return c.json({ success: true, data: { id: user.id, username: user.username } }, 201);
    } catch (error) {
        return c.json({ success: false, error: 'Registration failed' }, 500);
    }
});

authRoutes.post('/login', zValidator('json', loginSchema), async (c) => {
    const { username, password } = await c.req.json();
    try {
        const { token, userId } = await authService.login(username, password);
        return c.json({ success: true, data: { token, userId } });
    } catch (error) {
        return c.json({ success: false, error: 'Login failed' }, 401);
    }
});

export default authRoutes;