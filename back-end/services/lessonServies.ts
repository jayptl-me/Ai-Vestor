// services/lessonService.ts
import type { Lesson } from '@prisma/client';
import { Prisma } from '@prisma/client';
import prisma from '../utils/prismaClient';


export class LessonService {
    // Get all lessons with filtering and sorting
    async getLessons(
        courseId?: string,
        sortBy: 'title' | 'createdAt' | 'updatedAt' = 'createdAt',
        order: 'asc' | 'desc' = 'desc',
        page: number = 1,
        limit: number = 10
    ): Promise<{ lessons: Lesson[]; total: number }> {
        // Build filter conditions
        const where: Prisma.LessonWhereInput = {};

        // Filter by courseId if provided
        if (courseId) {
            where.courseId = courseId;
        }

        // Count total matching lessons
        const total = await prisma.lesson.count({ where });

        // Build sort options
        const orderBy: any = {};
        orderBy[sortBy] = order;

        // Execute query with pagination
        const lessons = await prisma.lesson.findMany({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
            include: {
                course: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });

        return { lessons, total };
    }

    // Get a lesson by ID
    async getLessonById(id: string): Promise<Lesson | null> {
        return prisma.lesson.findUnique({
            where: { id },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });
    }

    // Create a new lesson
    async createLesson(data: Prisma.LessonCreateInput): Promise<Lesson> {
        return prisma.lesson.create({
            data
        });
    }

    // Update a lesson
    async updateLesson(id: string, data: Prisma.LessonUpdateInput): Promise<Lesson | null> {
        try {
            return await prisma.lesson.update({
                where: { id },
                data
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return null; // Lesson not found
                }
            }
            throw error;
        }
    }

    // Delete a lesson
    async deleteLesson(id: string): Promise<boolean> {
        try {
            await prisma.lesson.delete({
                where: { id }
            });

            return true;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return false; // Lesson not found
                }
            }
            throw error;
        }
    }
}