import { z } from 'zod';
import config from '@/config/env';
import logger from '@/utils/logger';

const envSchema = z.object({
    NODE_ENV: z.enum(['production', 'development']),
    isProduction: z.boolean(),
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
