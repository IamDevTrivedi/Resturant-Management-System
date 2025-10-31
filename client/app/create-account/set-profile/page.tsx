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
import { useState } from 'react';
import { NAME_REGEX, PASSWORD_REGEX, ROLE_REGEX } from '@/constants/regex';

interface IFormError {
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
    role: string;
}

export default function Page() {
    const {
        firstName,
        setFirstName,
        lastName,
        setLastName,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        role,
        setRole,
    } = useCreateAccountStore();

    const [formErrors, setFormErrors] = useState<IFormError>({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        role: '',
    });

    const validate = (): boolean => {
        let valid = true;

        console.log(role);

        const newError: IFormError = {
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            role: '',
        };

        if (NAME_REGEX.test(firstName) === false) {
            newError.firstName =
                'First name must be at least 2 characters and contain only letters.';
            valid = false;
        }

        if (NAME_REGEX.test(lastName) === false) {
            newError.lastName = 'Last name must be at least 2 characters and contain only letters.';
            valid = false;
        }

        if (PASSWORD_REGEX.test(password) === false) {
            newError.password =
                'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.';
            valid = false;
        }

        if (password !== confirmPassword) {
            newError.confirmPassword = 'Passwords do not match.';
            valid = false;
        }

        if (ROLE_REGEX.test(role ?? '') === false) {
            newError.role = 'Please select a valid role.';
            valid = false;
        }

        setFormErrors(newError);
        return valid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const valid = validate();

        if (!valid) {
            return;
        }

        console.log('Backend call here with:', { firstName, lastName, password, role });
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center text-2xl">
                    <CardTitle>Complete Your Profile</CardTitle>
                    <CardDescription>
                        Just a few more details to get you started. This helps us personalize your
                        experience.
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                type="text"
                                placeholder="Enter your first name"
                                value={firstName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setFirstName(e.target.value)
                                }
                            />
                            {formErrors.firstName && (
                                <p className="text-xs text-destructive mt-1">
                                    {formErrors.firstName}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder="Enter your last name"
                                value={lastName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setLastName(e.target.value)
                                }
                            />
                            {formErrors.lastName && (
                                <p className="text-xs text-destructive mt-1">
                                    {formErrors.lastName}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setPassword(e.target.value)
                                }
                            />
                            <p
                                className={`text-xs ${formErrors.password.length > 0 ? 'text-destructive' : ' text-muted-foreground'}`}
                            >
                                Password must be at least 8 characters long and include at least one
                                uppercase letter, one lowercase letter, one number, and one special
                                character.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                            {formErrors.confirmPassword && (
                                <p className="text-xs text-destructive mt-1">
                                    {formErrors.confirmPassword}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Choose Your Role</Label>
                            <p className="text-xs text-muted-foreground mb-2">
                                Select how you&apos;ll be using this platform
                            </p>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="customer"
                                        name="role"
                                        value="customer"
                                        defaultChecked={true}
                                        onChange={() => setRole('customer')}
                                    />
                                    <span>Customer</span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="restaurant"
                                        name="role"
                                        value="restaurant"
                                        onChange={() => setRole('owner')}
                                    />
                                    <span>Restaurant Owner</span>
                                </label>
                            </div>
                            {formErrors.role && (
                                <p className="text-xs text-destructive mt-1">{formErrors.role}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full">
                            Save Profile
                        </Button>
                    </form>
                </CardContent>

                <Separator />

                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="ml-1 text-primary hover:underline">
                        Log in
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
