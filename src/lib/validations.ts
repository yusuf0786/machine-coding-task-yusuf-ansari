import { z } from 'zod';

export const leadFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone is required')
    .regex(
      /^\+?[\d\s\-().]{7,20}$/,
      { message: 'Please enter a valid phone number (e.g. +1-555-123-4567)' }
    ),
  company: z
    .string()
    .min(1, 'Company is required')
    .max(100, 'Company must be at most 100 characters'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Converted', 'Lost'], {
    message: 'Status is required',
  }),
  source: z.enum([
    'Website',
    'Referral',
    'Social Media',
    'Email Campaign',
    'Cold Call',
    'Event',
    'Partner',
    'Other',
  ]),
  assignedTo: z.string().nullable().optional(),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

// Password validation rules
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)');

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(80, 'Name must not exceed 80 characters')
      .trim(),
    email: z
      .string()
      .email('Invalid email address')
      .toLowerCase()
      .trim(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserRegisterFormValues = z.infer<typeof registerSchema>;
