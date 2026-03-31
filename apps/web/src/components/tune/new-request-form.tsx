'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTuneRequestSchema, type CreateTuneRequestInput } from '@automec/core/validators'
import {
  Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@automec/ui'
import { createTuneRequestAction } from '@/actions/tune'
import { useRouter } from 'next/navigation'
import type { garageVehicles, makes, models, shops } from '@automec/db'
import type { InferSelectModel } from 'drizzle-orm'

interface Props {
  vehicles: Array<{
    vehicle: InferSelectModel<typeof garageVehicles>
    make: InferSelectModel<typeof makes> | null
    model: InferSelectModel<typeof models> | null
  }>
  shops: InferSelectModel<typeof shops>[]
}

const platforms = [
  { value: 'hp_tuners', label: 'HP Tuners' },
  { value: 'ecutek', label: 'EcuTek' },
  { value: 'cobb', label: 'Cobb Accessport' },
  { value: 'haltech', label: 'Haltech' },
  { value: 'link', label: 'Link ECU' },
  { value: 'vi_pec', label: 'Vi-PEC' },
  { value: 'other', label: 'Other / Not sure' },
]

export function NewTuneRequestForm({ vehicles, shops }: Props) {
  const router = useRouter()
  const form = useForm<CreateTuneRequestInput>({
    resolver: zodResolver(createTuneRequestSchema),
  })

  async function onSubmit(values: CreateTuneRequestInput) {
    const requestId = await createTuneRequestAction(values)
    router.push(`/tune-requests/${requestId}`)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Vehicle</Label>
        <Select onValueChange={(v) => form.setValue('garageVehicleId', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select vehicle" />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map(({ vehicle, make, model }) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.year} {make?.name} {model?.name}
                {vehicle.nickname ? ` — ${vehicle.nickname}` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.garageVehicleId && (
          <p className="mt-1 text-xs text-red-500">Select a vehicle</p>
        )}
      </div>

      <div>
        <Label>Tune platform</Label>
        <Select onValueChange={(v) => form.setValue('platform', v as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            {platforms.map((p) => (
              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {shops.length > 0 && (
        <div>
          <Label>Shop (optional)</Label>
          <Select onValueChange={(v) => form.setValue('shopId', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a shop or leave open" />
            </SelectTrigger>
            <SelectContent>
              {shops.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label>Tell us about your build</Label>
        <textarea
          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Describe your mods, goals, and any special requirements..."
          {...form.register('description')}
        />
        {form.formState.errors.description && (
          <p className="mt-1 text-xs text-red-500">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Power goal (hp) — optional</Label>
          <Input
            type="number"
            placeholder="400"
            {...form.register('powerGoalHp', { valueAsNumber: true })}
          />
        </div>
        <div>
          <Label>Budget ($) — optional</Label>
          <Input
            type="number"
            placeholder="500"
            {...form.register('budget', { valueAsNumber: true })}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Submitting...' : 'Submit tune request'}
      </Button>
    </form>
  )
}
