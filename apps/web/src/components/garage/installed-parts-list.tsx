import Link from 'next/link'
import { Wrench, DollarSign } from 'lucide-react'
import type { installedParts, parts, brands } from '@automec/db'
import type { InferSelectModel } from 'drizzle-orm'
import { format } from 'date-fns'

interface Props {
  items: Array<{
    installedPart: InferSelectModel<typeof installedParts>
    part: InferSelectModel<typeof parts> | null
    brand: InferSelectModel<typeof brands> | null
  }>
}

export function InstalledPartsList({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/50 px-8 py-16 text-center">
        <Wrench className="mb-3 h-8 w-8 text-muted-foreground" />
        <p className="font-semibold">No parts added yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Add your first mod to start tracking your build.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map(({ installedPart, part, brand }) => (
        <div
          key={installedPart.id}
          className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-5 py-4 transition-colors hover:border-border"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <Wrench className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <div className="font-medium">
                {part ? (
                  <Link href={`/parts/${part.id}`} className="hover:text-amber-400 transition-colors">
                    {brand?.name} {part.name}
                  </Link>
                ) : (
                  'Unknown part'
                )}
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                {installedPart.installedAt && (
                  <span>Installed {format(installedPart.installedAt, 'MMM d, yyyy')}</span>
                )}
                {installedPart.notes && (
                  <>
                    <span>·</span>
                    <span className="line-clamp-1">{installedPart.notes}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          {installedPart.priceAtInstall && (
            <div className="flex items-center gap-1 text-sm font-semibold text-amber-400">
              <DollarSign className="h-3.5 w-3.5" />
              {Number(installedPart.priceAtInstall).toFixed(2)}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
