import { eq, ilike, and, asc, desc } from 'drizzle-orm'
import { db } from '../client'
import { parts, brands, partCategories, partImages, partVariants } from '../schema/index'

export async function getPartBySlug(shopId: string, slug: string) {
  const rows = await db
    .select()
    .from(parts)
    .where(and(eq(parts.shopId, shopId), eq(parts.slug, slug)))
    .limit(1)
  return rows[0] ?? null
}

export async function getPartWithDetails(partId: string) {
  const [part, images, variants] = await Promise.all([
    db
      .select({ part: parts, brand: brands, category: partCategories })
      .from(parts)
      .leftJoin(brands, eq(parts.brandId, brands.id))
      .leftJoin(partCategories, eq(parts.categoryId, partCategories.id))
      .where(eq(parts.id, partId))
      .limit(1),
    db.select().from(partImages).where(eq(partImages.partId, partId)),
    db.select().from(partVariants).where(eq(partVariants.partId, partId)),
  ])
  if (!part[0]) return null
  return { ...part[0], images, variants }
}

export async function getPartsByShop(shopId: string) {
  return db
    .select({ part: parts, brand: brands })
    .from(parts)
    .leftJoin(brands, eq(parts.brandId, brands.id))
    .where(eq(parts.shopId, shopId))
    .orderBy(desc(parts.createdAt))
}

export async function searchParts(shopId: string, query: string) {
  return db
    .select()
    .from(parts)
    .where(and(eq(parts.shopId, shopId), ilike(parts.name, `%${query}%`)))
    .limit(20)
}

export async function createPart(data: typeof parts.$inferInsert) {
  const rows = await db.insert(parts).values(data).returning()
  return rows[0]!
}

export async function updatePart(partId: string, data: Partial<typeof parts.$inferInsert>) {
  const rows = await db.update(parts).set(data).where(eq(parts.id, partId)).returning()
  return rows[0] ?? null
}
