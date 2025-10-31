'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function SuccessPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (countdown === 0) {
            router.push('/login');
            return;
        }

        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, router]);

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center text-green-600 mb-4">
                        <CheckCircle className="h-12 w-12" />
                    </div>
                    <CardTitle className="text-2xl">Password Reset Successful!</CardTitle>
                    <CardDescription>
                        Your password has been reset.
                        <br />
                        You will be redirected to the login page in{' '}
                        <span className="font-semibold">{countdown}</span> seconds.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                    <Progress value={(5 - countdown) * 20} className="w-full" />
                </CardContent>
            </Card>
        </div>
    );
}
