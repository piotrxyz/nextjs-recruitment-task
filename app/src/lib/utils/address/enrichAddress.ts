import { Address, AddressTableData } from '@/types/address'
import { createAddressId } from './addressId'
import { formatAddressPreview } from './formatAddress'

export function enrichAddressForTable(address: Address): AddressTableData {
  const id = createAddressId({
    userId: address.userId,
    addressType: address.addressType,
    validFrom: address.validFrom
  })

  const formattedAddress = formatAddressPreview(address).full
  const isActive = address.validFrom <= new Date()

  return {
    ...address,
    id,
    formattedAddress,
    isActive
  }
}
