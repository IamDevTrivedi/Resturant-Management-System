import { z } from 'zod';
import { Request, Response } from 'express';
import generateOTP from '@/utils/generateOTP';
import { redisClient } from '@/db/connectRedis';
import config from '@/config/env';
import { transporter } from '@/config/nodemailer';
import logger from '@/utils/logger';
import { OTP_REGEX } from '@/constants/regex';

const controller = {
    sendOTPForVerification: async (req: Request, res: Response) => {
        try {
            const schema = z.object({
                email: z.email(),
            });

            const result = schema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email address',
                    errors: z.treeifyError(result.error),
                });
            }

            const { email } = result.data;
            const OTP = generateOTP();

            const save = {
                OTP,
                expiry: Date.now() + 5 * 60 * 1000,
                isVerified: false,
            };

            await redisClient.set(`upcomingEmail:${email}`, JSON.stringify(save), {
                expiration: {
                    type: 'EX',
                    value: 60 * 60,
                },
            });

            const payload = {
                to: email,
                from: config.SENDER_EMAIL,
                subject: 'Your OTP Verification Code',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2>Email Verification</h2>
                        <p>Your OTP code is:</p>
                        <h1 style="letter-spacing: 5px;">${OTP}</h1>
                        <p>This code will expire in 5 minutes.</p>
                        <p>If you did not request this, please ignore this email.</p>
                    </div>
                    `,
            };

            await transporter.sendMail(payload);

            return res.status(200).json({
                success: true,
                message: 'OTP sent successfully',
            });
        } catch (error) {
            logger.error('Error sending OTP:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP',
            });
        }
    },

    verifyOTPForVerification: async (req: Request, res: Response) => {
        try {
            const schema = z.object({
                email: z.email(),
                OTP: z.string().regex(OTP_REGEX),
            });

            const result = schema.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid request body',
                    errors: z.treeifyError(result.error),
                });
            }

            const { email, OTP } = result.data;

            const key = await redisClient.get(`upcomingEmail:${email}`);
            if (!key) {
                return res.status(404).json({
                    success: false,
                    message: 'OTP not found or already used',
                });
            }

            const { OTP: genOTP, expiry, isVerified } = JSON.parse(key);

            if (isVerified) {
                return res.status(200).json({
                    success: true,
                    message: 'Email already verified',
                });
            }

            if (OTP !== genOTP) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid OTP',
                });
            }

            if (Date.now() > expiry) {
                return res.status(400).json({
                    success: false,
                    message: 'OTP has expired',
                });
            }

            await redisClient.set(
                `upcomingEmail:${email}`,
                JSON.stringify({
                    OTP: 'NOT_VALID',
                    expiry: 0,
                    isVerified: true,
                }),
                {
                    EX: 60 * 60,
                },
            );

            return res.status(200).json({
                success: true,
                message: 'Email successfully verified',
            });
        } catch (err) {
            logger.error('verifyOTPForVerification error:', err);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },
};

export default controller;
