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

    // FORECAST (guests only)
    getForecast: async (req: Request, res: Response) => {
        try {
            const schema = z.object({ horizon: z.string().optional(), window: z.string().optional() });
            const parsed = schema.safeParse(req.query);
            if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid query', error: z.treeifyError(parsed.error) });

            const horizon = parsed.data.horizon ? Math.max(1, parseInt(parsed.data.horizon, 10)) : 7;
            const ownerId = res.locals.userID as string;

            const from = new Date(Date.now() - 120 * 24 * 60 * 60 * 1000);
            const to = new Date();

            const hist = await (Booking as any).aggregate([
                { $match: { status: 'executed', bookingAt: { $gte: from, $lte: to } } },
                { $lookup: { from: 'restaurants', localField: 'restaurantID', foreignField: '_id', as: 'restaurant' } },
                { $unwind: '$restaurant' },
                { $match: { 'restaurant.owner': new mongoose.Types.ObjectId(ownerId) } },
                { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$bookingAt' } }, guests: { $sum: '$numberOfGuests' } } },
                { $project: { _id: 0, date: '$_id', guests: 1 } },
                { $sort: { date: 1 } },
            ]);

            // Build weekday-based profile from recent history
            const dayMs = 24 * 60 * 60 * 1000;

            // Aggregate total guests per weekday (0=Sun..6=Sat) from last ~90 days
            const weekdayTotals: number[] = Array(7).fill(0);
            const weekdayCounts: number[] = Array(7).fill(0);
            for (const row of hist) {
                const d = new Date(row.date + 'T00:00:00.000Z');
                const w = d.getUTCDay();
                weekdayTotals[w] += row.guests;
                weekdayCounts[w] += 1;
            }

            const weekdayAvg: number[] = Array(7).fill(0);
            let globalTotal = 0;
            let globalDays = 0;
            for (let w = 0; w < 7; w++) {
                if (weekdayCounts[w] > 0) {
                    weekdayAvg[w] = Math.round(weekdayTotals[w] / weekdayCounts[w]);
                    globalTotal += weekdayTotals[w];
                    globalDays += weekdayCounts[w];
                }
            }
            const globalAvg = globalDays > 0 ? Math.round(globalTotal / globalDays) : 0;

            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);

            // Produce next horizon days using weekday profile, fallback to global average
            const forecast = Array.from({ length: horizon }).map((_, i) => {
                const d = new Date(today.getTime() + (i + 1) * dayMs);
                const date = d.toISOString().slice(0, 10);
                const weekday = d.getUTCDay();
                const base = weekdayAvg[weekday] || globalAvg;
                return { day: i + 1, date, guests: base };
            });

            return res.status(200).json({ success: true, horizon, forecast });
        } catch (error) {
            logger.error('Error in getForecast', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    // FUNNEL
    getFunnel: async (req: Request, res: Response) => {
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

            const rows = await (Booking as any).aggregate([
                { $match: { createdAt: { $gte: from, $lte: to } } },
                { $lookup: { from: 'restaurants', localField: 'restaurantID', foreignField: '_id', as: 'restaurant' } },
                { $unwind: '$restaurant' },
                { $match: { 'restaurant.owner': new mongoose.Types.ObjectId(ownerId) } },
                { $group: { _id: '$status', count: { $sum: 1 } } },
                { $project: { _id: 0, status: '$_id', count: 1 } },
            ]);

            const byStatus = Object.fromEntries(rows.map((r: any) => [r.status, r.count])) as Record<string, number>;
            const pending = byStatus['pending'] || 0;
            const accepted = byStatus['accepted'] || 0;
            const paymentPending = byStatus['payment pending'] || 0;
            const confirmed = byStatus['confirmed'] || 0;
            const executed = byStatus['executed'] || 0;
            const rejected = byStatus['rejected'] || 0;

            const pct = (n: number, d: number) => (d > 0 ? Number(((n / d) * 100).toFixed(1)) : 0);
            const totalPipeline = pending + accepted + paymentPending + confirmed;
            const conversions = {
                pending_to_confirmed: pct(confirmed, pending),
                confirmed_to_executed: pct(executed, confirmed),
                overall_to_executed: pct(executed, totalPipeline),
            };
            return res.status(200).json({
                success: true,
                data: {
                    counts: { pending, accepted, paymentPending, confirmed, executed, rejected },
                    conversions,
                },
            });
        } catch (error) {
            logger.error('Error in getFunnel', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },


};

export default controller;
