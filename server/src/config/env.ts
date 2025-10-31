import dotenv from 'dotenv';
import process from 'process';

const NODE_ENV = process.env.NODE_ENV;
const fileName = `.env.${NODE_ENV}`;

const result = dotenv.config({
    path: fileName,
});

if (result.error) {
    console.error('File not configured');
    process.exit(1);
}

const config = {
    NODE_ENV,
    isProduction: NODE_ENV === 'production',

    PORT: Number(process.env.PORT),

    MONGODB_URI: process.env.MONGODB_URI,
    JWT_KEY: process.env.JWT_KEY,

    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: Number(process.env.REDIS_PORT),
    LOCAL_REDIS: Number(process.env.LOCAL_REDIS),

    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: Number(process.env.EMAIL_PORT),
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SENDER_EMAIL: process.env.SENDER_EMAIL,

    BACKEND_URL_DEV: process.env.BACKEND_URL_DEV,
    BACKEND_URL_PROD: process.env.BACKEND_URL_PROD,
    FRONTEND_URL_DEV: process.env.FRONTEND_URL_DEV,
    FRONTEND_URL_PROD: process.env.FRONTEND_URL_PROD,

    BACKEND_URL:
        NODE_ENV === 'production' ? process.env.BACKEND_URL_PROD : process.env.BACKEND_URL_DEV,
    FRONTEND_URL:
        NODE_ENV === 'production' ? process.env.FRONTEND_URL_PROD : process.env.FRONTEND_URL_DEV,
} as const;

export default config;
