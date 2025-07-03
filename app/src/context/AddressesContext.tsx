'use client'

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode
} from 'react'
import { AddressTableData, AddressFormData, AddressKey } from '@/types/address'
import {
  getAddresses,
  createAddress as createAddressAction,
  updateAddress as updateAddressAction,
  deleteAddress as deleteAddressAction
} from '@/lib/actions/addresses'
import { useUsersContext } from './UsersContext'

interface AddressesContextValue {
  addresses: AddressTableData[]
  isLoading: boolean
  error: string | null
  createAddress: (addressData: AddressFormData) => Promise<void>
  updateAddress: (
    addressKey: AddressKey,
    addressData: AddressFormData
  ) => Promise<void>
  deleteAddress: (addressKey: AddressKey) => Promise<void>
  refetchAddresses: () => Promise<void>
}

const AddressesContext = createContext<AddressesContextValue | undefined>(
  undefined
)

interface AddressesProviderProps {
  userId: number
  children: ReactNode
}

export function AddressesProvider({
  userId,
  children
}: AddressesProviderProps) {
  const [addresses, setAddresses] = useState<AddressTableData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { refetchUsers } = useUsersContext()

  const fetchAddresses = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedAddresses = await getAddresses(userId)
      setAddresses(fetchedAddresses)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch addresses'
      setError(errorMessage)
      console.error('Error fetching addresses:', err)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const createAddress = useCallback(
    async (addressData: AddressFormData): Promise<void> => {
      setIsLoading(true)
      setError(null)
      try {
        const createData = {
          ...addressData,
          userId,
          validFrom: addressData.validFrom.toISOString()
        }
        await createAddressAction(createData)

        await fetchAddresses()
        await refetchUsers()
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create address'
        setError(errorMessage)
        console.error('Error creating address:', err)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [userId, fetchAddresses, refetchUsers]
  )

  const updateAddress = useCallback(
    async (
      addressKey: AddressKey,
      addressData: AddressFormData
    ): Promise<void> => {
      setIsLoading(true)
      setError(null)
      try {
        const updateData = {
          ...addressData,
          userId: addressKey.userId,
          originalAddressType: addressKey.addressType,
          originalValidFrom: addressKey.validFrom.toISOString(),
          validFrom: addressData.validFrom.toISOString()
        }
        await updateAddressAction(updateData)

        await fetchAddresses()
        await refetchUsers()
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update address'
        setError(errorMessage)
        console.error('Error updating address:', err)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [fetchAddresses, refetchUsers]
  )

  const deleteAddress = useCallback(
    async (addressKey: AddressKey): Promise<void> => {
      setIsLoading(true)
      setError(null)
      try {
        await deleteAddressAction(addressKey)

        await fetchAddresses()
        await refetchUsers()
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete address'
        setError(errorMessage)
        console.error('Error deleting address:', err)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [fetchAddresses, refetchUsers]
  )

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  const value: AddressesContextValue = {
    addresses,
    isLoading,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
    refetchAddresses: fetchAddresses
  }

  return (
    <AddressesContext.Provider value={value}>
      {children}
    </AddressesContext.Provider>
  )
}

export function useAddressesContext(): AddressesContextValue {
  const context = useContext(AddressesContext)
  if (context === undefined) {
    throw new Error(
      'useAddressesContext must be used within an AddressesProvider'
    )
  }
  return context
}
