import { useState, useCallback, useEffect } from 'react'
import { UserTableData, UserFormData } from '@/types/user'
import {
  getUsers,
  createUser as createUserAction,
  updateUser as updateUserAction,
  deleteUser as deleteUserAction
} from '@/lib/actions/users'

interface UseUsersReturn {
  users: UserTableData[]
  isLoading: boolean
  error: string | null
  createUser: (userData: UserFormData) => Promise<void>
  updateUser: (userId: number, userData: UserFormData) => Promise<void>
  deleteUser: (userId: number) => Promise<void>
  refetch: () => Promise<void>
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<UserTableData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedUsers = await getUsers()
      setUsers(fetchedUsers)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch users'
      setError(errorMessage)
      console.error('Error fetching users:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createUser = useCallback(
    async (userData: UserFormData): Promise<void> => {
      setIsLoading(true)
      setError(null)
      try {
        const newUser = await createUserAction(userData)
        setUsers((prev) => [newUser, ...prev])
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create user'
        setError(errorMessage)
        console.error('Error creating user:', err)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const updateUser = useCallback(
    async (userId: number, userData: UserFormData): Promise<void> => {
      setIsLoading(true)
      setError(null)
      try {
        const updatedUser = await updateUserAction(userId, userData)
        setUsers((prev) =>
          prev.map((user) => (user.id === userId ? updatedUser : user))
        )
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update user'
        setError(errorMessage)
        console.error('Error updating user:', err)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const deleteUser = useCallback(async (userId: number): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      await deleteUserAction(userId)
      setUsers((prev) => prev.filter((user) => user.id !== userId))
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete user'
      setError(errorMessage)
      console.error('Error deleting user:', err)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers
  }
}
