'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface AddressesSectionProps {
  userId: number
}

export function AddressesSection({ userId }: AddressesSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-xl font-semibold">
          Addresses for User {userId}
        </CardTitle>
        <Button variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Address
        </Button>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">No addresses found</p>
          <p className="text-sm">
            Click &quot;Add Address&quot; to create the first address for this
            user.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
