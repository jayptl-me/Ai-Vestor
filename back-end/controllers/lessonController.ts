import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { LessonService } from '../services/lessonServies';
import { ProgressService } from '../services/progressServices';
import { getCookie } from 'hono/cookie';
import jwt from 'jsonwebtoken';

const lessonRoutes = new Hono();
const lessonService = new LessonService();
const progressService = new ProgressService();
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

const lessonCreateSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    type: z.enum(['VIDEO', 'QUIZ']),
    videoUrl: z.string().url("Video URL must be a valid URL").optional(),
    quizQuestions: z.array(z.object({
        question: z.string(),
        options: z.array(z.string()),
        correctAnswer: z.string(),
    })).optional(),
    courseId: z.string().min(1, "Course ID is required"),
});

const lessonUpdateSchema = lessonCreateSchema.partial();

const lessonQuerySchema = z.object({
    courseId: z.string().optional(),
    sortBy: z.enum(['title', 'createdAt', 'updatedAt']).optional().default('createdAt'),
    order: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
});

lessonRoutes.get('/', async (c) => {
    const query = c.req.query();
    try {
        const validatedQuery = lessonQuerySchema.parse({
            courseId: query.courseId,
            sortBy: query.sortBy || 'createdAt',
            order: query.order || 'desc',
            page: query.page || '1',
            limit: query.limit || '10',
        });

        const { lessons, total } = await lessonService.getLessons(
            validatedQuery.courseId,
            validatedQuery.sortBy,
            validatedQuery.order,
            parseInt(validatedQuery.page as string),
            parseInt(validatedQuery.limit as string)
        );

        return c.json({
            success: true,
            data: lessons,
            pagination: {
                total,
                page: parseInt(validatedQuery.page as string),
                limit: parseInt(validatedQuery.limit as string),
                pages: Math.ceil(total / parseInt(validatedQuery.limit as string)),
            },
        });
    } catch (error) {
        console.error('Error getting lessons:', error);
        return c.json({ success: false, error: 'Failed to get lessons' }, 500);
    }
});

lessonRoutes.get('/:id', async (c) => {
    const id = c.req.param('id');
    try {
        const lesson = await lessonService.getLessonById(id);
        if (!lesson) return c.json({ success: false, error: 'Lesson not found' }, 404);
        return c.json({ success: true, data: lesson });
    } catch (error) {
        console.error('Error getting lesson:', error);
        return c.json({ success: false, error: 'Failed to get lesson' }, 500);
    }
});

lessonRoutes.post('/', zValidator('json', lessonCreateSchema), async (c) => {
    const data = await c.req.json();
    try {
        const lesson = await lessonService.createLesson(data);
        return c.json({ success: true, data: lesson }, 201);
    } catch (error) {
        console.error('Error creating lesson:', error);
        if (error instanceof Error) {
            return c.json({ success: false, error: error.message }, 400);
        }
        return c.json({ success: false, error: 'Failed to create lesson' }, 500);
    }
});

lessonRoutes.put('/:id', zValidator('json', lessonUpdateSchema), async (c) => {
    const id = c.req.param('id');
    const data = await c.req.json();
    try {
        const lesson = await lessonService.updateLesson(id, data);
        if (!lesson) return c.json({ success: false, error: 'Lesson not found' }, 404);
        return c.json({ success: true, data: lesson });
    } catch (error) {
        console.error('Error updating lesson:', error);
        if (error instanceof Error) {
            return c.json({ success: false, error: error.message }, 400);
        }
        return c.json({ success: false, error: 'Failed to update lesson' }, 500);
    }
});

lessonRoutes.delete('/:id', async (c) => {
    const id = c.req.param('id');
    try {
        const deleted = await lessonService.deleteLesson(id);
        if (!deleted) return c.json({ success: false, error: 'Lesson not found' }, 404);
        return c.json({ success: true, message: 'Lesson deleted successfully' });
    } catch (error) {
        console.error('Error deleting lesson:', error);
        return c.json({ success: false, error: 'Failed to delete lesson' }, 500);
    }
});

lessonRoutes.post('/:id/complete', async (c) => {
    const id = c.req.param('id');
    const token = getCookie(c, 'token');
    if (!token) return c.json({ success: false, error: 'Unauthorized' }, 401);

    try {
        const { userId } = jwt.verify(token, SECRET_KEY) as { userId: string };
        await progressService.completeLesson(userId, id);
        return c.json({ success: true, message: 'Lesson completed' });
    } catch (error) {
        console.error('Error completing lesson:', error);
        return c.json({ success: false, error: 'Failed to complete lesson' }, 500);
    }
});

export default lessonRoutes;
