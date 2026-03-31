'use client'

import { Button } from '@automec/ui'
import { MessageSquare } from 'lucide-react'

interface Props {
  partId: string
  shopId: string
}

export function RequestQuoteButton({ partId, shopId }: Props) {
  return (
    <Button variant="outline" size="lg">
      <MessageSquare className="mr-1 h-4 w-4" />
      Request quote
    </Button>
  )
}
