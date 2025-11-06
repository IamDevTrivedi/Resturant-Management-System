import dotenv from 'dotenv';
import process from 'process';

const NODE_ENV = process.env.NODE_ENV;
const fileName = `.env.${NODE_ENV}`;

const result = dotenv.config({
    path: fileName,
});

if (result.error) {
    console.error('Env Files not configured');
    process.exit(1);
}

const config = {
    NODE_ENV: NODE_ENV as 'production' | 'development',
    isProduction: NODE_ENV === 'production',

    PORT: Number(process.env.PORT) as number,

    MONGODB_URI: process.env.MONGODB_URI as string,
    JWT_KEY: process.env.JWT_KEY as string,

    REDIS_USERNAME: process.env.REDIS_USERNAME as string,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
    REDIS_HOST: process.env.REDIS_HOST as string,
    REDIS_PORT: Number(process.env.REDIS_PORT) as number,
    LOCAL_REDIS: Number(process.env.LOCAL_REDIS) as number,

    EMAIL_HOST: process.env.EMAIL_HOST as string,
    EMAIL_PORT: Number(process.env.EMAIL_PORT) as number,
    SMTP_USER: process.env.SMTP_USER as string,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD as string,
    SENDER_EMAIL: process.env.SENDER_EMAIL as string,

    BACKEND_URL_DEV: process.env.BACKEND_URL_DEV as string,
    BACKEND_URL_PROD: process.env.BACKEND_URL_PROD as string,
    FRONTEND_URL_DEV: process.env.FRONTEND_URL_DEV as string,
    FRONTEND_URL_PROD: process.env.FRONTEND_URL_PROD as string,

    BACKEND_URL:
        NODE_ENV === 'production' ? process.env.BACKEND_URL_PROD : process.env.BACKEND_URL_DEV,
    FRONTEND_URL:
        NODE_ENV === 'production' ? process.env.FRONTEND_URL_PROD : process.env.FRONTEND_URL_DEV,

    GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY as string,
} as const;

export default config;
