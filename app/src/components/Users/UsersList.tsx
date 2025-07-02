'use client'

import { useState, useCallback } from 'react'
import { UsersTable } from './UsersTable'
import { AddressesSection } from './AddressesSection'
import { CreateUserButton } from './CreateUserButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUsers } from '@/hooks/useUsers'
import { UserFormData } from '@/types/user'

export function UsersList() {
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const { users, isLoading, error, createUser, updateUser, deleteUser } = useUsers()

  const handleUserClick = useCallback((userId: number) => {
    setSelectedUser(selectedUser === userId ? null : userId)
  }, [selectedUser])

  const handleCreateUser = useCallback(async (userData: UserFormData) => {
    await createUser(userData)
  }, [createUser])

  const handleUpdateUser = useCallback(async (userId: number, userData: UserFormData) => {
    await updateUser(userId, userData)
  }, [updateUser])

  const handleDeleteUser = useCallback(async (userId: number) => {
    await deleteUser(userId)
  }, [deleteUser])

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
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle className="text-2xl font-bold">Users</CardTitle>
          <CreateUserButton onCreateUser={handleCreateUser} />
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <UsersTable 
            users={users} 
            onUserClick={handleUserClick}
            onEditUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {selectedUser && <AddressesSection userId={selectedUser} />}
    </div>
  )
}
