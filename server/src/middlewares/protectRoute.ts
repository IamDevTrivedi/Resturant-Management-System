import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { redisClient } from '@/db/connectRedis';
import config from '@/config/env';
import logger from '@/utils/logger';

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        const decoded = jwt.verify(token, config.JWT_KEY) as JwtPayload & {
            userID: string;
        };

        const { userID } = decoded;
        if (!userID) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
            });
        }

        res.locals.userID = userID;
        next();
    } catch (err: unknown) {
        logger.error('Error in protectRoute Middleware:', err);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }
};
