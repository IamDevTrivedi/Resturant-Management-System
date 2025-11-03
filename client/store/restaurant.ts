import { create } from "zustand";
import { persist } from "zustand/middleware";



export interface IRestaurantData {
  restaurantID: string | null;
  setRestaurant: (restaurant: string | null) => void;


  reset: () => void;
}

export const useRestaurantData = create<IRestaurantData>()(
  persist(
    (set) => ({
      restaurantID: null,
      setRestaurant: (restaurantID: string | null) => set({ restaurantID }),

      

      reset: () =>
        set({
          restaurantID: null,
        }),
    }),
    {
      name: "restaurant-storage", 
    }
  )
);
