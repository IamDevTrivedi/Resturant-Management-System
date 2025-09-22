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

    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: Number(process.env.REDIS_PORT),
    LOCAL_REDIS: Number(process.env.LOCAL_REDIS),
} as const;

export default config;
