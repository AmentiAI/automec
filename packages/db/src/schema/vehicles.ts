import { pgTable, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const fuelTypeEnum = pgEnum('fuel_type', ['gasoline', 'diesel', 'hybrid', 'electric', 'flex'])
export const aspirationEnum = pgEnum('aspiration', ['na', 'turbo', 'supercharged', 'twinturbo'])
export const transmissionTypeEnum = pgEnum('transmission_type', ['manual', 'automatic', 'dct', 'cvt'])
export const drivetrainEnum = pgEnum('drivetrain', ['fwd', 'rwd', 'awd', '4wd'])

export const makes = pgTable('makes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logoUrl: text('logo_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const models = pgTable('models', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  makeId: text('make_id').notNull().references(() => makes.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const generations = pgTable('generations', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  modelId: text('model_id').notNull().references(() => models.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  yearStart: integer('year_start').notNull(),
  yearEnd: integer('year_end'),
  bodyStyle: text('body_style'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const trims = pgTable('trims', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  generationId: text('generation_id').notNull().references(() => generations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  market: text('market'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const engines = pgTable('engines', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  displacement: text('displacement'),
  cylinders: integer('cylinders'),
  fuelType: fuelTypeEnum('fuel_type').notNull().default('gasoline'),
  aspiration: aspirationEnum('aspiration'),
  powerHp: integer('power_hp'),
  torqueNm: integer('torque_nm'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const transmissions = pgTable('transmissions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  type: transmissionTypeEnum('type').notNull(),
  speeds: integer('speeds'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const vehicleConfigs = pgTable('vehicle_configs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  generationId: text('generation_id').notNull().references(() => generations.id, { onDelete: 'cascade' }),
  trimId: text('trim_id').references(() => trims.id),
  engineId: text('engine_id').notNull().references(() => engines.id),
  transmissionId: text('transmission_id').references(() => transmissions.id),
  drivetrain: drivetrainEnum('drivetrain').notNull(),
  yearStart: integer('year_start').notNull(),
  yearEnd: integer('year_end'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Relations
export const makesRelations = relations(makes, ({ many }) => ({
  models: many(models),
}))

export const modelsRelations = relations(models, ({ one, many }) => ({
  make: one(makes, { fields: [models.makeId], references: [makes.id] }),
  generations: many(generations),
}))

export const generationsRelations = relations(generations, ({ one, many }) => ({
  model: one(models, { fields: [generations.modelId], references: [models.id] }),
  trims: many(trims),
  vehicleConfigs: many(vehicleConfigs),
}))

export const trimsRelations = relations(trims, ({ one }) => ({
  generation: one(generations, { fields: [trims.generationId], references: [generations.id] }),
}))

export const vehicleConfigsRelations = relations(vehicleConfigs, ({ one }) => ({
  generation: one(generations, { fields: [vehicleConfigs.generationId], references: [generations.id] }),
  trim: one(trims, { fields: [vehicleConfigs.trimId], references: [trims.id] }),
  engine: one(engines, { fields: [vehicleConfigs.engineId], references: [engines.id] }),
  transmission: one(transmissions, { fields: [vehicleConfigs.transmissionId], references: [transmissions.id] }),
}))
