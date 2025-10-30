'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Utensils } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAccount } from '@/hooks/createAccount';
import { axiosClient } from '@/lib/axiosConfigure';

const otpSchema = z.object({
    otp: z
        .string()
        .min(1, 'OTP is required')
        .regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

type OTPFormValues = z.infer<typeof otpSchema>;

export default function OTPForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const { email, setVerified } = useAccount();

    useEffect(() => {
        if (!email) {
            router.push('/register');
        }
    }, [email, router]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OTPFormValues>({
        resolver: zodResolver(otpSchema),
    });

    const onSubmit = async (data: OTPFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axiosClient.post('/auth/verify-otp-for-verification', {
                OTP: data.otp,
                email: email,
            });

            if (response.status === 200) {
                setSuccess(true);
                console.log('Email verified successfully:', response.data);
                setVerified(true);
                router.push('/register/create-account');
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    if (!email) {
        return <>redirecting ...</>;
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                    <Utensils className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl font-semibold">Verify your email</CardTitle>
                <CardDescription className="text-base">
                    Enter the 6-digit code sent to your email
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
                        <Label htmlFor="otp" className="text-sm font-medium">
                            Verification Code
                        </Label>
                        <Input
                            id="otp"
                            type="text"
                            placeholder="000000"
                            maxLength={6}
                            inputMode="numeric"
                            disabled={isLoading}
                            {...register('otp')}
                            className={`text-center text-lg tracking-widest ${errors.otp ? 'border-destructive' : ''}`}
                        />
                        {errors.otp && (
                            <p className="text-sm text-destructive">{errors.otp.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                    </Button>
                </form>

                <div className="mt-4 text-center text-sm text-muted-foreground">
                    <p>
                        Didn't receive the code?{' '}
                        <a href="#" className="hover:text-primary underline underline-offset-4">
                            Resend OTP
                        </a>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
