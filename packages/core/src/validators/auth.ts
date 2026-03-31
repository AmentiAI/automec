import { z } from 'zod'

export const createOrgSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  type: z.enum(['shop', 'tuner_shop']),
})

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
})

export type CreateOrgInput = z.infer<typeof createOrgSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
