'use server'

import { prisma } from '@/lib/prisma'
import { UserTableData, UserFormData } from '@/types/user'
import { UpdateUserSchema, UserIdSchema } from '@/lib/validations/user'
import { revalidatePath } from 'next/cache'

export async function updateUser(
  userId: number,
  userData: UserFormData
): Promise<UserTableData> {
  try {
    const validatedId = UserIdSchema.parse({ id: userId })
    const validatedData = UpdateUserSchema.parse(userData)

    const user = await prisma.user.update({
      where: { id: validatedId.id },
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
    console.error('Error updating user:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      throw new Error(`Validation error: ${error.message}`)
    }

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      throw new Error('Email address is already in use')
    }

    if (
      error instanceof Error &&
      error.message.includes('Record to update not found')
    ) {
      throw new Error('User not found')
    }

    throw new Error('Failed to update user')
  }
}
