'use server'

import { prisma } from '@/lib/prisma'
import { AddressCreateRequest, AddressTableData } from '@/types/address'
import {
  enrichAddressForTable,
  normalizeCountryCode
} from '@/lib/utils/address'
import { revalidatePath } from 'next/cache'

export async function createAddress(
  addressData: AddressCreateRequest
): Promise<AddressTableData> {
  try {
    const address = await prisma.usersAddress.create({
      data: {
        userId: addressData.userId,
        addressType: addressData.addressType,
        validFrom: new Date(addressData.validFrom),
        postCode: addressData.postCode,
        city: addressData.city,
        countryCode: normalizeCountryCode(addressData.countryCode),
        street: addressData.street,
        buildingNumber: addressData.buildingNumber
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
    throw new Error('Failed to create address')
  }
}
