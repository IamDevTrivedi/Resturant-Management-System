import { Request, Response } from 'express';
import { z } from 'zod';
import Booking from '@/models/booking';
import logger from '@/utils/logger';
import mongoose from 'mongoose';

const DAY_MS = 24 * 60 * 60 * 1000;

const controller = {
    // DAILY SALES (bookings & guests with category breakdown)
    getDailySales: async (req: Request, res: Response) => {
        try {
            const schema = z.object({ from: z.string().optional(), to: z.string().optional(), span: z.string().optional() });
            const parsed = schema.safeParse(req.query);
            if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid query', error: z.treeifyError(parsed.error) });

            const spanDays = parsed.data.span ? Math.max(1, parseInt(parsed.data.span, 10)) : 30;
            const hasFrom = !!parsed.data.from;
            const hasTo = !!parsed.data.to;
            const to = hasTo ? new Date(parsed.data.to as string) : new Date();
            const from = hasFrom ? new Date(parsed.data.from as string) : new Date(to.getTime() - spanDays * DAY_MS);
            const ownerId = res.locals.userID as string;

            const data = await (Booking as any).aggregate([
                { $match: { status: 'executed', bookingAt: { $gte: from, $lte: to } } },
                { $lookup: { from: 'restaurants', localField: 'restaurantID', foreignField: '_id', as: 'restaurant' } },
                { $unwind: '$restaurant' },
                { $match: { 'restaurant.owner': new mongoose.Types.ObjectId(ownerId) } },
                {
                    $group: {
                        _id: {
                            date: { $dateToString: { format: '%Y-%m-%d', date: '$bookingAt' } },
                            category: '$category'
                        },
                        bookings: { $sum: 1 },
                        guests: { $sum: '$numberOfGuests' }
                    }
                },
                {
                    $group: {
                        _id: '$_id.date',
                        totalBookings: { $sum: '$bookings' },
                        totalGuests: { $sum: '$guests' },
                        categories: {
                            $push: {
                                category: '$_id.category',
                                bookings: '$bookings',
                                guests: '$guests'
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        date: '$_id',
                        bookings: '$totalBookings',
                        guests: '$totalGuests',
                        breakfast: {
                            $let: {
                                vars: { cat: { $first: { $filter: { input: '$categories', cond: { $eq: ['$$this.category', 'breakfast'] } } } } },
                                in: { bookings: '$$cat.bookings', guests: '$$cat.guests' }
                            }
                        },
                        lunch: {
                            $let: {
                                vars: { cat: { $first: { $filter: { input: '$categories', cond: { $eq: ['$$this.category', 'lunch'] } } } } },
                                in: { bookings: '$$cat.bookings', guests: '$$cat.guests' }
                            }
                        }
                    }
                },
                { $sort: { date: 1 } },
            ]);

            return res.status(200).json({ success: true, data });
        } catch (error) {
            logger.error('Error in getDailySales', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

};

export default controller;
