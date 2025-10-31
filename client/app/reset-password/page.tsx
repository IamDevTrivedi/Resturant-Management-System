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
import { useCreateAccountStore } from '@/store/create-account';
import React, { useState } from 'react';
import { EMAIL_REGEX } from '@/constants/regex';

interface IFormError {
    email?: string;
}

export default function Page() {
    const { email, setEmail } = useCreateAccountStore();
    const [errors, setErrors] = useState<IFormError>({});

    const validate = (): boolean => {
        let valid = true;
        const newErrors: IFormError = {};

        if (!email) {
            newErrors.email = 'Email address is required';
            valid = false;
        } else if (!EMAIL_REGEX.test(email)) {
            newErrors.email = 'Please enter a valid email address';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const valid = validate();
        if (!valid) return;
        console.log('Backend call here with:', { email });
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center text-2xl">
                    <CardTitle>Forgot Your Password?</CardTitle>
                    <CardDescription>
                        No worries! Enter your email address and we&apos;ll send you a verification
                        code to reset your password.
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email}</p>
                            )}
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
