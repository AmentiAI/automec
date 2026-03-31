import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { parts } from './parts'
import { vehicleConfigs } from './vehicles'

export const fitmentRuleTypeEnum = pgEnum('fitment_rule_type', ['direct', 'conditional', 'exclude'])

export const fitmentRules = pgTable('fitment_rules', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  partId: text('part_id').notNull().references(() => parts.id, { onDelete: 'cascade' }),
  ruleType: fitmentRuleTypeEnum('rule_type').notNull().default('direct'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const fitmentRuleVehicleConfigs = pgTable('fitment_rule_vehicle_configs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  fitmentRuleId: text('fitment_rule_id').notNull().references(() => fitmentRules.id, { onDelete: 'cascade' }),
  vehicleConfigId: text('vehicle_config_id').notNull().references(() => vehicleConfigs.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const fitmentDependencies = pgTable('fitment_dependencies', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  fitmentRuleId: text('fitment_rule_id').notNull().references(() => fitmentRules.id, { onDelete: 'cascade' }),
  dependsOnPartId: text('depends_on_part_id').notNull().references(() => parts.id),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const fitmentConflicts = pgTable('fitment_conflicts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  fitmentRuleId: text('fitment_rule_id').notNull().references(() => fitmentRules.id, { onDelete: 'cascade' }),
  conflictsWithPartId: text('conflicts_with_part_id').notNull().references(() => parts.id),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const fitmentWarnings = pgTable('fitment_warnings', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  fitmentRuleId: text('fitment_rule_id').notNull().references(() => fitmentRules.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  severity: text('severity').notNull().default('warning'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Relations
export const fitmentRulesRelations = relations(fitmentRules, ({ one, many }) => ({
  part: one(parts, { fields: [fitmentRules.partId], references: [parts.id] }),
  vehicleConfigs: many(fitmentRuleVehicleConfigs),
  dependencies: many(fitmentDependencies),
  conflicts: many(fitmentConflicts),
  warnings: many(fitmentWarnings),
}))

export const fitmentRuleVehicleConfigsRelations = relations(fitmentRuleVehicleConfigs, ({ one }) => ({
  fitmentRule: one(fitmentRules, { fields: [fitmentRuleVehicleConfigs.fitmentRuleId], references: [fitmentRules.id] }),
  vehicleConfig: one(vehicleConfigs, { fields: [fitmentRuleVehicleConfigs.vehicleConfigId], references: [vehicleConfigs.id] }),
}))

export const fitmentDependenciesRelations = relations(fitmentDependencies, ({ one }) => ({
  fitmentRule: one(fitmentRules, { fields: [fitmentDependencies.fitmentRuleId], references: [fitmentRules.id] }),
  dependsOnPart: one(parts, { fields: [fitmentDependencies.dependsOnPartId], references: [parts.id] }),
}))

export const fitmentConflictsRelations = relations(fitmentConflicts, ({ one }) => ({
  fitmentRule: one(fitmentRules, { fields: [fitmentConflicts.fitmentRuleId], references: [fitmentRules.id] }),
  conflictingPart: one(parts, { fields: [fitmentConflicts.conflictsWithPartId], references: [parts.id] }),
}))
