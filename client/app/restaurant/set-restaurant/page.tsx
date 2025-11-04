'use client';
import { MultiStepRestaurantForm } from '@/components/multi-step-restaurant-form';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useRestaurantData } from '@/store/restaurant';
import { useEffect } from 'react';
import { useUserData } from '@/store/user';

export default function AddRestaurantPage() {
    const router = useRouter();
    const { restaurantID } = useRestaurantData();
    useEffect(() => {
        if (restaurantID) {
            router.replace('/restaurant/dashboard');
        }
    });

    if (restaurantID) {
        return null;
    }
    return (
        <main className="min-h-screen bg-background py-8 sm:py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Card className="p-6 sm:p-8 border border-border shadow-lg">
                    <MultiStepRestaurantForm />
                </Card>

                {/* Info Note */}
                <Card className="mt-6 sm:mt-8 p-4 sm:p-5 border border-border shadow-sm">
                    <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Pro Tip:</span> All fields
                        marked with an asterisk <span className="text-destructive">*</span> are
                        required. Your restaurant information will be saved securely and verified by
                        our team.
                    </p>
                </Card>
            </div>
        </main>
    );
}
