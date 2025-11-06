import { create } from "zustand"
import { persist } from "zustand/middleware"
interface Address {
  line1: string
  line2: string
  line3: string
  zip: string
  city: string
  state: string
  country: string
}

interface OpeningHoursDay {
  start: string
  end: string
}

interface OpeningHours {
  weekday: OpeningHoursDay
  weekend: OpeningHoursDay
}

interface Status {
  isActive: boolean
  isVerified: boolean
  temporarilyClosed: boolean
}

export interface Restaurant {
  _id: string
  owner: string
  ownerName: string
  restaurantName: string
  restaurantEmail: string
  phoneNumber: string
  about: string
  slogan: string
  since: number
  bannerURL: string
  logoURL: string
  address: Address
  openingHours: OpeningHours
  status: Status
  ratingsSum: number
  ratingsCount: number
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Item {
  _id: string
  dishName: string
  description: string
  cuisine: string
  foodType: "veg" | "non-veg" | "vegan" | "egg"
  price: number
  imageURL: string
  category: string
  restaurantID: string
  isPopular: boolean
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

interface IRestaurantStore {
  restaurant: Restaurant | null
  setRestaurant: (restaurant: Restaurant | null) => void

  items: Item[]
  setItems: (items: Item[]) => void
  addItem: (item: Item) => void
  updateItem: (item: Item) => void
  deleteItem: (id: string) => void
  toggleItemPopular: (id: string) => void
  toggleItemAvailability: (id: string) => void

  reset: () => void
}

export const useRestaurantData = create<IRestaurantStore>()(
  persist(
    (set) => ({
      restaurant: null,
      items: [],

      setRestaurant: (restaurant) => set({ restaurant }),

      setItems: (items) => set({ items }),

      addItem: (item) => set((state) => ({ items: [...state.items, item] })),

      updateItem: (updatedItem) =>
        set((state) => ({
          items: state.items.map((item) => (item._id === updatedItem._id ? updatedItem : item)),
        })),

      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== id),
        })),

      toggleItemPopular: (id) =>
        set((state) => ({
          items: state.items.map((item) => (item._id === id ? { ...item, isPopular: !item.isPopular } : item)),
        })),

      toggleItemAvailability: (id) =>
        set((state) => ({
          items: state.items.map((item) => (item._id === id ? { ...item, isAvailable: !item.isAvailable } : item)),
        })),

      reset: () =>
        set({
          restaurant: null,
          items: [],
        }),
    }),
    {
      name: "restaurant-storage",
    },
  ),
)
