'use client'

import { useState } from 'react'
import { Button } from '@automec/ui'
import { Plus } from 'lucide-react'
import Link from 'next/link'

interface Props {
  vehicleId: string
  vehicleConfigId: string | null
}

export function AddPartButton({ vehicleId, vehicleConfigId }: Props) {
  return (
    <Button size="sm" asChild>
      <Link href={`/parts?vehicleConfigId=${vehicleConfigId ?? ''}&addTo=${vehicleId}`}>
        <Plus className="mr-1 h-4 w-4" />
        Add part
      </Link>
    </Button>
  )
}
