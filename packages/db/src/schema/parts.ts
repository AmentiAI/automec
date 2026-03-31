import { pgTable, text, timestamp, integer, boolean, numeric, jsonb, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { organizations } from './auth'

export const partConditionEnum = pgEnum('part_condition', ['new', 'used', 'remanufactured'])

export const brands = pgTable('brands', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logoUrl: text('logo_url'),
  websiteUrl: text('website_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const partCategories = pgTable('part_categories', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  parentId: text('parent_id'),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const parts = pgTable('parts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brandId: text('brand_id').notNull().references(() => brands.id),
  categoryId: text('category_id').notNull().references(() => partCategories.id),
  shopId: text('shop_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  sku: text('sku'),
  partNumber: text('part_number'),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }),
  condition: partConditionEnum('condition').notNull().default('new'),
  isActive: boolean('is_active').notNull().default(true),
  isTuneRequired: boolean('is_tune_required').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const partVariants = pgTable('part_variants', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  partId: text('part_id').notNull().references(() => parts.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  sku: text('sku'),
  price: numeric('price', { precision: 10, scale: 2 }),
  attributes: jsonb('attributes').$type<Record<string, string>>().notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const partImages = pgTable('part_images', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  partId: text('part_id').notNull().references(() => parts.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  altText: text('alt_text'),
  sortOrder: integer('sort_order').notNull().default(0),
  isPrimary: boolean('is_primary').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const partAttributes = pgTable('part_attributes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  partId: text('part_id').notNull().references(() => parts.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  value: text('value').notNull(),
  unit: text('unit'),
})

// Relations
export const brandsRelations = relations(brands, ({ many }) => ({
  parts: many(parts),
}))

export const partCategoriesRelations = relations(partCategories, ({ many }) => ({
  parts: many(parts),
}))

export const partsRelations = relations(parts, ({ one, many }) => ({
  brand: one(brands, { fields: [parts.brandId], references: [brands.id] }),
  category: one(partCategories, { fields: [parts.categoryId], references: [partCategories.id] }),
  shop: one(organizations, { fields: [parts.shopId], references: [organizations.id] }),
  variants: many(partVariants),
  images: many(partImages),
  attributes: many(partAttributes),
}))

export const partVariantsRelations = relations(partVariants, ({ one }) => ({
  part: one(parts, { fields: [partVariants.partId], references: [parts.id] }),
}))

export const partImagesRelations = relations(partImages, ({ one }) => ({
  part: one(parts, { fields: [partImages.partId], references: [parts.id] }),
}))
