import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prismaClient';

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key'; // Set this in your .env file

export class AuthService {
    async register(username: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, password: hashedPassword },
        });
        return user;
    }

    async login(username: string, password: string) {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) throw new Error('User not found');

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error('Invalid password');

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
        return { token, userId: user.id };
    }
}