import logger from '@/utils/logger';
import checkEnv from '@/config/checkEnv';
import { connectRedis } from '@/db/connectRedis';
import connectMongo from '@/db/connectMongo';
import express from 'express';
import config from '@/config/env';
import { verifyEmailTransporter } from '@/config/nodemailer';
import cookieParser from 'cookie-parser';
import cors from 'cors';

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
        app.use(cookieParser());
        app.use(
            cors({
                origin: config.FRONTEND_URL,
                credentials: true,
            }),
        );

        const { default: rootRoutes } = await import('@/modules/root/route');
        const { default: healthRoutes } = await import('@/modules/health/route');
        const { default: authRoutes } = await import('@/modules/auth/route');
        const { default: restaurantRoutes } = await import('@/modules/restaurant/route');

        app.use('/', rootRoutes);
        app.use('/api/v1/health', healthRoutes);
        app.use('/api/v1/auth', authRoutes);
        app.use('/api/v1/restaurants', restaurantRoutes);

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
