'use server'

import { prisma } from '@/lib/prisma'
import { UserTableData, UserFormData } from '@/types/user'
import { revalidatePath } from 'next/cache'

export async function createUser(userData: UserFormData): Promise<UserTableData> {
  try {
    const user = await prisma.user.create({
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
      initials: user.initials || undefined,
      email: user.email,
      status: user.status as 'ACTIVE' | 'INACTIVE',
      addressCount: user._count.addresses
    }
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error('Failed to create user')
  }
}