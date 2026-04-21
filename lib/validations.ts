import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const leadFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Invalid phone number'),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed', 'lost']),
  source: z.enum(['website', 'referral', 'phone', 'email', 'social', 'event']),
  budget: z.number().optional(),
  notes: z.string().optional(),
});

export const propertyFormSchema = z.object({
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().length(2, 'Invalid state code'),
  zipCode: z.string().regex(/^\d{5}$/, 'Invalid ZIP code'),
  price: z.number().positive('Price must be positive'),
  bedrooms: z.number().int().positive('Bedrooms must be at least 1'),
  bathrooms: z.number().positive('Bathrooms must be positive'),
  sqft: z.number().int().positive('Sqft must be positive'),
  type: z.enum(['house', 'apartment', 'condo', 'land', 'commercial']),
  status: z.enum(['available', 'sold', 'rented', 'pending']),
  features: z.string().optional(),
});

export const dealFormSchema = z.object({
  title: z.string().min(5, 'Title is required'),
  clientName: z.string().min(2, 'Client name is required'),
  propertyAddress: z.string().min(5, 'Property address is required'),
  value: z.number().positive('Deal value must be positive'),
  commission: z.number().nonnegative('Commission must be non-negative'),
  stage: z.enum(['proposal', 'negotiation', 'agreement', 'closed']),
  expectedCloseDate: z.string().optional(),
  notes: z.string().optional(),
});

export const taskFormSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['todo', 'in-progress', 'completed']),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;
export type LeadFormSchema = z.infer<typeof leadFormSchema>;
export type PropertyFormSchema = z.infer<typeof propertyFormSchema>;
export type DealFormSchema = z.infer<typeof dealFormSchema>;
export type TaskFormSchema = z.infer<typeof taskFormSchema>;
