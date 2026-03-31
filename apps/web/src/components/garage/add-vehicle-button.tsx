'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addVehicleSchema, type AddVehicleInput } from '@automec/core/validators'
import {
  Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
  Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@automec/ui'
import { Plus } from 'lucide-react'
import { addVehicleAction } from '@/actions/garage'
import { useRouter } from 'next/navigation'

interface Props {
  garageId: string
}

export function AddVehicleButton({ garageId }: Props) {
  const [open, setOpen] = useState(false)
  const [makes, setMakes] = useState<Array<{ id: string; name: string }>>([])
  const [models, setModels] = useState<Array<{ id: string; name: string }>>([])
  const router = useRouter()

  const form = useForm<AddVehicleInput>({
    resolver: zodResolver(addVehicleSchema),
    defaultValues: { garageId },
  })

  async function loadMakes() {
    const res = await fetch('/api/vehicles/makes')
    const data = await res.json()
    setMakes(data)
  }

  async function loadModels(makeId: string) {
    const res = await fetch(`/api/vehicles/models?makeId=${makeId}`)
    const data = await res.json()
    setModels(data)
  }

  async function onSubmit(values: AddVehicleInput) {
    await addVehicleAction(values)
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) loadMakes() }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 h-4 w-4" />
          Add vehicle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a vehicle</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Year</Label>
              <Input
                type="number"
                placeholder="2022"
                {...form.register('year', { valueAsNumber: true })}
              />
              {form.formState.errors.year && (
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.year.message}</p>
              )}
            </div>
            <div className="col-span-2">
              <Label>Make</Label>
              <Select onValueChange={(v) => { form.setValue('makeId', v); loadModels(v) }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  {makes.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Model</Label>
            <Select onValueChange={(v) => form.setValue('modelId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Nickname (optional)</Label>
            <Input placeholder="My WRX" {...form.register('nickname')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Mileage</Label>
              <Input
                type="number"
                placeholder="45000"
                {...form.register('mileage', { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label>Power goal (hp)</Label>
              <Input
                type="number"
                placeholder="400"
                {...form.register('powerGoalHp', { valueAsNumber: true })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Adding...' : 'Add vehicle'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
