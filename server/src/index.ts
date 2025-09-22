import logger from '@/utils/logger';
import checkEnv from '@/config/checkEnv';
import { connectRedis } from '@/db/connectRedis';
import connectMongo from '@/db/connectMongo';

async function startServer() {
    try {
        checkEnv();
        await connectMongo();
        await connectRedis();
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
