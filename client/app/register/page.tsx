'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Utensils } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import { axiosClient } from '@/lib/axiosConfigure';
import axios from 'axios';
import { useAccount } from '@/hooks/createAccount';

type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    hashedPassword: string;
};

const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const { isAuth, setAuth, setUser, user } = useAuth();
    const { email, setEmail } = useAccount();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axiosClient.post<{ token: string; user: User }>(
                '/auth/send-otp-for-verification',
                {
                    email: data.email,
                },
            );
            setEmail(data.email);
            router.push('/register/verify-email');
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(
                    err.response.data.message || 'Invalid email or password. Please try again.',
                );
            } else {
                setError('An unexpected error occurred. Please check your network connection.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-3 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                        <Utensils className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-semibold">Welcome</CardTitle>
                    <CardDescription className="text-base">
                        Enter your email to verify
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                autoComplete="email"
                                disabled={isLoading}
                                {...register('email')}
                                className={errors.email ? 'border-destructive' : ''}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Processing ..' : 'Submit'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
