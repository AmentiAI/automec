import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { db, tuneRequests, tuneRequestMessages, tuneFiles, users, garageVehicles, makes, models } from '@automec/db'
import { eq, asc } from 'drizzle-orm'
import { TuneRequestThread } from '@/components/tune/request-thread'
import { TuneFileList } from '@/components/tune/file-list'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-zinc-500/20 text-zinc-400' },
  accepted: { label: 'Accepted', color: 'bg-blue-500/20 text-blue-400' },
  in_progress: { label: 'In progress', color: 'bg-blue-500/20 text-blue-400' },
  waiting_datalog: { label: 'Waiting datalog', color: 'bg-amber-500/20 text-amber-400' },
  revision: { label: 'Revision', color: 'bg-amber-500/20 text-amber-400' },
  completed: { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-400' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-400' },
} as const

interface Props {
  params: Promise<{ requestId: string }>
}

export default async function TuneRequestDetailPage({ params }: Props) {
  const { requestId } = await params
  const user = await requireUser()

  const [result] = await db
    .select({ request: tuneRequests, vehicle: garageVehicles, make: makes, model: models })
    .from(tuneRequests)
    .leftJoin(garageVehicles, eq(tuneRequests.garageVehicleId, garageVehicles.id))
    .leftJoin(makes, eq(garageVehicles.makeId, makes.id))
    .leftJoin(models, eq(garageVehicles.modelId, models.id))
    .where(eq(tuneRequests.id, requestId))
    .limit(1)

  if (!result) notFound()
  if (result.request.customerId !== user.id && result.request.tunerId !== user.id) notFound()

  const [messages, files] = await Promise.all([
    db
      .select({ message: tuneRequestMessages, sender: users })
      .from(tuneRequestMessages)
      .innerJoin(users, eq(tuneRequestMessages.senderId, users.id))
      .where(eq(tuneRequestMessages.tuneRequestId, requestId))
      .orderBy(asc(tuneRequestMessages.createdAt)),
    db
      .select({ file: tuneFiles, uploader: users })
      .from(tuneFiles)
      .innerJoin(users, eq(tuneFiles.uploadedById, users.id))
      .where(eq(tuneFiles.tuneRequestId, requestId))
      .orderBy(asc(tuneFiles.createdAt)),
  ])

  const vehicleName = result.vehicle
    ? `${result.vehicle.year} ${result.make?.name ?? ''} ${result.model?.name ?? ''}`
    : 'Unknown vehicle'

  const status = statusConfig[result.request.status] ?? { label: result.request.status, color: 'bg-zinc-500/20 text-zinc-400' }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/tune-requests"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to tune requests
      </Link>

      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">Tune request</p>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>
            {status.label}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">{vehicleName}</h1>
        <div className="mt-2 text-sm text-muted-foreground">
          {result.request.platform.replace(/_/g, ' ').toUpperCase()} ·{' '}
          Requested {format(result.request.createdAt, 'MMM d, yyyy')}
        </div>
        {result.request.description && (
          <p className="mt-3 rounded-xl border border-border/60 bg-card px-4 py-3 text-sm">
            {result.request.description}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TuneRequestThread requestId={requestId} currentUserId={user.id} messages={messages} />
        </div>
        <div>
          <TuneFileList requestId={requestId} files={files} currentUserId={user.id} />
        </div>
      </div>
    </div>
  )
}
