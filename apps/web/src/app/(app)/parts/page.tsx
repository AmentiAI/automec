import { db, parts, brands, partCategories } from '@automec/db'
import { eq, and, ilike } from 'drizzle-orm'
import Link from 'next/link'
import { Button } from '@automec/ui'
import { FitmentBadge } from '@automec/ui'
import { checkFitment } from '@automec/core/fitment'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import type { FitmentStatus } from '@automec/types'

interface Props {
  searchParams: Promise<{ q?: string; vehicleConfigId?: string; categoryId?: string; addTo?: string }>
}

export default async function PartsPage({ searchParams }: Props) {
  const params = await searchParams
  const { q, vehicleConfigId, categoryId, addTo } = params

  const partsList = await db
    .select({ part: parts, brand: brands, category: partCategories })
    .from(parts)
    .leftJoin(brands, eq(parts.brandId, brands.id))
    .leftJoin(partCategories, eq(parts.categoryId, partCategories.id))
    .where(
      and(
        eq(parts.isActive, true),
        q ? ilike(parts.name, `%${q}%`) : undefined,
        categoryId ? eq(parts.categoryId, categoryId) : undefined,
      ),
    )
    .limit(50)

  const categories = await db.select().from(partCategories)

  return (
    <div>
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-500">Catalog</p>
        <h1 className="text-4xl font-extrabold tracking-tight">Parts catalog</h1>
        {vehicleConfigId && (
          <p className="mt-1 text-muted-foreground">Showing fitment status for your vehicle</p>
        )}
      </div>

      {/* Category filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href={vehicleConfigId ? `/parts?vehicleConfigId=${vehicleConfigId}` : '/parts'}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-secondary ${
            !categoryId ? 'border-amber-500/50 bg-amber-500/10 text-amber-400' : 'border-border/60 text-muted-foreground'
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/parts?categoryId=${cat.id}${vehicleConfigId ? `&vehicleConfigId=${vehicleConfigId}` : ''}`}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-secondary ${
              cat.id === categoryId
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                : 'border-border/60 text-muted-foreground'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {partsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/50 px-8 py-24 text-center">
          <ShoppingBag className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-semibold">No parts found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different category or search term.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {partsList.map(({ part, brand, category }) => (
            <PartCard
              key={part.id}
              part={part}
              brandName={brand?.name}
              categoryName={category?.name}
              vehicleConfigId={vehicleConfigId}
              addTo={addTo}
            />
          ))}
        </div>
      )}
    </div>
  )
}

async function PartCard({
  part,
  brandName,
  categoryName,
  vehicleConfigId,
  addTo,
}: {
  part: typeof parts.$inferSelect
  brandName?: string
  categoryName?: string
  vehicleConfigId?: string
  addTo?: string
}) {
  let fitmentStatus: FitmentStatus | undefined
  if (vehicleConfigId) {
    const result = await checkFitment({ partId: part.id, vehicleConfigId })
    fitmentStatus = result.status
  }

  return (
    <div className="group flex flex-col rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-amber-500/40 hover:shadow-[0_0_30px_-10px_hsl(38_92%_52%_/_0.15)]">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold leading-tight">
            {brandName && <span className="text-amber-400">{brandName} </span>}
            {part.name}
          </h3>
          {categoryName && <p className="mt-0.5 text-xs text-muted-foreground">{categoryName}</p>}
        </div>
        {fitmentStatus && <FitmentBadge status={fitmentStatus} />}
      </div>

      <div className="mb-4 mt-auto flex items-center justify-between">
        <div className="text-xl font-black">
          {part.price ? `$${Number(part.price).toFixed(2)}` : <span className="text-base font-normal text-muted-foreground">Price on request</span>}
        </div>
        {part.isTuneRequired && (
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400">
            Tune req.
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outline" asChild className="flex-1 border-border/60">
          <Link href={`/parts/${part.id}${vehicleConfigId ? `?vehicleConfigId=${vehicleConfigId}` : ''}`}>
            Details
          </Link>
        </Button>
        {addTo && (
          <Button size="sm" asChild className="flex-1 bg-amber-500 text-black hover:bg-amber-400">
            <Link href={`/parts/${part.id}?addTo=${addTo}&vehicleConfigId=${vehicleConfigId ?? ''}`}>
              Add to build
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
