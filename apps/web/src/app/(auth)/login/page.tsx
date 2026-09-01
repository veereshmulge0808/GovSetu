'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button, Alert } from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setApiError('');
    try {
      const result = await api.post<{
        accessToken: string;
        refreshToken: string;
        user: { id: string; email: string; firstName: string; lastName: string; role: any; organizationId: string | null };
      }>('/auth/login', data);

      setAuth(result.user, result.accessToken, result.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Invalid email or password';
      setApiError(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Access your GovSetu workspace
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {apiError && (
          <Alert variant="error">{apiError}</Alert>
        )}

        <div>
          <label className="label" htmlFor="email">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@organization.gov.in"
              className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
              {...register('email')}
            />
          </div>
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label mb-0" htmlFor="password">Password</label>
            <Link href="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          className="w-full"
        >
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-indigo-600 font-semibold hover:text-indigo-700">
          Create account
        </Link>
      </p>

      {/* Demo credentials notice */}
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
        <p className="text-xs font-semibold text-indigo-700 mb-2">Demo credentials</p>
        <div className="space-y-1 text-xs text-indigo-600">
          <p>Government Officer: officer@smartcity.gov.in</p>
          <p>Startup: founder@techstartup.in</p>
          <p className="text-indigo-400">Password: Demo@2026</p>
        </div>
      </div>
    </div>
  );
}
