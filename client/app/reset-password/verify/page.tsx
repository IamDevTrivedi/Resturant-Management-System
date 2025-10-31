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
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds]);

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center text-2xl">
                    <CardTitle>Verify Your Identity</CardTitle>
                    <CardDescription>
                        We&apos;ve sent a 6-digit verification code to your email. 
                        Enter it below to proceed with resetting your password.
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="otp">Verification Code</Label>
                            <Input id="otp" type="text" placeholder="Enter 6-digit code" maxLength={6} />
                            <p className="text-xs text-muted-foreground">
                                The code expires in 10 minutes. Check your spam folder if needed.
                            </p>
                        </div>
                        <Button type="submit" className="w-full">
                            Verify Code
                        </Button>
                    </form>
                </CardContent>

                <Separator />

                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    Didn&apos;t receive the OTP?
                    <Link
                        onClick={() => { if (seconds === 0) { setSeconds(60); } }}
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
