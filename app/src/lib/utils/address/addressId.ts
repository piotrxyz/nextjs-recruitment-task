import { Address, AddressKey } from '@/types/address'

export function createAddressId(key: AddressKey): string {
  const timestamp = key.validFrom.getTime()
  return `${key.userId}-${key.addressType}-${timestamp}`
}

export function parseAddressId(id: string): AddressKey {
  const [userId, addressType, timestamp] = id.split('-')
  return {
    userId: parseInt(userId, 10),
    addressType: addressType as Address['addressType'],
    validFrom: new Date(parseInt(timestamp, 10))
  }
}
