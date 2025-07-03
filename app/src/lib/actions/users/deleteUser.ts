'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function deleteUser(userId: number): Promise<void> {
  try {
    await prisma.user.delete({
      where: { id: userId }
    })

    revalidatePath('/')
  } catch (error) {
    console.error('Error deleting user:', error)
    throw new Error('Failed to delete user')
  }
}
