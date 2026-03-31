export type FitmentStatus = 'fits' | 'fits_with_conditions' | 'does_not_fit' | 'needs_review'

export type FitmentRuleType = 'direct' | 'conditional' | 'exclude'

export interface FitmentRule {
  id: string
  partId: string
  ruleType: FitmentRuleType
  notes: string | null
}

export interface FitmentDependency {
  id: string
  fitmentRuleId: string
  dependsOnPartId: string
  notes: string | null
}

export interface FitmentConflict {
  id: string
  fitmentRuleId: string
  conflictsWithPartId: string
  notes: string | null
}

export interface FitmentResult {
  status: FitmentStatus
  notes: string | null
  conditions: string[]
  requiredParts: Array<{ id: string; name: string }>
  conflictingParts: Array<{ id: string; name: string }>
  tuneRequired: boolean
  tunePlatforms: string[]
  plainEnglishSummary?: string
}

export interface FitmentCheckInput {
  partId: string
  vehicleConfigId: string
  installedPartIds?: string[]
}
