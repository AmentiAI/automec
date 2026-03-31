import { requireUser } from '@/lib/auth'
import { db, tuneRequests, garageVehicles, makes, models, users, shops, organizations, organizationMembers } from '@automec/db'
import { eq, desc } from 'drizzle-orm'
import { Button } from '@automec/ui'
import Link from 'next/link'
import { format } from 'date-fns'
import { Zap, ChevronRight } from 'lucide-react'

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-zinc-500/20 text-zinc-400' },
  accepted: { label: 'Accepted', color: 'bg-blue-500/20 text-blue-400' },
  in_progress: { label: 'In progress', color: 'bg-blue-500/20 text-blue-400' },
  waiting_datalog: { label: 'Waiting datalog', color: 'bg-amber-500/20 text-amber-400' },
  revision: { label: 'Revision', color: 'bg-amber-500/20 text-amber-400' },
  completed: { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-400' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-400' },
} as const

export default async function ShopTuneRequestsPage() {
  const user = await requireUser()

  const [membership] = await db
    .select({ shop: shops })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizationMembers.orgId, organizations.id))
    .innerJoin(shops, eq(organizations.id, shops.orgId))
    .where(eq(organizationMembers.userId, user.id))
    .limit(1)

  if (!membership) return null

  const requests = await db
    .select({ request: tuneRequests, vehicle: garageVehicles, make: makes, model: models, customer: users })
    .from(tuneRequests)
    .leftJoin(garageVehicles, eq(tuneRequests.garageVehicleId, garageVehicles.id))
    .leftJoin(makes, eq(garageVehicles.makeId, makes.id))
    .leftJoin(models, eq(garageVehicles.modelId, models.id))
    .leftJoin(users, eq(tuneRequests.customerId, users.id))
    .where(eq(tuneRequests.shopId, membership.shop.id))
    .orderBy(desc(tuneRequests.createdAt))

  return (
    <div>
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-500">Shop</p>
        <h1 className="text-4xl font-extrabold tracking-tight">Tune requests</h1>
        <p className="mt-1 text-muted-foreground">{requests.length} total requests</p>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/50 px-8 py-24 text-center">
          <Zap className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-semibold">No tune requests yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Tune requests from customers will appear here.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-secondary/50">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Customer</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vehicle</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Platform</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {requests.map(({ request, vehicle, make, model, customer }) => {
                const vehicleName = vehicle
                  ? `${vehicle.year} ${make?.name ?? ''} ${model?.name ?? ''}`
                  : 'Unknown'
                const status = statusConfig[request.status] ?? { label: request.status, color: 'bg-zinc-500/20 text-zinc-400' }
                return (
                  <tr key={request.id} className="border-b border-border/40 last:border-0 transition-colors hover:bg-secondary/30">
                    <td className="px-5 py-4 font-medium">{customer?.name ?? customer?.email ?? 'Unknown'}</td>
                    <td className="px-5 py-4 text-muted-foreground">{vehicleName}</td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs">{request.platform.replace(/_/g, ' ').toUpperCase()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{format(request.createdAt, 'MMM d, yyyy')}</td>
                    <td className="px-5 py-4">
                      <Button variant="ghost" size="sm" asChild className="text-xs gap-1">
                        <Link href={`/tune-requests/${request.id}`}>
                          View <ChevronRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
