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
import React, { useState } from 'react';
import { EMAIL_REGEX, PASSWORD_REGEX } from '@/constants/regex';
import { AxiosError } from 'axios';
import { Toast } from '@/components/Toast';
import { useLoginStore } from '@/store/login';
import { backend } from '@/config/backend';
import { IUser, useUserData } from '@/store/user';
import { useRouter } from 'next/navigation';

interface IFormError {
    email: string;
    password: string;
}

export default function Page() {
    const { email, setEmail, password, setPassword, reset } = useLoginStore();
    const { makeLogin } = useUserData();
    const [errors, setErrors] = useState<IFormError>({
        email: '',
        password: '',
    });

    const router = useRouter();

    const validate = (): boolean => {
        let valid = true;
        const newErrors: IFormError = {
            email: '',
            password: '',
        };

        if (!email) {
            newErrors.email = 'Email address is required';
            valid = false;
        } else if (!EMAIL_REGEX.test(email)) {
            newErrors.email = 'Please enter a valid email address';
            valid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (!PASSWORD_REGEX.test(password)) {
            newErrors.password =
                'Password must be at least 8 characters, include upper and lowercase letters, a number, and a special character';
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
            const { data } = await backend.post('/api/v1/auth/login', {
                email,
                password,
            });

            if (!data?.success) {
                Toast.error(data?.message || 'Login failed', {
                    description: 'Please check your credentials and try again.',
                });
                return;
            }

            const user: IUser = data.data;
            const token: string = data.token;

            makeLogin(user, token);

            Toast.success('Login successful', {
                description: `Welcome back, ${user.firstName}!`,
            });

            reset();
            router.replace('/');
        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>;

            if (err.response?.data.message) {
                Toast.error(err.response?.data.message, {
                    description: 'Please try again',
                });

                return;
            }

            if (err.message) {
                Toast.error(err.message, {
                    description: 'Please try again',
                });

                return;
            }

            Toast.error('An unexpected error occurred. Please try again.', {
                description: 'If the problem persists, contact support.',
            });
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center text-2xl">
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>
                        Sign in to your account to continue managing your restaurant or browse
                        dining options.
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
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/reset-password"
                                    className="text-xs text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password}</p>
                            )}
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
