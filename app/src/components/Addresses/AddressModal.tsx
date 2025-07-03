'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Address, AddressFormData } from '@/types/address'
import { addressSchema } from '@/lib/validations/address'
import { getAddressTypeLabel, normalizeCountryCode } from '@/lib/utils/address'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { AddressPreview } from './AddressPreview'
import { cn } from '@/lib/utils'

interface AddressModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  address?: Address
  onSubmit: (data: AddressFormData) => Promise<void>
}

export function AddressModal({
  open,
  onOpenChange,
  address,
  onSubmit
}: AddressModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isEdit = !!address

  const defaultValues = useMemo(
    () => ({
      addressType: address?.addressType || ('HOME' as const),
      validFrom: address?.validFrom || new Date(),
      postCode: address?.postCode || '',
      city: address?.city || '',
      countryCode: address?.countryCode || '',
      street: address?.street || '',
      buildingNumber: address?.buildingNumber || ''
    }),
    [address]
  )

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues
  })

  const formData = form.watch()

  useEffect(() => {
    form.reset(defaultValues)
  }, [form, defaultValues])

  const handleSubmit = useCallback(
    async (data: AddressFormData) => {
      setIsLoading(true)
      try {
        const normalizedData = {
          ...data,
          countryCode: normalizeCountryCode(data.countryCode)
        }
        await onSubmit(normalizedData)
        onOpenChange(false)
        form.reset()
      } catch (error) {
        console.error('Error submitting address:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [onSubmit, onOpenChange, form]
  )

  const handleClose = useCallback(() => {
    onOpenChange(false)
    form.reset()
  }, [onOpenChange, form])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Address' : 'Create New Address'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Make changes to the address information.'
              : 'Add a new address to the system.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4 xl:order-1">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
                id="address-form"
              >
                <FormField
                  control={form.control}
                  name="addressType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select address type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="HOME">
                            {getAddressTypeLabel('HOME')}
                          </SelectItem>
                          <SelectItem value="WORK">
                            {getAddressTypeLabel('WORK')}
                          </SelectItem>
                          <SelectItem value="INVOICE">
                            {getAddressTypeLabel('INVOICE')}
                          </SelectItem>
                          <SelectItem value="POST">
                            {getAddressTypeLabel('POST')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="validFrom"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Valid From *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date('1900-01-01')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street *</FormLabel>
                        <FormControl>
                          <Input placeholder="Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="buildingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Building Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="123A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="postCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Post Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country Code *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="USA"
                          maxLength={3}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase()
                            field.onChange(value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="text-xs text-muted-foreground">
                        ISO3166-1 alpha-3 format (e.g., USA, GBR, POL)
                      </div>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          <div className="space-y-4 xl:order-2">
            <AddressPreview formData={formData} />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} form="address-form">
            {isLoading
              ? 'Saving...'
              : isEdit
                ? 'Update Address'
                : 'Create Address'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
