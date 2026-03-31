import { pgTable, text, timestamp, integer, boolean, numeric, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './auth'
import { vehicleConfigs, makes, models } from './vehicles'
import { parts } from './parts'
import { partVariants } from './parts'

export const dynoTypeEnum = pgEnum('dyno_type', ['hub', 'roller', 'engine'])

export const garages = pgTable('garages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull().default('My Garage'),
  isPublic: boolean('is_public').notNull().default(false),
  slug: text('slug').unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const garageVehicles = pgTable('garage_vehicles', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  garageId: text('garage_id').notNull().references(() => garages.id, { onDelete: 'cascade' }),
  vehicleConfigId: text('vehicle_config_id').references(() => vehicleConfigs.id),
  makeId: text('make_id').references(() => makes.id),
  modelId: text('model_id').references(() => models.id),
  year: integer('year').notNull(),
  nickname: text('nickname'),
  color: text('color'),
  mileage: integer('mileage'),
  powerGoalHp: integer('power_goal_hp'),
  notes: text('notes'),
  isPublic: boolean('is_public').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const installedParts = pgTable('installed_parts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  garageVehicleId: text('garage_vehicle_id').notNull().references(() => garageVehicles.id, { onDelete: 'cascade' }),
  partId: text('part_id').notNull().references(() => parts.id),
  variantId: text('variant_id').references(() => partVariants.id),
  installedAt: timestamp('installed_at', { withTimezone: true }),
  notes: text('notes'),
  priceAtInstall: numeric('price_at_install', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const maintenanceLogs = pgTable('maintenance_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  garageVehicleId: text('garage_vehicle_id').notNull().references(() => garageVehicles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  mileage: integer('mileage'),
  performedAt: timestamp('performed_at', { withTimezone: true }).notNull(),
  cost: numeric('cost', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const dynoRuns = pgTable('dyno_runs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  garageVehicleId: text('garage_vehicle_id').notNull().references(() => garageVehicles.id, { onDelete: 'cascade' }),
  dynoType: dynoTypeEnum('dyno_type').notNull(),
  peakHp: integer('peak_hp'),
  peakTq: integer('peak_tq'),
  fileUrl: text('file_url'),
  notes: text('notes'),
  performedAt: timestamp('performed_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Relations
export const garagesRelations = relations(garages, ({ one, many }) => ({
  user: one(users, { fields: [garages.userId], references: [users.id] }),
  vehicles: many(garageVehicles),
}))

export const garageVehiclesRelations = relations(garageVehicles, ({ one, many }) => ({
  garage: one(garages, { fields: [garageVehicles.garageId], references: [garages.id] }),
  vehicleConfig: one(vehicleConfigs, { fields: [garageVehicles.vehicleConfigId], references: [vehicleConfigs.id] }),
  installedParts: many(installedParts),
  maintenanceLogs: many(maintenanceLogs),
  dynoRuns: many(dynoRuns),
}))

export const installedPartsRelations = relations(installedParts, ({ one }) => ({
  garageVehicle: one(garageVehicles, { fields: [installedParts.garageVehicleId], references: [garageVehicles.id] }),
  part: one(parts, { fields: [installedParts.partId], references: [parts.id] }),
  variant: one(partVariants, { fields: [installedParts.variantId], references: [partVariants.id] }),
}))
