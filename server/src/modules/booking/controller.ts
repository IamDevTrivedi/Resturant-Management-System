import { Request, Response } from 'express';
import { getIO } from '@/config/socket';
import { z } from 'zod';
import Booking, { IBooking } from '@/models/booking';
import User from '@/models/user';
import Restaurant from '@/models/restaurant';
import logger from '@/utils/logger';
import { transporter } from '@/config/nodemailer';
import config from '@/config/env';
import { bookingAcceptedTemplate, bookingRejectedTemplate } from '@/utils/emailTemplates';

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
                    bookingID: newBooking._id,
                    fullName: `${existingUser.firstName} ${existingUser.lastName}`,
                    email: existingUser.email,
                },
            });

            return res.status(201).json({
                success: true,
                message: 'Booking created successfully',
            });
        } catch (error) {
            console.error('Error creating booking:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to create booking',
            });
        }
    },

    getBookingsByRestaurant: async (req: Request, res: Response) => {
        try {
            const userID = res.locals.userID! as string;

            const existingRestaurant = await Restaurant.findOne({
                owner: userID,
            });

            if (!existingRestaurant) {
                return res.status(404).json({
                    success: false,
                    message: 'Restaurant Not Found',
                });
            }

            const bookings = await Booking.find({
                restaurantID: existingRestaurant._id,
            }).sort({ createdAt: -1 });

            const data = bookings.map(async (booking: IBooking) => {
                const existingUser = await User.findById(booking.userID);

                return {
                    bookingID: booking._id,
                    userID: booking.userID,
                    restaurantID: booking.restaurantID,
                    bookingAt: booking.bookingAt,
                    numberOfGuests: booking.numberOfGuests,
                    message: booking.message,
                    status: booking.status,
                    category: booking.category,
                    phoneNumber: booking.phoneNumber,
                    fullName: existingUser
                        ? `${existingUser.firstName} ${existingUser.lastName}`
                        : 'Unknown User',
                    email: existingUser ? existingUser.email : 'Unknown Email',
                };
            });

            const resolvedData = await Promise.all(data);

            return res.status(200).json({
                success: true,
                message: 'Bookings fetched successfully',
                data: resolvedData,
            });
        } catch (error) {
            logger.error('Error fetching bookings by restaurant:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch bookings',
            });
        }
    },

    getBookingsByCustomer: async (req: Request, res: Response) => {
        try {
            const userID = res.locals.userID! as string;

            const existingUser = await User.findById(userID);

            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User Not Found',
                });
            }

            const bookings = await Booking.find({
                userID: userID,
            }).sort({ createdAt: -1 });

            const data = bookings.map(async (booking: IBooking) => {
                return {
                    bookingID: booking._id,
                    userID: booking.userID,
                    restaurantID: booking.restaurantID,
                    bookingAt: booking.bookingAt,
                    numberOfGuests: booking.numberOfGuests,
                    message: booking.message,
                    status: booking.status,
                    category: booking.category,
                    phoneNumber: booking.phoneNumber,
                    fullName: `${existingUser.firstName} ${existingUser.lastName}`,
                    email: existingUser.email,
                };
            });

            const resolvedData = await Promise.all(data);

            return res.status(200).json({
                success: true,
                message: 'Bookings fetched successfully',
                data: resolvedData,
            });
        } catch (error) {
            logger.error('Error fetching bookings by customer:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch bookings',
            });
        }
    },

    changeBookingStatusR: async (req: Request, res: Response) => {
        try {
            const userID = res.locals.userID! as string;

            const schema = z.object({
                bookingID: z.string(),
                newStatus: z.enum(['accepted', 'rejected']),
            });

            const result = schema.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid Usage',
                    error: z.treeifyError(result.error),
                });
            }

            const { bookingID, newStatus } = result.data;
            const existingBooking = await Booking.findById(bookingID);

            if (!existingBooking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking Not Found',
                });
            }

            const existingRestaurant = await Restaurant.findOne({
                _id: existingBooking.restaurantID,
                owner: userID,
            });

            if (!existingRestaurant) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized: You do not own this restaurant',
                });
            }

            if (existingBooking.status !== 'pending') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot change the status of a non-pending booking',
                });
            }

            const existingUser = await User.findById(existingBooking.userID);

            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }

            existingBooking.status = newStatus;
            await existingBooking.save();

            try {
                if (newStatus === 'rejected') {
                    const emailHTML = bookingRejectedTemplate(
                        existingUser.firstName,
                        existingUser.lastName,
                        existingBooking.category,
                        existingBooking.bookingAt.toISOString(),
                        bookingID,
                    );

                    const options = {
                        from: config.SENDER_EMAIL,
                        to: existingUser.email,
                        subject: `Booking Cancelled - Booking ID: ${bookingID}`,
                        html: emailHTML,
                    };

                    await transporter.sendMail(options);

                    return res.status(200).json({
                        success: true,
                        message: 'Booking rejected and notification sent',
                    });
                } else {
                    const emailHTML = bookingAcceptedTemplate(
                        existingUser.firstName,
                        existingUser.lastName,
                        existingBooking.category,
                        existingBooking.bookingAt.toISOString(),
                        existingBooking.numberOfGuests,
                        bookingID,
                    );

                    const options = {
                        from: config.SENDER_EMAIL,
                        to: existingUser.email,
                        subject: `Booking Confirmed - ${existingBooking.category} at ${new Date(existingBooking.bookingAt).toLocaleString()}`,
                        html: emailHTML,
                    };

                    await transporter.sendMail(options);

                    return res.status(200).json({
                        success: true,
                        message: 'Booking accepted and confirmation sent',
                    });
                }
            } catch (emailError) {
                logger.error('Error sending booking status email:', emailError);

                return res.status(200).json({
                    success: true,
                    message: 'Booking status updated, but email notification failed',
                    warning: 'Email could not be sent to the customer',
                });
            }
        } catch (error) {
            logger.error('Error in changeBookingStatusR', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to change booking status',
            });
        }
    },
};

export default controller;
