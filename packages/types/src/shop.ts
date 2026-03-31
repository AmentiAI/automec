export type ShopVerificationStatus = 'pending' | 'verified' | 'rejected'

export interface Shop {
  id: string
  orgId: string
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  websiteUrl: string | null
  phone: string | null
  email: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string
  verificationStatus: ShopVerificationStatus
  isActive: boolean
  createdAt: Date
}

export interface ShopAnalytics {
  shopId: string
  period: 'day' | 'week' | 'month'
  fitmentLookups: number
  tuneRequests: number
  quoteRequests: number
  uniqueVehicles: number
  topParts: Array<{ partId: string; partName: string; lookups: number }>
}

export interface ApiKey {
  id: string
  shopId: string
  name: string
  keyHash: string
  lastUsedAt: Date | null
  expiresAt: Date | null
  createdAt: Date
}
