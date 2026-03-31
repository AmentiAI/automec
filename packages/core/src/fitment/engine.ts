import { eq, inArray } from 'drizzle-orm'
import { db } from '@automec/db/client'
import {
  fitmentRules,
  fitmentRuleVehicleConfigs,
  fitmentDependencies,
  fitmentConflicts,
  fitmentWarnings,
  partTuneRequirements,
  tunePlatforms,
  parts,
} from '@automec/db/schema'
import type { FitmentResult, FitmentCheckInput } from '@automec/types'

export async function checkFitment(input: FitmentCheckInput): Promise<FitmentResult> {
  const { partId, vehicleConfigId, installedPartIds = [] } = input

  // Find all fitment rules for this part
  const rules = await db
    .select({ rule: fitmentRules })
    .from(fitmentRules)
    .where(eq(fitmentRules.partId, partId))

  if (rules.length === 0) {
    return {
      status: 'needs_review',
      notes: 'No fitment data available for this part.',
      conditions: [],
      requiredParts: [],
      conflictingParts: [],
      tuneRequired: false,
      tunePlatforms: [],
    }
  }

  // Check which rules apply to this vehicle config
  const ruleIds = rules.map((r) => r.rule.id)

  const applicableConfigs = await db
    .select()
    .from(fitmentRuleVehicleConfigs)
    .where(
      eq(fitmentRuleVehicleConfigs.vehicleConfigId, vehicleConfigId),
    )

  const applicableRuleIds = applicableConfigs
    .filter((c) => ruleIds.includes(c.fitmentRuleId))
    .map((c) => c.fitmentRuleId)

  if (applicableRuleIds.length === 0) {
    return {
      status: 'does_not_fit',
      notes: 'This part does not fit this vehicle configuration.',
      conditions: [],
      requiredParts: [],
      conflictingParts: [],
      tuneRequired: false,
      tunePlatforms: [],
    }
  }

  // Check for exclude rules
  const excludeRules = rules.filter(
    (r) => r.rule.ruleType === 'exclude' && applicableRuleIds.includes(r.rule.id),
  )
  if (excludeRules.length > 0) {
    return {
      status: 'does_not_fit',
      notes: excludeRules[0]?.rule.notes ?? 'This part is excluded from this vehicle.',
      conditions: [],
      requiredParts: [],
      conflictingParts: [],
      tuneRequired: false,
      tunePlatforms: [],
    }
  }

  // Check dependencies
  const deps = await db
    .select({ dep: fitmentDependencies, part: parts })
    .from(fitmentDependencies)
    .innerJoin(parts, eq(fitmentDependencies.dependsOnPartId, parts.id))
    .where(inArray(fitmentDependencies.fitmentRuleId, applicableRuleIds))

  const missingDeps = deps.filter((d) => !installedPartIds.includes(d.dep.dependsOnPartId))
  const requiredParts = missingDeps.map((d) => ({ id: d.dep.dependsOnPartId, name: d.part.name }))

  // Check conflicts
  const conflicts = await db
    .select({ conflict: fitmentConflicts, part: parts })
    .from(fitmentConflicts)
    .innerJoin(parts, eq(fitmentConflicts.conflictsWithPartId, parts.id))
    .where(inArray(fitmentConflicts.fitmentRuleId, applicableRuleIds))

  const activeConflicts = conflicts.filter((c) =>
    installedPartIds.includes(c.conflict.conflictsWithPartId),
  )
  const conflictingParts = activeConflicts.map((c) => ({
    id: c.conflict.conflictsWithPartId,
    name: c.part.name,
  }))

  // Check warnings / conditions
  const warnings = await db
    .select()
    .from(fitmentWarnings)
    .where(inArray(fitmentWarnings.fitmentRuleId, applicableRuleIds))

  const conditions = warnings.map((w) => w.message)

  // Check tune requirements
  const tuneReqs = await db
    .select({ req: partTuneRequirements, platform: tunePlatforms })
    .from(partTuneRequirements)
    .leftJoin(tunePlatforms, eq(partTuneRequirements.platformId, tunePlatforms.id))
    .where(eq(partTuneRequirements.partId, partId))

  const tuneRequired = tuneReqs.some((r) => r.req.isRequired)
  const tunePlatformNames = tuneReqs
    .filter((r) => r.platform)
    .map((r) => r.platform!.name)

  // Determine overall status
  if (conflictingParts.length > 0) {
    return {
      status: 'does_not_fit',
      notes: `Conflicts with installed parts: ${conflictingParts.map((p) => p.name).join(', ')}`,
      conditions,
      requiredParts,
      conflictingParts,
      tuneRequired,
      tunePlatforms: tunePlatformNames,
    }
  }

  const conditionalRules = rules.filter(
    (r) => r.rule.ruleType === 'conditional' && applicableRuleIds.includes(r.rule.id),
  )

  if (requiredParts.length > 0 || conditionalRules.length > 0 || conditions.length > 0) {
    return {
      status: 'fits_with_conditions',
      notes:
        conditionalRules[0]?.rule.notes ??
        (requiredParts.length > 0
          ? `Requires: ${requiredParts.map((p) => p.name).join(', ')}`
          : null),
      conditions,
      requiredParts,
      conflictingParts,
      tuneRequired,
      tunePlatforms: tunePlatformNames,
    }
  }

  return {
    status: 'fits',
    notes: null,
    conditions,
    requiredParts,
    conflictingParts,
    tuneRequired,
    tunePlatforms: tunePlatformNames,
  }
}
