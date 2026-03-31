import { requireUser } from '@/lib/auth'
import { db, garages, garageVehicles, makes, models, shops } from '@automec/db'
import { eq } from 'drizzle-orm'
import { NewTuneRequestForm } from '@/components/tune/new-request-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function NewTuneRequestPage() {
  const user = await requireUser()

  const [garage] = await db.select().from(garages).where(eq(garages.userId, user.id)).limit(1)

  const vehicles = garage
    ? await db
        .select({ vehicle: garageVehicles, make: makes, model: models })
        .from(garageVehicles)
        .leftJoin(makes, eq(garageVehicles.makeId, makes.id))
        .leftJoin(models, eq(garageVehicles.modelId, models.id))
        .where(eq(garageVehicles.garageId, garage.id))
    : []

  const shopsList = await db.select().from(shops).where(eq(shops.isActive, true)).limit(20)

  return (
    <div className="max-w-2xl">
      <Link
        href="/tune-requests"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to tune requests
      </Link>

      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-500">New</p>
        <h1 className="text-4xl font-extrabold tracking-tight">Request a tune</h1>
        <p className="mt-1 text-muted-foreground">
          Select your vehicle, platform, and a verified shop to get started.
        </p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <NewTuneRequestForm vehicles={vehicles} shops={shopsList} />
      </div>
    </div>
  )
}
