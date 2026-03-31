import { pgTable, text, timestamp, pgEnum, boolean } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const userRoleEnum = pgEnum('user_role', ['customer', 'shop_owner', 'tuner', 'admin'])
export const orgRoleEnum = pgEnum('org_role', ['owner', 'admin', 'member'])
export const orgTypeEnum = pgEnum('org_type', ['shop', 'tuner_shop'])

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  role: userRoleEnum('role').notNull().default('customer'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const organizations = pgTable('organizations', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  clerkOrgId: text('clerk_org_id').unique(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  type: orgTypeEnum('type').notNull().default('shop'),
  logoUrl: text('logo_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const organizationMembers = pgTable('organization_members', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  orgId: text('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  role: orgRoleEnum('role').notNull().default('member'),
  joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orgMembers: many(organizationMembers),
}))

export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(organizationMembers),
}))

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  user: one(users, { fields: [organizationMembers.userId], references: [users.id] }),
  org: one(organizations, { fields: [organizationMembers.orgId], references: [organizations.id] }),
}))
