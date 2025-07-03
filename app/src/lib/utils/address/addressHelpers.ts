import { Address, AddressTableData } from '@/types/address'

export function getAddressTypeLabel(type: Address['addressType']): string {
  const labels = {
    HOME: 'Home',
    INVOICE: 'Invoice',
    POST: 'Post',
    WORK: 'Work'
  }
  return labels[type]
}

export function sortAddresses(
  addresses: AddressTableData[]
): AddressTableData[] {
  const typePriority = { HOME: 1, WORK: 2, INVOICE: 3, POST: 4 }

  return addresses.sort((a, b) => {
    const typeDiff = typePriority[a.addressType] - typePriority[b.addressType]
    if (typeDiff !== 0) return typeDiff

    return b.validFrom.getTime() - a.validFrom.getTime()
  })
}
