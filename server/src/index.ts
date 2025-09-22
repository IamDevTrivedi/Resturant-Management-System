import logger from '@/utils/logger';
import checkEnv from '@/config/checkEnv';
import { connectRedis } from '@/db/connectRedis';
import connectMongo from '@/db/connectMongo';
import express, { Request, Response } from 'express';
import config from '@/config/env';

async function startServer() {
    try {
        // CHECK ENV VARIABLES
        checkEnv();

        // CONNECT TO DATABASES
        await connectMongo();
        await connectRedis();

        // INIT EXPRESS
        const app = express();

        // CORE MIDDLEWARES
        app.use(express.json());

        // TEST ROUTE
        app.get('/', (req: Request, res: Response) => {
            return res.status(200).json({
                success: true,
                message: 'Server is running',
            });
        });

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
