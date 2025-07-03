'use server'

import { prisma } from '@/lib/prisma'
import { AddressUpdateRequest, AddressTableData } from '@/types/address'
import {
  enrichAddressForTable,
  normalizeCountryCode
} from '@/lib/utils/address'
import { updateAddressRequestSchema } from '@/lib/validations/address'
import { revalidatePath } from 'next/cache'

export async function updateAddress(
  updateData: AddressUpdateRequest
): Promise<AddressTableData> {
  try {
    const validatedData = updateAddressRequestSchema.parse(updateData)
    const targetDate = new Date(validatedData.originalValidFrom)
    const searchBefore = new Date(targetDate.getTime() - 1000)
    const searchAfter = new Date(targetDate.getTime() + 1000)

    const existingRecord = await prisma.usersAddress.findFirst({
      where: {
        userId: validatedData.userId,
        addressType: validatedData.originalAddressType,
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
        post_code = ${validatedData.postCode},
        city = ${validatedData.city},
        country_code = ${normalizeCountryCode(validatedData.countryCode)},
        street = ${validatedData.street},
        building_number = ${validatedData.buildingNumber},
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
      validatedData.addressType !== existingRecord.addressType ||
      new Date(validatedData.validFrom).getTime() !==
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

    if (error instanceof Error && error.name === 'ZodError') {
      throw new Error(`Validation error: ${error.message}`)
    }

    if (error instanceof Error && error.message.includes('Record not found')) {
      throw new Error('Address not found')
    }

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      throw new Error(
        'An address with this type and date already exists for this user'
      )
    }

    throw new Error('Failed to update address')
  }
}
