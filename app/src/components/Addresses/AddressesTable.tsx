'use client'

import { useCallback } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { TablePagination } from '@/components/ui/table-pagination'
import { AddressActionsMenu } from './AddressActionsMenu'
import { AddressTableData, AddressFormData, AddressKey } from '@/types/address'
import { getAddressTypeLabel } from '@/lib/utils/address'
import { usePagination } from '@/hooks/usePagination'

interface AddressesTableProps {
  addresses: AddressTableData[]
  onEditAddress: (
    addressKey: AddressKey,
    data: AddressFormData
  ) => Promise<void>
  onDeleteAddress: (addressKey: AddressKey) => Promise<void>
  isLoading?: boolean
}

export function AddressesTable({
  addresses,
  onEditAddress,
  onDeleteAddress,
  isLoading
}: AddressesTableProps) {
  const {
    currentPage,
    totalPages,
    currentItems: currentAddresses,
    setCurrentPage
  } = usePagination({
    items: addresses,
    itemsPerPage: 5
  })

  const handleEditAddress = useCallback(
    async (addressKey: AddressKey, data: AddressFormData) => {
      await onEditAddress(addressKey, data)
    },
    [onEditAddress]
  )

  const handleDeleteAddress = useCallback(
    async (addressKey: AddressKey) => {
      await onDeleteAddress(addressKey)
    },
    [onDeleteAddress]
  )

  if (isLoading && addresses.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <div className="text-muted-foreground">Loading addresses...</div>
      </div>
    )
  }

  if (addresses.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <div className="text-muted-foreground">
          <p className="text-lg mb-2">No addresses found</p>
          <p className="text-sm">
            Click &quot;Add Address&quot; to create the first address.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[300px]">Address</TableHead>
              <TableHead className="w-[120px]">Valid From</TableHead>
              <TableHead className="w-[80px]">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentAddresses.map((address) => (
              <TableRow key={address.id}>
                <TableCell className="font-medium py-4">
                  <Badge variant="outline">
                    {getAddressTypeLabel(address.addressType)}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <div className="whitespace-pre-line text-sm">
                    {address.formattedAddress}
                  </div>
                </TableCell>
                <TableCell className="py-4 text-sm">
                  {address.validFrom.toLocaleDateString()}
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    variant={address.isActive ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {address.isActive ? 'Active' : 'Future'}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <AddressActionsMenu
                    address={address}
                    onEdit={(data: AddressFormData) =>
                      handleEditAddress(
                        {
                          userId: address.userId,
                          addressType: address.addressType,
                          validFrom: address.validFrom
                        },
                        data
                      )
                    }
                    onDelete={() =>
                      handleDeleteAddress({
                        userId: address.userId,
                        addressType: address.addressType,
                        validFrom: address.validFrom
                      })
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
