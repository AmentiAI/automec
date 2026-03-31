import { pgTable, text, timestamp, boolean, integer, pgEnum, numeric } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users, organizations } from './auth'

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'trialing', 'active', 'past_due', 'canceled', 'incomplete', 'paused',
])

export const planIdEnum = pgEnum('plan_id', [
  'enthusiast_free', 'enthusiast_pro', 'shop_starter', 'shop_growth', 'shop_pro',
])

export const usageEventTypeEnum = pgEnum('usage_event_type', [
  'fitment_lookup', 'tune_request', 'catalog_import', 'api_call', 'shop_seat',
])

export const stripeCustomers = pgTable('stripe_customers', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  stripeCustomerId: text('stripe_customer_id').notNull().unique(),
  entityId: text('entity_id').notNull(),
  entityType: text('entity_type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  entityId: text('entity_id').notNull(),
  entityType: text('entity_type').notNull(),
  planId: planIdEnum('plan_id').notNull(),
  status: subscriptionStatusEnum('status').notNull(),
  stripeSubscriptionId: text('stripe_subscription_id').notNull().unique(),
  stripeCustomerId: text('stripe_customer_id').notNull(),
  currentPeriodStart: timestamp('current_period_start', { withTimezone: true }).notNull(),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }).notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').notNull().default(false),
  trialEnd: timestamp('trial_end', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const usageEvents = pgTable('usage_events', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  entityId: text('entity_id').notNull(),
  entityType: text('entity_type').notNull(),
  eventType: usageEventTypeEnum('event_type').notNull(),
  quantity: integer('quantity').notNull().default(1),
  metadata: text('metadata'),
  stripeUsageRecordId: text('stripe_usage_record_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const invoicesCache = pgTable('invoices_cache', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  stripeInvoiceId: text('stripe_invoice_id').notNull().unique(),
  entityId: text('entity_id').notNull(),
  entityType: text('entity_type').notNull(),
  amountDue: integer('amount_due').notNull(),
  amountPaid: integer('amount_paid').notNull(),
  status: text('status').notNull(),
  pdfUrl: text('pdf_url'),
  periodStart: timestamp('period_start', { withTimezone: true }),
  periodEnd: timestamp('period_end', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
