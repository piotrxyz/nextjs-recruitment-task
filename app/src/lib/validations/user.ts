import { z } from 'zod'

export const UserStatus = z.enum(['ACTIVE', 'INACTIVE'])

export const UserFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(60, 'First name must be at most 60 characters')
    .regex(
      /^[a-zA-ZąćęłńóśżźĄĆĘŁŃÓŚŻŹ\s-']+$/,
      'First name contains invalid characters'
    ),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be at most 100 characters')
    .regex(
      /^[a-zA-ZąćęłńóśżźĄĆĘŁŃÓŚŻŹ\s-']+$/,
      'Last name contains invalid characters'
    ),

  initials: z
    .string()
    .max(30, 'Initials must be at most 30 characters')
    .regex(
      /^[A-ZĄĆĘŁŃÓŚŻŹ.]*$/,
      'Initials can only contain uppercase letters and dots'
    )
    .optional()
    .or(z.literal('')),

  email: z
    .string()
    .min(1, 'Email is required')
    .max(100, 'Email must be at most 100 characters')
    .email('Please enter a valid email address'),

  status: UserStatus.default('ACTIVE')
})

export const CreateUserSchema = UserFormSchema

export const UpdateUserSchema = UserFormSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
)

export const UserIdSchema = z.object({
  id: z.coerce.number().int().positive('User ID must be a positive integer')
})

export type UserFormData = z.infer<typeof UserFormSchema>
export type CreateUserData = z.infer<typeof CreateUserSchema>
export type UpdateUserData = z.infer<typeof UpdateUserSchema>
export type UserStatusType = z.infer<typeof UserStatus>
