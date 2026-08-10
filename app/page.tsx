'use client'

import { useState } from 'react'
import { HeroCapture } from '@/components/home/hero-capture'
import { FeatureCards } from '@/components/home/feature-cards'
import { RecentRecords } from '@/components/home/recent-records'
import { BottomNav } from '@/components/bottom-nav'
import { Toast } from '@/components/home/toast'

export default function HomePage() {
  const [toastOpen, setToastOpen] = useState(false)

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-background">
      <main className="flex-1 px-5 pb-28 pt-6">
        <HeroCapture />
        <FeatureCards onComingSoon={() => setToastOpen(true)} />
        <RecentRecords records={[]} />
      </main>

      <BottomNav />

      <Toast
        message="功能即将开放"
        open={toastOpen}
        onClose={() => setToastOpen(false)}
      />
    </div>
  )
}
