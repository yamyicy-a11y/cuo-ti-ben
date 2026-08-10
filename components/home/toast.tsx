'use client'

import { useEffect } from 'react'
import { Info } from 'lucide-react'

export function Toast({
  message,
  open,
  onClose,
  duration = 2000,
}: {
  message: string
  open: boolean
  onClose: () => void
  duration?: number
}) {
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [open, duration, onClose])

  if (!open) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-6"
    >
      <div className="flex items-center gap-2 rounded-full bg-foreground/90 px-4 py-2.5 text-sm font-medium text-background shadow-lg backdrop-blur animate-in fade-in slide-in-from-bottom-2">
        <Info className="size-4" />
        {message}
      </div>
    </div>
  )
}
