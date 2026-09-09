'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { registerSchema, RegisterInput } from '@/lib/authSchemas';

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password', '');

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    let score = 0;
    if (passwordValue.length >= 8) score++;
    if (/[A-Z]/.test(passwordValue)) score++;
    if (/[0-9]/.test(passwordValue)) score++;
    if (/[!@#$%^&*]/.test(passwordValue)) score++;

    return {
      score,
      label: ['Weak', 'Weak', 'Fair', 'Good', 'Strong'][score] || 'Weak',
      color: [
        'bg-red-500',
        'bg-red-500',
        'bg-orange-500',
        'bg-yellow-500',
        'bg-green-500',
      ][score] || 'bg-zinc-200 dark:bg-zinc-700',
    };
  }, [passwordValue]);

  const onSubmit = async (data: RegisterInput) => {
    try {
      setServerError(null);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setServerError('This email is already registered');
        } else if (response.status === 400 && result.errors) {
          // Set field-level errors
          Object.entries(result.errors).forEach(([field, message]) => {
            setError(field as keyof RegisterInput, {
              type: 'server',
              message: message as string,
            });
          });
        } else {
          setServerError(result.message || 'Something went wrong. Please try again.');
        }
        return;
      }

      // Success - navigate to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      setServerError('Network error. Please check your connection and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Server Error Alert */}
      {serverError && (
        <div
          role="alert"
          className="flex items-center gap-2 p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-lg"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-1"
        >
          Full Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name')}
          className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
            errors.name
              ? 'border-red-500 dark:border-red-500'
              : 'border-zinc-300 dark:border-zinc-700'
          }`}
          placeholder="John Doe"
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-1"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
          className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
            errors.email
              ? 'border-red-500 dark:border-red-500'
              : 'border-zinc-300 dark:border-zinc-700'
          }`}
          placeholder="name@company.com"
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-1"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            aria-required="true"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
            className={`w-full px-3 py-2 pr-10 text-sm border rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              errors.password
                ? 'border-red-500 dark:border-red-500'
                : 'border-zinc-300 dark:border-zinc-700'
            }`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {passwordValue && (
          <div className="mt-2 space-y-1.5">
            <div className="flex gap-1 h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full flex-1 transition-all ${
                  passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'
                }`}
              />
              <div
                className={`h-full flex-1 transition-all ${
                  passwordStrength.score >= 2 ? passwordStrength.color : 'bg-transparent'
                }`}
              />
              <div
                className={`h-full flex-1 transition-all ${
                  passwordStrength.score >= 3 ? passwordStrength.color : 'bg-transparent'
                }`}
              />
              <div
                className={`h-full flex-1 transition-all ${
                  passwordStrength.score >= 4 ? passwordStrength.color : 'bg-transparent'
                }`}
              />
            </div>
            <p className="text-xs text-text-secondary dark:text-text-secondary flex justify-between">
              <span>Strength: {passwordStrength.label}</span>
              <span className="text-[10px] text-text-muted">
                Min. 8 chars, 1 uppercase, 1 number, 1 special char
              </span>
            </p>
          </div>
        )}

        {errors.password && (
          <p id="password-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-1"
        >
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            aria-required="true"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
            {...register('confirmPassword')}
            className={`w-full px-3 py-2 pr-10 text-sm border rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              errors.confirmPassword
                ? 'border-red-500 dark:border-red-500'
                : 'border-zinc-300 dark:border-zinc-700'
            }`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 focus:outline-none"
            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="confirm-password-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating account…</span>
          </>
        ) : (
          'Create account'
        )}
      </button>

      {/* Login Link */}
      <p className="text-center text-sm text-text-secondary dark:text-text-secondary">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 focus:outline-none focus:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
