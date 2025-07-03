'use server'

import { prisma } from '@/lib/prisma'
import { AddressUpdateRequest, AddressTableData } from '@/types/address'
import {
  enrichAddressForTable,
  normalizeCountryCode
} from '@/lib/utils/address'
import { revalidatePath } from 'next/cache'

export async function updateAddress(
  updateData: AddressUpdateRequest
): Promise<AddressTableData> {
  try {
    const targetDate = new Date(updateData.originalValidFrom)
    const searchBefore = new Date(targetDate.getTime() - 1000)
    const searchAfter = new Date(targetDate.getTime() + 1000)

    const existingRecord = await prisma.usersAddress.findFirst({
      where: {
        userId: updateData.userId,
        addressType: updateData.originalAddressType,
        validFrom: {
          gte: searchBefore,
          lte: searchAfter
        }
      }
    })

    if (!existingRecord) {
      throw new Error('Record not found for update')
    }

    const updateResult = await prisma.$executeRaw`
      UPDATE users_addresses 
      SET 
        post_code = ${updateData.postCode},
        city = ${updateData.city},
        country_code = ${normalizeCountryCode(updateData.countryCode)},
        street = ${updateData.street},
        building_number = ${updateData.buildingNumber},
        updated_at = NOW()
      WHERE 
        user_id = ${existingRecord.userId} AND 
        address_type = ${existingRecord.addressType} AND 
        valid_from >= ${searchBefore} AND 
        valid_from <= ${searchAfter}
    `

    if (updateResult === 0) {
      throw new Error('No records were updated')
    }

    if (
      updateData.addressType !== existingRecord.addressType ||
      new Date(updateData.validFrom).getTime() !==
        existingRecord.validFrom.getTime()
    ) {
      await prisma.$executeRaw`
        DELETE FROM users_addresses 
        WHERE 
          user_id = ${existingRecord.userId} AND 
          address_type = ${existingRecord.addressType} AND 
          valid_from = ${existingRecord.validFrom}
      `

      const address = await prisma.usersAddress.create({
        data: {
          userId: updateData.userId,
          addressType: updateData.addressType,
          validFrom: new Date(updateData.validFrom),
          postCode: updateData.postCode,
          city: updateData.city,
          countryCode: normalizeCountryCode(updateData.countryCode),
          street: updateData.street,
          buildingNumber: updateData.buildingNumber
        }
      })

      revalidatePath('/')

      return enrichAddressForTable({
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
    }

    const address = existingRecord

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
    console.error('Error updating address:', error)
    throw new Error('Failed to update address')
  }
}
