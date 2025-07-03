type AddressType = 'HOME' | 'INVOICE' | 'POST' | 'WORK'

export interface Address {
  userId: number
  addressType: AddressType
  validFrom: Date
  postCode: string
  city: string
  countryCode: string
  street: string
  buildingNumber: string
  createdAt?: Date
  updatedAt?: Date
}

export interface AddressFormData {
  addressType: AddressType
  validFrom: Date
  postCode: string
  city: string
  countryCode: string
  street: string
  buildingNumber: string
}

export interface AddressTableData extends Address {
  id: string
  formattedAddress: string
  isActive: boolean
}

export interface AddressCreateRequest {
  addressType: AddressType
  validFrom: string
  postCode: string
  city: string
  countryCode: string
  street: string
  buildingNumber: string
  userId: number
}

export interface AddressUpdateRequest {
  addressType: AddressType
  validFrom: string
  postCode: string
  city: string
  countryCode: string
  street: string
  buildingNumber: string
  userId: number
  originalAddressType: AddressType
  originalValidFrom: string
}

export interface AddressKey {
  userId: number
  addressType: AddressType
  validFrom: Date
}

export interface AddressPreview {
  line1: string
  line2: string
  line3: string
  full: string
}
