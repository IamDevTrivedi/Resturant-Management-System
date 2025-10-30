'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff, Utensils, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAccount } from '@/hooks/createAccount';
import { useRouter } from 'next/navigation';
import { axiosClient } from '@/lib/axiosConfigure';

const signupSchema = z
    .object({
        firstName: z
            .string()
            .min(1, 'First name is required')
            .min(2, 'First name must be at least 2 characters'),
        lastName: z
            .string()
            .min(1, 'Last name is required')
            .min(2, 'Last name must be at least 2 characters'),
        email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
        password: z
            .string()
            .min(1, 'Password is required')
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
        role: z.enum(['customer', 'owner'], {
            message: 'Please select a role',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

type SignupFormValues = z.infer<typeof signupSchema>;

function PasswordStrengthIndicator({ password }: { password: string }) {
    const getStrength = () => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const strength = getStrength();
    const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const strengthColor = [
        'bg-destructive',
        'bg-orange-500',
        'bg-yellow-500',
        'bg-blue-500',
        'bg-green-500',
        'bg-green-600',
    ];

    return (
        <div className="space-y-2">
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${i < strength ? strengthColor[strength] : 'bg-muted'}`}
                    />
                ))}
            </div>
            <p className="text-xs text-muted-foreground">
                Strength: <span className="font-medium">{strengthText[strength]}</span>
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                    <span
                        className={
                            password.length >= 8 ? 'text-green-600' : 'text-muted-foreground'
                        }
                    >
                        ✓
                    </span>
                    At least 8 characters
                </li>
                <li className="flex items-center gap-2">
                    <span
                        className={
                            /[A-Z]/.test(password) ? 'text-green-600' : 'text-muted-foreground'
                        }
                    >
                        ✓
                    </span>
                    One uppercase letter
                </li>
                <li className="flex items-center gap-2">
                    <span
                        className={
                            /[a-z]/.test(password) ? 'text-green-600' : 'text-muted-foreground'
                        }
                    >
                        ✓
                    </span>
                    One lowercase letter
                </li>
                <li className="flex items-center gap-2">
                    <span
                        className={
                            /[0-9]/.test(password) ? 'text-green-600' : 'text-muted-foreground'
                        }
                    >
                        ✓
                    </span>
                    One number
                </li>
                <li className="flex items-center gap-2">
                    <span
                        className={
                            /[^A-Za-z0-9]/.test(password)
                                ? 'text-green-600'
                                : 'text-muted-foreground'
                        }
                    >
                        ✓
                    </span>
                    One special character (!@#$%^&*)
                </li>
            </ul>
        </div>
    );
}

export default function SignupForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const { email, isVerified } = useAccount();
    const router = useRouter();

    useEffect(() => {
        if (!isVerified) {
            router.push('/register');
        }
    }, [email, router]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    });

    const selectedRole = watch('role');

    const onSubmit = async (data: SignupFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axiosClient.post('/auth/create-account', {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                role: data.role,
            });

            if (response.status === 201 || response.status === 200) {
                setSuccess(true);
                console.log('Account created successfully:', response.data);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message || 'Failed to create account. Please try again.',
                );
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-3 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-semibold">
                        Account created successfully
                    </CardTitle>
                    <CardDescription className="text-base">
                        Welcome to our restaurant reservation system
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-center text-sm text-muted-foreground">
                        Your account has been created. You can now sign in with your credentials.
                    </p>
                    <Button className="w-full" onClick={() => (window.location.href = '/login')}>
                        Go to Login
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                    <Utensils className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl font-semibold">Create account</CardTitle>
                <CardDescription className="text-base">
                    Join our restaurant reservation system
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-medium">
                                First Name
                            </Label>
                            <Input
                                id="firstName"
                                type="text"
                                placeholder="John"
                                disabled={isLoading}
                                {...register('firstName')}
                                className={errors.firstName ? 'border-destructive' : ''}
                            />
                            {errors.firstName && (
                                <p className="text-xs text-destructive">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-medium">
                                Last Name
                            </Label>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder="Doe"
                                disabled={isLoading}
                                {...register('lastName')}
                                className={errors.lastName ? 'border-destructive' : ''}
                            />
                            {errors.lastName && (
                                <p className="text-xs text-destructive">
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>
                    </div>

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
                            <p className="text-xs text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-medium">
                            Account Type
                        </Label>
                        <Select
                            onValueChange={(value) =>
                                setValue('role', value as 'customer' | 'owner')
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger
                                id="role"
                                className={errors.role ? 'border-destructive' : ''}
                            >
                                <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="customer">Customer</SelectItem>
                                <SelectItem value="owner">Restaurant Owner</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && (
                            <p className="text-xs text-destructive">{errors.role.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a strong password"
                                disabled={isLoading}
                                {...register('password', {
                                    onChange: (e) => setPassword(e.target.value),
                                })}
                                className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-destructive">{errors.password.message}</p>
                        )}
                        {password && <PasswordStrengthIndicator password={password} />}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirm Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                disabled={isLoading}
                                {...register('confirmPassword')}
                                className={`pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-destructive">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                </form>

                <div className="mt-4 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <a href="/login" className="hover:text-primary underline underline-offset-4">
                        Sign in
                    </a>
                </div>
            </CardContent>
        </Card>
    );
}
