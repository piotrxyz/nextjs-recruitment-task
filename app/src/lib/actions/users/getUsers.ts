'use server'

import { prisma } from '@/lib/prisma'
import { UserTableData } from '@/types/user'

export async function getUsers(): Promise<UserTableData[]> {
  try {
    const users = await prisma.user.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return users.map(
      (user): UserTableData => ({
        id: user.id,
        firstName: user.firstName || '',
        lastName: user.lastName,
        initials: user.initials || '',
        email: user.email,
        status: user.status as 'ACTIVE' | 'INACTIVE',
        addressCount: user._count.addresses
      })
    )
  } catch (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }
}
