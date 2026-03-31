'use server'

import { requireUser } from '@/lib/auth'
import {
  db, parts, fitmentRules, fitmentRuleVehicleConfigs,
  fitmentDependencies, fitmentConflicts, fitmentWarnings,
  shops, organizations, organizationMembers, tuneLicenseInventory,
} from '@automec/db'
import { eq } from 'drizzle-orm'
import {
  createPartSchema, updatePartSchema, createFitmentRuleSchema,
  type CreatePartInput, type UpdatePartInput, type CreateFitmentRuleInput,
} from '@automec/core/validators'
import { revalidatePath } from 'next/cache'

async function requireShopAccess(userId: string) {
  const [membership] = await db
    .select({ shop: shops })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizationMembers.orgId, organizations.id))
    .innerJoin(shops, eq(organizations.id, shops.orgId))
    .where(eq(organizationMembers.userId, userId))
    .limit(1)
  if (!membership) throw new Error('No shop access')
  return membership.shop
}

export async function createPartAction(input: CreatePartInput & { shopId: string }) {
  const user = await requireUser()
  await requireShopAccess(user.id)
  const data = createPartSchema.parse(input)

  await db.insert(parts).values({
    ...data,
    shopId: input.shopId,
    price: data.price?.toString(),
  })

  revalidatePath('/shop/catalog')
}

export async function updatePartAction(partId: string, input: UpdatePartInput) {
  const user = await requireUser()
  const shop = await requireShopAccess(user.id)
  const data = updatePartSchema.parse(input)

  // Verify part belongs to shop
  const [part] = await db.select().from(parts).where(eq(parts.id, partId)).limit(1)
  if (!part || part.shopId !== shop.id) throw new Error('Forbidden')

  await db.update(parts).set({
    ...data,
    price: data.price?.toString(),
    updatedAt: new Date(),
  }).where(eq(parts.id, partId))

  revalidatePath('/shop/catalog')
}

export async function createFitmentRuleAction(input: CreateFitmentRuleInput) {
  const user = await requireUser()
  await requireShopAccess(user.id)
  const data = createFitmentRuleSchema.parse(input)

  const [rule] = await db.insert(fitmentRules).values({
    partId: data.partId,
    ruleType: data.ruleType,
    notes: data.notes,
  }).returning()

  if (!rule) throw new Error('Failed to create fitment rule')

  // Link to vehicle configs
  if (data.vehicleConfigIds.length > 0) {
    await db.insert(fitmentRuleVehicleConfigs).values(
      data.vehicleConfigIds.map((vcId) => ({
        fitmentRuleId: rule.id,
        vehicleConfigId: vcId,
      })),
    )
  }

  // Add dependencies
  if (data.dependsOnPartIds && data.dependsOnPartIds.length > 0) {
    await db.insert(fitmentDependencies).values(
      data.dependsOnPartIds.map((pid) => ({
        fitmentRuleId: rule.id,
        dependsOnPartId: pid,
      })),
    )
  }

  // Add conflicts
  if (data.conflictsWithPartIds && data.conflictsWithPartIds.length > 0) {
    await db.insert(fitmentConflicts).values(
      data.conflictsWithPartIds.map((pid) => ({
        fitmentRuleId: rule.id,
        conflictsWithPartId: pid,
      })),
    )
  }

  // Add warnings
  if (data.warnings && data.warnings.length > 0) {
    await db.insert(fitmentWarnings).values(
      data.warnings.map((msg) => ({
        fitmentRuleId: rule.id,
        message: msg,
      })),
    )
  }

  revalidatePath('/shop/fitment')
}

export async function addLicenseAction(platform: string, licenseKey: string) {
  const user = await requireUser()
  const shop = await requireShopAccess(user.id)

  await db.insert(tuneLicenseInventory).values({
    shopId: shop.id,
    platform: platform as any,
    licenseKey,
  })

  revalidatePath('/shop/licenses')
}
