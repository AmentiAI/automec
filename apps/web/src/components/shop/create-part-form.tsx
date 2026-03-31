'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPartSchema, type CreatePartInput } from '@automec/core/validators'
import {
  Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@automec/ui'
import { createPartAction } from '@/actions/shop'
import { useRouter } from 'next/navigation'
import type { brands, partCategories } from '@automec/db'
import type { InferSelectModel } from 'drizzle-orm'

interface Props {
  shopId: string
  brands: InferSelectModel<typeof brands>[]
  categories: InferSelectModel<typeof partCategories>[]
}

export function CreatePartForm({ shopId, brands, categories }: Props) {
  const router = useRouter()
  const form = useForm<CreatePartInput>({
    resolver: zodResolver(createPartSchema),
    defaultValues: { condition: 'new', isTuneRequired: false },
  })

  async function onSubmit(values: CreatePartInput) {
    await createPartAction({ ...values, shopId })
    router.push('/shop/catalog')
    router.refresh()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Brand</Label>
          <Select onValueChange={(v) => form.setValue('brandId', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Category</Label>
          <Select onValueChange={(v) => form.setValue('categoryId', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Part name</Label>
        <Input placeholder="Cold Air Intake System" {...form.register('name')} />
        {form.formState.errors.name && (
          <p className="mt-1 text-xs text-red-500">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div>
        <Label>URL slug</Label>
        <Input placeholder="cold-air-intake-system" {...form.register('slug')} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>SKU</Label>
          <Input placeholder="CAI-WRX-001" {...form.register('sku')} />
        </div>
        <div>
          <Label>Part number</Label>
          <Input placeholder="PSP-INT-001" {...form.register('partNumber')} />
        </div>
      </div>

      <div>
        <Label>Price ($)</Label>
        <Input
          type="number"
          step="0.01"
          placeholder="399.00"
          {...form.register('price', { valueAsNumber: true })}
        />
      </div>

      <div>
        <Label>Description</Label>
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Part description..."
          {...form.register('description')}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isTuneRequired"
          {...form.register('isTuneRequired')}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="isTuneRequired">Tune required for this part</Label>
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Creating...' : 'Create part'}
      </Button>
    </form>
  )
}
