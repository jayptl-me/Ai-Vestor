import prisma from '../utils/prismaClient';


export class ProgressService {
    async completeLesson(userId: string, lessonId: string) {
        const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
        if (!lesson) throw new Error('Lesson not found');

        const experiencePoints = lesson.type === 'VIDEO' ? 10 : 20; // 10 for videos, 20 for quizzes

        // Update experience
        await prisma.user.update({
            where: { id: userId },
            data: { experience: { increment: experiencePoints } },
        });

        // Simplified streak: increment if completed today (real implementation needs date tracking)
        await prisma.user.update({
            where: { id: userId },
            data: { streak: { increment: 1 } },
        });
    }

    async completeCourse(userId: string, courseId: string) {
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: { Lesson: true },
        });
        if (!course) throw new Error('Course not found');

        // Award 50 points for course completion
        await prisma.user.update({
            where: { id: userId },
            data: { experience: { increment: 50 } },
        });
    }

    async getUserProgress(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { streak: true, experience: true },
        });
        if (!user) throw new Error('User not found');
        return user;
    }
}