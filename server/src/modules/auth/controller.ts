import { z } from 'zod';
import { Request, Response } from 'express';
import generateOTP from '@/utils/generateOTP';
import { redisClient } from '@/db/connectRedis';
import config from '@/config/env';
import { transporter } from '@/config/nodemailer';
import logger from '@/utils/logger';
import { OTP_REGEX, PASSWORD_REGEX } from '@/constants/regex';
import User from '@/models/user';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

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

    createAccount: async (req: Request, res: Response) => {
        try {
            const schema = z.object({
                email: z.email(),
                firstName: z.string().min(1, 'First name is required'),
                lastName: z.string().min(1, 'Last name is required'),
                password: z.string(),
                role: z.enum(['owner', 'customer']),
            });

            const result = schema.safeParse(req.body);

            if (!result.success) {
                console.error('Zod Validation Failed:', z.treeifyError(result.error));
                return res.status(400).json({
                    success: false,
                    error: 'Invalid input',
                    details: z.treeifyError(result.error),
                });
            }

            const { email, firstName, lastName, password, role } = result.data;

            const key = await redisClient.get(`upcomingEmail:${email}`);
            if (!key) {
                return res.status(400).json({
                    success: false,
                    error: 'Email not found or expired. Please verify again.',
                });
            }
            const { isVerified } = JSON.parse(key);
            if (!isVerified) {
                return res.status(400).json({ success: false, error: 'Email is not verified' });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res
                    .status(409)
                    .json({ success: false, error: 'User already exists with this email' });
            }
            const hashedPassword = await bcrypt.hash(password, 12);

            const user = await User.create({
                firstName,
                lastName,
                hashedPassword,
                role,
                email,
            });
            await redisClient.del(`upcomingEmail:${email}`);

            return res.status(201).json({
                success: true,
                message: 'Account created successfully',
            });
        } catch (error) {
            console.error('Error creating account:', error);
            return res.status(500).json({ success: false, error: 'Internal server error' });
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const schema = z.object({
                email: z.email(),
                password: z.string().regex(PASSWORD_REGEX, 'Invalid password format'),
            });

            const result = schema.safeParse(req.body);
            if (!result.success) {
                return res
                    .status(400)
                    .json({ success: false, error: z.treeifyError(result.error) });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ success: false, error: 'Invalid credentials' });
            }

            const match = await bcrypt.compare(password, user.hashedPassword);
            if (!match) {
                return res.status(401).json({ success: false, error: 'Invalid credentials' });
            }

            const token = jwt.sign({ userID: user._id }, process.env.JWT_KEY as string, {
                expiresIn: '7d',
            });

            const cookieOptions: {
                httpOnly: boolean;
                secure: boolean;
                sameSite: 'strict' | 'lax' | 'none';
                maxAge: number;
                path: string;
            } = {
                httpOnly: true,
                secure: config.isProduction,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/',
            };

            res.cookie('token', token, cookieOptions);
            return res.json({ success: true, message: 'Login successful' });
        } catch {
            return res.status(500).json({ success: false, error: 'Server error' });
        }
    },

    logout: async (req: Request, res: Response): Promise<Response> => {
        try {
            const token = req.cookies?.token as string | undefined;

            if (!token) {
                return res.status(401).json({ success: false, error: 'No token provided' });
            }

            const payload = jwt.decode(token) as JwtPayload | null;

            if (!payload || typeof payload.exp !== 'number') {
                return res.status(401).json({ success: false, error: 'Invalid token' });
            }

            await redisClient.set(`token:${token}`, 'BLOCKED');
            await redisClient.expireAt(`token:${token}`, payload.exp);

            res.cookie('token', '', {
                httpOnly: true,
                secure: config.isProduction,
                sameSite: 'strict',
                expires: new Date(0),
                path: '/',
            });

            return res.json({ success: true, message: 'Logged out successfully' });
        } catch (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ success: false, error: 'Server error' });
        }
    },
};

export default controller;
