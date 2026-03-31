import { pgTable, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { organizations } from './auth'

export const shopVerificationStatusEnum = pgEnum('shop_verification_status', [
  'pending', 'verified', 'rejected',
])

export const shops = pgTable('shops', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  orgId: text('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }).unique(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  logoUrl: text('logo_url'),
  websiteUrl: text('website_url'),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  country: text('country').notNull().default('US'),
  verificationStatus: shopVerificationStatusEnum('verification_status').notNull().default('pending'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const shopsRelations = relations(shops, ({ one }) => ({
  org: one(organizations, { fields: [shops.orgId], references: [organizations.id] }),
}))
