'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { UserModal } from './UserModal'
import { UserFormData } from '@/types/user'

interface CreateUserButtonProps {
  onCreateUser: (data: UserFormData) => Promise<void>
}

export function CreateUserButton({ onCreateUser }: CreateUserButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  return (
    <>
      <Button onClick={handleOpenModal} className="gap-2">
        <Plus className="w-4 h-4" />
        Create User
      </Button>
      
      <UserModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={onCreateUser}
      />
    </>
  )
}