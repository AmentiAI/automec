import { z } from 'zod'

export const createPartSchema = z.object({
  brandId: z.string(),
  categoryId: z.string(),
  name: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  sku: z.string().max(100).optional(),
  partNumber: z.string().max(100).optional(),
  description: z.string().max(5000).optional(),
  price: z.number().min(0).optional(),
  condition: z.enum(['new', 'used', 'remanufactured']).optional(),
  isTuneRequired: z.boolean().optional(),
})

export const updatePartSchema = createPartSchema.partial()

export const createFitmentRuleSchema = z.object({
  partId: z.string(),
  vehicleConfigIds: z.array(z.string()).min(1),
  ruleType: z.enum(['direct', 'conditional', 'exclude']).optional(),
  notes: z.string().max(1000).optional(),
  dependsOnPartIds: z.array(z.string()).optional(),
  conflictsWithPartIds: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
})

export type CreatePartInput = z.infer<typeof createPartSchema>
export type UpdatePartInput = z.infer<typeof updatePartSchema>
export type CreateFitmentRuleInput = z.infer<typeof createFitmentRuleSchema>
