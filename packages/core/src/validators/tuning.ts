import { z } from 'zod'

export const createTuneRequestSchema = z.object({
  garageVehicleId: z.string(),
  shopId: z.string().optional(),
  platform: z.enum(['hp_tuners', 'ecutek', 'cobb', 'haltech', 'link', 'vi_pec', 'other']),
  description: z.string().min(10).max(5000),
  powerGoalHp: z.number().int().min(0).max(5000).optional(),
  budget: z.number().min(0).optional(),
})

export const sendTuneMessageSchema = z.object({
  tuneRequestId: z.string(),
  content: z.string().min(1).max(5000),
  fileUrls: z.array(z.string().url()).max(10).default([]),
})

export const updateTuneRequestStatusSchema = z.object({
  tuneRequestId: z.string(),
  status: z.enum([
    'pending', 'accepted', 'in_progress', 'waiting_datalog', 'revision', 'completed', 'cancelled',
  ]),
})

export const uploadTuneFileSchema = z.object({
  tuneRequestId: z.string(),
  fileName: z.string().min(1).max(255),
  fileUrl: z.string().url(),
  notes: z.string().max(1000).optional(),
})

export type CreateTuneRequestInput = z.infer<typeof createTuneRequestSchema>
export type SendTuneMessageInput = z.infer<typeof sendTuneMessageSchema>
export type UpdateTuneRequestStatusInput = z.infer<typeof updateTuneRequestStatusSchema>
export type UploadTuneFileInput = z.infer<typeof uploadTuneFileSchema>
