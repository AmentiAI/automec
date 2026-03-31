import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db, users, garages, garageVehicles, installedParts, parts, brands, makes, models, dynoRuns } from '@automec/db'
import { eq, and } from 'drizzle-orm'
import Link from 'next/link'
import { Zap, Wrench, Trophy, ArrowLeft } from 'lucide-react'

interface Props {
  params: Promise<{ username: string; vehicle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, vehicle } = await params
  return {
    title: `${username}'s ${decodeURIComponent(vehicle)} build`,
    description: `See ${username}'s build list, mods, and dyno numbers on Automec.`,
  }
}

export default async function PublicBuildPage({ params }: Props) {
  const { username, vehicle: vehicleSlug } = await params

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.name, decodeURIComponent(username)))
    .limit(1)

  if (!user) notFound()

  const [garage] = await db
    .select()
    .from(garages)
    .where(and(eq(garages.userId, user.id), eq(garages.isPublic, true)))
    .limit(1)

  if (!garage) notFound()

  const vehicles = await db
    .select({ vehicle: garageVehicles, make: makes, model: models })
    .from(garageVehicles)
    .leftJoin(makes, eq(garageVehicles.makeId, makes.id))
    .leftJoin(models, eq(garageVehicles.modelId, models.id))
    .where(and(eq(garageVehicles.garageId, garage.id), eq(garageVehicles.isPublic, true)))

  const vehicleRow = vehicles.find(
    (v) => `${v.vehicle.year}-${v.make?.slug ?? ''}-${v.model?.slug ?? ''}` === vehicleSlug,
  )

  if (!vehicleRow) notFound()

  const [installedList, dynos] = await Promise.all([
    db
      .select({ ip: installedParts, part: parts, brand: brands })
      .from(installedParts)
      .leftJoin(parts, eq(installedParts.partId, parts.id))
      .leftJoin(brands, eq(parts.brandId, brands.id))
      .where(eq(installedParts.garageVehicleId, vehicleRow.vehicle.id)),
    db.select().from(dynoRuns).where(eq(dynoRuns.garageVehicleId, vehicleRow.vehicle.id)),
  ])

  const vehicleName = `${vehicleRow.vehicle.year} ${vehicleRow.make?.name ?? ''} ${vehicleRow.model?.name ?? ''}`
  const bestDyno = dynos.reduce<(typeof dynos)[0] | null>(
    (a, b) => (b.peakHp && (!a || b.peakHp > (a.peakHp ?? 0)) ? b : a),
    null,
  )

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,hsl(38_92%_52%_/_0.1),transparent)]" />

      <div className="container relative mx-auto max-w-3xl px-6 py-16">
        <Link
          href={`/builds/${username}`}
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {username}'s builds
        </Link>

        {/* Header */}
        <div className="mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-500">
            Public build · {username}
          </p>
          <h1 className="text-5xl font-extrabold tracking-tight">
            {vehicleRow.vehicle.nickname ?? vehicleName}
          </h1>
          {vehicleRow.vehicle.nickname && (
            <p className="mt-1 text-xl text-muted-foreground">{vehicleName}</p>
          )}

          {bestDyno && (
            <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-3">
              <Trophy className="h-5 w-5 text-amber-500" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-amber-500">Best dyno</div>
                <div className="text-2xl font-black">
                  {bestDyno.peakHp} hp
                  {bestDyno.peakTq && (
                    <span className="text-lg font-normal text-muted-foreground"> / {bestDyno.peakTq} lb-ft</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mod list */}
        {installedList.length > 0 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Wrench className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold">Mod list ({installedList.length})</h2>
            </div>
            <div className="space-y-2">
              {installedList.map(({ ip, part, brand }) => (
                <div
                  key={ip.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-5 py-4 transition-colors hover:border-amber-500/30"
                >
                  <div className="font-medium">
                    {part ? (
                      <Link
                        href={`/parts/${part.id}`}
                        className="transition-colors hover:text-amber-400"
                      >
                        {brand?.name && <span className="text-amber-400">{brand.name} </span>}
                        {part.name}
                      </Link>
                    ) : (
                      'Unknown part'
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dyno runs */}
        {dynos.length > 1 && (
          <div className="mt-10">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold">Dyno history</h2>
            </div>
            <div className="space-y-2">
              {dynos.map((run) => (
                <div key={run.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-5 py-4">
                  <div className="font-bold">
                    {run.peakHp} hp{run.peakTq && ` / ${run.peakTq} lb-ft`}
                  </div>
                  <div className="text-sm text-muted-foreground">{run.dynoType}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
