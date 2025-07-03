'use server'

import { prisma } from '@/lib/prisma'
import { UserTableData, UserFormData } from '@/types/user'
import { CreateUserSchema } from '@/lib/validations/user'
import { revalidatePath } from 'next/cache'

export async function createUser(
  userData: UserFormData
): Promise<UserTableData> {
  try {
    const validatedData = CreateUserSchema.parse(userData)
    const user = await prisma.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        initials: validatedData.initials || null,
        email: validatedData.email,
        status: validatedData.status
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        initials: true,
        email: true,
        status: true,
        _count: {
          select: {
            addresses: true
          }
        }
      }
    })

    revalidatePath('/')

    return {
      id: user.id,
      firstName: user.firstName || '',
      lastName: user.lastName,
      initials: user.initials || '',
      email: user.email,
      status: user.status as 'ACTIVE' | 'INACTIVE',
      addressCount: user._count.addresses
    }
  } catch (error) {
    console.error('Error creating user:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      throw new Error(`Validation error: ${error.message}`)
    }

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      throw new Error('Email address is already in use')
    }

    throw new Error('Failed to create user')
  }
}
