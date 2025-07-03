import * as z from 'zod'
import { isValidCountryCode } from '@/lib/utils/address'

export const createAddressRequestSchema = z.object({
  addressType: z.enum(['HOME', 'INVOICE', 'POST', 'WORK']),
  validFrom: z.string().datetime('Invalid date format'),
  postCode: z
    .string()
    .min(1, 'Post code is required')
    .max(6, 'Post code cannot exceed 6 characters')
    .regex(/^[0-9-]+$/, 'Post code must contain only numbers and dashes'),
  city: z
    .string()
    .min(1, 'City is required')
    .max(60, 'City cannot exceed 60 characters'),
  countryCode: z
    .string()
    .length(3, 'Country code must be exactly 3 characters')
    .refine(
      isValidCountryCode,
      'Country code must be ISO3166-1 alpha-3 format (e.g., USA, GBR, POL)'
    ),
  street: z
    .string()
    .min(1, 'Street is required')
    .max(100, 'Street cannot exceed 100 characters'),
  buildingNumber: z
    .string()
    .min(1, 'Building number is required')
    .max(60, 'Building number cannot exceed 60 characters'),
  userId: z.number().int().positive('User ID must be a positive integer')
})

export const updateAddressRequestSchema = z.object({
  addressType: z.enum(['HOME', 'INVOICE', 'POST', 'WORK']),
  validFrom: z.string().datetime('Invalid date format'),
  postCode: z
    .string()
    .min(1, 'Post code is required')
    .max(6, 'Post code cannot exceed 6 characters')
    .regex(/^[0-9-]+$/, 'Post code must contain only numbers and dashes'),
  city: z
    .string()
    .min(1, 'City is required')
    .max(60, 'City cannot exceed 60 characters'),
  countryCode: z
    .string()
    .length(3, 'Country code must be exactly 3 characters')
    .refine(
      isValidCountryCode,
      'Country code must be ISO3166-1 alpha-3 format (e.g., USA, GBR, POL)'
    ),
  street: z
    .string()
    .min(1, 'Street is required')
    .max(100, 'Street cannot exceed 100 characters'),
  buildingNumber: z
    .string()
    .min(1, 'Building number is required')
    .max(60, 'Building number cannot exceed 60 characters'),
  userId: z.number().int().positive('User ID must be a positive integer'),
  originalAddressType: z.enum(['HOME', 'INVOICE', 'POST', 'WORK']),
  originalValidFrom: z.string().datetime('Invalid date format')
})

export const addressSchema = z.object({
  addressType: z.enum(['HOME', 'INVOICE', 'POST', 'WORK'], {
    required_error: 'Address type is required'
  }),
  validFrom: z.date({
    required_error: 'Valid from date is required'
  }),
  postCode: z
    .string()
    .min(1, 'Post code is required')
    .max(6, 'Post code cannot exceed 6 characters')
    .regex(/^[0-9-]+$/, 'Post code must contain only numbers and dashes'),
  city: z
    .string()
    .min(1, 'City is required')
    .max(60, 'City cannot exceed 60 characters'),
  countryCode: z
    .string()
    .length(3, 'Country code must be exactly 3 characters')
    .refine(
      isValidCountryCode,
      'Country code must be ISO3166-1 alpha-3 format (e.g., USA, GBR, POL)'
    ),
  street: z
    .string()
    .min(1, 'Street is required')
    .max(100, 'Street cannot exceed 100 characters'),
  buildingNumber: z
    .string()
    .min(1, 'Building number is required')
    .max(60, 'Building number cannot exceed 60 characters')
})
