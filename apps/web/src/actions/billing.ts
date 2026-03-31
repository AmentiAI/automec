'use server'

import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { stripe, getOrCreateStripeCustomer } from '@/lib/stripe'
import { PLANS } from '@automec/types'
import type { PlanId } from '@automec/types'

const PRICE_MAP: Record<string, string | undefined> = {
  enthusiast_pro: process.env['STRIPE_PRICE_ENTHUSIAST_PRO'],
  shop_starter: process.env['STRIPE_PRICE_SHOP_STARTER'],
  shop_growth: process.env['STRIPE_PRICE_SHOP_GROWTH'],
  shop_pro: process.env['STRIPE_PRICE_SHOP_PRO'],
}

export async function createCheckoutAction(planId: PlanId) {
  const user = await requireUser()
  const plan = PLANS[planId]
  const priceId = PRICE_MAP[planId]

  if (!priceId) throw new Error(`No price configured for plan: ${planId}`)

  const customerId = await getOrCreateStripeCustomer(user.id, 'user', user.email, user.name ?? undefined)

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 14,
      metadata: { entityId: user.id, entityType: 'user', planId },
    },
    success_url: `${process.env['NEXT_PUBLIC_APP_URL']}/billing?success=1`,
    cancel_url: `${process.env['NEXT_PUBLIC_APP_URL']}/billing`,
  })

  redirect(session.url!)
}

export async function createPortalAction() {
  const user = await requireUser()
  const customerId = await getOrCreateStripeCustomer(user.id, 'user', user.email, user.name ?? undefined)

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env['NEXT_PUBLIC_APP_URL']}/billing`,
  })

  redirect(session.url)
}
