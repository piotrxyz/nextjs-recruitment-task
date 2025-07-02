import { UsersList } from '@/components/Users/UsersList'

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Address Manager</h1>
          <p className="text-xl text-muted-foreground">
            Manage users and their addresses
          </p>
        </div>
        <UsersList />
      </div>
    </div>
  )
}
