import dotenv from 'dotenv';
dotenv.config();

export const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    FASTAPI_URL: process.env.FASTAPI_URL || 'http://localhost:8000',
};

export default config;