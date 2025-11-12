import { Request, Response } from 'express';
import { getIO } from '@/config/socket';
import { z } from 'zod';
import Booking from '@/models/booking';
import User from '@/models/user';

const controller = {
    createBooking: async (req: Request, res: Response) => {
        try {
            const userID = res.locals.userID! as string;

            const existingUser = await User.findById(userID);

            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User Not Found',
                });
            }

            const schema = z.object({
                restaurantID: z.string(),
                bookingAt: z
                    .string()
                    .refine((date) => !isNaN(Date.parse(date)), { message: 'Invalid date format' }),
                numberOfGuests: z.number().min(1),
                message: z.string().default(''),
                category: z.enum(['breakfast', 'lunch', 'dinner']),
                phoneNumber: z.string().min(10).max(10),
            });

            const result = schema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid Usage',
                    error: z.treeifyError(result.error),
                });
            }

            const { restaurantID, bookingAt, numberOfGuests, message, category, phoneNumber } =
                result.data;

            const newBooking = new Booking({
                userID: userID,
                restaurantID: restaurantID,
                bookingAt,
                numberOfGuests,
                message,
                status: 'pending',
                category,
                phoneNumber,
            });

            await newBooking.save();

            const io = getIO();
            io.to(`restaurant-${restaurantID}`).emit('new-booking', {
                message: 'New booking received!',
                data: {
                    ...result.data,
                    fullName: `${existingUser.firstName} ${existingUser.lastName}`,
                    email: existingUser.email,
                },
            });

            res.status(201).json({
                success: true,
                message: 'Booking created successfully',
            });
        } catch (error) {
            console.error('Error creating booking:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create booking',
            });
        }
    },
};

export default controller;
