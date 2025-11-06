// /store/restaurants.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Address {
  street: string;
  city: string;
}

export interface OpeningHours {
  weekdayOpen: string;
  weekdayClose: string;
  weekendOpen: string;
  weekendClose: string;
}

export interface Restaurant {
  _id: string;
  restaurantName: string;
  logoURL: string;
  bannerURL: string;
  ratingsSum: number;
  ratingsCount: number;
  slogan: string;
  address: Address;
  openingHours: OpeningHours;
  status: string;
  city: string;
  cuisines: string[];
  temporarilyClosed?: boolean;
  isOpen?: boolean;
}

export interface RestaurantStore {
  restaurants: Restaurant[];
  setRestaurants: (restaurants: Restaurant[]) => void;
  clearRestaurants: () => void;
  getRestaurantById: (id: string) => Restaurant | undefined;
}

export const useBrowseRestaurantStore = create<RestaurantStore>()(
  persist(
    (set, get) => ({
      restaurants: [],
      setRestaurants: (restaurants) => set({ restaurants }),
      clearRestaurants: () => set({ restaurants: [] }),
      getRestaurantById: (id) => get().restaurants.find((r) => r._id === id),
    }),
    {
      name: "restaurants-storage", // persisted in localStorage
    }
  )
);
