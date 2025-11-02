import Resturant from '@/models/resturant';
import User from '@/models/user';
import logger from '@/utils/logger';
import { Request, Response } from 'express';
import { z } from 'zod';

const controller = {
    addRestaurant: async (req: Request, res: Response) => {
        try {
            const schema = z.object({
                resturantName: z.string().min(2),

                address: z.object({
                    line1: z.string().min(3).trim(),
                    line2: z.string().min(3).trim(),
                    line3: z.string().min(3).trim().optional(),
                    zip: z.string().trim(),
                    city: z.string().min(2),
                    state: z.string().min(2),
                    country: z.string().min(2),
                }),

                ownerName: z.string().min(2).trim(),

                phoneNumber: z.string().trim(),
                resturantEmail: z.email().trim(),

                websiteURL: z.url().trim().optional(),

                socialMedia: z
                    .object({
                        facebook: z.url().trim().optional(),
                        twitter: z.url().trim().optional(),
                        instagram: z.url().trim().optional(),
                    })
                    .optional(),

                openingHours: z.object({
                    weekend: z.object({
                        start: z.string(),
                        end: z.string(),
                    }),
                    weekday: z.object({
                        start: z.string(),
                        end: z.string(),
                    }),
                }),

                logoURL: z.url().trim().optional(),
                bannerURL: z.url().trim(),
                about: z.string().min(10).trim().optional(),
                since: z.number().int().optional(),
                slogan: z.string().min(5).trim().optional(),
            });

            const result = schema.safeParse(req.body);

            if (!result.success) {
                logger.warn('Validation failed in addResturant controller:', result.error);

                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: z.treeifyError(result.error),
                });
            }

            const userID = res.locals.userID! as string;

            const existingUser = await User.findById(userID);
            if (!existingUser) {
                logger.warn(`User not found with ID: ${userID} in addResturant controller`);
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }

            const existingResturant = await Resturant.findOne({
                owner: userID,
            });
            if (existingResturant) {
                logger.warn(
                    `Resturant already exists for user ID: ${userID} in addResturant controller`,
                );
                return res.status(400).json({
                    success: false,
                    message: 'Resturant already exists for this user',
                });
            }

            const newResturant = new Resturant({
                owner: userID,
                ...result.data,
            });

            await newResturant.save();

            return res.status(201).json({
                success: true,
                message: 'Resturant added successfully',
                resturantID: newResturant._id,
            });
        } catch (error) {
            logger.error('Error in addResturant controller:', error);

            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },
};

export default controller;


/**
 * TODO: 
 * updateResturant
 * addMenuItem
 * deleteMenuItem
 */