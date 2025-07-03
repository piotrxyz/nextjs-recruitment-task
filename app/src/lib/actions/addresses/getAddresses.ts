'use server'

import { prisma } from '@/lib/prisma'
import { AddressTableData } from '@/types/address'
import { enrichAddressForTable } from '@/lib/utils/address'

export async function getAddresses(
  userId: number
): Promise<AddressTableData[]> {
  try {
    const addresses = await prisma.usersAddress.findMany({
      where: {
        userId
      },
      orderBy: [{ addressType: 'asc' }, { validFrom: 'desc' }]
    })

    return addresses.map((address) =>
      enrichAddressForTable({
        userId: address.userId,
        addressType: address.addressType as
          | 'HOME'
          | 'INVOICE'
          | 'POST'
          | 'WORK',
        validFrom: address.validFrom,
        postCode: address.postCode,
        city: address.city,
        countryCode: address.countryCode,
        street: address.street,
        buildingNumber: address.buildingNumber,
        createdAt: address.createdAt,
        updatedAt: address.updatedAt
      })
    )
  } catch (error) {
    console.error('Error fetching addresses:', error)
    throw new Error('Failed to fetch addresses')
  }
}
