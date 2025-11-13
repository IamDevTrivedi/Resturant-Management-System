"use client";

import type React from "react";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Loader2, Star, MessageSquare, Filter } from "lucide-react";
import { backend } from "@/config/backend";
import { Toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewDialog } from "@/components/review-dialog";
import { ReviewCard } from "@/components/review-card";
import { ReviewSummaryDialog } from "@/components/review-summary-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Review {
  name: string;
  content: string;
  rate: number;
  createdAt: string;
}

interface ReviewsResponse {
  success: boolean;
  reviews: Review[];
  histogram: Record<1 | 2 | 3 | 4 | 5, number>;
}

interface ReviewsSectionProps {
  restaurantId: string;
  userId: string;
  onReviewAdded?: () => Promise<void> | void;
}

type SortOption = "recent" | "highest" | "lowest";

export function ReviewsSection({
  restaurantId,
  userId,
  onReviewAdded,
}: ReviewsSectionProps): React.ReactElement {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [histogram, setHistogram] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("recent");

  // 🔁 Fetch all reviews
  const fetchReviews = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const restaurantIdStr = Array.isArray(restaurantId)
        ? restaurantId[0]
        : restaurantId;

      const { data } = await backend.post<ReviewsResponse>(
        "/api/v1/review/get-reviews",
        { restaurantID: restaurantIdStr }
      );

      if (data.success) {
        setReviews(data.reviews);
        setHistogram(data.histogram);
      }
    } catch (error: unknown) {
      console.error("Error fetching reviews:", error);
      if (axios.isAxiosError(error)) {
        Toast.error("Error loading reviews", {
          description:
            error.response?.data?.message || "Please try again later.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load reviews on mount
  useEffect(() => {
    fetchReviews();
  }, [restaurantId]);

  // ✅ Handle after submitting a review
  const handleReviewAdded = async (): Promise<void> => {
    setIsDialogOpen(false); // close immediately
    Toast.success("Review submitted successfully!");
    await fetchReviews();
    if (onReviewAdded) await onReviewAdded(); // refresh parent count
  };

  // Sort logic
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    switch (sortOption) {
      case "highest":
        return sorted.sort((a, b) => b.rate - a.rate);
      case "lowest":
        return sorted.sort((a, b) => a.rate - b.rate);
      default:
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [reviews, sortOption]);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Reviews</h2>
          <p className="text-sm text-muted-foreground">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={sortOption}
              onValueChange={(v: SortOption) => setSortOption(v)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <ReviewDialog
            restaurantId={restaurantId}
            userId={userId}
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onReviewAdded={handleReviewAdded}
          />
          <Button
            variant="outline"
            onClick={() => setIsSummaryOpen(true)}
            disabled={reviews.length === 0}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Summarize
          </Button>
        </div>
      </div>

      {/* Histogram */}
      {Object.values(histogram).some((count) => count > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-foreground">
              Rating Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        reviews.length > 0
                          ? (histogram[rating as keyof typeof histogram] /
                              reviews.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {histogram[rating as keyof typeof histogram]}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Reviews */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : sortedReviews.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2 text-foreground">
              No reviews yet
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Be the first to share your experience with this restaurant.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedReviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>
      )}

      {/* Summary Dialog */}
      <ReviewSummaryDialog
        isOpen={isSummaryOpen}
        onOpenChange={setIsSummaryOpen}
        restaurantId={restaurantId}
      />
    </section>
  );
}
