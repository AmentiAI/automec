import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db, makes, models, generations, vehicleConfigs, engines, fitmentRuleVehicleConfigs, fitmentRules, parts, brands } from '@automec/db'
import { eq, and } from 'drizzle-orm'
import Link from 'next/link'
import { Button } from '@automec/ui'
import { ArrowRight, ChevronRight } from 'lucide-react'

interface Props {
  params: Promise<{ year: string; make: string; model: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, make, model } = await params
  const makeSlug = decodeURIComponent(make)
  const modelSlug = decodeURIComponent(model)
  return {
    title: `${year} ${makeSlug} ${modelSlug} — Parts, Fitment & Tuning`,
    description: `Find compatible parts, check fitment, and find tuners for your ${year} ${makeSlug} ${modelSlug}.`,
    openGraph: { title: `${year} ${makeSlug} ${modelSlug} — Automec` },
  }
}

export default async function VehicleSeoPage({ params }: Props) {
  const { year, make: makeSlug, model: modelSlug } = await params
  const yearNum = parseInt(year)

  const [makeRow] = await db.select().from(makes).where(eq(makes.slug, makeSlug)).limit(1)
  if (!makeRow) notFound()

  const [modelRow] = await db
    .select()
    .from(models)
    .where(and(eq(models.makeId, makeRow.id), eq(models.slug, modelSlug)))
    .limit(1)
  if (!modelRow) notFound()

  const gens = await db.select().from(generations).where(eq(generations.modelId, modelRow.id))
  const validGens = gens.filter((g) => g.yearStart <= yearNum && (!g.yearEnd || g.yearEnd >= yearNum))
  const gen = validGens[0]

  const configs = gen
    ? await db
        .select({ config: vehicleConfigs, engine: engines })
        .from(vehicleConfigs)
        .leftJoin(engines, eq(vehicleConfigs.engineId, engines.id))
        .where(eq(vehicleConfigs.generationId, gen.id))
    : []

  const compatibleParts = configs[0]
    ? await db
        .select({ part: parts, brand: brands })
        .from(fitmentRuleVehicleConfigs)
        .innerJoin(fitmentRules, eq(fitmentRuleVehicleConfigs.fitmentRuleId, fitmentRules.id))
        .innerJoin(parts, eq(fitmentRules.partId, parts.id))
        .leftJoin(brands, eq(parts.brandId, brands.id))
        .where(eq(fitmentRuleVehicleConfigs.vehicleConfigId, configs[0].config.id))
        .limit(12)
    : []

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,hsl(38_92%_52%_/_0.08),transparent)]" />

      <div className="container relative mx-auto max-w-5xl px-6 py-16">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/vehicles" className="hover:text-foreground transition-colors">Vehicles</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/vehicles/${makeRow.slug}`} className="hover:text-foreground transition-colors">{makeRow.name}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{year} {makeRow.name} {modelRow.name}</span>
        </div>

        <div className="mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-500">Vehicle</p>
          <h1 className="text-5xl font-extrabold tracking-tight">
            {year} {makeRow.name} {modelRow.name}
          </h1>
          {gen && (
            <p className="mt-2 text-lg text-muted-foreground">{gen.name} · {gen.bodyStyle}</p>
          )}
        </div>

        {/* Engine configs */}
        {configs.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-4 text-xl font-bold">Configurations</h2>
            <div className="flex flex-wrap gap-2">
              {configs.map(({ config, engine }) => (
                <div key={config.id} className="rounded-lg border border-border/60 bg-card px-3 py-2 text-sm font-medium">
                  {engine?.name ?? 'Unknown engine'} · <span className="font-mono text-xs">{config.drivetrain.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compatible parts */}
        {compatibleParts.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-4 text-xl font-bold">Compatible parts</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {compatibleParts.map(({ part, brand }) => (
                <Link
                  key={part.id}
                  href={`/parts/${part.id}`}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3.5 transition-all hover:border-amber-500/40"
                >
                  <div>
                    <div className="font-semibold">
                      {brand?.name && <span className="text-amber-400">{brand.name} </span>}
                      {part.name}
                    </div>
                    {part.price && (
                      <div className="mt-0.5 text-sm font-mono text-muted-foreground">
                        ${Number(part.price).toFixed(2)}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8">
          <h3 className="mb-2 text-xl font-bold">Own a {year} {makeRow.name} {modelRow.name}?</h3>
          <p className="mb-5 text-muted-foreground">
            Track your build, check fitment on every part, and connect with tuners who know this platform.
          </p>
          <Button asChild className="bg-amber-500 text-black hover:bg-amber-400 font-semibold">
            <Link href="/sign-up">
              Add your car free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
