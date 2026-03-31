import { requireUser } from '@/lib/auth'
import { db, tuneRequests, garageVehicles, makes, models } from '@automec/db'
import { eq, desc } from 'drizzle-orm'
import { Button } from '@automec/ui'
import Link from 'next/link'
import { Plus, Zap, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-zinc-500/20 text-zinc-400' },
  accepted: { label: 'Accepted', color: 'bg-blue-500/20 text-blue-400' },
  in_progress: { label: 'In progress', color: 'bg-blue-500/20 text-blue-400' },
  waiting_datalog: { label: 'Waiting datalog', color: 'bg-amber-500/20 text-amber-400' },
  revision: { label: 'Revision', color: 'bg-amber-500/20 text-amber-400' },
  completed: { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-400' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-400' },
} as const

export default async function TuneRequestsPage() {
  const user = await requireUser()

  const requests = await db
    .select({ request: tuneRequests, vehicle: garageVehicles, make: makes, model: models })
    .from(tuneRequests)
    .leftJoin(garageVehicles, eq(tuneRequests.garageVehicleId, garageVehicles.id))
    .leftJoin(makes, eq(garageVehicles.makeId, makes.id))
    .leftJoin(models, eq(garageVehicles.modelId, models.id))
    .where(eq(tuneRequests.customerId, user.id))
    .orderBy(desc(tuneRequests.createdAt))

  return (
    <div>
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-500">Tuning</p>
          <h1 className="text-4xl font-extrabold tracking-tight">Tune requests</h1>
        </div>
        <Button asChild className="bg-amber-500 text-black hover:bg-amber-400 font-semibold">
          <Link href="/tune-requests/new">
            <Plus className="mr-1.5 h-4 w-4" />
            New request
          </Link>
        </Button>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/50 px-8 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
            <Zap className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-xl font-bold">No tune requests yet</h3>
          <p className="mb-6 max-w-sm text-muted-foreground">
            Request a tune from a verified shop or tuner and track every revision in one thread.
          </p>
          <Button asChild className="bg-amber-500 text-black hover:bg-amber-400 font-semibold">
            <Link href="/tune-requests/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Request a tune
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {requests.map(({ request, vehicle, make, model }) => {
            const vehicleName = vehicle
              ? `${vehicle.year} ${make?.name ?? ''} ${model?.name ?? ''}`
              : 'Unknown vehicle'
            const status = statusConfig[request.status] ?? { label: request.status, color: 'bg-zinc-500/20 text-zinc-400' }

            return (
              <Link
                key={request.id}
                href={`/tune-requests/${request.id}`}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-5 py-4 transition-all hover:border-amber-500/40 hover:shadow-[0_0_20px_-10px_hsl(38_92%_52%_/_0.15)]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                    <Zap className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="font-semibold">{vehicleName}</div>
                    <div className="mt-0.5 text-sm text-muted-foreground">
                      {request.platform.replace(/_/g, ' ').toUpperCase()} ·{' '}
                      {format(request.createdAt, 'MMM d, yyyy')}
                    </div>
                    {request.description && (
                      <div className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                        {request.description}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>
                    {status.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
