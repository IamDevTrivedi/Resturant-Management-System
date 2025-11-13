"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { Loader2, AlertCircle, CalendarDays } from "lucide-react"
import { useRouter } from "next/navigation"
import { backend } from "@/config/backend"
import { useRestaurantData } from "@/store/restaurant"
import { useUserData } from "@/store/user"
import { Toast } from "@/components/Toast"
import { RestaurantHero } from "@/components/restaurant-hero"
import { RestaurantInfo } from "@/components/restaurant-info"
import { RestaurantAbout } from "@/components/restaurant-about"
import { RestaurantAddress } from "@/components/restaurant-address"
import { RestaurantActions } from "@/components/restaurant-actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import type { Restaurant } from "@/store/restaurant"
import BookingAlert from "@/components/booking-alert"

interface RestaurantResponse {
  success: boolean
  found: boolean
  restaurant: Restaurant | null
  message: string
}

export default function RestaurantDetailsPage(): React.ReactElement {
  const [status, setStatus] = useState<"loading" | "found" | "not-found">("loading")
  const { restaurant, setRestaurant } = useRestaurantData()
  const { user } = useUserData()
  const router = useRouter()

  useEffect(() => {
    const fetchRestaurant = async (): Promise<void> => {
      try {
        const { data } = await backend.post<RestaurantResponse>("/api/v1/restaurants/get-restaurant-by-owner")

        if (data.success && data.found && data.restaurant !== null) {
          setRestaurant(data.restaurant)
          setStatus("found")
        } else {
          setStatus("not-found")
        }
      } catch (error: unknown) {
        console.error("Error fetching restaurant:", error)

        if (axios.isAxiosError(error)) {
          const message: string =
            error.response?.data?.message || "Unable to fetch restaurant details. Please try again."
          Toast.error("Restaurant not found", { description: message })
        } else if (error instanceof Error) {
          Toast.error("Error Occurred", { description: error.message })
        } else {
          Toast.error("Unexpected Error", {
            description: "Something went wrong. Please try again later.",
          })
        }

        setStatus("not-found")
      }
    }

    if (user) {
      fetchRestaurant()
    }
  }, [user, setRestaurant])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading restaurant details...</p>
        </div>
      </div>
    )
  }

  if (status === "not-found" || restaurant === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Restaurant not found. Please set up your restaurant profile first.</AlertDescription>
          </Alert>

          <div className="mt-6">
            <Button onClick={() => router.push("/restaurant/set-restaurant")} className="w-full" size="lg">
              Add Restaurant
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 md:py-12">
        {/* Hero Section */}
        <div className="mb-8 md:mb-12">
          <RestaurantHero restaurant={restaurant} />
        </div>

        {/* Main Content */}
        <div className="space-y-6 md:space-y-8">
          <RestaurantInfo restaurant={restaurant} />
          <RestaurantAbout about={restaurant.about} />
          <RestaurantAddress address={restaurant.address} />
          <RestaurantActions />

          {/* View Bookings Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => router.push("/restaurant/dashboard/bookings")}
              className="flex items-center gap-2 text-white"
            >
              <CalendarDays className="w-4 h-4" />
              View All Bookings
            </Button>
          </div>

          {/* Real-Time Booking Alerts */}
          <BookingAlert restaurantId={restaurant._id} />
        </div>
      </div>
    </main>
  )
}
