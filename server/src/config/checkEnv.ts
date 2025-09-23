import { z } from 'zod';
import config from '@/config/env';
import logger from '@/utils/logger';

const envSchema = z.object({
    NODE_ENV: z.enum(['production', 'development']),
    isProduction: z.boolean(),

    MONGODB_URI: z.url(),
    JWT_KEY: z.string().min(32),

    REDIS_USERNAME: z.string(),
    REDIS_PASSWORD: z.string(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.number(),
    LOCAL_REDIS: z.number(),

    EMAIL_HOST: z.string(),
    EMAIL_PORT: z.number(),
    SMTP_USER: z.string(),
    SMTP_PASSWORD: z.string(),
    SENDER_EMAIL: z.email(),
});

type ConfigSchema = z.infer<typeof envSchema>;

const checkEnv = (): ConfigSchema => {
    const result = envSchema.safeParse(config);

    if (!result.success) {
        logger.error('Invalid environment configuration:', result.error.format());
        process.exit(1);
    } else {
        logger.info('Environment configuration is valid.');
    }

    return result.data;
};

export default checkEnv;
