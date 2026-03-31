import { eq, inArray } from 'drizzle-orm'
import { db } from '../client'
import {
  fitmentRules,
  fitmentRuleVehicleConfigs,
  fitmentDependencies,
  fitmentConflicts,
  fitmentWarnings,
  parts,
} from '../schema/index'

export async function getFitmentRulesForPart(partId: string) {
  return db
    .select()
    .from(fitmentRules)
    .where(eq(fitmentRules.partId, partId))
}

export async function getFitmentRuleWithDetails(fitmentRuleId: string) {
  const [rule, vehicleConfigs, deps, conflicts, warnings] = await Promise.all([
    db.select().from(fitmentRules).where(eq(fitmentRules.id, fitmentRuleId)).limit(1),
    db.select().from(fitmentRuleVehicleConfigs).where(eq(fitmentRuleVehicleConfigs.fitmentRuleId, fitmentRuleId)),
    db.select().from(fitmentDependencies).where(eq(fitmentDependencies.fitmentRuleId, fitmentRuleId)),
    db.select().from(fitmentConflicts).where(eq(fitmentConflicts.fitmentRuleId, fitmentRuleId)),
    db.select().from(fitmentWarnings).where(eq(fitmentWarnings.fitmentRuleId, fitmentRuleId)),
  ])
  if (!rule[0]) return null
  return { rule: rule[0], vehicleConfigs, deps, conflicts, warnings }
}

export async function getFitmentRulesForVehicleConfig(vehicleConfigId: string) {
  const rows = await db
    .select({ rule: fitmentRules, part: parts })
    .from(fitmentRuleVehicleConfigs)
    .innerJoin(fitmentRules, eq(fitmentRuleVehicleConfigs.fitmentRuleId, fitmentRules.id))
    .innerJoin(parts, eq(fitmentRules.partId, parts.id))
    .where(eq(fitmentRuleVehicleConfigs.vehicleConfigId, vehicleConfigId))
  return rows
}

export async function getPartsForVehicle(vehicleConfigId: string) {
  const rows = await db
    .select({ rule: fitmentRules, part: parts })
    .from(fitmentRuleVehicleConfigs)
    .innerJoin(fitmentRules, eq(fitmentRuleVehicleConfigs.fitmentRuleId, fitmentRules.id))
    .innerJoin(parts, eq(fitmentRules.partId, parts.id))
    .where(eq(fitmentRuleVehicleConfigs.vehicleConfigId, vehicleConfigId))
  return rows
}
