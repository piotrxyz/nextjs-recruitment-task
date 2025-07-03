import { Address, AddressPreview } from '@/types/address'

export function formatAddressPreview(
  address: Partial<Address>
): AddressPreview {
  const {
    street = '',
    buildingNumber = '',
    postCode = '',
    city = '',
    countryCode = ''
  } = address

  const line1 = `${street} ${buildingNumber}`.trim()
  const line2 = `${postCode} ${city}`.trim()
  const line3 = countryCode.trim()
  const full = [line1, line2, line3].filter(Boolean).join('\n')

  return { line1, line2, line3, full }
}
