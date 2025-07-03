'use server'

import { prisma } from '@/lib/prisma'
import { AddressKey } from '@/types/address'
import { revalidatePath } from 'next/cache'

export async function deleteAddress(addressKey: AddressKey): Promise<void> {
  try {
    await prisma.usersAddress.delete({
      where: {
        userId_addressType_validFrom: {
          userId: addressKey.userId,
          addressType: addressKey.addressType,
          validFrom: addressKey.validFrom
        }
      }
    })

    revalidatePath('/')
  } catch (error) {
    console.error('Error deleting address:', error)
    throw new Error('Failed to delete address')
  }
}
