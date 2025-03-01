// controllers/lessonController.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { LessonService } from '../services/lessonServies';

const lessonRoutes = new Hono();
const lessonService = new LessonService();

// Schemas for validation
const lessonCreateSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    videoUrl: z.string().url("Video URL must be a valid URL"),
    courseId: z.string().min(1, "Course ID is required")
});

const lessonUpdateSchema = lessonCreateSchema.partial();

// Query schema for filtering and sorting
const lessonQuerySchema = z.object({
    courseId: z.string().optional(),
    sortBy: z.enum(['title', 'createdAt', 'updatedAt']).optional().default('createdAt'),
    order: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10')
});

// Get all lessons with filtering and sorting
lessonRoutes.get('/', async (c) => {
    const query = c.req.query();

    try {
        const validatedQuery = lessonQuerySchema.parse({
            courseId: query.courseId,
            sortBy: query.sortBy || 'createdAt',
            order: query.order || 'desc',
            page: query.page || '1',
            limit: query.limit || '10'
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
                pages: Math.ceil(total / parseInt(validatedQuery.limit as string))
            }
        });
    } catch (error) {
        console.error('Error getting lessons:', error);
        return c.json({ success: false, error: 'Failed to get lessons' }, 500);
    }
});

// Get a lesson by ID
lessonRoutes.get('/:id', async (c) => {
    const id = c.req.param('id');

    try {
        const lesson = await lessonService.getLessonById(id);

        if (!lesson) {
            return c.json({ success: false, error: 'Lesson not found' }, 404);
        }

        return c.json({ success: true, data: lesson });
    } catch (error) {
        console.error('Error getting lesson:', error);
        return c.json({ success: false, error: 'Failed to get lesson' }, 500);
    }
});

// Create a new lesson
lessonRoutes.post('/', zValidator('json', lessonCreateSchema), async (c) => {
    const data = await c.req.json();

    try {
        const lesson = await lessonService.createLesson(data);
        return c.json({ success: true, data: lesson }, 201);
    } catch (error) {
        console.error('Error creating lesson:', error);
        return c.json({ success: false, error: 'Failed to create lesson' }, 500);
    }
});

// Update a lesson
lessonRoutes.put('/:id', zValidator('json', lessonUpdateSchema), async (c) => {
    const id = c.req.param('id');
    const data = await c.req.json();

    try {
        const lesson = await lessonService.updateLesson(id, data);

        if (!lesson) {
            return c.json({ success: false, error: 'Lesson not found' }, 404);
        }

        return c.json({ success: true, data: lesson });
    } catch (error) {
        console.error('Error updating lesson:', error);
        return c.json({ success: false, error: 'Failed to update lesson' }, 500);
    }
});

// Delete a lesson
lessonRoutes.delete('/:id', async (c) => {
    const id = c.req.param('id');

    try {
        const deleted = await lessonService.deleteLesson(id);

        if (!deleted) {
            return c.json({ success: false, error: 'Lesson not found' }, 404);
        }

        return c.json({ success: true, message: 'Lesson deleted successfully' });
    } catch (error) {
        console.error('Error deleting lesson:', error);
        return c.json({ success: false, error: 'Failed to delete lesson' }, 500);
    }
});

export default lessonRoutes;