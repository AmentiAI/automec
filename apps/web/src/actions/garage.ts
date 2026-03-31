'use server'

import { requireUser } from '@/lib/auth'
import { db, garageVehicles, garages, installedParts, maintenanceLogs, dynoRuns } from '@automec/db'
import { eq } from 'drizzle-orm'
import {
  addVehicleSchema,
  addInstalledPartSchema,
  addMaintenanceLogSchema,
  addDynoRunSchema,
  type AddVehicleInput,
  type AddInstalledPartInput,
} from '@automec/core/validators'
import { revalidatePath } from 'next/cache'

export async function addVehicleAction(input: AddVehicleInput) {
  const user = await requireUser()
  const data = addVehicleSchema.parse(input)

  // Verify garage ownership
  const [garage] = await db
    .select()
    .from(garages)
    .where(eq(garages.id, data.garageId))
    .limit(1)
  if (!garage || garage.userId !== user.id) throw new Error('Forbidden')

  await db.insert(garageVehicles).values({
    garageId: data.garageId,
    makeId: data.makeId,
    modelId: data.modelId,
    vehicleConfigId: data.vehicleConfigId,
    year: data.year,
    nickname: data.nickname,
    color: data.color,
    mileage: data.mileage,
    powerGoalHp: data.powerGoalHp,
    notes: data.notes,
  })

  revalidatePath('/garage')
}

export async function addInstalledPartAction(input: AddInstalledPartInput) {
  const user = await requireUser()
  const data = addInstalledPartSchema.parse(input)

  // Verify ownership via vehicle → garage → user
  const [vehicle] = await db
    .select({ garageId: garageVehicles.garageId })
    .from(garageVehicles)
    .where(eq(garageVehicles.id, data.garageVehicleId))
    .limit(1)
  if (!vehicle) throw new Error('Vehicle not found')

  const [garage] = await db
    .select()
    .from(garages)
    .where(eq(garages.id, vehicle.garageId))
    .limit(1)
  if (!garage || garage.userId !== user.id) throw new Error('Forbidden')

  await db.insert(installedParts).values({
    garageVehicleId: data.garageVehicleId,
    partId: data.partId,
    variantId: data.variantId,
    installedAt: data.installedAt ? new Date(data.installedAt) : undefined,
    notes: data.notes,
    priceAtInstall: data.priceAtInstall?.toString(),
  })

  revalidatePath(`/garage/${data.garageVehicleId}`)
}

export async function removeInstalledPartAction(installedPartId: string) {
  const user = await requireUser()

  const [ip] = await db
    .select({ garageVehicleId: installedParts.garageVehicleId })
    .from(installedParts)
    .where(eq(installedParts.id, installedPartId))
    .limit(1)
  if (!ip) throw new Error('Not found')

  const [vehicle] = await db
    .select({ garageId: garageVehicles.garageId })
    .from(garageVehicles)
    .where(eq(garageVehicles.id, ip.garageVehicleId))
    .limit(1)
  if (!vehicle) throw new Error('Not found')

  const [garage] = await db
    .select()
    .from(garages)
    .where(eq(garages.id, vehicle.garageId))
    .limit(1)
  if (!garage || garage.userId !== user.id) throw new Error('Forbidden')

  await db.delete(installedParts).where(eq(installedParts.id, installedPartId))
  revalidatePath(`/garage/${ip.garageVehicleId}`)
}
