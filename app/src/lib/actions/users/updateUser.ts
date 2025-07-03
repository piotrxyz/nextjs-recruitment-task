'use server'

import { prisma } from '@/lib/prisma'
import { UserTableData, UserFormData } from '@/types/user'
import { revalidatePath } from 'next/cache'

export async function updateUser(
  userId: number,
  userData: UserFormData
): Promise<UserTableData> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        initials: userData.initials,
        email: userData.email,
        status: userData.status
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
    throw new Error('Failed to update user')
  }
}
