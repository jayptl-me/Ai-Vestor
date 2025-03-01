// controllers/courseController.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { CourseService } from '../services/courseServices';

const courseRoutes = new Hono();
const courseService = new CourseService();

// Schemas for validation
const courseCreateSchema = z.object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().min(1, "Subtitle is required"),
    description: z.string().min(1, "Description is required"),
    author: z.string().min(1, "Author is required"),
    category: z.array(z.string()),
    tags: z.array(z.string())
});

const courseUpdateSchema = courseCreateSchema.partial();

// Query schema for filtering and sorting
const courseQuerySchema = z.object({
    category: z.string().optional(),
    tags: z.string().optional(),
    sortBy: z.enum(['title', 'createdAt', 'updatedAt']).optional().default('createdAt'),
    order: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10')
});

// Get all courses with filtering and sorting
courseRoutes.get('/', async (c) => {
    const query = c.req.query();

    try {
        const validatedQuery = courseQuerySchema.parse({
            category: query.category,
            tags: query.tags,
            sortBy: query.sortBy || 'createdAt',
            order: query.order || 'desc',
            page: query.page || '1',
            limit: query.limit || '10'
        });

        const { courses, total } = await courseService.getCourses(
            validatedQuery.category,
            validatedQuery.tags,
            validatedQuery.sortBy,
            validatedQuery.order,
            parseInt(validatedQuery.page as string),
            parseInt(validatedQuery.limit as string)
        );

        return c.json({
            success: true,
            data: courses,
            pagination: {
                total,
                page: parseInt(validatedQuery.page as string),
                limit: parseInt(validatedQuery.limit as string),
                pages: Math.ceil(total / parseInt(validatedQuery.limit as string))
            }
        });
    } catch (error) {
        console.error('Error getting courses:', error);
        return c.json({ success: false, error: 'Failed to get courses' }, 500);
    }
});

// Get a course by ID
courseRoutes.get('/:id', async (c) => {
    const id = c.req.param('id');

    try {
        const course = await courseService.getCourseById(id);

        if (!course) {
            return c.json({ success: false, error: 'Course not found' }, 404);
        }

        return c.json({ success: true, data: course });
    } catch (error) {
        console.error('Error getting course:', error);
        return c.json({ success: false, error: 'Failed to get course' }, 500);
    }
});

// Create a new course
courseRoutes.post('/', zValidator('json', courseCreateSchema), async (c) => {
    const data = await c.req.json();

    try {
        const course = await courseService.createCourse(data);
        return c.json({ success: true, data: course }, 201);
    } catch (error) {
        console.error('Error creating course:', error);
        return c.json({ success: false, error: 'Failed to create course' }, 500);
    }
});

// Update a course
courseRoutes.put('/:id', zValidator('json', courseUpdateSchema), async (c) => {
    const id = c.req.param('id');
    const data = await c.req.json();

    try {
        const course = await courseService.updateCourse(id, data);

        if (!course) {
            return c.json({ success: false, error: 'Course not found' }, 404);
        }

        return c.json({ success: true, data: course });
    } catch (error) {
        console.error('Error updating course:', error);
        return c.json({ success: false, error: 'Failed to update course' }, 500);
    }
});

// Delete a course
courseRoutes.delete('/:id', async (c) => {
    const id = c.req.param('id');

    try {
        const deleted = await courseService.deleteCourse(id);

        if (!deleted) {
            return c.json({ success: false, error: 'Course not found' }, 404);
        }

        return c.json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        return c.json({ success: false, error: 'Failed to delete course' }, 500);
    }
});

export default courseRoutes;