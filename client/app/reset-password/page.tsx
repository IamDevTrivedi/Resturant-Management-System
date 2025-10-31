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
                    <CardTitle>Forgot Your Password?</CardTitle>
                    <CardDescription>
                        No worries! Enter your email address and we&apos;ll send you a verification code to reset your password.
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="you@example.com" />
                            <p className="text-xs text-muted-foreground">
                                Enter the email associated with your account.
                            </p>
                        </div>
                        <Button type="submit" className="w-full">
                            Send Verification Code
                        </Button>
                    </form>
                </CardContent>

                <Separator />

                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    Remember your password?{' '}
                    <Link href="/login" className="ml-1 text-primary hover:underline">
                        Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
