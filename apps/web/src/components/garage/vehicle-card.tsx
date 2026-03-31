import Link from 'next/link'
import { Button } from '@automec/ui'
import { Car, ArrowRight, Gauge, Zap } from 'lucide-react'
import type { garageVehicles } from '@automec/db'
import type { InferSelectModel } from 'drizzle-orm'

interface Props {
  vehicle: InferSelectModel<typeof garageVehicles>
  makeName: string
  modelName: string
}

export function GarageVehicleCard({ vehicle, makeName, modelName }: Props) {
  const title = vehicle.nickname ?? `${vehicle.year} ${makeName} ${modelName}`
  const subtitle = vehicle.nickname ? `${vehicle.year} ${makeName} ${modelName}` : undefined

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-amber-500/40 hover:shadow-[0_0_40px_-10px_hsl(38_92%_52%_/_0.2)]">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 transition-colors group-hover:bg-amber-500/20">
          <Car className="h-6 w-6 text-amber-500" />
        </div>
        <div className="h-2 w-2 rounded-full bg-emerald-500" title="Active" />
      </div>

      <div className="mb-5">
        <h3 className="text-xl font-bold leading-tight">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3">
        {vehicle.mileage && (
          <div className="rounded-lg bg-secondary/60 px-3 py-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Gauge className="h-3 w-3" /> Mileage
            </div>
            <div className="mt-0.5 text-sm font-semibold">{vehicle.mileage.toLocaleString()} mi</div>
          </div>
        )}
        {vehicle.powerGoalHp && (
          <div className="rounded-lg bg-secondary/60 px-3 py-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Zap className="h-3 w-3" /> Power goal
            </div>
            <div className="mt-0.5 text-sm font-semibold">{vehicle.powerGoalHp} hp</div>
          </div>
        )}
      </div>

      <Button asChild size="sm" variant="outline" className="w-full border-border/60 hover:border-amber-500/50 hover:bg-amber-500/5 hover:text-amber-400">
        <Link href={`/garage/${vehicle.id}`}>
          View build
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  )
}
