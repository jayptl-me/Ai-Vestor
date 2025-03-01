import type { Lesson } from '@prisma/client';
import { Prisma } from '@prisma/client';
import prisma from '../utils/prismaClient';

export class LessonService {
    async getLessons(
        courseId?: string,
        sortBy: 'title' | 'createdAt' | 'updatedAt' = 'createdAt',
        order: 'asc' | 'desc' = 'desc',
        page: number = 1,
        limit: number = 10
    ): Promise<{ lessons: Lesson[]; total: number }> {
        const where: Prisma.LessonWhereInput = { courseId };
        const total = await prisma.lesson.count({ where });
        const orderBy: any = { [sortBy]: order };

        const lessons = await prisma.lesson.findMany({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
            include: { course: { select: { id: true, title: true } } },
        });

        return { lessons, total };
    }

    async getLessonById(id: string): Promise<Lesson | null> {
        return prisma.lesson.findUnique({
            where: { id },
            include: { course: { select: { id: true, title: true } } },
        });
    }

    async createLesson(data: any) {
        if (data.type === 'VIDEO' && !data.videoUrl) {
            throw new Error('Video URL is required for video lessons');
        }
        if (data.type === 'QUIZ' && !data.quizQuestions) {
            throw new Error('Quiz questions are required for quiz lessons');
        }
        return prisma.lesson.create({ data });
    }

    async updateLesson(id: string, data: any): Promise<Lesson | null> {
        if (data.type === 'VIDEO' && data.videoUrl === undefined) {
            throw new Error('Video URL is required for video lessons');
        }
        if (data.type === 'QUIZ' && data.quizQuestions === undefined) {
            throw new Error('Quiz questions are required for quiz lessons');
        }
        try {
            return await prisma.lesson.update({ where: { id }, data });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }

    async deleteLesson(id: string): Promise<boolean> {
        try {
            await prisma.lesson.delete({ where: { id } });
            return true;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return false;
            }
            throw error;
        }
    }
}