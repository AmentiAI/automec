import { requireUser } from '@/lib/auth'
import { db, garages, garageVehicles, makes, models } from '@automec/db'
import { eq } from 'drizzle-orm'
import { GarageVehicleCard } from '@/components/garage/vehicle-card'
import { AddVehicleButton } from '@/components/garage/add-vehicle-button'
import { Car } from 'lucide-react'

export default async function GaragePage() {
  const user = await requireUser()

  let [garage] = await db.select().from(garages).where(eq(garages.userId, user.id)).limit(1)

  if (!garage) {
    const [created] = await db
      .insert(garages)
      .values({ userId: user.id, name: 'My Garage' })
      .returning()
    garage = created!
  }

  const vehicles = await db
    .select({ vehicle: garageVehicles, make: makes, model: models })
    .from(garageVehicles)
    .leftJoin(makes, eq(garageVehicles.makeId, makes.id))
    .leftJoin(models, eq(garageVehicles.modelId, models.id))
    .where(eq(garageVehicles.garageId, garage.id))

  return (
    <div>
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-500">Garage</p>
          <h1 className="text-4xl font-extrabold tracking-tight">{garage.name}</h1>
          <p className="mt-1 text-muted-foreground">
            {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} in your build
          </p>
        </div>
        <AddVehicleButton garageId={garage.id} />
      </div>

      {vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/50 px-8 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
            <Car className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-xl font-bold">No vehicles yet</h3>
          <p className="mb-6 max-w-sm text-muted-foreground">
            Add your first vehicle to start tracking your build, logging mods, and checking fitment.
          </p>
          <AddVehicleButton garageId={garage.id} />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map(({ vehicle, make, model }) => (
            <GarageVehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              makeName={make?.name ?? ''}
              modelName={model?.name ?? ''}
            />
          ))}
        </div>
      )}
    </div>
  )
}
