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
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>
                        Join us today and start your journey. Enter your email address to get started.
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="you@example.com" />
                            <p className="text-xs text-muted-foreground">
                                We&apos;ll send a verification code to this email address.
                            </p>
                        </div>
                        <Button type="submit" className="w-full">
                            Continue
                        </Button>
                    </form>
                </CardContent>

                <Separator />

                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="ml-1 text-primary hover:underline">
                        Sign in
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
