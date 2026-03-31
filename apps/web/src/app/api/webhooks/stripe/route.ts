import { NextResponse, type NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db, subscriptions, invoicesCache } from '@automec/db'
import { eq } from 'drizzle-orm'
import type Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const webhookSecret = process.env['STRIPE_WEBHOOK_SECRET']!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const entityId = sub.metadata['entityId']
      const entityType = sub.metadata['entityType']
      const planId = (sub.metadata['planId'] ?? 'enthusiast_free') as any

      if (!entityId || !entityType) break

      await db
        .insert(subscriptions)
        .values({
          entityId,
          entityType,
          planId,
          status: sub.status as any,
          stripeSubscriptionId: sub.id,
          stripeCustomerId: sub.customer as string,
          currentPeriodStart: new Date(sub.current_period_start * 1000),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
        })
        .onConflictDoUpdate({
          target: subscriptions.stripeSubscriptionId,
          set: {
            status: sub.status as any,
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            updatedAt: new Date(),
          },
        })
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await db
        .update(subscriptions)
        .set({ status: 'canceled', updatedAt: new Date() })
        .where(eq(subscriptions.stripeSubscriptionId, sub.id))
      break
    }

    case 'invoice.payment_succeeded':
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const entityId = (invoice.customer_email ?? invoice.metadata?.['entityId']) as string
      if (!entityId || !invoice.id) break

      await db
        .insert(invoicesCache)
        .values({
          stripeInvoiceId: invoice.id,
          entityId,
          entityType: 'user',
          amountDue: invoice.amount_due,
          amountPaid: invoice.amount_paid,
          status: invoice.status ?? 'unknown',
          pdfUrl: invoice.invoice_pdf,
          periodStart: invoice.period_start ? new Date(invoice.period_start * 1000) : null,
          periodEnd: invoice.period_end ? new Date(invoice.period_end * 1000) : null,
        })
        .onConflictDoNothing()
      break
    }
  }

  return NextResponse.json({ received: true })
}
