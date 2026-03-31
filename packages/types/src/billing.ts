export type PlanId =
  | 'enthusiast_free'
  | 'enthusiast_pro'
  | 'shop_starter'
  | 'shop_growth'
  | 'shop_pro'

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'paused'

export type UsageEventType =
  | 'fitment_lookup'
  | 'tune_request'
  | 'catalog_import'
  | 'api_call'
  | 'shop_seat'

export interface Plan {
  id: PlanId
  name: string
  description: string
  priceMonthly: number | null
  features: string[]
  limits: {
    garages?: number
    fitmentLookups?: number | 'unlimited'
    tuneRequests?: number | 'unlimited'
    shopSeats?: number
    catalogSize?: number | 'unlimited'
  }
}

export interface Subscription {
  id: string
  entityId: string
  entityType: 'user' | 'organization'
  planId: PlanId
  status: SubscriptionStatus
  stripeSubscriptionId: string
  stripeCustomerId: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  trialEnd: Date | null
}

export const PLANS: Record<PlanId, Plan> = {
  enthusiast_free: {
    id: 'enthusiast_free',
    name: 'Free',
    description: 'For the casual enthusiast',
    priceMonthly: 0,
    features: ['1 garage', 'Build tracker', 'Fitment checks', '3 tune requests/mo'],
    limits: { garages: 1, fitmentLookups: 50, tuneRequests: 3 },
  },
  enthusiast_pro: {
    id: 'enthusiast_pro',
    name: 'Pro',
    description: 'For the serious builder',
    priceMonthly: 12,
    features: [
      'Unlimited garages',
      'Advanced fitment notes',
      'Mod planner',
      'Tune history',
      'Public build customization',
    ],
    limits: { garages: 'unlimited', fitmentLookups: 'unlimited', tuneRequests: 'unlimited' },
  },
  shop_starter: {
    id: 'shop_starter',
    name: 'Shop Starter',
    description: 'For new shops getting started',
    priceMonthly: 149,
    features: ['1 shop', 'Fitment widget', 'Customer requests', 'Basic analytics'],
    limits: { shopSeats: 2, catalogSize: 500, fitmentLookups: 1000 },
  },
  shop_growth: {
    id: 'shop_growth',
    name: 'Shop Growth',
    description: 'For growing shops',
    priceMonthly: 399,
    features: [
      'More lookups',
      'Tune request workflow',
      'Code/license inventory',
      'Staff seats',
      'Customer CRM',
    ],
    limits: { shopSeats: 10, catalogSize: 5000, fitmentLookups: 10000 },
  },
  shop_pro: {
    id: 'shop_pro',
    name: 'Shop Pro',
    description: 'For high-volume shops and partners',
    priceMonthly: 999,
    features: [
      'API access',
      'White-label widget',
      'Advanced rules',
      'Custom onboarding',
      'Unlimited everything',
    ],
    limits: {
      shopSeats: 'unlimited',
      catalogSize: 'unlimited',
      fitmentLookups: 'unlimited',
      tuneRequests: 'unlimited',
    },
  },
}
