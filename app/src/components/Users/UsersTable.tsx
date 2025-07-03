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
import { UserActionsMenu } from './UserActionsMenu'
import { UserTableData, UserFormData } from '@/types/user'
import { usePagination } from '@/hooks/usePagination'

interface UsersTableProps {
  users: UserTableData[]
  onUserClick: (userId: number) => void
  onEditUser: (userId: number, data: UserFormData) => Promise<void>
  onDeleteUser: (userId: number) => Promise<void>
  isLoading?: boolean
}

export function UsersTable({
  users,
  onUserClick,
  onEditUser,
  onDeleteUser,
  isLoading
}: UsersTableProps) {
  const {
    currentPage,
    totalPages,
    currentItems: currentUsers,
    setCurrentPage
  } = usePagination({
    items: users,
    itemsPerPage: 10
  })

  const handleUserClick = useCallback(
    (userId: number) => {
      onUserClick(userId)
    },
    [onUserClick]
  )

  const handleUserEdit = useCallback(
    async (userId: number, data: UserFormData) => {
      await onEditUser(userId, data)
    },
    [onEditUser]
  )

  const handleUserDelete = useCallback(
    async (userId: number) => {
      await onDeleteUser(userId)
    },
    [onDeleteUser]
  )

  if (isLoading && users.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <div className="text-muted-foreground">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead className="w-[300px]">Email</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[100px]">Addresses</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow
                key={user.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleUserClick(user.id)}
              >
                <TableCell className="font-medium py-4">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell className="py-4">{user.email}</TableCell>
                <TableCell className="py-4">
                  <Badge
                    variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}
                    className="font-medium"
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 text-center">
                  <span className="bg-muted px-2 py-1 rounded-md text-sm font-medium">
                    {user.addressCount}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <UserActionsMenu
                    user={user}
                    onEdit={(data: UserFormData) =>
                      handleUserEdit(user.id, data)
                    }
                    onDelete={() => handleUserDelete(user.id)}
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
