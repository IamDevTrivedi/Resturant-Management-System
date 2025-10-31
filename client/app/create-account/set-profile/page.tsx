'use client';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function Page() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center text-2xl">
                    <CardTitle>Set Up Your Profile</CardTitle>
                    <CardDescription>
                        Please fill in the details to complete your profile.
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent>
                    <form className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" type="text" placeholder="Enter your first name" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" type="text" placeholder="Enter your last name" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="customer"
                                        name="role"
                                        value="customer"
                                    />
                                    <span>Customer</span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="restaurant"
                                        name="role"
                                        value="restaurant"
                                    />
                                    <span>Restaurant</span>
                                </label>
                            </div>
                        </div>

                        <Button type="submit" className="w-full">
                            Save Profile
                        </Button>
                    </form>
                </CardContent>

                <Separator />

                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="ml-1 text-primary hover:underline">
                        Log in
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
