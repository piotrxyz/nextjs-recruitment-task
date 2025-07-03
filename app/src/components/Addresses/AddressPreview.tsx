import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatAddressPreview } from '@/lib/utils/address'
import { AddressFormData } from '@/types/address'

interface AddressPreviewProps {
  formData: Partial<AddressFormData>
}

export function AddressPreview({ formData }: AddressPreviewProps) {
  const preview = useMemo(() => formatAddressPreview(formData), [formData])

  const isEmpty = !preview.full.trim()

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-muted-foreground">
          Real-time Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {isEmpty ? (
          <div className="text-muted-foreground text-sm italic min-h-[60px] flex items-center">
            Fill in the address fields to see preview
          </div>
        ) : (
          <div className="space-y-2 min-h-[60px]">
            {preview.line1 && (
              <div className="font-medium text-sm sm:text-base">
                {preview.line1}
              </div>
            )}
            {preview.line2 && (
              <div className="text-sm sm:text-base">{preview.line2}</div>
            )}
            {preview.line3 && (
              <div className="text-sm sm:text-base font-mono uppercase tracking-wider">
                {preview.line3}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
