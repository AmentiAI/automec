import Stripe from 'stripe'

export const stripe = new Stripe(process.env['STRIPE_SECRET_KEY']!, {
  apiVersion: '2025-02-24.acacia',
})

export async function getOrCreateStripeCustomer(entityId: string, entityType: string, email: string, name?: string) {
  const { db, stripeCustomers } = await import('@automec/db')
  const { eq, and } = await import('drizzle-orm')

  const existing = await db
    .select()
    .from(stripeCustomers)
    .where(and(eq(stripeCustomers.entityId, entityId), eq(stripeCustomers.entityType, entityType)))
    .limit(1)

  if (existing[0]) return existing[0].stripeCustomerId

  const customer = await stripe.customers.create({ email, name, metadata: { entityId, entityType } })

  await db.insert(stripeCustomers).values({
    stripeCustomerId: customer.id,
    entityId,
    entityType,
  })

  return customer.id
}

export function formatAmount(cents: number, currency = 'usd') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100)
}
