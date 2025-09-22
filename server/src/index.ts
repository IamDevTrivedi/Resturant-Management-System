import logger from '@/utils/logger';
import checkEnv from '@/config/checkEnv';
import { connectRedis } from '@/db/connectRedis';
import connectMongo from '@/db/connectMongo';
import express from 'express';
import config from '@/config/env';
import { verifyEmailTransporter } from '@/config/nodemailer';

async function startServer() {
    try {
        // CHECK ENV VARIABLES
        checkEnv();

        // CONNECT TO DATABASES
        await connectMongo();
        await connectRedis();
        await verifyEmailTransporter();

        // INIT EXPRESS
        const app = express();

        // CORE MIDDLEWARES
        app.use(express.json());

        const { default: rootRoutes } = await import('@/modules/root/route');
        const { default: healthRoutes } = await import('@/modules/health/route');

        app.use('/', rootRoutes);
        app.use('/api/v1/health', healthRoutes);

        // START SERVER
        app.listen(config.PORT, () => {
            logger.info(`Server is running on port ${config.PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
