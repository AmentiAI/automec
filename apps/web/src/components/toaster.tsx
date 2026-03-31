'use client'

import { ToastProvider, ToastViewport } from '@automec/ui'

export function Toaster() {
  return (
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  )
}
