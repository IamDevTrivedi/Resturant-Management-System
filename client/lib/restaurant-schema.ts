import z from 'zod/v3';

// Helper to compare "HH:MM" strings
const isEarlierTime = (start: string, end: string) => {
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    return sH < eH || (sH === eH && sM < eM);
};

export const restaurantSchema = z.object({
    restaurantName: z.string().min(2, 'Restaurant name must be at least 2 characters'),
    address: z.object({
        line1: z.string().min(3, 'Address line 1 must be at least 3 characters'),
        line2: z.string().min(3, 'Address line 2 must be at least 3 characters'),
        line3: z.string().optional().or(z.literal('')),
        zip: z.string().min(6, 'ZIP code is required'),
        city: z.string().min(2, 'City must be at least 2 characters'),
        state: z.string().min(2, 'State must be at least 2 characters'),
        country: z.string().min(2, 'Country must be at least 2 characters'),
    }),
    ownerName: z.string().min(2, 'Owner name must be at least 2 characters'),
    phoneNumber: z.string().min(10, 'Phone number is required'),
    restaurantEmail: z.string().email('Valid email is required'),
    websiteURL: z.string().url('Invalid URL format').optional().or(z.literal('')),
    socialMedia: z
        .object({
            facebook: z
                .string()
                .trim()
                .optional()
                .refine(
                    (val) => !val || val.length === 0 || z.string().url().safeParse(val).success,
                    { message: 'Invalid Facebook URL' },
                ),
            twitter: z
                .string()
                .trim()
                .optional()
                .refine(
                    (val) => !val || val.length === 0 || z.string().url().safeParse(val).success,
                    { message: 'Invalid Twitter URL' },
                ),
            instagram: z
                .string()
                .trim()
                .optional()
                .refine(
                    (val) => !val || val.length === 0 || z.string().url().safeParse(val).success,
                    { message: 'Invalid Instagram URL' },
                ),
        })
        .optional(),

    openingHours: z.object({
        weekend: z
            .object({
                start: z.string().min(1, 'Opening time required'),
                end: z.string().min(1, 'Closing time required'),
            })
            .refine((data) => isEarlierTime(data.start, data.end), {
                message: 'Weekend opening time must be earlier than closing time',
                path: ['end'],
            }),
        weekday: z
            .object({
                start: z.string().min(1, 'Opening time required'),
                end: z.string().min(1, 'Closing time required'),
            })
            .refine((data) => isEarlierTime(data.start, data.end), {
                message: 'Weekday opening time must be earlier than closing time',
                path: ['end'],
            }),
    }),
    logoURL: z.string().url('Invalid URL').optional().or(z.literal('')),
    bannerURL: z.string().url('Banner image is required').optional().or(z.literal('')),
    about: z
        .string()
        .min(10, 'About section must be at least 10 characters')
        .optional()
        .or(z.literal('')),
    since: z.number().int().optional(),
    slogan: z.string().min(5, 'Slogan must be at least 5 characters').optional().or(z.literal('')),
    bankAccount: z.object({
        name: z.string().min(2),
        number: z.string().min(5),
        IFSC: z.string().min(5),
    }),
});

export type RestaurantFormData = z.infer<typeof restaurantSchema>;