import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db, parts, brands, partCategories, partImages } from '@automec/db'
import { eq } from 'drizzle-orm'
import Image from 'next/image'
import { Button } from '@automec/ui'
import Link from 'next/link'
import { ArrowRight, Package, Zap } from 'lucide-react'

interface Props {
  params: Promise<{ partId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { partId } = await params
  const [row] = await db
    .select({ part: parts, brand: brands })
    .from(parts)
    .leftJoin(brands, eq(parts.brandId, brands.id))
    .where(eq(parts.id, partId))
    .limit(1)

  if (!row) return { title: 'Part not found' }
  return {
    title: `${row.brand?.name} ${row.part.name} — Automec`,
    description: row.part.description ?? `View fitment, pricing, and compatibility for the ${row.brand?.name} ${row.part.name}.`,
  }
}

export default async function PublicPartPage({ params }: Props) {
  const { partId } = await params

  const [row] = await db
    .select({ part: parts, brand: brands, category: partCategories })
    .from(parts)
    .leftJoin(brands, eq(parts.brandId, brands.id))
    .leftJoin(partCategories, eq(parts.categoryId, partCategories.id))
    .where(eq(parts.id, partId))
    .limit(1)

  if (!row || !row.part.isActive) notFound()

  const images = await db.select().from(partImages).where(eq(partImages.partId, partId))
  const primaryImage = images.find((i) => i.isPrimary) ?? images[0]

  return (
    <div className="relative min-h-screen py-16">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,hsl(38_92%_52%_/_0.08),transparent)]" />

      <div className="container relative mx-auto max-w-5xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image */}
          {primaryImage ? (
            <div className="aspect-square overflow-hidden rounded-2xl border border-border/60">
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText ?? row.part.name}
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

          {/* Details */}
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              {row.category?.name && <span>{row.category.name}</span>}
              {row.category?.name && row.brand?.name && <span>·</span>}
              {row.brand?.name && <span className="font-medium text-amber-400">{row.brand.name}</span>}
            </div>

            <h1 className="mb-5 text-4xl font-extrabold tracking-tight">{row.part.name}</h1>

            <div className="mb-5 text-4xl font-black">
              {row.part.price
                ? `$${Number(row.part.price).toFixed(2)}`
                : <span className="text-2xl font-semibold text-muted-foreground">Contact for price</span>
              }
            </div>

            {row.part.isTuneRequired && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold text-amber-400">Tune required with this part</span>
              </div>
            )}

            {row.part.description && (
              <p className="mb-6 leading-relaxed text-muted-foreground">{row.part.description}</p>
            )}

            <Button asChild className="w-full bg-amber-500 text-black hover:bg-amber-400 font-semibold h-12 text-base">
              <Link href={`/sign-up?part=${partId}`}>
                Check fitment for my car
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <p className="mt-3 text-center text-sm text-muted-foreground">
              Free account. No credit card.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
