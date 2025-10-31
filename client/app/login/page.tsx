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
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>
                        Sign in to your account to continue managing your restaurant or browse dining options.
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="you@example.com" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/reset-password" className="text-xs text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input id="password" type="password" placeholder="Enter your password" />
                        </div>
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>
                </CardContent>

                <Separator />

                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link href="/create-account" className="ml-1 text-primary hover:underline">
                        Sign up
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}