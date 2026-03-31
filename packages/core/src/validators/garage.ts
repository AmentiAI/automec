import { z } from 'zod'

export const addVehicleSchema = z.object({
  garageId: z.string(),
  year: z.number().int().min(1980).max(new Date().getFullYear() + 1),
  makeId: z.string(),
  modelId: z.string(),
  vehicleConfigId: z.string().optional(),
  nickname: z.string().max(100).optional(),
  color: z.string().max(50).optional(),
  mileage: z.number().int().min(0).optional(),
  powerGoalHp: z.number().int().min(0).max(5000).optional(),
  notes: z.string().max(2000).optional(),
})

export const addInstalledPartSchema = z.object({
  garageVehicleId: z.string(),
  partId: z.string(),
  variantId: z.string().optional(),
  installedAt: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
  priceAtInstall: z.number().min(0).optional(),
})

export const addMaintenanceLogSchema = z.object({
  garageVehicleId: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  mileage: z.number().int().min(0).optional(),
  performedAt: z.string().datetime(),
  cost: z.number().min(0).optional(),
})

export const addDynoRunSchema = z.object({
  garageVehicleId: z.string(),
  dynoType: z.enum(['hub', 'roller', 'engine']),
  peakHp: z.number().int().min(0).max(5000).optional(),
  peakTq: z.number().int().min(0).max(5000).optional(),
  fileUrl: z.string().url().optional(),
  notes: z.string().max(1000).optional(),
  performedAt: z.string().datetime(),
})

export type AddVehicleInput = z.infer<typeof addVehicleSchema>
export type AddInstalledPartInput = z.infer<typeof addInstalledPartSchema>
export type AddMaintenanceLogInput = z.infer<typeof addMaintenanceLogSchema>
export type AddDynoRunInput = z.infer<typeof addDynoRunSchema>
