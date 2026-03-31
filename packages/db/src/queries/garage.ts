import { eq } from 'drizzle-orm'
import { db } from '../client'
import { garages, garageVehicles, installedParts, dynoRuns, maintenanceLogs } from '../schema/index'

export async function getGarageByUserId(userId: string) {
  return db.select().from(garages).where(eq(garages.userId, userId))
}

export async function getGarageBySlug(slug: string) {
  const rows = await db.select().from(garages).where(eq(garages.slug, slug)).limit(1)
  return rows[0] ?? null
}

export async function getGarageVehicles(garageId: string) {
  return db.select().from(garageVehicles).where(eq(garageVehicles.garageId, garageId))
}

export async function getGarageVehicleWithParts(vehicleId: string) {
  const [vehicle, parts, dynos, logs] = await Promise.all([
    db.select().from(garageVehicles).where(eq(garageVehicles.id, vehicleId)).limit(1),
    db.select().from(installedParts).where(eq(installedParts.garageVehicleId, vehicleId)),
    db.select().from(dynoRuns).where(eq(dynoRuns.garageVehicleId, vehicleId)),
    db.select().from(maintenanceLogs).where(eq(maintenanceLogs.garageVehicleId, vehicleId)),
  ])
  if (!vehicle[0]) return null
  return { vehicle: vehicle[0], parts, dynos, logs }
}

export async function createGarage(data: typeof garages.$inferInsert) {
  const rows = await db.insert(garages).values(data).returning()
  return rows[0]!
}

export async function addVehicleToGarage(data: typeof garageVehicles.$inferInsert) {
  const rows = await db.insert(garageVehicles).values(data).returning()
  return rows[0]!
}

export async function addInstalledPart(data: typeof installedParts.$inferInsert) {
  const rows = await db.insert(installedParts).values(data).returning()
  return rows[0]!
}
