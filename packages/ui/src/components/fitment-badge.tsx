import * as React from 'react'
import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from 'lucide-react'
import { Badge } from './badge'
import { cn } from '../lib/utils'
import type { FitmentStatus } from '@automec/types'

interface FitmentBadgeProps {
  status: FitmentStatus
  className?: string
}

const statusConfig = {
  fits: {
    label: 'Fits',
    variant: 'success' as const,
    icon: CheckCircle,
  },
  fits_with_conditions: {
    label: 'Fits with conditions',
    variant: 'warning' as const,
    icon: AlertTriangle,
  },
  does_not_fit: {
    label: 'Does not fit',
    variant: 'destructive' as const,
    icon: XCircle,
  },
  needs_review: {
    label: 'Needs review',
    variant: 'info' as const,
    icon: HelpCircle,
  },
}

export function FitmentBadge({ status, className }: FitmentBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={cn('gap-1', className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}
