'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Toast } from '@/components/Toast';
import { backend } from '@/config/backend';
import { useUserData } from '@/store/user';
import { useRestaurantData } from '@/store/restaurant';
import { useRouter } from 'next/navigation';

interface Address {
    line1: string;
    line2: string;
    line3: string;
    zip: string;
    city: string;
    state: string;
    country: string;
}

interface OpeningHoursDay {
    start: string;
    end: string;
}

interface OpeningHours {
    weekday: OpeningHoursDay;
    weekend: OpeningHoursDay;
}

interface Status {
    isActive: boolean;
    isVerified: boolean;
    temporarilyClosed: boolean;
}

interface Restaurant {
    _id: string;
    owner: string;
    ownerName: string;
    restaurantName: string;
    restaurantEmail: string;
    phoneNumber: string;
    about: string;
    slogan: string;
    since: number;
    bannerURL: string;
    logoURL: string;
    address: Address;
    openingHours: OpeningHours;
    status: Status;
    ratingsSum: number;
    ratingsCount: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface RestaurantResponse {
    success: boolean;
    found: boolean;
    restaurant: Restaurant | null;
    message: string;
}

export default function RestaurantStatusCard() {
    const [status, setStatus] = useState<'loading' | 'found' | 'not-found'>('loading');
    const { restaurant, setRestaurant } = useRestaurantData();
    const { user } = useUserData();
    const router = useRouter();

    const handleAddRestaurant = () => {
        router.replace('/restaurant/set-restaurant');
    };

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const { data } = await backend.post<RestaurantResponse>(
                    '/api/v1/restaurants/get-restaurant-by-owner',
                );

                if (data.success && data.found && data.restaurant !== null) {
                    setRestaurant(data.restaurant);
                    setStatus('found');
                } else {
                    setStatus('not-found');
                }
            } catch (error: unknown) {
                console.error('Error fetching restaurant:', error);

                if (axios.isAxiosError(error)) {
                    const message =
                        error.response?.data?.message ||
                        'Unable to fetch restaurant details. Please try again.';
                    Toast.error('Restaurant not found', { description: message });
                } else if (error instanceof Error) {
                    Toast.error('Error Occurred', { description: error.message });
                } else {
                    Toast.error('Unexpected Error', {
                        description: 'Something went wrong. Please try again later.',
                    });
                }

                setStatus('not-found');
            }
        };

        if (user) {
            fetchRestaurant();
        }
    }, [user, setRestaurant]);

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md p-8 text-center">
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading restaurant info...</p>
                    </div>
                )}

                {status === 'found' && restaurant !== null && (
                    <>
                        <CardHeader>
                            <CheckCircle2 className="h-12 w-12 mx-auto text-green-600" />
                            <CardTitle className="text-2xl mt-4">Restaurant Found</CardTitle>
                            <CardDescription>{restaurant.restaurantName}</CardDescription>
                        </CardHeader>
                    </>
                )}

                {status === 'not-found' && (
                    <CardContent className="flex flex-col items-center gap-6">
                        <AlertCircle className="h-12 w-12 text-amber-600" />
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-foreground">
                                Set Up Your Restaurant
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                You have not added your restaurant yet. Start by setting up your
                                restaurant profile to begin taking reservations!
                            </p>
                        </div>
                        <Button className="w-full" size="lg" onClick={handleAddRestaurant}>
                            Add Restaurant
                        </Button>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
