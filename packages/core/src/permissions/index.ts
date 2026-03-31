import type { UserRole, OrgRole } from '@automec/types'

// User-level permissions
export function canManageShop(role: UserRole): boolean {
  return role === 'shop_owner' || role === 'admin'
}

export function canAccessTunerDashboard(role: UserRole): boolean {
  return role === 'tuner' || role === 'shop_owner' || role === 'admin'
}

export function isAdmin(role: UserRole): boolean {
  return role === 'admin'
}

// Org-level permissions
export function canManageOrgMembers(orgRole: OrgRole): boolean {
  return orgRole === 'owner' || orgRole === 'admin'
}

export function canManageCatalog(orgRole: OrgRole): boolean {
  return orgRole === 'owner' || orgRole === 'admin' || orgRole === 'member'
}

export function canManageBilling(orgRole: OrgRole): boolean {
  return orgRole === 'owner'
}

export function canViewAnalytics(orgRole: OrgRole): boolean {
  return orgRole === 'owner' || orgRole === 'admin'
}

// Plan-based gates
export type PlanId = 'enthusiast_free' | 'enthusiast_pro' | 'shop_starter' | 'shop_growth' | 'shop_pro'

export function canUseApi(planId: PlanId): boolean {
  return planId === 'shop_pro'
}

export function canUseWhiteLabel(planId: PlanId): boolean {
  return planId === 'shop_pro'
}

export function getGarageLimit(planId: PlanId): number | 'unlimited' {
  if (planId === 'enthusiast_free') return 1
  return 'unlimited'
}

export function getFitmentLookupLimit(planId: PlanId): number | 'unlimited' {
  switch (planId) {
    case 'enthusiast_free': return 50
    case 'shop_starter': return 1000
    case 'shop_growth': return 10000
    default: return 'unlimited'
  }
}
