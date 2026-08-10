'use client'

import { useRouter } from 'next/navigation'
import { Camera, BarChart3, PenLine, ChevronRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Feature = {
  key: string
  title: string
  desc: string
  icon: LucideIcon
  iconClass: string
}

const FEATURES: Feature[] = [
  {
    key: 'capture',
    title: '拍照识题',
    desc: '拍照上传，AI 识别题目与作答',
    icon: Camera,
    iconClass: 'bg-primary/12 text-primary',
  },
  {
    key: 'analysis',
    title: '语法分析',
    desc: '定位语法薄弱点，生成错题报告',
    icon: BarChart3,
    iconClass: 'bg-secondary text-secondary-foreground',
  },
  {
    key: 'practice',
    title: '举一反三',
    desc: '针对薄弱点生成同类练习题',
    icon: PenLine,
    iconClass: 'bg-accent text-accent-foreground',
  },
]

export function FeatureCards({
  onComingSoon,
}: {
  onComingSoon: () => void
}) {
  const router = useRouter()

  const handleClick = (key: string) => {
    if (key === 'capture') router.push('/upload')
    else if (key === 'analysis') router.push('/mistakes-list')
    else onComingSoon()
  }

  return (
    <section className="mt-7">
      <h2 className="mb-3 text-base font-bold text-foreground">核心功能</h2>
      <ul className="flex flex-col gap-3">
        {FEATURES.map((f) => {
          const Icon = f.icon
          return (
            <li key={f.key}>
              <button
                type="button"
                onClick={() => handleClick(f.key)}
                className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-accent/40 active:scale-[0.99]"
              >
                <span
                  className={cn(
                    'flex size-12 shrink-0 items-center justify-center rounded-xl',
                    f.iconClass,
                  )}
                >
                  <Icon className="size-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-foreground">
                    {f.title}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {f.desc}
                  </span>
                </span>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
