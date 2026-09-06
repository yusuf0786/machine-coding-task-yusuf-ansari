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
      'Please enter a valid phone number (e.g. +1-555-123-4567)'
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
    'LinkedIn',
    'Cold Call',
    'Email Campaign',
    'Trade Show',
    'Other',
  ]),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
