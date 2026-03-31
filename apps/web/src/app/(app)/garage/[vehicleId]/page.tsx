import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { db, garageVehicles, garages, installedParts, parts, brands, dynoRuns, maintenanceLogs, makes, models } from '@automec/db'
import { eq, and } from 'drizzle-orm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@automec/ui'
import { InstalledPartsList } from '@/components/garage/installed-parts-list'
import { DynoRunsList } from '@/components/garage/dyno-runs-list'
import { MaintenanceLogList } from '@/components/garage/maintenance-log-list'
import { VehicleHeader } from '@/components/garage/vehicle-header'
import { AddPartButton } from '@/components/garage/add-part-button'

interface Props {
  params: Promise<{ vehicleId: string }>
}

export default async function VehiclePage({ params }: Props) {
  const { vehicleId } = await params
  const user = await requireUser()

  const [result] = await db
    .select({ vehicle: garageVehicles, garage: garages, make: makes, model: models })
    .from(garageVehicles)
    .innerJoin(garages, eq(garageVehicles.garageId, garages.id))
    .leftJoin(makes, eq(garageVehicles.makeId, makes.id))
    .leftJoin(models, eq(garageVehicles.modelId, models.id))
    .where(and(eq(garageVehicles.id, vehicleId), eq(garages.userId, user.id)))
    .limit(1)

  if (!result) notFound()

  const [installedPartsList, dynoRunsList, maintenanceList] = await Promise.all([
    db
      .select({ installedPart: installedParts, part: parts, brand: brands })
      .from(installedParts)
      .leftJoin(parts, eq(installedParts.partId, parts.id))
      .leftJoin(brands, eq(parts.brandId, brands.id))
      .where(eq(installedParts.garageVehicleId, vehicleId)),
    db.select().from(dynoRuns).where(eq(dynoRuns.garageVehicleId, vehicleId)),
    db.select().from(maintenanceLogs).where(eq(maintenanceLogs.garageVehicleId, vehicleId)),
  ])

  return (
    <div>
      <VehicleHeader
        vehicle={result.vehicle}
        makeName={result.make?.name ?? ''}
        modelName={result.model?.name ?? ''}
      />

      <Tabs defaultValue="parts" className="mt-8">
        <TabsList className="border border-border/60 bg-secondary/50">
          <TabsTrigger value="parts" className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400">
            Parts ({installedPartsList.length})
          </TabsTrigger>
          <TabsTrigger value="dyno" className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400">
            Dyno runs ({dynoRunsList.length})
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400">
            Maintenance ({maintenanceList.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="parts" className="mt-6">
          <div className="mb-4 flex justify-end">
            <AddPartButton vehicleId={vehicleId} vehicleConfigId={result.vehicle.vehicleConfigId} />
          </div>
          <InstalledPartsList items={installedPartsList} />
        </TabsContent>

        <TabsContent value="dyno" className="mt-6">
          <DynoRunsList vehicleId={vehicleId} items={dynoRunsList} />
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <MaintenanceLogList vehicleId={vehicleId} items={maintenanceList} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
