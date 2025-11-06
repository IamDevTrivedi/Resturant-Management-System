import Restaurant from '@/models/restaurant';
import Review, { IReview } from '@/models/review';
import User from '@/models/user';
import logger from '@/utils/logger';
import { Request, Response } from 'express';
import { z } from 'zod';

const controller = {
    addReview: async (req: Request, res: Response) => {
        const userID = res.locals.userID! as string;

        try {
            const schema = z.object({
                restaurantID: z.string(),
                content: z.string().optional().default(''),
                rate: z.number().int().min(1).max(5),
            });

            const result = schema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid input',
                    errors: z.treeifyError(result.error),
                });
            }

            const { restaurantID, content, rate } = result.data;

            const existingRestaurant = await Restaurant.findById(restaurantID);
            if (!existingRestaurant) {
                return res.status(404).json({
                    success: false,
                    message: 'Restaurant not found',
                });
            }

            const existingUser = await User.findOne({
                _id: userID,
                role: 'customer',
            });

            if (!existingUser) {
                return res.status(403).json({
                    success: false,
                    message: 'Only customers can review',
                });
            }

            const newReview = new Review({
                userID,
                restaurantID,
                content,
                rate,
                name: `${existingUser.firstName} ${existingUser.lastName}`,
            });

            await newReview.save();

            existingRestaurant.ratingsCount += 1;
            existingRestaurant.ratingsSum += rate;

            await existingRestaurant.save();

            return res.status(201).json({
                success: true,
                message: 'Review added successfully',
                review: newReview,
            });
        } catch (error) {
            logger.error('Error in adding review:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    },

    getReviews: async (req: Request, res: Response) => {
        try {
            const schema = z.object({
                restaurantID: z.string(),
            });

            const result = schema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid input',
                    errors: z.treeifyError(result.error),
                });
            }

            const { restaurantID } = result.data;

            const allReviews = await Review.find({ restaurantID });

            const histogram = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
            };

            allReviews.forEach((review: IReview) => {
                const rate = review.rate as 1 | 2 | 3 | 4 | 5;
                histogram[rate]++;
            });

            const contentReview = allReviews.filter((review: IReview) => {
                return review.content.length > 0;
            });

            const formattedReviews = contentReview.map((review: IReview) => ({
                name: review.name,
                content: review.content,
                rate: review.rate,
                createdAt: review.createdAt.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                }),
            }));

            formattedReviews.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });

            return res.status(200).json({
                success: true,
                message: 'Reviews fetched Successfully',
                reviews: formattedReviews,
                histogram,
            });
        } catch (error) {
            logger.error('Error in getting reviews:', error);

            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    },
};

export default controller;
