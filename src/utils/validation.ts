import { z } from 'zod';

export const phoneSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ''))
  .refine((v) => v.startsWith('998') && v.length === 12, {
    message: 'Enter a valid Uzbek phone number',
  });

export const otpSchema = z
  .string()
  .regex(/^\d{6}$/, 'Enter the 6-digit code');

export const pinSchema = z
  .string()
  .regex(/^\d{6}$/, 'PIN must be 6 digits');

export const cardNumberSchema = z
  .string()
  .transform((v) => v.replace(/\s/g, ''))
  .refine((v) => /^\d{16,19}$/.test(v), { message: 'Enter a valid card number' });

export const amountSchema = z
  .number()
  .positive('Amount must be positive')
  .max(500_000_000, 'Amount exceeds limit');
