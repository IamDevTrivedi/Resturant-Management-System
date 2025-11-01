import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="w-full min-h-screen items-center justify-center flex flex-col p-4">
            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>

            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-4xl font-bold">
                        Welcome to Restaurant Management System
                    </CardTitle>
                    <CardDescription className="text-lg mt-2">
                        Streamline your restaurant operations with our comprehensive management
                        solution
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-center text-muted-foreground">
                        Whether you&apos;re a restaurant owner looking to manage your business
                        efficiently, or a customer searching for your next dining experience,
                        we&apos;ve got you covered.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/create-account">
                            <Button size="lg" className="w-full sm:w-auto">
                                Get Started
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                Sign In
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-2">For Restaurants</h3>
                            <p className="text-sm text-muted-foreground">
                                Manage reservations, track orders, and grow your business with
                                powerful tools.
                            </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-2">For Customers</h3>
                            <p className="text-sm text-muted-foreground">
                                Discover restaurants, make reservations, and enjoy seamless dining
                                experiences.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
