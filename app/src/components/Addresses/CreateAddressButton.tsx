'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AddressFormData } from '@/types/address'
import { AddressModal } from './AddressModal'

interface CreateAddressButtonProps {
  onCreateAddress: (data: AddressFormData) => Promise<void>
}

export function CreateAddressButton({
  onCreateAddress
}: CreateAddressButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  return (
    <>
      <Button onClick={handleOpenModal} className="gap-2">
        <Plus className="w-4 h-4" />
        Add Address
      </Button>

      <AddressModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={onCreateAddress}
      />
    </>
  )
}
