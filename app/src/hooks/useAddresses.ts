import { useState, useCallback, useEffect } from 'react'
import {
  AddressTableData,
  AddressFormData,
  AddressCreateRequest,
  AddressUpdateRequest,
  AddressKey
} from '@/types/address'
import {
  getAddresses,
  createAddress as createAddressAction,
  updateAddress as updateAddressAction,
  deleteAddress as deleteAddressAction
} from '@/lib/actions/addresses'

interface UseAddressesReturn {
  addresses: AddressTableData[]
  isLoading: boolean
  error: string | null
  createAddress: (addressData: AddressFormData) => Promise<void>
  updateAddress: (
    addressKey: AddressKey,
    addressData: AddressFormData
  ) => Promise<void>
  deleteAddress: (addressKey: AddressKey) => Promise<void>
  refetch: () => Promise<void>
}

export function useAddresses(userId: number | null): UseAddressesReturn {
  const [addresses, setAddresses] = useState<AddressTableData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAddresses = useCallback(async (): Promise<void> => {
    if (!userId) return

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
      if (!userId) return

      setIsLoading(true)
      setError(null)
      try {
        const createData: AddressCreateRequest = {
          ...addressData,
          userId,
          validFrom: addressData.validFrom.toISOString()
        }
        const newAddress = await createAddressAction(createData)
        setAddresses((prev) => [newAddress, ...prev])
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
    [userId]
  )

  const updateAddress = useCallback(
    async (
      addressKey: AddressKey,
      addressData: AddressFormData
    ): Promise<void> => {
      setIsLoading(true)
      setError(null)
      try {
        const updateData: AddressUpdateRequest = {
          ...addressData,
          userId: addressKey.userId,
          originalAddressType: addressKey.addressType,
          originalValidFrom: addressKey.validFrom.toISOString(),
          validFrom: addressData.validFrom.toISOString()
        }
        const updatedAddress = await updateAddressAction(updateData)
        setAddresses((prev) =>
          prev.map((address) =>
            address.userId === addressKey.userId &&
            address.addressType === addressKey.addressType &&
            address.validFrom.getTime() === addressKey.validFrom.getTime()
              ? updatedAddress
              : address
          )
        )
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
    []
  )

  const deleteAddress = useCallback(
    async (addressKey: AddressKey): Promise<void> => {
      setIsLoading(true)
      setError(null)
      try {
        await deleteAddressAction(addressKey)
        setAddresses((prev) =>
          prev.filter(
            (address) =>
              !(
                address.userId === addressKey.userId &&
                address.addressType === addressKey.addressType &&
                address.validFrom.getTime() === addressKey.validFrom.getTime()
              )
          )
        )
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
    []
  )

  useEffect(() => {
    if (userId) {
      fetchAddresses()
    } else {
      setAddresses([])
    }
  }, [fetchAddresses, userId])

  return {
    addresses,
    isLoading,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
    refetch: fetchAddresses
  }
}
