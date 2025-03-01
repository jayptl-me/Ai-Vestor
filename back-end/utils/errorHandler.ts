// utils/errorHandler.ts
import type { Context, MiddlewareHandler, Next } from 'hono';

export const errorHandler = (): MiddlewareHandler => {
    return async (c: Context, next: Next) => {
        try {
            await next();
        } catch (error) {
            console.error('Unhandled error:', error);

            if (error instanceof Error) {
                return c.json({
                    success: false,
                    error: error.message || 'Internal Server Error'
                }, 500);
            }

            return c.json({
                success: false,
                error: 'Internal Server Error'
            }, 500);
        }
    };
};