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
} as const;

export default config;
