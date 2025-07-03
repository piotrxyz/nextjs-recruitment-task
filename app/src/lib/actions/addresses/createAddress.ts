'use server'

import { prisma } from '@/lib/prisma'
import { AddressCreateRequest, AddressTableData } from '@/types/address'
import {
  enrichAddressForTable,
  normalizeCountryCode
} from '@/lib/utils/address'
import { createAddressRequestSchema } from '@/lib/validations/address'
import { revalidatePath } from 'next/cache'

export async function createAddress(
  addressData: AddressCreateRequest
): Promise<AddressTableData> {
  try {
    const validatedData = createAddressRequestSchema.parse(addressData)
    const address = await prisma.usersAddress.create({
      data: {
        userId: validatedData.userId,
        addressType: validatedData.addressType,
        validFrom: new Date(validatedData.validFrom),
        postCode: validatedData.postCode,
        city: validatedData.city,
        countryCode: normalizeCountryCode(validatedData.countryCode),
        street: validatedData.street,
        buildingNumber: validatedData.buildingNumber
      }
    })

    revalidatePath('/')

    return enrichAddressForTable({
      userId: address.userId,
      addressType: address.addressType as 'HOME' | 'INVOICE' | 'POST' | 'WORK',
      validFrom: address.validFrom,
      postCode: address.postCode,
      city: address.city,
      countryCode: address.countryCode,
      street: address.street,
      buildingNumber: address.buildingNumber,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt
    })
  } catch (error) {
    console.error('Error creating address:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      throw new Error(`Validation error: ${error.message}`)
    }

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      throw new Error(
        'An address with this type and date already exists for this user'
      )
    }

    if (
      error instanceof Error &&
      error.message.includes('Foreign key constraint')
    ) {
      throw new Error('User not found')
    }

    throw new Error('Failed to create address')
  }
}
