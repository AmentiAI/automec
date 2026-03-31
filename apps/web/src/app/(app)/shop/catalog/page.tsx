import { requireUser } from '@/lib/auth'
import { db, parts, brands, partCategories, shops, organizations, organizationMembers } from '@automec/db'
import { eq, desc } from 'drizzle-orm'
import { Button } from '@automec/ui'
import Link from 'next/link'
import { Plus, Upload, Package } from 'lucide-react'
import { format } from 'date-fns'

export default async function ShopCatalogPage() {
  const user = await requireUser()

  const [membership] = await db
    .select({ shop: shops })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizationMembers.orgId, organizations.id))
    .innerJoin(shops, eq(organizations.id, shops.orgId))
    .where(eq(organizationMembers.userId, user.id))
    .limit(1)

  if (!membership) return null

  const partsList = await db
    .select({ part: parts, brand: brands, category: partCategories })
    .from(parts)
    .leftJoin(brands, eq(parts.brandId, brands.id))
    .leftJoin(partCategories, eq(parts.categoryId, partCategories.id))
    .where(eq(parts.shopId, membership.shop.id))
    .orderBy(desc(parts.createdAt))
    .limit(100)

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-500">Shop</p>
          <h1 className="text-4xl font-extrabold tracking-tight">Parts catalog</h1>
          <p className="mt-1 text-muted-foreground">{partsList.length} parts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-border/60">
            <Upload className="mr-1.5 h-4 w-4" />
            Import CSV
          </Button>
          <Button size="sm" asChild className="bg-amber-500 text-black hover:bg-amber-400 font-semibold">
            <Link href="/shop/catalog/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Add part
            </Link>
          </Button>
        </div>
      </div>

      {partsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/50 px-8 py-24 text-center">
          <Package className="mb-3 h-8 w-8 text-muted-foreground" />
          <h3 className="mb-2 text-xl font-bold">No parts yet</h3>
          <p className="mb-6 text-muted-foreground">Add your first part or import a CSV catalog.</p>
          <Button asChild className="bg-amber-500 text-black hover:bg-amber-400 font-semibold">
            <Link href="/shop/catalog/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Add your first part
            </Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-secondary/50">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Part</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Price</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Added</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {partsList.map(({ part, brand, category }) => (
                <tr key={part.id} className="border-b border-border/40 transition-colors last:border-0 hover:bg-secondary/30">
                  <td className="px-5 py-4">
                    <div className="font-semibold">
                      {brand?.name && <span className="text-amber-400">{brand.name} </span>}
                      {part.name}
                    </div>
                    {part.sku && <div className="mt-0.5 text-xs text-muted-foreground">SKU: {part.sku}</div>}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{category?.name ?? '—'}</td>
                  <td className="px-5 py-4 font-mono font-semibold">
                    {part.price ? `$${Number(part.price).toFixed(2)}` : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${part.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-500/20 text-zinc-400'}`}>
                        {part.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {part.isTuneRequired && (
                        <span className="rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-400">
                          Tune req.
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{format(part.createdAt, 'MMM d, yyyy')}</td>
                  <td className="px-5 py-4">
                    <Button variant="ghost" size="sm" asChild className="text-xs">
                      <Link href={`/shop/catalog/${part.id}`}>Edit</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
