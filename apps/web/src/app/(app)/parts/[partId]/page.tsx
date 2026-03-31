import { notFound } from 'next/navigation'
import { db, parts, brands, partCategories, partImages, partVariants, partTuneRequirements, tunePlatforms } from '@automec/db'
import { eq } from 'drizzle-orm'
import Image from 'next/image'
import { Button } from '@automec/ui'
import { FitmentBadge } from '@automec/ui'
import { checkFitment } from '@automec/core/fitment'
import { explainFitmentResult } from '@/lib/openai'
import { AddToGarageButton } from '@/components/parts/add-to-garage-button'
import { RequestQuoteButton } from '@/components/parts/request-quote-button'
import { Package, Zap, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: Promise<{ partId: string }>
  searchParams: Promise<{ vehicleConfigId?: string; addTo?: string }>
}

export default async function PartDetailPage({ params, searchParams }: Props) {
  const { partId } = await params
  const { vehicleConfigId, addTo } = await searchParams

  const [partRow] = await db
    .select({ part: parts, brand: brands, category: partCategories })
    .from(parts)
    .leftJoin(brands, eq(parts.brandId, brands.id))
    .leftJoin(partCategories, eq(parts.categoryId, partCategories.id))
    .where(eq(parts.id, partId))
    .limit(1)

  if (!partRow) notFound()

  const [images, variants, tuneReqs] = await Promise.all([
    db.select().from(partImages).where(eq(partImages.partId, partId)),
    db.select().from(partVariants).where(eq(partVariants.partId, partId)),
    db
      .select({ req: partTuneRequirements, platform: tunePlatforms })
      .from(partTuneRequirements)
      .leftJoin(tunePlatforms, eq(partTuneRequirements.platformId, tunePlatforms.id))
      .where(eq(partTuneRequirements.partId, partId)),
  ])

  let fitmentResult = null
  let fitmentExplanation = null
  if (vehicleConfigId) {
    fitmentResult = await checkFitment({ partId, vehicleConfigId })
    if (fitmentResult) {
      fitmentExplanation = await explainFitmentResult(
        `${partRow.brand?.name ?? ''} ${partRow.part.name}`,
        'your vehicle',
        fitmentResult,
      ).catch(() => null)
    }
  }

  const primaryImage = images.find((i) => i.isPrimary) ?? images[0]

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/parts"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to catalog
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Images */}
        <div>
          {primaryImage ? (
            <div className="aspect-square overflow-hidden rounded-2xl border border-border/60">
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText ?? partRow.part.name}
                width={600}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card">
              <div className="text-center">
                <Package className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No image</p>
              </div>
            </div>
          )}
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img) => (
                <div key={img.id} className="aspect-square h-16 shrink-0 overflow-hidden rounded-lg border border-border/60">
                  <Image src={img.url} alt={img.altText ?? ''} width={64} height={64} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            {partRow.category?.name && <span>{partRow.category.name}</span>}
            {partRow.category?.name && partRow.brand?.name && <span>·</span>}
            {partRow.brand?.name && <span className="font-medium text-amber-400">{partRow.brand.name}</span>}
          </div>

          <h1 className="mb-1 text-3xl font-extrabold tracking-tight">{partRow.part.name}</h1>
          {partRow.part.partNumber && (
            <div className="mb-4 text-sm text-muted-foreground font-mono">Part #: {partRow.part.partNumber}</div>
          )}

          <div className="mb-6 text-4xl font-black">
            {partRow.part.price
              ? `$${Number(partRow.part.price).toFixed(2)}`
              : <span className="text-2xl font-semibold text-muted-foreground">Contact for price</span>
            }
          </div>

          {/* Fitment result */}
          {fitmentResult && (
            <div className="mb-4 rounded-xl border border-border/60 bg-card p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-semibold">Fitment check:</span>
                <FitmentBadge status={fitmentResult.status} />
              </div>
              {fitmentExplanation && (
                <p className="text-sm leading-relaxed text-muted-foreground">{fitmentExplanation}</p>
              )}
              {fitmentResult.requiredParts.length > 0 && (
                <div className="mt-2 flex items-start gap-1.5 text-sm">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                  <span className="text-muted-foreground">
                    Also needed: {fitmentResult.requiredParts.map((p) => p.name).join(', ')}
                  </span>
                </div>
              )}
              {fitmentResult.conditions.map((c) => (
                <div key={c} className="mt-1 flex items-start gap-1.5 text-sm">
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                  <span className="text-muted-foreground">{c}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tune required */}
          {(partRow.part.isTuneRequired || tuneReqs.length > 0) && (
            <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
              <Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <div>
                <div className="text-sm font-semibold text-amber-400">Tune required</div>
                {tuneReqs.length > 0 && (
                  <div className="mt-0.5 text-sm text-muted-foreground">
                    Compatible platforms: {tuneReqs.filter((r) => r.platform).map((r) => r.platform!.name).join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mb-6 flex gap-3">
            {addTo && vehicleConfigId ? (
              <AddToGarageButton partId={partId} garageVehicleId={addTo} price={partRow.part.price?.toString()} />
            ) : (
              <Button size="lg" className="flex-1 bg-amber-500 text-black hover:bg-amber-400 font-semibold">
                Buy now
              </Button>
            )}
            <RequestQuoteButton partId={partId} shopId={partRow.part.shopId} />
          </div>

          {/* Description */}
          {partRow.part.description && (
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Description</h3>
              <p className="text-sm leading-relaxed">{partRow.part.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
