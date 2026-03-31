import { pgTable, text, timestamp, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './auth'
import { parts } from './parts'
import { vehicleConfigs } from './vehicles'

export const lookupEvents = pgTable('lookup_events', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  shopId: text('shop_id'),
  partId: text('part_id').references(() => parts.id, { onDelete: 'set null' }),
  vehicleConfigId: text('vehicle_config_id').references(() => vehicleConfigs.id, { onDelete: 'set null' }),
  result: text('result'),
  ipHash: text('ip_hash'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const savedBuildEvents = pgTable('saved_build_events', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  garageVehicleId: text('garage_vehicle_id'),
  partId: text('part_id').references(() => parts.id, { onDelete: 'set null' }),
  action: text('action').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const quoteRequests = pgTable('quote_requests', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  shopId: text('shop_id'),
  partId: text('part_id').references(() => parts.id, { onDelete: 'set null' }),
  vehicleConfigId: text('vehicle_config_id'),
  message: text('message'),
  contactEmail: text('contact_email'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const apiKeys = pgTable('api_keys', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  shopId: text('shop_id').notNull(),
  name: text('name').notNull(),
  keyHash: text('key_hash').notNull().unique(),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: text('action').notNull(),
  entityType: text('entity_type'),
  entityId: text('entity_id'),
  metadata: jsonb('metadata'),
  ipHash: text('ip_hash'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
