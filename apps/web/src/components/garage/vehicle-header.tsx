import Link from 'next/link'
import { Button } from '@automec/ui'
import { ArrowLeft, Edit, Gauge, Palette, Zap } from 'lucide-react'
import type { garageVehicles } from '@automec/db'
import type { InferSelectModel } from 'drizzle-orm'

interface Props {
  vehicle: InferSelectModel<typeof garageVehicles>
  makeName: string
  modelName: string
}

export function VehicleHeader({ vehicle, makeName, modelName }: Props) {
  const title = vehicle.nickname ?? `${vehicle.year} ${makeName} ${modelName}`

  return (
    <div>
      <Link
        href="/garage"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to garage
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-500">Build</p>
          <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
          {vehicle.nickname && (
            <p className="mt-1 text-lg text-muted-foreground">
              {vehicle.year} {makeName} {modelName}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            {vehicle.mileage && (
              <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-sm">
                <Gauge className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-muted-foreground">Mileage</span>
                <span className="font-semibold">{vehicle.mileage.toLocaleString()} mi</span>
              </div>
            )}
            {vehicle.color && (
              <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-sm">
                <Palette className="h-3.5 w-3.5 text-amber-500" />
                <span className="font-semibold">{vehicle.color}</span>
              </div>
            )}
            {vehicle.powerGoalHp && (
              <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-sm">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-muted-foreground">Goal</span>
                <span className="font-semibold">{vehicle.powerGoalHp} hp</span>
              </div>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" className="border-border/60">
          <Edit className="mr-1.5 h-3.5 w-3.5" />
          Edit
        </Button>
      </div>
    </div>
  )
}
