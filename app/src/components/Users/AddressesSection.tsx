'use client'

import { useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AddressesTable } from '../Addresses/AddressesTable'
import { CreateAddressButton } from '../Addresses/CreateAddressButton'
import {
  AddressesProvider,
  useAddressesContext
} from '@/context/AddressesContext'
import { AddressFormData } from '@/types/address'
import { UserTableData } from '@/types/user'

interface AddressesSectionProps {
  user: UserTableData
}

function AddressesSectionContent({ user }: AddressesSectionProps) {
  const {
    addresses,
    isLoading,
    error,
    createAddress,
    updateAddress,
    deleteAddress
  } = useAddressesContext()

  const handleCreateAddress = useCallback(
    async (data: AddressFormData) => {
      await createAddress(data)
    },
    [createAddress]
  )

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-6">
        <CardTitle className="text-lg sm:text-xl font-semibold">
          Addresses for {user.firstName} {user.lastName}
        </CardTitle>
        <CreateAddressButton onCreateAddress={handleCreateAddress} />
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-6">
        <div className="overflow-x-auto">
          <AddressesTable
            addresses={addresses}
            onEditAddress={updateAddress}
            onDeleteAddress={deleteAddress}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export function AddressesSection({ user }: AddressesSectionProps) {
  return (
    <AddressesProvider userId={user.id}>
      <AddressesSectionContent user={user} />
    </AddressesProvider>
  )
}
