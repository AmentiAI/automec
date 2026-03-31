import { pgTable, text, timestamp, integer, boolean, numeric, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { parts } from './parts'
import { organizations, users } from './auth'

export const tunePlatformEnum = pgEnum('tune_platform', [
  'hp_tuners', 'ecutek', 'cobb', 'haltech', 'link', 'vi_pec', 'other',
])

export const tuneRequestStatusEnum = pgEnum('tune_request_status', [
  'pending', 'accepted', 'in_progress', 'waiting_datalog', 'revision', 'completed', 'cancelled',
])

export const tunePlatforms = pgTable('tune_platforms', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logoUrl: text('logo_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const partTuneRequirements = pgTable('part_tune_requirements', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  partId: text('part_id').notNull().references(() => parts.id, { onDelete: 'cascade' }),
  platformId: text('platform_id').references(() => tunePlatforms.id),
  isRequired: boolean('is_required').notNull().default(true),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const tuneRequests = pgTable('tune_requests', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  garageVehicleId: text('garage_vehicle_id').notNull(),
  customerId: text('customer_id').notNull().references(() => users.id),
  shopId: text('shop_id').references(() => organizations.id),
  tunerId: text('tuner_id').references(() => users.id),
  platform: tunePlatformEnum('platform').notNull(),
  status: tuneRequestStatusEnum('status').notNull().default('pending'),
  description: text('description'),
  powerGoalHp: integer('power_goal_hp'),
  budget: numeric('budget', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const tuneRequestMessages = pgTable('tune_request_messages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  tuneRequestId: text('tune_request_id').notNull().references(() => tuneRequests.id, { onDelete: 'cascade' }),
  senderId: text('sender_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  fileUrls: text('file_urls').array().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const tuneFiles = pgTable('tune_files', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  tuneRequestId: text('tune_request_id').notNull().references(() => tuneRequests.id, { onDelete: 'cascade' }),
  uploadedById: text('uploaded_by_id').notNull().references(() => users.id),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  version: integer('version').notNull().default(1),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const tuneLicenseInventory = pgTable('tune_license_inventory', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  shopId: text('shop_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  platform: tunePlatformEnum('platform').notNull(),
  licenseKey: text('license_key').notNull(),
  isAssigned: boolean('is_assigned').notNull().default(false),
  assignedToRequestId: text('assigned_to_request_id').references(() => tuneRequests.id),
  assignedAt: timestamp('assigned_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Relations
export const tuneRequestsRelations = relations(tuneRequests, ({ one, many }) => ({
  customer: one(users, { fields: [tuneRequests.customerId], references: [users.id] }),
  shop: one(organizations, { fields: [tuneRequests.shopId], references: [organizations.id] }),
  messages: many(tuneRequestMessages),
  files: many(tuneFiles),
  licenses: many(tuneLicenseInventory),
}))

export const tuneRequestMessagesRelations = relations(tuneRequestMessages, ({ one }) => ({
  tuneRequest: one(tuneRequests, { fields: [tuneRequestMessages.tuneRequestId], references: [tuneRequests.id] }),
  sender: one(users, { fields: [tuneRequestMessages.senderId], references: [users.id] }),
}))

export const tuneFilesRelations = relations(tuneFiles, ({ one }) => ({
  tuneRequest: one(tuneRequests, { fields: [tuneFiles.tuneRequestId], references: [tuneRequests.id] }),
  uploadedBy: one(users, { fields: [tuneFiles.uploadedById], references: [users.id] }),
}))

export const partTuneRequirementsRelations = relations(partTuneRequirements, ({ one }) => ({
  part: one(parts, { fields: [partTuneRequirements.partId], references: [parts.id] }),
  platform: one(tunePlatforms, { fields: [partTuneRequirements.platformId], references: [tunePlatforms.id] }),
}))
