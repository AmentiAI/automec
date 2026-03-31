import { eq, asc } from 'drizzle-orm'
import { db } from '../client'
import { makes, models, generations, trims, engines, transmissions, vehicleConfigs } from '../schema/index'

export async function getMakes() {
  return db.select().from(makes).orderBy(asc(makes.name))
}

export async function getModelsByMake(makeId: string) {
  return db.select().from(models).where(eq(models.makeId, makeId)).orderBy(asc(models.name))
}

export async function getGenerationsByModel(modelId: string) {
  return db.select().from(generations).where(eq(generations.modelId, modelId))
}

export async function getTrimsByGeneration(generationId: string) {
  return db.select().from(trims).where(eq(trims.generationId, generationId))
}

export async function getVehicleConfigsByGeneration(generationId: string) {
  return db
    .select({
      config: vehicleConfigs,
      engine: engines,
      transmission: transmissions,
      trim: trims,
    })
    .from(vehicleConfigs)
    .leftJoin(engines, eq(vehicleConfigs.engineId, engines.id))
    .leftJoin(transmissions, eq(vehicleConfigs.transmissionId, transmissions.id))
    .leftJoin(trims, eq(vehicleConfigs.trimId, trims.id))
    .where(eq(vehicleConfigs.generationId, generationId))
}

export async function getVehicleConfigById(configId: string) {
  const rows = await db
    .select({
      config: vehicleConfigs,
      generation: generations,
      engine: engines,
      transmission: transmissions,
      trim: trims,
    })
    .from(vehicleConfigs)
    .leftJoin(generations, eq(vehicleConfigs.generationId, generations.id))
    .leftJoin(engines, eq(vehicleConfigs.engineId, engines.id))
    .leftJoin(transmissions, eq(vehicleConfigs.transmissionId, transmissions.id))
    .leftJoin(trims, eq(vehicleConfigs.trimId, trims.id))
    .where(eq(vehicleConfigs.id, configId))
    .limit(1)
  return rows[0] ?? null
}
