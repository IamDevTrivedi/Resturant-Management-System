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
import React, { useEffect, useState } from 'react';

interface IFormError {
    OTP: string;
}

export default function Page() {
    const [OTP, setOTP] = useState('');
    const [errors, setErrors] = useState<IFormError>({
        OTP: '',
    });
    const [seconds, setSeconds] = useState(60);

    useEffect(() => {
        if (seconds <= 0) return;
        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [seconds]);

    const validate = (): boolean => {
        let valid = true;
        const newErrors: IFormError = {
            OTP: '',
        };

        if (!OTP) {
            newErrors.OTP = 'Verification code is required';
            valid = false;
        } else if (!/^\d{6}$/.test(OTP)) {
            newErrors.OTP = 'Enter a valid 6-digit code';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const valid = validate();
        if (!valid) return;

        try {
            // backend call to verify OTP
        } catch (error) {
            // handle error
        }
    };

    const handleResend = () => {
        if (seconds === 0) {
            setSeconds(60);
            // backend call to resend OTP
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center text-2xl">
                    <CardTitle>Verify Your Identity</CardTitle>
                    <CardDescription>
                        We&apos;ve sent a 6-digit verification code to your email. Enter it below to
                        proceed with resetting your password.
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="otp">Verification Code</Label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                value={OTP}
                                onChange={(e) => setOTP(e.target.value)}
                            />
                            {errors.OTP && <p className="text-sm text-destructive">{errors.OTP}</p>}
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
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleResend();
                        }}
                        className={`${seconds > 0 ? 'cursor-not-allowed opacity-50' : ''} ml-1 text-primary hover:underline`}
                    >
                        {seconds > 0 ? `Resend OTP in ${seconds}s` : 'Resend OTP'}
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
