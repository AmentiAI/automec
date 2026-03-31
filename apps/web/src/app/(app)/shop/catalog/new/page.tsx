import { requireUser } from '@/lib/auth'
import { db, brands, partCategories, shops, organizations, organizationMembers } from '@automec/db'
import { eq } from 'drizzle-orm'
import { CreatePartForm } from '@/components/shop/create-part-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function NewPartPage() {
  const user = await requireUser()

  const [membership] = await db
    .select({ shop: shops })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizationMembers.orgId, organizations.id))
    .innerJoin(shops, eq(organizations.id, shops.orgId))
    .where(eq(organizationMembers.userId, user.id))
    .limit(1)

  if (!membership) return null

  const [brandsList, categoriesList] = await Promise.all([
    db.select().from(brands),
    db.select().from(partCategories),
  ])

  return (
    <div className="max-w-2xl">
      <Link
        href="/shop/catalog"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to catalog
      </Link>

      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-500">Catalog</p>
        <h1 className="text-4xl font-extrabold tracking-tight">Add part</h1>
        <p className="mt-1 text-muted-foreground">Add a new part to your shop catalog.</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <CreatePartForm shopId={membership.shop.id} brands={brandsList} categories={categoriesList} />
      </div>
    </div>
  )
}
