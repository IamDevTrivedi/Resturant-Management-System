import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export interface IRestaurantData {
    restaurant: Restaurant | null;
    setRestaurant: (restaurant: Restaurant | null) => void;

    reset: () => void;
}

export const useRestaurantData = create<IRestaurantData>()(
    persist(
        (set) => ({
            restaurant: null,
            setRestaurant: (restaurant: Restaurant | null) => set({ restaurant }),

            reset: () =>
                set({
                    restaurant: null,
                }),
        }),
        {
            name: 'restaurant-storage',
        },
    ),
);
