"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  MapPin,
  Clock,
  Building2,
  Globe,
  Star,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Toast } from "@/components/Toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewsSection } from "@/components/reviews-section";
import { useUserData } from "@/store/user";
import { useBrowseRestaurantStore, type Restaurant } from "@/store/restaurant-browse";
import { Button } from "@/components/ui/button";
import { backend } from "@/config/backend";

const formatTime = (timeStr: string): string => {
  if (!timeStr) return "N/A";
  try {
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return timeStr;

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${hours}:${formattedMinutes} ${period}`;
  } catch {
    return timeStr;
  }
};

export default function CustomerRestaurantDetailsPage(): React.ReactElement {
  const [status, setStatus] = useState<"loading" | "found" | "not-found">("loading");
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reviewsCount, setReviewsCount] = useState<number>(0); // ✅ Track review count
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useUserData();
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;
  const { getRestaurantById, restaurants } = useBrowseRestaurantStore();

  // ✅ Load restaurant details from store
  useEffect(() => {
    if (!restaurantId) return;
    const found = getRestaurantById(restaurantId);
    if (found) {
      setRestaurant(found);
      setStatus("found");
    } else if (restaurants.length > 0) {
      setStatus("not-found");
      Toast.warning("Restaurant not found", {
        description: "Please return to browse and try again.",
      });
    } else {
      setStatus("not-found");
      Toast.warning("No data available", {
        description: "Please open the Browse page first to load restaurants.",
      });
    }
  }, [restaurantId, restaurants, getRestaurantById]);

  // ✅ Fetch updated review count (after new review)
  const fetchReviewsCount = async () => {
    try {
      setRefreshing(true);
      const { data } = await backend.post("/api/v1/review/get-reviews", {
        restaurantID: restaurantId,
      });

      if (data.success) {
        setReviewsCount(data.reviews?.length || 0);
      }
    } catch (err) {
      console.error("Error fetching review count:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // ✅ When a new review is added
  const handleReviewAdded = async (): Promise<void> => {
    await fetchReviewsCount();
  };

  // ✅ Initial load for review count
  useEffect(() => {
    if (restaurantId) fetchReviewsCount();
  }, [restaurantId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (status === "not-found" || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center space-y-4">
          <Alert variant="destructive" className="flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Restaurant not found.</AlertDescription>
          </Alert>
          <Button
            variant="outline"
            onClick={() => router.push("/browse")}
            className="flex items-center mx-auto gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  const averageRating =
    restaurant.ratingsCount > 0
      ? (restaurant.ratingsSum / restaurant.ratingsCount).toFixed(1)
      : "No ratings";

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 md:py-12">
        {/* 🏞️ Banner Section */}
        <div className="mb-8 md:mb-12">
          <div className="rounded-lg overflow-hidden bg-muted h-64 md:h-80 mb-6 relative group">
            {restaurant.bannerURL ? (
              <img
                src={restaurant.bannerURL || "/placeholder.svg"}
                alt={restaurant.restaurantName}
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              {restaurant.restaurantName}
            </h1>

            <p className="text-lg text-muted-foreground flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              {restaurant.cuisines?.join(", ")}
            </p>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 bg-background px-2 py-1 rounded-md">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-primary text-sm">
                  {averageRating}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({refreshing ? "..." : reviewsCount}{" "}
                {reviewsCount === 1 ? "review" : "reviews"})
              </span>
            </div>

            <div className="mt-6">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary text-white"
                onClick={() =>
                  router.push(`/customer/browse/${restaurant._id}/booking`)
                }
              >
                Reserve a Table
              </Button>
            </div>
          </div>
        </div>

        {/* 🧾 Info Section */}
        <div className="space-y-8">
          {/* Status + City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-lg font-semibold ${
                    restaurant.isOpen ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {restaurant.isOpen ? "Open Now" : "Closed"}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  City
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{restaurant.city}</p>
              </CardContent>
            </Card>
          </div>

          {/* Address */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Address
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const addressParts = [
                    restaurant.address.street,
                    restaurant.address.city,
                    restaurant.address.zip,
                  ].filter(Boolean);
                  const query = encodeURIComponent(addressParts.join(", "));
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${query}`,
                    "_blank"
                  );
                }}
              >
                View on Map
              </Button>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground">
                {restaurant.address.street}, {restaurant.address.city}
                {restaurant.address.zip ? ` (${restaurant.address.zip})` : ""}
              </p>
            </CardContent>
          </Card>

          {/* Hours */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Opening Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold">Weekday:</span>{" "}
                {formatTime(restaurant.openingHours.weekdayOpen)} –{" "}
                {formatTime(restaurant.openingHours.weekdayClose)}
              </p>
              <p>
                <span className="font-semibold">Weekend:</span>{" "}
                {formatTime(restaurant.openingHours.weekendOpen)} –{" "}
                {formatTime(restaurant.openingHours.weekendClose)}
              </p>
            </CardContent>
          </Card>

          {/* Reviews */}
          {user && (
            <ReviewsSection
              restaurantId={restaurant._id}
              userId={user._id}
              onReviewAdded={handleReviewAdded} // ✅ Refresh reviews count after new review
            />
          )}
        </div>
      </div>
    </main>
  );
}
