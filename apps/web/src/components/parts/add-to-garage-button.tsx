'use client'

import { Button } from '@automec/ui'
import { addInstalledPartAction } from '@/actions/garage'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Check } from 'lucide-react'

interface Props {
  partId: string
  garageVehicleId: string
  price?: string
}

export function AddToGarageButton({ partId, garageVehicleId, price }: Props) {
  const [done, setDone] = useState(false)
  const router = useRouter()

  async function handleAdd() {
    await addInstalledPartAction({
      garageVehicleId,
      partId,
      priceAtInstall: price ? Number(price) : undefined,
    })
    setDone(true)
    setTimeout(() => router.push(`/garage/${garageVehicleId}`), 800)
  }

  if (done) {
    return (
      <Button size="lg" className="flex-1 bg-green-600 hover:bg-green-600">
        <Check className="mr-1 h-4 w-4" />
        Added!
      </Button>
    )
  }

  return (
    <Button size="lg" className="flex-1" onClick={handleAdd}>
      Add to build
    </Button>
  )
}
