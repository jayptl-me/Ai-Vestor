// services/courseService.ts
import type { Course } from '@prisma/client';
import { Prisma } from '@prisma/client';
import prisma from '../utils/prismaClient';



export class CourseService {
    // Get all courses with filtering and sorting
    async getCourses(
        categoryFilter?: string,
        tagsFilter?: string,
        sortBy: 'title' | 'createdAt' | 'updatedAt' = 'createdAt',
        order: 'asc' | 'desc' = 'desc',
        page: number = 1,
        limit: number = 10
    ): Promise<{ courses: Course[]; total: number }> {
        // Build filter conditions
        const where: Prisma.CourseWhereInput = {};

        // Filter by category if provided
        if (categoryFilter) {
            where.category = {
                has: categoryFilter
            };
        }

        // Filter by tags if provided
        if (tagsFilter) {
            const tagsList = tagsFilter.split(',');
            where.tags = {
                hasSome: tagsList
            };
        }

        // Count total matching courses
        const total = await prisma.course.count({ where });

        // Build sort options
        const orderBy: any = {};
        orderBy[sortBy] = order;

        // Execute query with pagination
        const courses = await prisma.course.findMany({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
            include: {
                Lesson: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });

        return { courses, total };
    }

    // Get a course by ID
    async getCourseById(id: string): Promise<Course | null> {
        return prisma.course.findUnique({
            where: { id },
            include: {
                Lesson: true
            }
        });
    }

    // Create a new course
    async createCourse(data: Prisma.CourseCreateInput): Promise<Course> {
        return prisma.course.create({
            data
        });
    }

    // Update a course
    async updateCourse(id: string, data: Prisma.CourseUpdateInput): Promise<Course | null> {
        try {
            return await prisma.course.update({
                where: { id },
                data
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return null; // Course not found
                }
            }
            throw error;
        }
    }

    // Delete a course
    async deleteCourse(id: string): Promise<boolean> {
        try {
            // First delete related lessons
            await prisma.lesson.deleteMany({
                where: { courseId: id }
            });

            // Then delete the course
            await prisma.course.delete({
                where: { id }
            });

            return true;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return false; // Course not found
                }
            }
            throw error;
        }
    }
}