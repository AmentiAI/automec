'use client'

import { Button } from '@automec/ui'
import { Plus, ClipboardList, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import type { maintenanceLogs } from '@automec/db'
import type { InferSelectModel } from 'drizzle-orm'

interface Props {
  vehicleId: string
  items: InferSelectModel<typeof maintenanceLogs>[]
}

export function MaintenanceLogList({ vehicleId, items }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/50 px-8 py-16 text-center">
        <ClipboardList className="mb-3 h-8 w-8 text-muted-foreground" />
        <p className="font-semibold">No maintenance logs yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Track oil changes, brake jobs, and more.</p>
        <Button size="sm" variant="outline" className="mt-4 border-border/60">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add log
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button size="sm" variant="outline" className="border-border/60">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add log
        </Button>
      </div>
      {items.map((log) => (
        <div key={log.id} className="flex items-start justify-between rounded-xl border border-border/60 bg-card px-5 py-4">
          <div>
            <div className="font-semibold">{log.title}</div>
            {log.description && (
              <div className="mt-0.5 text-sm text-muted-foreground">{log.description}</div>
            )}
            <div className="mt-1 text-xs text-muted-foreground">
              {format(log.performedAt, 'MMM d, yyyy')}
              {log.mileage && <> · {log.mileage.toLocaleString()} mi</>}
            </div>
          </div>
          {log.cost && (
            <div className="flex items-center gap-1 text-sm font-semibold text-amber-400">
              <DollarSign className="h-3.5 w-3.5" />
              {Number(log.cost).toFixed(2)}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
