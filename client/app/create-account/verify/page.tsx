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
import { useEffect, useState } from 'react';

export default function Page() {
    const [seconds, setSeconds] = useState(60);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(seconds - 1);
        }, 1000);

        return () => clearInterval(interval);
    });

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center text-2xl">
                    <CardTitle>Verify Account</CardTitle>
                    <CardDescription>
                        Enter the OTP sent to your email to verify your account.
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="otp">OTP</Label>
                            <Input id="otp" type="text" placeholder="Enter the OTP" />
                        </div>
                        <Button type="submit" className="w-full">
                            Verify OTP
                        </Button>
                    </form>
                </CardContent>

                <Separator />

                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    Didn&apos;t receive the OTP?
                    <Link
                        onClick={() => console.log("RESEND")}
                        href="#"
                        className={`${seconds > 0 ? 'cursor-not-allowed opacity-50' : ''} ml-1 text-primary hover:underline`}
                    >
                        {seconds > 0 ? `Resend OTP in ${seconds}s` : 'Resend OTP'}
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
