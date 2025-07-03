'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { AddressTableData, AddressFormData } from '@/types/address'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, Trash } from 'lucide-react'
import { AddressModal } from './AddressModal'

interface AddressActionsMenuProps {
  address: AddressTableData
  onEdit: (data: AddressFormData) => Promise<void>
  onDelete: () => void
}

export function AddressActionsMenu({
  address,
  onEdit,
  onDelete
}: AddressActionsMenuProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditModalOpen(true)
  }, [])

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onDelete()
    },
    [onDelete]
  )

  const handleTriggerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  const handleEditSubmit = useCallback(
    async (data: AddressFormData) => {
      await onEdit(data)
      setIsEditModalOpen(false)
    },
    [onEdit]
  )

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleTriggerClick}
          >
            <MoreHorizontal className="w-4 h-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleEditClick} className="gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteClick}
            variant="destructive"
            className="gap-2"
          >
            <Trash className="w-4 h-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddressModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        address={address}
        onSubmit={handleEditSubmit}
      />
    </>
  )
}
