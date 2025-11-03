'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AxiosError } from 'axios';

import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toast } from '@/components/Toast';
import { backend } from '@/config/backend';
import { EMAIL_REGEX, PASSWORD_REGEX } from '@/constants/regex';
import { useLoginStore } from '@/store/login';
import { IUser, useUserData } from '@/store/user';

interface IFormError {
  email: string;
  password: string;
}

export default function Page() {
  const { email, setEmail, password, setPassword, reset } = useLoginStore();
  const { makeLogin, isAuthenticated } = useUserData();
  const [errors, setErrors] = useState<IFormError>({ email: '', password: '' });
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = (): boolean => {
    let valid = true;
    const newErrors: IFormError = { email: '', password: '' };

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
        'Password must be at least 8 characters, include upper/lowercase letters, a number, and a special character';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setDisabled(true);
      setLoading(true);

      const { data } = await backend.post('/api/v1/auth/login', { email, password });

      if (!data?.success) {
        Toast.error(data?.message || 'Login failed');
        return;
      }

      const user: IUser = data.data;
      const token: string = data.token;

      makeLogin(user, token);
      Toast.success(`Welcome back, ${user.firstName}!`);
      reset();
      router.replace('/');
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      const message = err.response?.data?.message || err.message;
      Toast.error(message || 'Unexpected error');
    } finally {
      setDisabled(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/');
      Toast.info('You are already logged in.');
    }
  }, [isAuthenticated, router]);

  // ✅ responsive background + shape
  const [bgUrl, setBgUrl] = useState('/plates.jpg');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      if (typeof window === 'undefined') return;
      const landscape = window.innerWidth > window.innerHeight;
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // mobile -> plates.jpg, desktop-landscape -> plate2.png
      setBgUrl(!mobile && landscape ? '/plate.png' : '/plates.png');
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    window.addEventListener('orientationchange', updateLayout);
    return () => {
      window.removeEventListener('resize', updateLayout);
      window.removeEventListener('orientationchange', updateLayout);
    };
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-yellow-400 via-yellow-200 to-yellow-300 overflow-hidden px-4">
      
      <Card
        className={`relative z-10  flex flex-col items-center justify-center overflow-hidden border-none transition-all duration-300 bg-amber-50
          ${isMobile
            ? 'w-[90vw] max-w-md rounded-3xl  bg-white/10' // mobile rectangle
            : 'w-[90vmin] h-[90vmin] rounded-full'               // desktop circle
          }`}
        style={{
          backgroundImage: `url("${bgUrl}")`,
          // mobile: cover to fill rectangular card; desktop: cover works for plate texture too
          backgroundSize: isMobile ? 'contain' : 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'white',
          boxShadow:
            'inset 0 0 20px rgba(255,255,255,0.3), 0 0 0 8px rgba(255,255,255,0.9), 0 10px 25px rgba(0,0,0,0.2)',
          // apply 10:14 aspect ratio only on mobile
          ...(isMobile ? { aspectRatio: '10 / 13.5' } : {}),
        }}
      >
        <div className={'relative z-10 w-[70%] aspect-square text-center flex flex-col justify-center'}>
          
          {/* 🖥️ Show header INSIDE card only on desktop */}
          <div className="mb-3">
            <h1 className="text-4xl font-semibold text-amber-800 drop-shadow-md">Welcome Back</h1>
            <p className="text-sm text-gray-700">
              Sign in to manage your restaurant or reserve a table.
            </p>
          </div>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email" className={`text-gray-800 ${isMobile ? 'ml-0 w-full' : 'ml-[5%] w-[90%]'} mt-2`}>
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`bg-white/80 backdrop-blur-sm border-amber-200 ${isMobile ? 'w-full' : 'w-[90%]'} text-black`} // Changed input color to black
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className={`flex items-center justify-between ${isMobile ? 'w-full' : 'ml-[5%] w-[90%]'}`}>
                  <Label htmlFor="password" className="text-gray-800">
                    Password
                  </Label>
                  <Link
                    href="/reset-password"
                    className="text-xs text-amber-700 hover:underline"
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
                  className={`bg-white/80 backdrop-blur-sm border-amber-200 ${isMobile ? 'w-full' : 'w-[90%]'} text-black`} // Changed input color to black
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className={isMobile ? 'flex justify-center pt-2' : 'flex justify-center'}>
                <Button
                  type="submit"
                  className={`bg-amber-600 hover:bg-amber-700 text-white shadow-md ${isMobile ? 'w-full max-w-none' : 'w-[90%] max-w-[320px]'}`}
                  disabled={disabled || loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center text-sm text-gray-700 py-5">
            Don&apos;t have an account?{' '}
            <Link
              href="/create-account"
              className="ml-1 text-amber-700 hover:underline font-medium"
            >
              Sign up
            </Link>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
