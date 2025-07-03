'use client'

import { useCallback } from 'react'
import { UsersTable } from './UsersTable'
import { AddressesSection } from './AddressesSection'
import { CreateUserButton } from './CreateUserButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUsersContext } from '@/context/UsersContext'
import { UserFormData } from '@/types/user'

export function UsersList() {
  const {
    users,
    selectedUser,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    setSelectedUserId
  } = useUsersContext()

  const handleUserClick = useCallback(
    (userId: number) => {
      setSelectedUserId(userId)
    },
    [setSelectedUserId]
  )

  const handleCreateUser = useCallback(
    async (userData: UserFormData) => {
      await createUser(userData)
    },
    [createUser]
  )

  const handleUpdateUser = useCallback(
    async (userId: number, userData: UserFormData) => {
      await updateUser(userId, userData)
    },
    [updateUser]
  )

  const handleDeleteUser = useCallback(
    async (userId: number) => {
      await deleteUser(userId)
    },
    [deleteUser]
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

      {selectedUser && <AddressesSection user={selectedUser} />}
    </div>
  )
}
