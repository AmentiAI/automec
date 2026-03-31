export type UserRole = 'customer' | 'shop_owner' | 'tuner' | 'admin'

export type OrgRole = 'owner' | 'admin' | 'member'

export type OrgType = 'shop' | 'tuner_shop'

export interface UserProfile {
  id: string
  clerkId: string
  email: string
  name: string | null
  avatarUrl: string | null
  role: UserRole
  createdAt: Date
}

export interface Organization {
  id: string
  name: string
  slug: string
  type: OrgType
  logoUrl: string | null
  createdAt: Date
}

export interface OrgMember {
  userId: string
  orgId: string
  role: OrgRole
  joinedAt: Date
}
