'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { Button, Alert } from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

const schema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  role: z.enum(['GOVERNMENT_OFFICER', 'STARTUP_USER', 'EVALUATOR']),
  password: z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

const ROLE_OPTIONS = [
  { value: 'STARTUP_USER', label: '🚀 Startup / Entrepreneur' },
  { value: 'GOVERNMENT_OFFICER', label: '🏛️ Government Officer' },
  { value: 'EVALUATOR', label: '⭐ Domain Expert / Evaluator' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'STARTUP_USER' },
  });

  const onSubmit = async (data: FormData) => {
    setApiError('');
    const { confirmPassword, ...payload } = data;
    try {
      const result = await api.post<{
        accessToken: string;
        refreshToken: string;
        user: any;
      }>('/auth/register', payload);

      setAuth(result.user, result.accessToken, result.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.';
      setApiError(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  return (
    <div>
      <div className="mb-7">
        <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
        <p className="text-gray-500 mt-1 text-sm">Join the GovSetu platform</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {apiError && <Alert variant="error">{apiError}</Alert>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="firstName">First name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input id="firstName" placeholder="Jane" className={`input pl-10 ${errors.firstName ? 'input-error' : ''}`} {...register('firstName')} />
            </div>
            {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="lastName">Last name</label>
            <input id="lastName" placeholder="Doe" className={`input ${errors.lastName ? 'input-error' : ''}`} {...register('lastName')} />
            {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="email">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input id="email" type="email" placeholder="you@example.com" className={`input pl-10 ${errors.email ? 'input-error' : ''}`} {...register('email')} />
          </div>
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label" htmlFor="role">I am a…</label>
          <select id="role" className="select" {...register('role')}>
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="password">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              id="password" type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
              {...register('password')}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <div>
          <label className="label" htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" type="password" placeholder="Repeat password" className={`input ${errors.confirmPassword ? 'input-error' : ''}`} {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full mt-2">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">Sign in</Link>
      </p>
    </div>
  );
}
