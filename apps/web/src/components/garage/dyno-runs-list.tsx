'use client'

import { Button } from '@automec/ui'
import { Plus, Zap, Trophy } from 'lucide-react'
import { format } from 'date-fns'
import type { dynoRuns } from '@automec/db'
import type { InferSelectModel } from 'drizzle-orm'

interface Props {
  vehicleId: string
  items: InferSelectModel<typeof dynoRuns>[]
}

export function DynoRunsList({ vehicleId, items }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/50 px-8 py-16 text-center">
        <Zap className="mb-3 h-8 w-8 text-muted-foreground" />
        <p className="font-semibold">No dyno runs yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Log your first pull to start tracking power.</p>
        <Button size="sm" variant="outline" className="mt-4 border-border/60">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Log dyno run
        </Button>
      </div>
    )
  }

  const best = items.reduce((a, b) => ((b.peakHp ?? 0) > (a.peakHp ?? 0) ? b : a))

  return (
    <div className="space-y-3">
      {/* Best run highlight */}
      <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/5 px-5 py-3">
        <div className="flex items-center gap-3">
          <Trophy className="h-5 w-5 text-amber-500" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-amber-500">Best run</div>
            <div className="text-2xl font-black">
              {best.peakHp && `${best.peakHp} hp`}
              {best.peakHp && best.peakTq && <span className="text-muted-foreground"> / </span>}
              {best.peakTq && `${best.peakTq} lb-ft`}
            </div>
          </div>
        </div>
        <Button size="sm" variant="outline" className="border-border/60">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Log run
        </Button>
      </div>

      {items.map((run) => (
        <div key={run.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-5 py-4">
          <div>
            <div className="text-lg font-bold">
              {run.peakHp && `${run.peakHp} hp`}
              {run.peakHp && run.peakTq && <span className="font-normal text-muted-foreground"> / </span>}
              {run.peakTq && `${run.peakTq} lb-ft`}
            </div>
            <div className="mt-0.5 text-sm text-muted-foreground">
              {format(run.performedAt, 'MMM d, yyyy')} · {run.dynoType} dyno
            </div>
            {run.notes && <div className="mt-1 text-sm text-muted-foreground">{run.notes}</div>}
          </div>
          <div className="rounded-md border border-border/60 bg-secondary px-2.5 py-1 text-xs font-medium uppercase tracking-wide">
            {run.dynoType}
          </div>
        </div>
      ))}
    </div>
  )
}
