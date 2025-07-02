export type UserStatus = 'ACTIVE' | 'INACTIVE'

export interface User {
  id: number
  firstName: string
  lastName: string
  initials?: string
  email: string
  status: UserStatus
}

export interface UserFormData {
  firstName: string
  lastName: string
  initials?: string
  email: string
  status: UserStatus
}

export interface UserCreateData extends UserFormData {}

export interface UserUpdateData extends UserFormData {
  id: number
}

export interface UserTableData extends User {
  addressCount: number
}