import Item from '@/models/menu';
import Restaurant from '@/models/restaurant';
import User from '@/models/user';
import logger from '@/utils/logger';
import { Request, Response } from 'express';
import { z } from 'zod';

const controller = {
    addRestaurant: async (req: Request, res: Response) => {
        try {
            const schema = z.object({
                restaurantName: z.string().min(2),

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
                restaurantEmail: z.email().trim(),

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
                since: z.number().optional(),
                slogan: z.string().min(5).trim().optional(),
            });

            const result = schema.safeParse(req.body);

            if (!result.success) {
                logger.warn('Validation failed in addRestaurant controller:', result.error);

                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: z.treeifyError(result.error),
                });
            }

            const userID = res.locals.userID! as string;

            const existingUser = await User.findById(userID);
            if (!existingUser) {
                logger.warn(`User not found with ID: ${userID} in addRestaurant controller`);
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }

            const existingRestaurant = await Restaurant.findOne({
                owner: userID,
            });
            if (existingRestaurant) {
                logger.warn(
                    `Restaurant already exists for user ID: ${userID} in addRestaurant controller`,
                );
                return res.status(400).json({
                    success: false,
                    message: 'Restaurant already exists for this user',
                });
            }

            const newRestaurant = new Restaurant({
                owner: userID,
                ...result.data,
            });

            await newRestaurant.save();

            return res.status(201).json({
                success: true,
                message: 'restaurant added successfully',
                restaurantID: newRestaurant._id,
            });
        } catch (error) {
            logger.error('Error in add restaurant controller:', error);

            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },

    getRestaurantByOwner: async (req: Request, res: Response) => {
        try {
            const schema = z.object({
                ownerID: z.string().length(24),
            });

            const result = schema.safeParse({ ownerID: res.locals.userID });

            if (!result.success) {
                logger.warn('Validation failed in getRestaurantByOwner controller:', result.error);
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: z.treeifyError(result.error),
                });
            }

            const restaurant = await Restaurant.findOne({
                owner: result.data.ownerID,
            });

            if (!restaurant) {
                logger.warn(
                    `restaurant not found for owner ID: ${result.data.ownerID} in getRestaurantByOwner controller`,
                );
                return res.status(404).json({
                    success: true,
                    found: false,
                    message: 'restaurant not found for this owner',
                });
            }

            return res.status(200).json({
                success: true,
                found: true,
                restaurant,
            });
        } catch (error) {
            logger.error('Error in getRestaurantByOwner controller:', error);

            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },

    addItem: async (req: Request, res: Response) => {
        try {
            const userID = res.locals.userID! as string;

            const schema = z.object({
                dishName: z.string().min(2),
                description: z.string().optional(),
                cuisine: z.enum([
                    'South Indian',
                    'North Indian',
                    'Gujarati',
                    'Chinese',
                    'Italian',
                    'Mexican',
                    'Thai',
                    'Japanese',
                    'American',
                    'Continental',
                    'Mediterranean',
                    'French',
                    'Korean',
                    'Vietnamese',
                    'Middle Eastern',
                    'Fusion',
                    'Other',
                ]),
                foodType: z.enum(['veg', 'non-veg', 'vegan', 'egg']),
                price: z.number(),
                imageURL: z.url(),
                category: z.enum([
                    'Appetizer',
                    'Main Course',
                    'Dessert',
                    'Beverage',
                    'Snack',
                    'Breakfast',
                    'Salad',
                    'Soup',
                ]),
            });

            const result = schema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid input data',
                    errors: z.treeifyError(result.error),
                });
            }

            const restaurant = await Restaurant.findOne({
                owner: userID,
            });

            if (!restaurant) {
                return res.status(404).json({
                    success: false,
                    message: 'Restaurant not found for the owner',
                });
            }

            const newItem = new Item({
                restaurantID: restaurant._id,
                ...result.data,
            });

            await newItem.save();

            return res.status(200).json({
                success: true,
                message: 'Item added successfully',
                data: newItem,
            });
        } catch (error) {
            logger.error('Error in addItem', error);

            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    },

    deleteItem: async (req: Request, res: Response) => {
        try {
            const schema = z.object({
                itemID: z.string(),
            });

            const result = schema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid item ID provided',
                    errors: z.treeifyError(result.error),
                });
            }

            const { itemID } = result.data;

            const restaurant = await Restaurant.findOne({
                owner: res.locals.userID! as string,
            });

            if (!restaurant) {
                return res.status(404).json({
                    success: false,
                    message: 'Restaurant not found for the owner',
                });
            }

            const existingItem = await Item.findOneAndDelete({
                _id: itemID,
                restaurantID: restaurant._id,
            });

            if (!existingItem) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found or already deleted',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Item deleted successfully',
            });
        } catch (error) {
            logger.error('Error in deleteItem', error);

            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    },

    updateItem: async (req: Request, res: Response) => {
        try {
            const owner = res.locals.userID! as string;

            const schema = z.object({
                itemID: z.string(),
                dishName: z.string().min(2).optional(),
                description: z.string().optional(),
                cuisine: z
                    .enum([
                        'South Indian',
                        'North Indian',
                        'Gujarati',
                        'Chinese',
                        'Italian',
                        'Mexican',
                        'Thai',
                        'Japanese',
                        'American',
                        'Continental',
                        'Mediterranean',
                        'French',
                        'Korean',
                        'Vietnamese',
                        'Middle Eastern',
                        'Fusion',
                        'Other',
                    ])
                    .optional(),
                foodType: z.enum(['veg', 'non-veg', 'vegan', 'egg']).optional(),
                price: z.number().optional(),
                imageURL: z.url().optional(),
                category: z
                    .enum([
                        'Appetizer',
                        'Main Course',
                        'Dessert',
                        'Beverage',
                        'Snack',
                        'Breakfast',
                        'Salad',
                        'Soup',
                    ])
                    .optional(),
            });

            const result = schema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid input data',
                    errors: z.treeifyError(result.error),
                });
            }

            const { itemID, ...updateData } = result.data;

            const restaurant = await Restaurant.findOne({
                owner: owner,
            });

            if (!restaurant) {
                return res.status(404).json({
                    success: false,
                    message: 'Restaurant not found for the owner',
                });
            }

            const updatedItem = await Item.findOneAndUpdate(
                {
                    _id: itemID,
                    restaurantID: restaurant._id,
                },
                updateData,
                { new: true },
            );

            if (!updatedItem) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Item updated successfully',
                item: updatedItem,
            });
        } catch (error) {
            logger.error('Error in updateItem', error);

            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    },

    getItemsByRestaurant: async (req: Request, res: Response) => {
        try {
            const owner = res.locals.userID! as string;

            const restaurant = await Restaurant.findOne({
                owner: owner,
            });

            if (!restaurant) {
                return res.status(404).json({
                    success: false,
                    message: 'Restaurant not found for the owner',
                });
            }

            const items = await Item.find({
                restaurantID: restaurant._id,
            });

            if (items.length === 0) {
                return res
                    .status(200)
                    .json({ success: true, message: 'No items found', items: [] });
            }

            return res
                .status(200)
                .json({ success: true, message: 'Items retrieved successfully', items });
        } catch (error) {
            logger.error('Error in getItemsByRestaurant', error);
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    },
};

export default controller;

/**
 * TODO:
 * updateRestaurant
 * addMenuItem
 * deleteMenuItem
 */
